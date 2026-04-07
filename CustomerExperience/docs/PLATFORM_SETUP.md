# PLATFORM_SETUP.md

<!-- Reference this file when setting up a new dev machine, debugging toolchain issues, or onboarding a new developer. -->

## Android Toolchain

- **NDK:** 27.1.12297006
- **Kotlin:** 2.0.21 (K2)
- **AGP:** 8.6.1
- **Gradle:** 8.10.2
- **compileSdk:** 35

## 16KB Page Size Compliance

✅ Fully compliant. All `.so` files at 0x4000. Fixed by:
- Hermes ON (replaces `libjsc.so`)
- reanimated 3.16.2 → 3.18.2
- `patches/react-native-screens+3.37.0.patch` adds `-Wl,-z,max-page-size=16384` to `librnscreens.so`

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
