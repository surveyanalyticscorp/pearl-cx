# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

- This is a react-native project, that runs on both Android and iOS platform.
- The app is used by CX managers on their Android or iOS phones.
- It shows NPS, CSAT scores, Survey Responses and Tickets.
- All data can be filtered by date.
- Tickets can be filtered by Status, priority, Manual ticket or detractor ticket, tags.
- CX Manager can manage tickets from the app.
- CX manager can see survey responses.
- CX manager can put comments and contact the Customer via email from the app.

## React Native Version & Platform Status

- **React Native:** 0.77.2
- **Android:** ✅ Builds and runs on emulator (upgraded 0.75.5 → 0.77.2, April 2026)
- **iOS:** ✅ Builds and runs on simulator (upgraded 0.75.5 → 0.77.2, April 2026)
- **Hermes:** ON (`hermesEnabled=true` in gradle.properties, `hermes_enabled: true` in Podfile) — enabled April 2026 for 16KB page size compliance
- **New Architecture (Fabric):** OFF (`newArchEnabled=false` in gradle.properties, `fabric_enabled: false` and `new_arch_enabled: false` in Podfile)
- **Minimum iOS deployment target:** 15.1 (bumped from 13.4 — RN 0.76 hard minimum)
- **Node requirement:** Node >= 18 (RN 0.77 requires Node 18+)
- **Xcode tested on:** Xcode 26.3 / iOS 26.2 SDK
- **Android toolchain:** NDK 27.1.12297006 · Kotlin 2.0.21 (K2) · AGP 8.6.1 · Gradle 8.10.2 · compileSdk 35
- **16KB page size:** ✅ Fully compliant. All `.so` files at 0x4000. Fixed: Hermes ON (replaces `libjsc.so`), reanimated 3.16.2 → 3.18.2, `patches/react-native-screens+3.37.0.patch` adds `-Wl,-z,max-page-size=16384` to `librnscreens.so`.

## Tech Stack

- React Native (JavaScript only — no TypeScript)
- State: Redux + Redux-Saga
- Navigation: React Navigation v6 (Stack + Drawer)
- Styling: EStyleSheet (react-native-extended-stylesheet) + React Native Paper
- Testing: Jest (unit / component / widget)
- Package Manager: Yarn

---

## Commands

```bash
# Development
yarn start                    # Start Metro bundler
yarn start:resetCache         # Reset Metro cache
yarn android                  # Run Android emulator
nvm use 18.20.4 && yarn ios   # Run iOS simulator (Node 18 required)

# Android builds
yarn android:cleanBuildAssemble  # Full clean build
yarn android:debug-bundle        # Create debug bundle

# iOS
yarn ios:pod-reinstall        # Full pod clean and reinstall (always after dep changes)
                              # If that fails, run manually:
                              # cd ios && rm -rf Pods Podfile.lock && pod install --repo-update && cd ..

# Testing
yarn test                     # Run all tests (includes -u snapshot update)
yarn test:unit                # app/testcases/unit_test/
yarn test:component           # app/testcases/component_test/
yarn test:widget              # app/testcases/widget_test/
yarn test:watch               # Watch mode
yarn test:coverage            # Full coverage report

# Run a single test file
yarn test --testPathPattern=path/to/MyFile.test.js

# Cache / reset
yarn watchman:clean           # Fix file watching issues
yarn reset_                   # Full node_modules reset + cache clean
```

---

## Architecture

All application code lives in `app/` — there is no `src/` directory. Never create a `src/` folder.

### Project Structure

```
app/
  api/              # Network layer (ApiHandler.js, WebServiceHandler.js)
  components/       # Reusable UI components
  config/           # Constants and configuration (Constant.js)
  redux/
    actions/        # Domain-specific action creators
    reducer/        # Domain-specific reducers
    sagas/          # Async logic and API calls
    store/          # Store setup
  routes/           # Navigation stacks and appRouter.js
  screens/          # Screen-level components
  styles/           # Global style variables
  testcases/
    unit_test/
    component_test/
    widget_test/
```

### State Management: Redux + Redux-Saga

- **Store**: `app/redux/store/store.js`
- **Actions**: Domain-specific files in `app/redux/actions/` (e.g. `dashboard.actions.js`)
- **Reducers**: `app/redux/reducer/` — domain-specific (Dashboard, Global, Notification, Feedback, Login, Network)
- **Sagas**: `app/redux/sagas/` — handle ALL async operations and API calls

**The standard async flow — always follow this, no exceptions:**

```
dispatch action
  → saga intercepts with takeEvery
  → saga calls API via ApiHandler
  → saga dispatches success/error action
  → reducer updates state
```

Never call APIs directly from a component or a reducer. All async logic belongs in a saga.

