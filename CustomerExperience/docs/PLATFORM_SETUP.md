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
- **Xcode archive "Can't find node" error:** Xcode's GUI shell doesn't inherit your terminal PATH, so nvm-managed `node` is invisible. Fixed by sourcing `with-environment.sh` in both "Bundle React Native code and images" build phases in `project.pbxproj` — this causes RN to read `ios/.xcode.env.local` (which sets `NODE_BINARY` to the absolute nvm path). The `ios/.xcode.env.local` must contain:
  `export NODE_BINARY=/Users/mehedihasan/.nvm/versions/node/v18.20.4/bin/node`

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

**Hermes dSYM (App Store Connect upload):**

The pre-built `hermes.xcframework` ships without a separate dSYM file, so App Store Connect upload reports "Upload symbols failed" for `hermes.framework`. The DWARF debug info is embedded in the binary itself — extract it once with `dsymutil` and commit the result.

**One-time setup (already done for RN 0.77.2):**

```bash
# Download the hermes iOS release artifact from the RN v<VERSION> GitHub release assets:
# react-native-artifacts-<VERSION>-hermes-ios-release.tar.gz
# Extract it, then run:

dsymutil path/to/hermes.xcframework/ios-arm64/hermes.framework/hermes \
  -o ios/hermes-dsym/hermes.framework.dSYM
```

The result lives at `ios/hermes-dsym/hermes.framework.dSYM/` and is committed to git.

The Podfile `post_install` hook adds a `[RN] Copy Hermes dSYM` build phase to the main app target — it copies the dSYM into `$DWARF_DSYM_FOLDER_PATH` automatically on every Archive build.

After setup, verify with:
```bash
dwarfdump --uuid ios/hermes-dsym/hermes.framework.dSYM/Contents/Resources/DWARF/hermes
# UUID must match the one in the Xcode error
```

**When upgrading RN:** download the new hermes iOS release artifact, re-run `dsymutil` targeting the new binary, replace `ios/hermes-dsym/hermes.framework.dSYM/`, commit, and run `yarn ios:pod-reinstall`.

**If the app is already uploaded but symbols are missing:**
- Xcode Organizer → select the archive → **Upload dSYMs...** — uploads symbols only, no new build number needed.

**Patches:**

- `patches/` directory contains `patch-package` patches for several RN libraries
- These apply automatically on `yarn install` via the `postinstall` script
- Never manually edit files in `node_modules/` — use patch-package instead
