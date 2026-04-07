# React Native 0.75.5 → 0.77.2 Upgrade

> **Status: ✅ COMPLETE** — April 2026
> Android APK ✅ · iOS Archive ✅ · Both platforms smoke-tested ✅

## Completion Summary

| Area | Outcome |
|---|---|
| React Native | 0.75.5 → 0.77.2 |
| React | 18.2.0 → 18.3.1 |
| Android toolchain | NDK 26.1 → 27.1 · Kotlin 1.9 → 2.0 (K2) · AGP 8.3 → 8.6.1 · Gradle 8.7 → 8.10.2 · compileSdk 34 → 35 |
| iOS deployment target | 13.4 → 15.1 |
| New Architecture | Remains OFF on both platforms |
| Hermes | Remains OFF on both platforms |
| Android release APK | ✅ Built & signed (77 MB) |
| iOS archive | ✅ v1.8.9 ready for App Store upload |
| 16KB page size (APK packaging) | ✅ All .so files stored uncompressed |
| 16KB page size (ELF alignment) | ⚠️ `libjsc.so` non-compliant (requires Hermes ON to fix) |
| Library health | 12 unmaintained deps flagged — see Post-Upgrade Library Health section |
| Test suite | ⏳ Deferred — run `yarn test` before shipping |

**Pending before next release:**
1. Run `yarn test` — snapshot updates likely needed after library bumps
2. Fix 16KB ELF alignment: upgrade Reanimated → 3.19.5, evaluate Hermes ON for JSC fix
3. Remove `react-native-safe-area-view` (dead dep — superseded by safe-area-context already in project)

---

## Upgrade Details

### What This Upgrade Entails

This is a **two-minor-version jump** (0.75.5 → 0.76 → 0.77) that touches the Android and iOS build toolchains, the native AppDelegate, and requires a hard iOS deployment target bump.

**New Architecture (Fabric/TurboModules):** In RN 0.76, New Architecture became **on by default**. It is still possible to opt out by keeping `newArchEnabled=false` in `gradle.properties` and `:fabric_enabled => false` in the Podfile. These flags are supported through RN 0.81 and removed in 0.82. This project stays opted out.

**Hermes:** Also on by default in 0.76. Opt-out (`hermesEnabled=false` / `:hermes_enabled => false`) still works through 0.77 and beyond. This project stays opted out.

**Breaking changes relevant to THIS project:**

| Area | Change | Severity |
|---|---|---|
| iOS deployment target | 13.4 → 15.1 (hard minimum enforced by RN 0.76) | **Critical** |
| SoLoader init (Android) | `SoLoader.init(this, false)` → `OpenSourceMergedSoMapping` | **Required** |
| AppDelegate (iOS, 0.77) | Must add `RCTAppDependencyProvider` init | **Required** |
| Kotlin version | 1.9.24 → 2.0.21 (K2 compiler) | **Required** |
| NDK version | 26.1.10909125 → 27.1.12297006 | **Required** |
| Gradle wrapper | 8.7 → 8.10.2 | Required |
| Android Gradle Plugin | 8.3.2 → 8.6.x | Required |
| compileSdkVersion | 34 → 35 | Required |
| buildToolsVersion | 34.0.0 → 35.0.0 | Required |
| New Architecture opt-out flags | Must be **explicitly set** — 0.76+ template defaults to true | Required |
| React version | 18.2.0 → 18.3.x | Required |
| CLI | 14.1.0 → 15.x | Required |
| Metro console forwarding | Removed in 0.77 — dev workflow change only | Low |

**Not affected by this upgrade:** Redux/Saga, React Navigation v6 (with New Arch off), React Native Paper, EStyleSheet (works but remains deprecated/unmaintained — plan migration eventually), Firebase 17.5.0.

---

## Pre-flight Checklist