### API Layer

Two files handle ALL network communication — never use raw `fetch` anywhere else:

- **`app/api/ApiHandler.js`** — business logic layer. Exposes named methods like `getCXDetractorTicket()`, `getFeedbackResponseList()`, `generateEmailWithAI()`.
  - Use `callAPIInternal(token, url, data, successCb, errorCb)` for standard calls
  - Use `callAIRouterAPI(url, apiKey, data, successCb, errorCb)` for AI router endpoints
- **`app/api/WebServiceHandler.js`** — HTTP abstraction using native `fetch`. Auto-prepends `global.baseUrl` to relative URLs.
  - Use `static postNew()` for POST
  - Use `static get()` for GET

API endpoints and app-wide constants are in `app/config/Constant.js`. Never hardcode URLs or keys inline.

### Navigation

- Central router: `app/routes/appRouter.js`
- Feature stacks: `DashboardStack.js`, `ClosedLoopStack.js`, `ResponsesStack.js`, `SettingsStack.js`, `SignInStack.js`
- Drawer with custom: `app/components/view/DrawerContent.js`

Never hardcode screen name strings. Always reference screen name constants.

### Styling — EStyleSheet Rules

- Use **EStyleSheet** (`react-native-extended-stylesheet`) for ALL styles — not plain `StyleSheet.create()`
- Use `$rem(n)` units for all sizing and spacing — never raw pixel numbers
- Global variables (colors, spacing, fonts) are in `app/styles/globalStyleVariables.js`
- **Never hardcode color hex values** — always use the global style variables
- React Native Paper (`PaperProvider`) wraps the app — use Paper components where they exist before building custom ones

### Testing

Tests split into three categories under `app/testcases/`:

- `unit_test/` — pure function/utility tests
- `component_test/` — React component tests with snapshot testing
- `widget_test/` — UI widget tests

Saga tests are co-located with saga files (e.g. `dashboard.saga.test.js` lives next to `dashboard.saga.js`).

**Before writing any new mock** — check `__mocks__/` first. Pre-built mocks exist for all major RN libraries including `@react-navigation/*`, Firebase, AsyncStorage, and device info. Do not duplicate them.

### AsyncStorage Keys

These constants are defined in `Constant.js` — always use them, never raw strings:

- `ASYNC_AUTH_TOKEN` — user auth token
- `ASYNC_USER_INFO` — user profile
- `ASYNC_LOGGED_IN_ALREADY` — session flag

---

## Critical Conventions — ALWAYS FOLLOW

- **JS only** — this is a JavaScript project. No TypeScript, no `.ts`/`.tsx` files, no type annotations
- **Functional components only** — no class components
- **Arrow function components**: `const MyComponent = () => {}`
- **Named exports** for all components and utilities
  - Exception: screen components use `export default` (required by React Navigation)
- Use `optional chaining (?.)` and `nullish coalescing (??)` — never assume a value exists
- Always destructure props at the function signature level
- Use `Pressable` for all touchable elements — not `TouchableOpacity` or `TouchableHighlight`
  - Exception: if the surrounding code already uses `TouchableOpacity`, stay consistent
- Always wrap screens with safe area handling using `useSafeAreaInsets` from `react-native-safe-area-context`
  - Never import `SafeAreaView` from `react-native` directly
- Always handle loading, error, and empty states — never assume API data exists

---

## DO NOT — Hard Rules

- **Do NOT add TypeScript** to any file under any circumstance
- **Do NOT install new packages without asking me first** — RN + patch-package setup is fragile
- **Do NOT use raw `fetch` in components or sagas** — always go through `ApiHandler.js` / `WebServiceHandler.js`
- **Do NOT hardcode API URLs, keys, or endpoints** — they belong in `Constant.js`
- **Do NOT hardcode colors or spacing values** — use `globalStyleVariables.js`
- **Do NOT use `StyleSheet.create()`** — use EStyleSheet
- **Do NOT use `console.log`** for debugging — ask me what logger to use if needed
- **Do NOT create a `src/` directory** — all code lives in `app/`
- **Do NOT modify `app/redux/store/store.js`** without explicit instruction
- **Do NOT put async logic in components or reducers** — it belongs in sagas
- **Do NOT write new mocks** without checking `__mocks__/` first

---

## Platform-Specific Notes

**iOS:**

- Always use `nvm use 18.20.4` before building — Node 18 is required, Node 16 will fail
- Do NOT use `NODE_OPTIONS=--openssl-legacy-provider` — Node 18 rejects it; RN 0.75 + Metro does not need it
- Run `yarn ios:pod-reinstall` after ANY dependency change — not optional
- If `yarn ios:pod-reinstall` fails with RCT-Folly conflict, delete manually: `cd ios && rm -rf Pods Podfile.lock && pod install --repo-update`
- Xcode 26 / iOS 26 SDK is supported with the current Podfile configuration
- Minimum deployment target is iOS 15.1 — do not lower it (RN 0.76 hard minimum)

