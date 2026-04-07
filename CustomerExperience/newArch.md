# New Architecture Migration Checklist (RN 0.77.2)

## Context

Migrating from Old Architecture (Paper/Bridge) to New Architecture (Fabric + TurboModules).

**Current state:**
- Hermes: ✅ ON (already enabled — required for New Arch)
- New Architecture: ❌ OFF — `newArchEnabled=false` (Android), `:fabric_enabled => false, :new_arch_enabled => false` (iOS)
- AppDelegate.mm already uses `RCTAppDependencyProvider` (New Arch pattern) — no changes needed there

---

## Library Compatibility Audit

| Library | Version | New Arch Status |
|---|---|---|
| react-native-reanimated | 3.18.2 | ✅ Full Fabric + TurboModule support |
| react-native-gesture-handler | 2.30.1 | ✅ Supports New Arch (Fabric) |
| react-native-screens | 3.37.0 | ✅ Supports New Arch |
| @react-native-firebase/* | 17.5.0 | ✅ New Arch added in v17 |
| react-native-paper | 4.12.6 | ✅ Pure JS — unaffected |
| react-native-extended-stylesheet | 0.12.0 | ✅ Pure JS — unaffected |
| @react-navigation/* | 6.x | ✅ Pure JS — unaffected |
| react-native-notifications | 5.2.0 | ⚠️ Bridge-based — interop layer should handle it; verify at runtime |

---

## Steps

### Android

- [ ] **`android/gradle.properties`** — flip `newArchEnabled=false` → `newArchEnabled=true`
- [ ] **Verify** the `ViewManagerWithGeneratedInterface` stub in `android/stubs/java/com/facebook/react/uimanager/ViewManagerWithGeneratedInterface.java` still compiles cleanly (keep it unless gesture-handler is upgraded to a version that drops the reference)
- [ ] **Build & run:** `nvm use 18.20.4 && yarn android`
- [ ] **Check for duplicate symbol errors** from gesture-handler Paper codegen — if they appear, remove the stub + `subprojects` hook from `android/build.gradle`

### iOS

- [ ] **`ios/Podfile`** — flip both flags in `use_react_native!`:
  - `fabric_enabled: false` → `true`
  - `new_arch_enabled: false` → `true`
- [ ] **Update Podfile comment** above those flags to reflect that New Arch is now active
- [ ] **Run pod reinstall:**
  ```bash
  nvm use 18.20.4
  cd ios && rm -rf Pods Podfile.lock && pod install --repo-update && cd ..
  ```
- [ ] **Watch the `React-RuntimeApple.modulemap` deletion hook** in `post_install` — with New Arch ON this file may now be needed. If Xcode build fails with "module not found: React-RuntimeApple", remove this line from `post_install`:
  ```ruby
  File.delete(conflicting_map) if File.exist?(conflicting_map)
  ```
- [ ] **Build & run:** `nvm use 18.20.4 && yarn ios`

### Documentation

- [ ] **`CLAUDE.md`** — update New Architecture status line:
  - From: `**New Architecture (Fabric):** OFF (...)`
  - To: `**New Architecture (Fabric):** ON (...) — enabled April 2026`

---

## Smoke Testing Checklist

After both platforms build successfully:

- [ ] Login flow works end-to-end
- [ ] Dashboard loads (NPS/CSAT scores, charts — exercises Reanimated)
- [ ] Tickets list renders and filter drawer opens (exercises gesture handler + screens)
- [ ] Survey Responses screen loads
- [ ] Settings screen loads
- [ ] Push notifications received (exercises Firebase + react-native-notifications)
- [ ] Confirm New Arch is active — Metro console should log `Running on Fabric` or check renderer version in React DevTools

---

## Known Risks & Mitigations

| Risk | Mitigation |
|---|---|
| `react-native-notifications 5.2.0` crash at runtime | RN 0.77 interop layer should bridge old modules; if it crashes, may need to upgrade to v6+ |
| `React-RuntimeApple.modulemap` deletion breaks Fabric build | Remove the deletion from `post_install` |
| Gesture handler stub causes duplicate symbol with New Arch codegen | Remove stub + `subprojects` hook from `android/build.gradle` |
| Reanimated worklets behave differently under Fabric | Test all animated screens manually |
| Firebase + New Arch issues | Firebase 17.5.0 targets New Arch; watch for missing `modulemap` errors |
