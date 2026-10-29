# AN Moments — native iOS prototype

An **original, independent** SwiftUI iPhone application for private photo moments. It is **not** a patched/re-signed Locket IPA and does not unlock or connect to Locket Gold. No Telegram login, no remote API, no ads.

## Implemented

- Native iOS dark-mode UI, Vietnamese copy
- Capture a photo using the iPhone camera
- Pick a photo from Apple's Photos picker
- Write a caption and store images locally (JPEG + JSON index)
- Browse saved moments by date; share an image with the system share sheet; delete moments
- Edit local display name
- Clear disclosure about the unavailable friends/network features

## Not yet implemented

- Real social account or friend connections, photo delivery, remote synchronization
- Real-time friend widget or WidgetKit extension
- Videos, audio, Gold subscription or Locket's servers
- Restore/backup after uninstall

The Friends screen intentionally explains that these functions do not work without a dedicated backend. **Do not log in using your primary credentials to unknown modded IPAs.**

## Requirements

- Mac with Xcode 15+ (Xcode 26 recommended for iOS 26)
- iPhone running iOS 17 or later
- Homebrew and `xcodegen`

## Build on a Mac

From inside this `ANMoments-iOS` folder:

```bash
brew install xcodegen
xcodegen generate
open ANMoments.xcodeproj
```

In Xcode:

1. Select **ANMoments** project > **ANMoments** target > **Signing & Capabilities**.
2. Check **Automatically manage signing** and select your Apple ID **Team**.
3. If Xcode says bundle identifier unavailable, replace `com.ifywnx.anmoments` with a unique identifier under the Signing settings.
4. Connect your unlocked iPhone, select it from the Run destination menu, and press **Cmd+R**.
5. If requested, enable **Settings > Privacy & Security > Developer Mode** on your iPhone.

For a command-line check on a Mac with full Xcode:

```bash
xcodebuild -project ANMoments.xcodeproj -scheme ANMoments \
  -configuration Debug -sdk iphonesimulator \
  -destination 'generic/platform=iOS Simulator' \
  CODE_SIGNING_ALLOWED=NO build
```

## Notes

- App identifier: `com.ifywnx.anmoments`.
- Storage location inside app sandbox: `Documents/ANMoments/`.
- This is independent source code, not a decompilation of the uploaded NSMOD IPA.
- Free Apple development profiles may have limited app slots and expire after 7 days.
- This repository branch is an isolated prototype; main branch is unaffected.
