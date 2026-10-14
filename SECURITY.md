# Security review — preliminary (2026-10-14)

This is an unaudited research copy of upstream code; not an official Locket offering. Original scripts remain attributed to @duyvinh09.

## Scope
- Archived three original Locket-related JavaScript files in `upstream/js/`.
- A user-branded Shadowrocket module points exclusively to **this repository** for those scripts.
- This module uses HTTPS interception (MITM) and touches RevenueCat subscription API responses and Firebase Remote Config responses. It can read and alter responses for matching hosts. **It cannot truthfully be represented as not reading user data**.
- Static inspection of Locket scripts identified upstream URLs to `i.ibb.co`, `instagram.com`, `tiktok.com`, and `apps.apple.com`; those appearances alone do not prove outgoing network transmission.
- Original 80kB remote configuration script has not received a complete independent security review. No promise of no malware is made.
- No third-party DNS/mobileconfig is included. No user secrets should be placed in this repo.

## Ethics and permissions
Source: https://github.com/duyvinh09/Module_IOS. License was not present at the upstream repo root on the inspection date. The upstream author retains rights; seek permission for redistribution. The module changes purchase/status data and may violate applicable terms. Test only with accounts/data you own and in an authorized environment.

## Installation caution
Do not ask the general public to install a custom CA certificate without an independent audit. Avoid using this module on a phone with sensitive personal data. A certificate/MITM capability itself entails access to decrypted HTTPS information for the intercepted hosts.