**Android:**

- Use `--stacktrace` flag for Gradle debugging
- Port 8081 conflict fix: `lsof -i :8081` → `kill -9 <PID>`
- **Node 18 is required for Android builds too.** The system node at `/usr/local/bin/node` may be v16 — the Gradle daemon inherits this and `react-native config` (autolinking) fails. Always ensure Node 18 is active before any Gradle build:
  ```bash
  nvm use 18.20.4
  cd android && ./gradlew --stop && cd ..   # kill any daemon started with wrong Node
  ```
  To make Node 18 the permanent system default: `nvm alias default 18.20.4` then symlink:
  `ln -sf ~/.nvm/versions/node/v18.20.4/bin/node /usr/local/bin/node`
- **RN 0.77 RNGP uses `npx` for autolinking — `npx` must be in Gradle's PATH.** If `npx` is only available via nvm (not at `/usr/local/bin/npx`), autolinking fails with exit code 126. Fixed in `android/settings.gradle` by overriding the autolinking command to call the CLI directly via `node` instead of `npx`. Note: RNGP runs from `settings.rootDir.parentFile` (the project root, not `android/`), so the path has no `../`:
  ```groovy
  ex.autolinkLibrariesFromCommand(
      ["node", "node_modules/@react-native-community/cli/build/bin.js", "config"]
  )
  ```

**Patches:**

- `patches/` directory contains `patch-package` patches for several RN libraries
- These apply automatically on `yarn install` via the `postinstall` script
- Never manually edit files in `node_modules/` — use patch-package instead

---

## Known Issues / Gotchas

<!-- This section is GOLD — keep adding to it as you discover quirks -->

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

**4. `CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES = YES` required**
Xcode 26 promotes `non-modular-include-in-framework-module` from warning to hard error. Set via `post_install` on all pod targets. Required for RN C++ pods (React-Fabric, React-RCTFabric, etc.) that include Boost/Folly headers non-modularly.

**5. ReactCommon module map conflict**
`Pods/Headers/Public/ReactCommon/` contains two module maps that both declare `module ReactCommon` — `ReactCommon.modulemap` and `React-RuntimeApple.modulemap`. Xcode 26 enforces this as a hard error. Fixed via `post_install` hook that deletes `React-RuntimeApple.modulemap` after pod install.

**6. `sourceURLForBridge:` crash on launch (RN 0.75 + Xcode 26)**
RN 0.75's `RCTAppDelegate` always registers a `sourceURLForBridge` block that calls `[self sourceURLForBridge:bridge]`, which throws if not overridden — even when `bundleURL` is implemented. Both methods must be present in `AppDelegate.mm`: `bundleURL` returns the JS bundle URL, and `sourceURLForBridge:` delegates to `self.bundleURL`. Without both, the app crashes immediately on launch with `EXC_CRASH (SIGABRT)`.

**7. `NODE_OPTIONS=--openssl-legacy-provider` removed from iOS commands**
This flag was needed for webpack 4 + Node 17+, but RN 0.75 uses Metro. Node 18+ rejects this flag in `NODE_OPTIONS` with `"not allowed in NODE_OPTIONS"`. All iOS build commands no longer need this prefix. The flag is still present in some `package.json` scripts — do not add it to new iOS commands.

**8. Node 18 required — use nvm**
RN 0.75 requires Node >= 18. Use `nvm use 18.20.4` before running iOS builds. The system node may be a different version. Set default with `nvm alias default 18.20.4`.

**9. Podfile.lock must be deleted on fresh pod install**
When changing RN versions, `pod deintegrate` alone is not enough. Both `Pods/` and `Podfile.lock` must be deleted, otherwise CocoaPods conflicts on `RCT-Folly` version mismatch. Always run:
```bash
cd ios && rm -rf Pods Podfile.lock && pod install --repo-update && cd ..
```

**10. `get_default_flags` deprecation warning**
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

### Skipped / Deferred Items

- **`rnx-kit alignDeps`** references `react-native@0.77` in `package.json` (updated during 0.77 upgrade). Run `yarn check-deps` before adding new packages to verify compatibility.
- **Reanimated 3.16.2 with Hermes OFF**: Reanimated 3.x works without Hermes but some advanced worklet features may behave differently. No issues found so far.
- **`react-native-notifications` 5.2.0**: Autolinked successfully. Push notification runtime behaviour on iOS 26 simulator has not been tested end-to-end.