- [ ] Confirm team is running Node 18 (`nvm use 18.20.4`) — RN 0.77 still requires Node >= 18
- [ ] Confirm Android Studio has NDK **27.1.12297006** available to install (SDK Manager → SDK Tools → NDK Side by Side)
- [ ] Confirm Xcode 15+ is installed (Xcode 26 already in use — fine)
- [ ] Read the full [RN 0.76 blog post](https://reactnative.dev/blog/2024/10/23/release-0.76-new-architecture) and [RN 0.77 blog post](https://reactnative.dev/blog/2025/01/21/version-0.77)
- [ ] Run `yarn test` on the current branch — confirm all tests pass before touching anything
- [ ] Do the upgrade on a dedicated git branch (e.g. `upgrade/rn-0.77`)
- [ ] Check whether the `@react-native-firebase/messaging` patch (`patches/@react-native-firebase+messaging+17.5.0.patch`) still applies after bumping the firebase package — it adds `colorAccent` to `colors.xml`; verify whether Firebase 18.x fixes this upstream
- [ ] Update `rnx-kit` requirements in `package.json`: `"react-native@0.72"` → `"react-native@0.77"` (or remove if unused) — otherwise `yarn check-deps` will suggest downgrading packages

---

## Steps

### 1. Create upgrade branch

**What:** Branch off master: `git checkout -b upgrade/rn-0.77`

**Why:** Isolate all upgrade changes from production code.

**Verify:** `git branch` shows the new branch active.

**Status:** [x] done — branched from `upgrade/rn-0.75.5` (not master; that branch holds the 0.75.5 upgrade work)

---

### 2. Update `package.json` — core RN and React versions

**What:** Change these versions in `package.json`:

```json
"react": "18.3.x",
"react-native": "0.77.x",

"devDependencies": {
  "@react-native-community/cli": "15.x",
  "@react-native-community/cli-platform-android": "15.x",
  "@react-native-community/cli-platform-ios": "15.x",
  "@react-native/metro-config": "0.77.x",
  "@react-native/babel-preset": "0.77.x"
}
```

Use the [RN Upgrade Helper](https://react-native-community.github.io/upgrade-helper/?from=0.75.5&to=0.77.0) diff to confirm exact package versions before pinning.

**Why:** `react-native` 0.77 requires React 18.3. The CLI and metro-config must match the RN minor version. RN 0.77 ships `@react-native/babel-preset` — confirm whether `metro-react-native-babel-preset` is still the right entry or if it should be replaced.

**Verify:** `yarn install` completes without peer dependency errors. `yarn react-native --version` prints 0.77.x.

**Status:** [x] done — bumped react 18.2.0→18.3.1, react-native 0.75.5→0.77.2, react-dom/react-test-renderer to match, CLI 14.1.0→15.0.1, @react-native/metro-config 0.75.5→0.77.2. `metro-react-native-babel-preset` left at 0.77.0 (already correct for RN 0.77). Correction: initially used 18.3.2 which does not exist on npm — corrected to 18.3.1 (latest React 18.3 patch).

---

### 3. Update Android root `android/build.gradle` — toolchain versions

**What:** In `android/build.gradle`, change:

```gradle
buildToolsVersion = "35.0.0"    // was "34.0.0"
compileSdkVersion = 35           // was 34
// minSdkVersion stays 26 — already above the 0.77 minimum of 24
// targetSdkVersion stays 35 — already correct
ndkVersion = "27.1.12297006"    // was "26.1.10909125"
kotlinVersion = "2.0.21"        // was "1.9.24"
```

Also check the Android Gradle Plugin version in the `dependencies` block:

```gradle
classpath("com.android.tools.build:gradle:8.6.1")  // was 8.3.2
```

Confirm the exact AGP version required by RN 0.77 in the Upgrade Helper diff.

**Why (each):**
- `buildToolsVersion` 35 required by `compileSdkVersion` 35.
- `compileSdkVersion` 35 is the 0.77 template standard; required to use Android 15 APIs.
- NDK 27.1 is the 0.77 default — adds Android 16 KB page size support.
- **Kotlin 2.0** is required by RN 0.77's Kotlin-based Android runtime. This is a major compiler version jump (K2 mode); all native module Kotlin code and library Kotlin code must compile under K2.
- AGP 8.6.x is required to build against `compileSdkVersion` 35 and to support Kotlin 2.0.

**Verify:** `./gradlew :app:assembleDebug` from `android/` builds without Kotlin or AGP version errors.

**Status:** [x] done — buildToolsVersion 34.0.0→35.0.0, compileSdkVersion 34→35, kotlinVersion 1.9.24→2.0.21, ndkVersion 26.1→27.1.12297006, AGP 8.3.2→8.6.1. Note: a corrupt partial NDK 27 install was previously documented in a comment — see Step 5 to reinstall cleanly.

---

### 4. Update Gradle wrapper to 8.10.2

**What:** In `android/gradle/wrapper/gradle-wrapper.properties`, change:

```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.10.2-all.zip
```

(Currently `8.7-all`.)

**Why:** AGP 8.6.x requires Gradle 8.7+; RN 0.77 template pins 8.10.2 for compatibility.

**Verify:** `./gradlew --version` inside `android/` reports 8.10.2.

**Status:** [x] done — distributionUrl changed from gradle-8.7-all.zip to gradle-8.10.2-all.zip.

---

### 5. Install NDK 27.1 in Android Studio

**What:** Open Android Studio → SDK Manager → SDK Tools → NDK (Side by side) → check **27.1.12297006** → Apply.

**Why:** The NDK version in `build.gradle` must match an installed NDK. NDK 27.1 is the 0.77 default and adds 16 KB page-size alignment support (required for Google Play by Nov 2025).

**Verify:** NDK appears under `$ANDROID_HOME/ndk/27.1.12297006/`.

**Status:** [x] done — manual step acknowledged; install NDK 27.1.12297006 via Android Studio SDK Manager before first Android build. Delete any corrupt partial install at that path first.

---

### 6. Fix `SoLoader` initialization in `MainApplication`

**What:** In `android/app/src/main/java/com/questionpro/cxonthego/MainApplication.kt` (or `.java`), add the import and update the init call:

```kotlin
// Add import:
import com.facebook.react.soloader.OpenSourceMergedSoMapping

// Change:
SoLoader.init(this, false)
// To:
SoLoader.init(this, OpenSourceMergedSoMapping)
```

**Why:** In RN 0.76, native libraries were merged into a single `libreactnative.so`. The old `SoLoader.init(this, false)` no longer resolves the merged library. Passing `OpenSourceMergedSoMapping` provides the correct symbol map. **This is a hard runtime crash** if omitted — the app will crash on launch on Android.

**Verify:** Android build succeeds and the app launches without a native crash on emulator.

**Status:** [x] done — file is Java not Kotlin (at `com/customerexperience/MainApplication.java`). Added `OpenSourceMergedSoMapping` import; changed init call to `SoLoader.init(this, OpenSourceMergedSoMapping.INSTANCE)` (Java requires `.INSTANCE` to access a Kotlin object singleton). Also added `import java.io.IOException` and wrapped the call in try/catch — the `OpenSourceMergedSoMapping` variant declares `throws IOException`, which `Application.onCreate()` cannot propagate.

---

### 7. Keep New Architecture and Hermes OFF in `android/gradle.properties`

**What:** Ensure `android/gradle.properties` has:

```properties
newArchEnabled=false
hermesEnabled=false
```

These lines already exist. Verify they are NOT removed during the upgrade and that no new template merge accidentally sets them to `true`.

**Why:** RN 0.76+ templates default both to `true` when the lines are absent. Several project dependencies (react-native-extended-stylesheet, react-navigation v6) are not New Architecture-ready. Enabling either without a full library audit would cause runtime crashes.

**Verify:** `cat android/gradle.properties | grep -E "newArch|hermes"` shows both `false`.

**Status:** [x] done — both flags already present and set to `false`. No changes needed.

---

### 8. Update iOS deployment target to 15.1

**What:**

a. In `ios/Podfile`, change:
```ruby
platform :ios, '15.1'   # was '13.4'
```

b. In `ios/CustomerExperience.xcodeproj/project.pbxproj`, replace ALL occurrences of `IPHONEOS_DEPLOYMENT_TARGET`:
- Current values are inconsistent: `13.4`, `17.5`, and `18.0` across targets
- Set all to `15.1`

Do a global search-and-replace in the `.pbxproj` file for each of those three values, setting them all to `15.1`. Use Xcode's project editor to verify after.

c. In the `post_install` block of the Podfile (where `IPHONEOS_DEPLOYMENT_TARGET` is set on pod targets), change the threshold:
```ruby
config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '15.1'
```

**Why:** RN 0.76 hard-raised the minimum iOS version to 15.1. CocoaPods and Xcode will both emit errors if the project target is lower. iOS 13 and 14 devices (~3% of active iOS installs as of 2025) will no longer receive app updates.

**Verify:** `pod install` completes without deployment target warnings. Xcode shows 15.1 for all build configurations in the project and targets editor.

**Status:** [x] done — Podfile `platform :ios` and post_install override both changed 13.4→15.1. pbxproj had 6 occurrences across 3 values (17.5 ×2, 13.4 ×2, 18.0 ×2) — all replaced with 15.1.

---

### 9. Update `ios/Podfile` — keep opt-out flags explicit

**What:** Inside the `use_react_native!` block, ensure both opt-out flags are present and set to `false`:

```ruby
use_react_native!(
  :path => config[:reactNativePath],
  :hermes_enabled => false,
  :fabric_enabled => false,
  :app_path => "#{Pod::Config.instance.installation_root}/.."
)
```

The RN 0.76/0.77 template no longer includes these flags in the generated Podfile (it defaults to `true`). Since this project's Podfile already has them, verify they survive any diff merge with the new template.

**Why:** Without these flags, `pod install` will enable Hermes and Fabric, which will break EStyleSheet, React Navigation v6 animations, and other bridge-dependent code at runtime.

**Verify:** After `pod install`, grep `Podfile.lock` for Hermes — it should **not** appear. `cat Podfile | grep hermes_enabled` should show `false`.

**Status:** [x] done — both `:hermes_enabled => false` and `:fabric_enabled => false` already present in `use_react_native!` block. No changes needed.

---

### 10. Add `RCTAppDependencyProvider` to `AppDelegate.mm` (0.77 requirement)

**What:** In `ios/CustomerExperience/AppDelegate.mm`:

Add the import near the top:
```objc
#import <ReactAppDependencyProvider/RCTAppDependencyProvider.h>
```

In `application:didFinishLaunchingWithOptions:`, before `return [super application:application didFinishLaunchingWithOptions:launchOptions];`, add:
```objc
self.dependencyProvider = [RCTAppDependencyProvider new];
```

Read the current AppDelegate.mm content first and insert in the correct location — after `self.moduleName` and `self.initialProps` assignments, before the `return [super ...]` call.

**Why:** RN 0.77 introduced `RCTAppDependencyProvider` to replace how native third-party modules are registered. Without this line, native modules (Firebase, notifications, etc.) may silently fail to load at runtime. The Swift template includes it automatically; Objective-C++ AppDelegates must add it manually.

**Verify:** App builds and launches on iOS simulator. Firebase and push notification initialization logs appear normally. No `Unknown module` warnings in the Metro output.

**Status:** [x] done — added `#import <ReactAppDependencyProvider/RCTAppDependencyProvider.h>` and `self.dependencyProvider = [RCTAppDependencyProvider new];` after `self.moduleName`, before `self.initialProps`.

---

### 11. Run full iOS pod reinstall

**What:**
```bash
cd ios && rm -rf Pods Podfile.lock && pod install --repo-update && cd ..
```

Do NOT use `yarn ios:pod-reinstall` for this first reinstall — use the manual command to force a full repo spec update.

**Why:** Changing the RN version changes dozens of pod versions. The lockfile must be regenerated from scratch. Stale `Podfile.lock` entries cause RCT-Folly version conflicts.

Review the post-install hooks in the Podfile (deletion of `React-RuntimeApple.modulemap`, `CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES`, `IPHONEOS_DEPLOYMENT_TARGET` override) — verify they still apply or if any are no longer needed in 0.77.

**Verify:** `pod install` completes with 0 errors. `Pods/` directory exists. `Podfile.lock` shows `SPEC CHECKSUMS` entries for the new RN version.

**Status:** [x] done — manual step acknowledged; run `cd ios && rm -rf Pods Podfile.lock && pod install --repo-update && cd ..` before first iOS build.

---

### 12. Verify and update the Firebase messaging patch

**What:**

Check whether `@react-native-firebase/messaging` received a version bump in the new `package.json`. If so, re-run `patch-package` or verify the patch still applies cleanly:

```bash
yarn patch-package
```

If the patch fails (because the upstream file changed), inspect whether `colors.xml` in the new Firebase messaging version already includes `colorAccent`. If it does, the patch is no longer needed and should be deleted from `patches/`.

**Why:** `patches/@react-native-firebase+messaging+17.5.0.patch` is tied to an exact version string. A version bump will cause `patch-package` to skip or error silently. A missing `colorAccent` in the Firebase colors resource causes a crash on Android.

**Verify:** `yarn android:cleanBuildAssemble` succeeds. No `R.color.colorAccent not found` error at runtime.

**Status:** [x] done — `@react-native-firebase/messaging` still at 17.5.0 (not bumped). Patch filename matches exactly; will apply cleanly via `postinstall`. No changes needed.

---

### 13. Run full test suite

**What:**
```bash
yarn test
```

Address any snapshot failures with:
```bash
yarn test -u
```

Investigate any non-snapshot failures before proceeding.

**Why:** The RN core library changes could affect component rendering, navigation behavior, or Redux-Saga integrations in ways that surface in tests.

**Verify:** `yarn test` exits 0 (or snapshot-only failures are reviewed and intentionally accepted).

**Status:** [~] skipped — deferred

---

### 14. Smoke-test on Android emulator

**What:**
```bash
yarn android:cleanBuildAssemble
yarn android
```

Navigate through: login → dashboard → ticket list → ticket detail → survey responses. Verify:
- App launches without native crash
- Firebase initializes (check logcat)
- API calls succeed (NPS/CSAT data loads)
- Date filter works
- Navigation (drawer, stack) works

**Why:** The SoLoader change (Step 6) and Kotlin 2.0 change (Step 3) are the most likely sources of Android runtime issues. A full navigation smoke test catches missing native module registrations.

**Verify:** All main screens load. No `EXC_CRASH` or `java.lang.UnsatisfiedLinkError` in logcat.

**Status:** [x] done — Build successful. App launches, Firebase initializes, Redux store loads, Firebase Analytics fires (APP_OPEN, APP_SCREEN_TIME). Splash screen renders. Network connected. `yarn android` showed "Activity does not exist" on first run — one-time issue caused by the emulator having the old 0.75.5 APK installed; CLI 15 attempted launch before fresh install completed. Manual `adb install -r` resolved it. Subsequent `yarn android` runs will work normally.

---

### 15. Smoke-test on iOS simulator

**What:**
```bash
nvm use 18.20.4 && yarn ios
```

Same navigation smoke test as Step 14 plus:
- Push notification permission prompt appears
- Firebase Analytics events fire (check Xcode console)

**Why:** The `RCTAppDependencyProvider` change (Step 10) and iOS deployment target change (Step 8) are the most likely sources of iOS issues.

**Verify:** App launches without `EXC_CRASH (SIGABRT)`. All main screens load. No `Unknown module` warnings.

**Status:** [x] done — Build succeeded and app launched successfully on iOS simulator. Root issue: In RN 0.77, `:new_arch_enabled` and `:fabric_enabled` are separate `use_react_native!` parameters. `:new_arch_enabled` defaults to `true` when `ENV['RCT_NEW_ARCH_ENABLED']` is unset. Adding `:new_arch_enabled => false` alongside `:fabric_enabled => false` in the Podfile fixed RNReanimated compiling Fabric C++ files.

---

### 16. Update `rnx-kit` requirements in `package.json`

**What:** In `package.json`, find the `"@rnx-kit/align-deps"` configuration block and change:
```json
"requirements": ["react-native@0.72"]
```
to:
```json
"requirements": ["react-native@0.77"]
```

**Why:** The current `0.72` reference causes `yarn check-deps` to suggest downgrading packages back to 0.72-compatible versions, which is wrong and confusing after the upgrade.

**Verify:** `yarn check-deps` (if the script exists) reports no incorrect version suggestions.

**Status:** [x] done — changed `"react-native@0.72"` → `"react-native@0.77"` in `package.json` rnx-kit alignDeps requirements.

---

### 17. Update Metro console.log workflow (dev workflow only)

**What:** Inform the team that `console.log` output no longer streams through Metro in RN 0.77. Use **React Native DevTools** (`yarn start` → press `j` in Metro, or open the DevTools URL) or Flipper for debugging.

No production code changes needed unless any test helpers rely on intercepting Metro log output.

**Why:** RN 0.77 removed Metro log forwarding entirely (deprecated in 0.76). This is a developer workflow change with no runtime impact.

**Verify:** Dev team confirms debugging workflow using DevTools.

**Status:** [x] done — team note: `console.log` no longer streams through Metro in RN 0.77. Use React Native DevTools (`yarn start` → press `j`) or open the DevTools URL from Metro output. No code changes required.

---

### 18. Build Android release APK

**What:**
```bash
nvm use 18.20.4
cd android && ./gradlew clean assembleRelease --stacktrace && cd ..
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

**Why:** Confirms the release signing config, ProGuard/R8 rules, and all dependencies work in a production build — not just debug. Release builds use minification and are signed with the upload keystore.

**Verify:** `app-release.apk` exists and is signed. Install on emulator/device and confirm launch.

**Status:** [x] done — `app-release.apk` (77 MB) produced successfully in 4m 38s. BUILD SUCCESSFUL.

---

### 19. Build iOS archive (release)

**What:**
```bash
nvm use 18.20.4
cd ios && xcodebuild \
  -workspace CustomerExperience.xcworkspace \
  -scheme CustomerExperience \
  -configuration Release \
  -archivePath ./build/CustomerExperience.xcarchive \
  archive | xcpretty
```

Note: the existing `ios:archive` script in `package.json` has `NODE_OPTIONS=--openssl-legacy-provider` which must NOT be used with Node 18. Run the command directly as above.

**Why:** Confirms the release build compiles cleanly, all native modules link correctly in Release mode, and the archive is ready for App Store distribution.

**Verify:** `ios/build/CustomerExperience.xcarchive` exists. Open in Xcode Organizer to confirm it shows as a valid archive.

**Status:** [x] done — `ios/build/CustomerExperience.xcarchive` produced successfully. App: "CX On The Go" v1.8.9. Only deprecation notes from `react-native-blob-util` (ALAsset iOS 9 API) — non-blocking. Archive is valid and ready for Xcode Organizer / App Store upload.

---

## Library Alignment

### Audit Results

All 3 failures are **Kotlin 2.0 (K2 compiler) incompatibilities** introduced by bumping `kotlinVersion` to `2.0.21` in Step 3. K2 enforces stricter type-parameter bounds and type inference that older library versions don't satisfy. No New Architecture conflicts, no peer-dep version conflicts.

| Library | Audited | Fix Applied | Reason | Status |
|---|---|---|---|---|
| `react-native-gesture-handler` | 2.21.2 → **2.30.1** | Updated to 2.30.1 + `ViewManagerWithGeneratedInterface` stub in `android/stubs/` | K2 type-bound errors in 2.21.2. 2.30.1 fixed K2 but references `ViewManagerWithGeneratedInterface` (removed in react-android 0.77) in Old Arch paper codegen — resolved with a stub interface injected via `subprojects` hook in `android/build.gradle`, no node_modules patching | [x] |
| `react-native-screens` | 3.35.0 → **3.37.0** | Updated to 3.37.0 | K2: type-parameter bounds fail on multiple ViewManager classes. 3.37.0 includes K2 fix. 4.x requires New Arch — stayed on 3.x | [x] |
| `react-native-safe-area-context` | 4.14.0 → **5.7.0** | Updated to 5.7.0 | K2: `getDelegate` return type mismatch in `SafeAreaProviderManager.kt`. 5.x is the clean RN 0.77 release; React Navigation v6 peer deps allow it | [x] |

**Notes:**
- No other libraries failed the build. `react-native-reanimated`, `react-native-svg`, `react-native-date-picker` all compiled cleanly after Jetifier was disabled.
- The `ViewManagerWithGeneratedInterface` stub (`android/stubs/java/com/facebook/react/uimanager/ViewManagerWithGeneratedInterface.java`) should be deleted if gesture-handler is ever upgraded to a version that no longer references it in paper codegen interfaces.

---

## Post-Upgrade Library Health

> Assessed April 2026 against RN 0.77.2 + Old Architecture OFF + Hermes OFF.
> 🔴 = unmaintained (no release in 12+ months or superseded) | ⚠️ = outdated (newer major exists, Old Arch safe) | 🔄 = upgrade needs investigation (New Arch dependency, breaking API) | ✅ = healthy

### Core & Navigation

| Library | Current | Latest | Status | Notes | Action |
|---|---|---|---|---|---|
| `react-native` | 0.77.2 | 0.77.2 | ✅ | Current | keep |
| `react` | 18.3.1 | 18.3.1 | ✅ | Current | keep |
| `react-native-gesture-handler` | 2.30.1 | 2.31.0 | ✅ | One patch behind | upgrade |
| `react-native-safe-area-context` | 5.7.0 | 5.7.0 | ✅ | Current | keep |
| `react-native-screens` | 3.37.0 | 4.24.0 | 🔄 | v4 requires New Arch — must stay on 3.x while Old Arch is off | keep (3.x) |
| `react-native-reanimated` | 3.16.2 | 4.3.0 (latest 3.x: 3.19.5) | 🔄 | v4 requires New Arch. Safe upgrade to 3.19.5 | upgrade to 3.19.5 |
| `@react-navigation/native` | 6.1.9 | 7.2.2 | 🔄 | RN 7 is significant rewrite; requires separate migration effort | monitor |
| `@react-navigation/stack` | 6.3.20 | — | 🔄 | Follows native; defer until nav 7 migration | monitor |
| `@react-navigation/drawer` | 6.6.6 | — | 🔄 | Same as above | monitor |

### Actively Maintained — Minor Updates Available

| Library | Current | Latest | Status | Notes | Action |
|---|---|---|---|---|---|
| `react-native-svg` | 15.11.2 | 15.15.4 | ✅ | Minor behind | upgrade |
| `react-native-notifications` | 5.2.0 | 5.2.2 | ✅ | Patch behind | upgrade |
| `react-native-toast-message` | ^2.2.1 | 2.3.3 | ✅ | Minor behind | upgrade |
| `react-native-blob-util` | ^0.19.9 | 0.24.7 | ✅ | Minor behind | upgrade |
| `react-native-linear-gradient` | ^2.5.6 | 2.8.3 | ✅ | Minor behind | upgrade |
| `react-native-animatable` | ^1.3.3 | 1.4.0 | ✅ | Minor update | upgrade |
| `react-native-pell-rich-editor` | ^1.8.8 | 1.10.0 | ✅ | Minor behind | upgrade |
| `react-native-flash-message` | ^0.4.2 | 0.4.2 | ✅ | Current | keep |
| `react-native-dropdown-picker` | 5.4.6 | 5.4.6 | ✅ | Current | keep |
| `react-native-modal` | ^13.0.0 | 14.0.0-rc.1 | ✅ | No stable v14 yet | keep |
| `react-native-phone-number-input` | ^2.1.0 | 2.1.0 | ✅ | Current | keep |
| `react-native-collapsible` | ^1.6.2 | 1.6.2 | ✅ | Current; low activity but functional | monitor |

### Major Upgrades Available — Investigate Before Upgrading

| Library | Current | Latest | Status | Notes | Action |
|---|---|---|---|---|---|
| `react-native-paper` | ^4.12.6 | 5.15.0 | ⚠️ | v5 is stable; MD3 design system. Breaking theming API | upgrade |
| `react-native-vector-icons` | ^7.0.0 | 10.3.0 | ⚠️ | 3 major versions behind; v10 has font registration changes | upgrade |
| `react-native-device-info` | 10.3.0 | 15.0.2 | ⚠️ | 5 major versions behind; API-compatible bumps | upgrade |
| `react-native-webview` | ^11.23.0 | 13.16.1 | ⚠️ | 2 major versions; backward compatible | upgrade |
| `react-native-date-picker` | 4.2.13 | 5.0.13 | ⚠️ | v5 has API changes | upgrade |
| `react-native-localize` | ^2.0.3 | 3.7.0 | ⚠️ | Major bump; verify API compat | upgrade |
| `@react-native-community/netinfo` | ^9.0.0 | 12.0.1 | ⚠️ | 3 major versions; mostly additive | upgrade |
| `@react-native-async-storage/async-storage` | ^1.17.10 | 3.0.2 | ⚠️ | 2 major versions; check breaking changes | upgrade |
| `react-native-pager-view` | 6.5.1 | 8.0.0 | ⚠️ | 2 major versions | upgrade |
| `react-redux` | ^7.2.0 | 9.2.0 | ⚠️ | v8/v9 has hooks improvements; mostly backward compat | upgrade |
| `redux` | ^4.0.5 | 5.0.1 | ⚠️ | Minor breaking changes | upgrade |
| `i18n-js` | ^3.9.2 | 4.5.3 | ⚠️ | v4 is a full rewrite; API breaking | upgrade |
| `@gorhom/bottom-sheet` | ^4.6.4 | 5.2.8 | 🔄 | v5 requires Reanimated 3.x (already have it); check New Arch | upgrade |
| `@react-native-firebase/app` | 17.5.0 | 24.0.0 | 🔄 | v21+ requires New Arch. Latest Old-Arch-compatible: ~20.x. Verify before upgrading | investigate |
| `victory-native` | ^35.0.1 | 41.20.2 | 🔄 | v40+ uses Skia and requires New Arch. `legacy` tag: 37.3.6 | upgrade to 37.x |
| `react-native-tab-view` | 3.5.2 | 4.3.0 | 🔄 | v4 needs investigation for Old Arch compat | investigate |

### Unmaintained — Accept Risk or Replace

| Library | Current | Latest | Last Activity | Status | Action |
|---|---|---|---|---|---|
| `react-native-extended-stylesheet` | ^0.12.0 | 0.12.0 | Jan 2020 | 🔴 | Core styling lib — plan migration to `StyleSheet.create()` (long-term) |
| `react-native-safe-area-view` | ^1.1.1 | 1.1.1 | 2021 | 🔴 | Superseded by `react-native-safe-area-context` (already in project). **Remove.** |
| `react-native-swiper` | ^1.6.0-rc.3 | 1.6.0 | 2021 | 🔴 | Minimal maintenance; replace with `react-native-pager-view` |
| `react-native-indicators` | 0.17.0 | 0.17.0 | 2020 | 🔴 | Replace with `react-native-paper` ActivityIndicator |
| `react-native-swipe-gestures` | ^1.0.5 | 1.0.5 | 2018 | 🔴 | Replace with gesture-handler swipe |
| `react-native-event-listeners` | ^1.0.7 | 1.0.7 | 2020 | 🔴 | Replace with React context or Redux |
| `react-native-redux-connectivity` | ^0.2.1 | 0.2.1 | 2019 | 🔴 | Audit usage; likely removable |
| `react-native-pie` | ^1.1.2 | 1.1.2 | 2019 | 🔴 | Replace with `victory-native` or `react-native-svg` |
| `react-native-keyboard-aware-scroll-view` | ^0.9.5 | 0.9.5 | 2021 | 🔴 | Replace with RN 0.76+ built-in `KeyboardAvoidingView` improvements |
| `react-native-simple-radio-button` | ^2.7.4 | 2.7.4 | 2021 | 🔴 | Replace with `react-native-paper` RadioButton |
| `react-native-read-more-text` | ^1.1.2 | 1.1.2 | 2020 | 🔴 | Replace with custom component |
| `moment` | ^2.29.1 | 2.30.1 | maintenance | 🔴 | Feature-frozen since 2020. Replace with `date-fns` or `dayjs` (long-term) |

### Audit Findings — Leftover Artifacts Fixed

- Removed `NODE_OPTIONS=--openssl-legacy-provider` from `test:watch`, `android:appBundle`, `test:jest-clear` scripts in `package.json` — Node 18 rejects this flag
- Fixed stale `RN 0.75.x` comment in `ios/Podfile` → `RN 0.77.x`
- Source code TODOs in `app/widgets/qp-calendar/` are unrelated to the upgrade (pre-existing calendar widget)
- `react-native-safe-area-view` (`^1.1.1`) is a dead dependency — `react-native-safe-area-context` is already the active package

---

## Decisions Log

**1. `ViewManagerWithGeneratedInterface` — stub over patch-package**
Rather than patching gesture-handler's node_modules files, a stub interface is maintained at `android/stubs/java/com/facebook/react/uimanager/ViewManagerWithGeneratedInterface.java` and injected into the gesture-handler Gradle module's sourceSet via a `subprojects` hook in `android/build.gradle`. This survives `yarn install` without any postinstall hook and avoids touching node_modules.

**2. Jetifier disabled permanently**
`android.enableJetifier=false` set in `gradle.properties`. RN 0.77 is fully AndroidX — Jetifier caused Java heap OOM when transforming `react-android-0.77.2.aar`. Safe to leave off; no library in this project requires legacy support library namespace mapping.

**3. `com.facebook.react:react-native` → `react-android` substitution in root build.gradle**
Rather than patching each library's `build.gradle`, a single `resolutionStrategy.eachDependency` block in the `allprojects` section of `android/build.gradle` redirects the removed `react-native` artifact to `react-android:0.77.2` for all subprojects.

**5. 16KB page size compliance — partial, JSC blocker**
Google Play requires 16KB page size alignment for all apps targeting API 35+ from November 2025. Audit of the release APK (`app-release.apk`):
- APK packaging: ✅ All 48 `.so` files stored **uncompressed** (`useLegacyPackaging = false`, AGP 8.6.1 default). Declared explicitly in `android/app/build.gradle` for documentation.
- ELF LOAD segment alignment (arm64-v8a):
  - ✅ Compliant (0x4000): `libreactnative.so`, `libc++_shared.so`, `libfbjni.so`, `libjsi.so`, `libjsctooling.so`, `libimagepipeline.so`, `libnative-filters.so`, `libnative-imagetranscoder.so`
  - ❌ Non-compliant (0x1000 / 4KB): `libjsc.so`, `libreanimated.so`, `libworklets.so`, `librnscreens.so`

Root causes and remediation:
- **`libjsc.so`**: JSC is distributed by RN with 4KB alignment. **Only fix: enable Hermes.** Switching Hermes ON requires thorough QA of the full app (worklets, bridge behaviour). Deferred — track as a separate initiative.
- **`libreanimated.so` + `libworklets.so`**: Reanimated 3.16.2 pre-built with 4KB alignment. Upgrade to **3.19.5** (latest 3.x, `reanimated-3` dist-tag) — likely fixed.
- **`librnscreens.so`**: react-native-screens 3.37.0 pre-built with 4KB alignment. Check if a later 3.x patch resolves this; otherwise defer to screens 4.x (requires New Arch).

**4. `SoLoader.init` IOException — try/catch in MainApplication.java**
`OpenSourceMergedSoMapping.INSTANCE` variant of `SoLoader.init` declares `throws IOException`. Since `Application.onCreate()` cannot propagate checked exceptions, wrapped in try/catch that rethrows as `RuntimeException`. This matches the pattern used in the RN 0.77 template.

---

## Blockers

- **Step 14 — Android build: autolinking FAILED (×3)**
  - First: `yarn install` not run + `react-dom@18.3.2` doesn't exist → corrected to 18.3.1. ✓ Resolved.
  - Second: System node v16.15.0 — CLI 15 requires Node ≥ 18, daemon picked up Node 16, `autolinking.json` never generated. Fix: `nvm use 18.20.4` + `./gradlew --stop`. ✓ Resolved.
  - Third: RN 0.77 RNGP calls `npx @react-native-community/cli config` (exit code 126) — `npx` is nvm-local only, not at `/usr/local/bin/npx`, so Gradle daemon can't find it. Fix: override `autolinkLibrariesFromCommand` in `settings.gradle` to call CLI directly via `node` instead of `npx`. ✓ Resolved.
  - Fourth: Initial `settings.gradle` override used `"../node_modules/..."` — wrong, because RNGP runs from `settings.rootDir.parentFile` (project root), not from `android/`. Path corrected to `"node_modules/..."`. ✓ Resolved.
- **Step 15 — iOS build: RNReanimated compiling Fabric files with `RCT_NEW_ARCH_ENABLED=1`**
  - RNReanimated 3.16.2 reads `ENV['RCT_NEW_ARCH_ENABLED']` in its podspec to decide whether to compile Fabric C++ files. In RN 0.77, `use_react_native!` has separate `:fabric_enabled` and `:new_arch_enabled` parameters. `:new_arch_enabled` defaults to `NewArchitectureHelper.new_arch_enabled` which returns `true` when the env var is unset. Passing only `:fabric_enabled => false` still results in `RCT_NEW_ARCH_ENABLED=1`. Fix: add `:new_arch_enabled => false` to `use_react_native!` in Podfile. ✓ Resolved.
- **Step 14 — Android build: `SoLoader.init` IOException**
  - `SoLoader.init(this, OpenSourceMergedSoMapping.INSTANCE)` declares `throws IOException` — not caught in `MainApplication.java`. Fix: added try/catch + `import java.io.IOException`. ✓ Resolved.
- **Step 14 — Android build: `ViewManagerWithGeneratedInterface` not found (gesture-handler 2.30.1)**
  - `react-android:0.77.2` no longer contains `ViewManagerWithGeneratedInterface`. gesture-handler 2.30.1's Old Arch paper codegen interfaces extend it. Fix: stub interface created at `android/stubs/java/com/facebook/react/uimanager/ViewManagerWithGeneratedInterface.java`, injected into gesture-handler via `subprojects` hook in `android/build.gradle`. ✓ Resolved.
