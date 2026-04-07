# UPGRADE_NOTES.md

<!-- Reference this file when upgrading RN, modifying the Podfile, or debugging build regressions. -->
<!-- Tell Claude Code to read this file at the start of any upgrade session. -->

## Known Issues / Gotchas

### iOS Upgrade Gotchas (RN 0.72 → 0.75, Xcode 26)

**1. `__apply_Xcode_12_5_M1_post_install_workaround` removed**
This helper was removed in RN 0.74. Calling it causes `NoMethodError` during `pod install`. It has been removed from the Podfile.

**2. `react-native-i18n` / `RNI18n` is gone**
The app migrated to `i18n-js` (pure JS) + `react-native-localize` (autolinked). The old `pod 'RNI18n'` line has been removed from the Podfile. Do not re-add it.

**3. `new_arch_enabled` and `fabric_enabled` are separate parameters in RN 0.77**
In RN 0.77, `use_react_native!` has TWO separate flags: `:fabric_enabled` and `:new_arch_enabled`. The default for `:new_arch_enabled` is `NewArchitectureHelper.new_arch_enabled`, which returns `true` when `ENV['RCT_NEW_ARCH_ENABLED']` is unset (i.e., always, unless you set the env var before pod install). Passing only `:fabric_enabled => false` still results in `RCT_NEW_ARCH_ENABLED=1` being propagated to all pods. RNReanimated reads this env var and compiles Fabric C++ files, causing build failures. **Always pass both:**
```ruby
:fabric_enabled => false,
:new_arch_enabled => false,
```

**4. `use_modular_headers!` removed — Firebase pods declared explicitly**
Global `use_modular_headers!` was removed because it causes `non-modular-include-in-framework-module` hard errors in Xcode 26 for all RN C++ pods. Instead, the Firebase dependency chain is declared explicitly in the target block with `:modular_headers => true`:
- `GoogleUtilities`, `FirebaseCore`, `FirebaseCoreInternal`, `FirebaseCoreExtension`
- `FirebaseInstallations`, `FirebaseMessaging`, `GoogleDataTransport`, `nanopb`, `PromisesObjC`

Do NOT add `use_modular_headers!` back globally.

**5. `CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES = YES` required**
Xcode 26 promotes `non-modular-include-in-framework-module` from warning to hard error. Set via `post_install` on all pod targets. Required for RN C++ pods (React-Fabric, React-RCTFabric, etc.) that include Boost/Folly headers non-modularly.

**6. ReactCommon module map conflict**
`Pods/Headers/Public/ReactCommon/` contains two module maps that both declare `module ReactCommon` — `ReactCommon.modulemap` and `React-RuntimeApple.modulemap`. Xcode 26 enforces this as a hard error. Fixed via `post_install` hook that deletes `React-RuntimeApple.modulemap` after pod install.

**7. `sourceURLForBridge:` crash on launch (RN 0.75 + Xcode 26)**
RN 0.75's `RCTAppDelegate` always registers a `sourceURLForBridge` block that calls `[self sourceURLForBridge:bridge]`, which throws if not overridden — even when `bundleURL` is implemented. Both methods must be present in `AppDelegate.mm`: `bundleURL` returns the JS bundle URL, and `sourceURLForBridge:` delegates to `self.bundleURL`. Without both, the app crashes immediately on launch with `EXC_CRASH (SIGABRT)`.

**8. `NODE_OPTIONS=--openssl-legacy-provider` removed from iOS commands**
This flag was needed for webpack 4 + Node 17+, but RN 0.75 uses Metro. Node 18+ rejects this flag in `NODE_OPTIONS` with `"not allowed in NODE_OPTIONS"`. All iOS build commands no longer need this prefix. The flag is still present in some `package.json` scripts — do not add it to new iOS commands.

**9. Node 18 required — use nvm**
RN 0.75 requires Node >= 18. Use `nvm use 18.20.4` before running iOS builds. The system node may be a different version. Set default with `nvm alias default 18.20.4`.

**10. Podfile.lock must be deleted on fresh pod install**
When changing RN versions, `pod deintegrate` alone is not enough. Both `Pods/` and `Podfile.lock` must be deleted, otherwise CocoaPods conflicts on `RCT-Folly` version mismatch. Always run:
```bash
cd ios && rm -rf Pods Podfile.lock && pod install --repo-update && cd ..
```

**11. `get_default_flags` deprecation warning**
`get_default_flags()` is deprecated in RN 0.75 and `flags` variable is unused. This is a non-fatal warning. The call and variable remain in the Podfile to avoid accidental breakage — clean up only when doing a dedicated Podfile refactor.

### Android Upgrade Gotchas (RN 0.75.5 → 0.77.2)

**1. `ViewManagerWithGeneratedInterface` removed from react-android 0.77**
`react-native-gesture-handler` 2.30.1's Old Architecture (paper) codegen interfaces (`RNGestureHandlerButtonManagerInterface`, `RNGestureHandlerRootViewManagerInterface`) extend `ViewManagerWithGeneratedInterface`, which was removed from `react-android:0.77.2`. Do NOT patch node_modules. Instead, a stub interface is maintained at `android/stubs/java/com/facebook/react/uimanager/ViewManagerWithGeneratedInterface.java` and injected into the gesture-handler module via a `subprojects` hook in `android/build.gradle`. If gesture-handler is upgraded to a version that drops this reference, delete the stub and the hook.

**2. `SoLoader.init` throws checked `IOException` in RN 0.76+**
`SoLoader.init(this, OpenSourceMergedSoMapping.INSTANCE)` declares `throws IOException`. The Java `onCreate()` method must wrap it in try/catch — it cannot declare `throws IOException` since `Application.onCreate()` does not. See `MainApplication.java`.

**3. Jetifier disabled — do not re-enable**
`android.enableJetifier=false` in `gradle.properties`. RN 0.77 is fully AndroidX — running Jetifier against the large `react-android-0.77.2.aar` causes Java heap space OOM. It is safe to leave it off permanently.

**4. `com.facebook.react:react-native` artifact removed in RN 0.77**
Libraries that still declare `implementation 'com.facebook.react:react-native:+'` will fail to resolve because RN 0.77 only publishes `com.facebook.react:react-android`. A dependency substitution rule in `android/build.gradle` (`allprojects → configurations.all → resolutionStrategy.eachDependency`) redirects the old artifact name to the new one for all subprojects automatically.

### Dependency Removals

**`react-native-extended-stylesheet` removed (April 2026)**
The library was only used in `app/index.js` for `EStyleSheet.build()` and `EStyleSheet.subscribe('build', cb)`. All 164 style files already used standard `StyleSheet.create()`. The `$rem` variable in `app/styles/globalStyleVariables.js` is plain JS and does not depend on EStyleSheet. The `styleBuilt` rendering gate was removed — `AppContent` now renders directly. No replacement needed.

### Skipped / Deferred Items

- **`rnx-kit alignDeps`** references `react-native@0.77` in `package.json` (updated during 0.77 upgrade). Run `yarn check-deps` before adding new packages to verify compatibility.
- **Reanimated 3.16.2 with Hermes OFF**: Reanimated 3.x works without Hermes but some advanced worklet features may behave differently. No issues found so far.
- **`react-native-notifications` 5.2.0**: Autolinked successfully. Push notification runtime behaviour on iOS 26 simulator has not been tested end-to-end.
