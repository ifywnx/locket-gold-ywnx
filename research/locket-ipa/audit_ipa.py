#!/usr/bin/env python3
"""Non-invasive comparison of iOS IPA archives. Python stdlib; Mac optional otool.

Reads IPA archives, without modifying app binaries, decrypting apps, injecting
libraries or changing entitlements. Reports technical differences only.
"""
from __future__ import annotations
import argparse
import datetime
import hashlib
import json
import pathlib
import plistlib
import re
import shutil
import subprocess
import sys
import tempfile
import zipfile

MAX_BINARY = 180 * 1024 * 1024
URL_MARKERS = {
    "telegram": (b"t.me/", b"telegram.me/", b"telegram.org"),
    "revenuecat": (b"api.revenuecat.com", b"revenuecat"),
    "substrate": (b"/Library/MobileSubstrate/", b"SubstrateLoader"),
}

def sha256(path: pathlib.Path) -> str:
    hasher = hashlib.sha256()
    with path.open("rb") as src:
        for block in iter(lambda: src.read(1024 * 1024), b""):
            hasher.update(block)
    return hasher.hexdigest()

def app_root(names: list[str]) -> str:
    roots = []
    for name in names:
        found = re.match(r"^Payload/([^/]+\.app)/Info\.plist$", name)
        if found:
            roots.append("Payload/" + found.group(1) + "/")
    if not roots:
        raise ValueError("No Payload/*.app/Info.plist inside IPA")
    if len(roots) > 1:
        raise ValueError("IPA contains multiple root apps: " + ", ".join(roots))
    return roots[0]

def marker_hits(data: bytes) -> list[str]:
    lower = data.lower()
    return [key for key, words in URL_MARKERS.items()
            if any(word.lower() in lower for word in words)]

def otool_dependencies(data: bytes, suffix: str) -> list[str]:
    """otool -L on extracted Mach-O only; never executes code from IPA."""
    if not shutil.which("otool"):
        return []
    with tempfile.TemporaryDirectory(prefix="locket-ipa-inspect-") as tmp:
        file = pathlib.Path(tmp, "library" + suffix)
        file.write_bytes(data)
        try:
            result = subprocess.run(
                ["otool", "-L", str(file)], stdout=subprocess.PIPE,
                stderr=subprocess.DEVNULL, timeout=12, check=False, text=True
            )
        except (subprocess.SubprocessError, OSError):
            return []
        dependencies = []
        for line in result.stdout.splitlines()[1:]:
            value = line.strip().split(" (compatibility version")[0]
            if value and value not in dependencies:
                dependencies.append(value)
        return dependencies

def inspect(path: pathlib.Path) -> dict:
    result = {
        "file": path.name, "size_mib": round(path.stat().st_size / 1048576, 2),
        "sha256": sha256(path),
        "bundle_id": None, "version": None, "build": None,
        "executable": None, "app_extensions": [], "embedded_dylibs": [],
        "third_party_frameworks": [], "signing_resources_present": False,
        "provisioning_profile_present": False, "linked_non_system_dylibs": [],
        "binary_markers": {}, "warnings": [],
    }
    with zipfile.ZipFile(path, "r") as archive:
        names = archive.namelist()
        root = app_root(names)
        info = plistlib.loads(archive.read(root + "Info.plist"))
        result["bundle_id"] = info.get("CFBundleIdentifier")
        result["version"] = info.get("CFBundleShortVersionString")
        result["build"] = info.get("CFBundleVersion")
        result["executable"] = info.get("CFBundleExecutable")
        result["app_extensions"] = sorted(
            name for name in names
            if name.startswith(root + "PlugIns/") and name.endswith(".appex/Info.plist")
        )
        result["embedded_dylibs"] = sorted(
            name.replace(root, "")
            for name in names
            if name.startswith(root) and name.lower().endswith(".dylib")
        )
        result["third_party_frameworks"] = sorted(
            {x.removeprefix(root + "Frameworks/").split("/")[0]
             for x in names if x.startswith(root + "Frameworks/")
             and x.removeprefix(root + "Frameworks/")}
        )
        result["signing_resources_present"] = root + "_CodeSignature/CodeResources" in names
        result["provisioning_profile_present"] = root + "embedded.mobileprovision" in names
        binaries = []
        executable = root + str(result["executable"] or "")
        if executable in names:
            binaries.append(executable)
        for name in names:
            if name.startswith(root + "Frameworks/") and name.endswith(".dylib"):
                binaries.append(name)
        for name in binaries:
            meta = archive.getinfo(name)
            if meta.file_size > MAX_BINARY:
                result["warnings"].append("Skipped large binary: " + name)
                continue
            try:
                data = archive.read(name)
            except (RuntimeError, zipfile.BadZipFile):
                result["warnings"].append("Unreadable binary: " + name)
                continue
            found = marker_hits(data)
            if found:
                result["binary_markers"][name.removeprefix(root)] = found
            suffix = pathlib.Path(name).suffix or ".bin"
            linked = otool_dependencies(data, suffix)
            for dep in linked:
                # Retain non-system dynamic libraries, an indicator of
                # additional executable code. This does not prove maliciousness.
                if not dep.startswith(("/System/Library/", "/usr/lib/")):
                    if dep not in result["linked_non_system_dylibs"]:
                        result["linked_non_system_dylibs"].append(dep)
        if not result["signing_resources_present"]:
            result["warnings"].append("No CodeResources found (signature not verified)")
        if "com.locket" not in str(result["bundle_id"] or "").lower():
            result["warnings"].append("Bundle ID does not look like official Locket ID")
    result["linked_non_system_dylibs"].sort()
    return result

def main() -> int:
    parser = argparse.ArgumentParser(description="Compare Locket IPA metadata")
    parser.add_argument("ipas", nargs="+", help="IPA files; quote paths containing spaces")
    parser.add_argument("--out", default="locket-ipa-report.json",
                        help="JSON output path; do NOT commit personal artifacts")
    args = parser.parse_args()
    reports = []
    for raw in args.ipas:
        path = pathlib.Path(raw).expanduser()
        if not path.exists() or not path.is_file():
            print(f"SKIP: {path} does not exist", file=sys.stderr)
            continue
        try:
            result = inspect(path)
            reports.append(result)
            print(f"{result['file']}: {result['version']} ({result['build']}), "
                  f"{result['bundle_id']}, {result['size_mib']} MiB")
            print(f"  app extensions={len(result['app_extensions'])}, "
                  f"dylibs={len(result['embedded_dylibs'])}, "
                  f"linked extras={len(result['linked_non_system_dylibs'])}, "
                  f"markers={result['binary_markers']}")
        except Exception as error:
            print(f"ERROR: {path.name}: {error}", file=sys.stderr)
    if not reports:
        return 1
    output = {
        "tool": "Locket IPA static audit v1",
        "created_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "note": ("Version strings and markers are indicators only. A match "
                 "does not prove a feature is unlocked or safe."),
        "archives": reports
    }
    pathlib.Path(args.out).write_text(json.dumps(output, ensure_ascii=False, indent=2))
    print(f"Saved report to {args.out}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
