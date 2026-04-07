# 16KB Page Size Fix Plan

> **Status:** Planned  
> **Target:** Android release APK compliance for Google Play  
> **Last Updated:** April 2026

---

## Problem Statement

Google Play requires 16KB page size alignment for all apps targeting API 35+ from November 2025. The current release APK (`app-release.apk`) has compliance issues:

| Component | ELF Alignment | Status |
|-----------|---------------|--------|
| APK Packaging | N/A (uncompressed .so) | ✅ Compliant |
| `libreactnative.so`, `libc++_shared.so`, etc. | 0x4000 (16KB) | ✅ Compliant |
| `libjsc.so` | 0x1000 (4KB) | ❌ Non-compliant |
| `libreanimated.so` + `libworklets.so` | 0x1000 (4KB) | ❌ Non-compliant |
| `librnscreens.so` | 0x1000 (4KB) | ❌ Non-compliant |

**Root Causes:**
- `libjsc.so`: JSC is distributed by React Native with 4KB pre-built binaries. Only fix: enable Hermes (which bundles 16KB-aligned JSC).
- `libreanimated.so` + `libworklets.so`: Reanimated 3.16.2 pre-built with 4KB alignment. Fix: upgrade to 3.19.5.
- `librnscreens.so`: react-native-screens 3.37.0 pre-built with 4KB alignment. May require library update or accept deferral.

---

## Solution Approach

**Minimal upgrades strategy** — enable Hermes + upgrade Reanimated. This fixes 3 of 4 non-compliant libraries without major architectural changes.

---

## Pre-Flight Checklist

Before starting implementation:

- [ ] Read React Native 0.77 blog posts on Hermes compatibility
- [ ] Confirm full app smoke test plan after Hermes enablement
- [ ] Run `yarn test` on current branch to establish baseline
- [ ] Create backup branch: `git checkout -b fix/16kb-page-size`
- [ ] Review any Reanimated worklets usage in codebase

---

## Implementation Steps

### Step 1: Upgrade react-native-reanimated

**Why:** Reanimated 3.16.2 pre-built binaries are 4KB-aligned. Upgrade to 3.19.5 (latest stable 3.x).

**Action:**
```bash
yarn remove react-native-reanimated
yarn add react-native-reanimated@3.19.5
```

**Verify:**
```bash
yarn list react-native-reanimated
# Should show 3.19.5
```

**Expected Outcome:** `libreanimated.so` and `libworklets.so` will be rebuilt with 16KB alignment.

---

### Step 2: Enable Hermes on Android

**Why:** Hermes bundles its own JSC with 16KB-aligned pre-built binaries. This fixes `libjsc.so` compliance.

**File:** `android/gradle.properties`

```properties
# CHANGE THIS:
hermesEnabled=false

# TO THIS:
hermesEnabled=true
```

**Verify:**
```bash
grep hermesEnabled android/gradle.properties
# Should show hermesEnabled=true
```

---

### Step 3: Enable Hermes on iOS

**File:** `ios/Podfile`

```ruby
# In use_react_native! block, find and change:
:hermes_enabled => false

# TO:
:hermes_enabled => true
```

**Verify:**
```bash
grep hermes_enabled ios/Podfile
# Should show :hermes_enabled => true
```

---

### Step 4: Reinstall iOS Pods

**Why:** Hermes pod needs to be installed with new configuration.

**Action:**
```bash
cd ios && rm -rf Pods Podfile.lock && pod install --repo-update && cd ..
```

**Verify:**
```bash
grep -i hermes Podfile.lock | head -5
# Should show Hermes-related entries
```

---

### Step 5: Clean Android Build

**Why:** Clear cached native builds to force rebuild with Hermes.

**Action:**
```bash
nvm use 18.20.4
cd android && ./gradlew clean --stacktrace && cd ..
```

---

### Step 6: Build Android Release APK

**Action:**
```bash
cd android && ./gradlew assembleRelease --stacktrace && cd ..
```

**Output:** `android/app/build/outputs/apk/release/app-release.apk`

**Verify:** Build completes without errors.

---

### Step 7: Verify 16KB Alignment

**Option A: Command Line**
```bash
# Check each .so file's p_align value
arm-linux-gnueabi-readelf -l android/app/build/outputs/apk/release/app-release.apk lib/arm64-v8a/*.so 2>/dev/null | grep -E "lib NAME|p_align"
```

**Expected Output:**
| Library | p_align | Status |
|---------|---------|--------|
| libjsc.so | 0x4000 | ✅ 16KB |
| libreanimated.so | 0x4000 | ✅ 16KB |
| libworklets.so | 0x4000 | ✅ 16KB |
| librnscreens.so | 0x1000 | ⚠️ 4KB (see note) |

**Option B: Android Studio**
1. Open Android Studio
2. Build → Analyze APK
3. Select `app-release.apk`
4. Navigate to `lib/` folder
5. Check alignment status for each `.so` file

---

### Step 8: Smoke Test - Android

**Action:**
```bash
yarn android
```

**Verify:**
- App launches without crash
- Login flow works
- Dashboard/NPS/CSAT data loads
- Navigation works
- No `java.lang.UnsatisfiedLinkError` in logcat

---

### Step 9: Smoke Test - iOS

**Action:**
```bash
nvm use 18.20.4 && yarn ios
```

**Verify:**
- App launches without crash
- All screens load
- Firebase initializes
- No `EXC_CRASH` errors

---

### Step 10: Run Test Suite

**Action:**
```bash
yarn test
```

**If snapshot failures occur:**
```bash
yarn test -u
```

---

## Known Issues / Deferrals

### librnscreens.so (4KB aligned)

**Status:** May remain non-compliant

**Root Cause:** react-native-screens 3.37.0 pre-built binaries are 4KB-aligned. Latest 3.x is still 3.37.0.

**Options:**
1. **Accept deferral** — JSC + Reanimated fixed = significant improvement
2. **Check for updates** — Monitor screens for 3.38.x with 16KB fix
3. **Wait for screens 4.x** — Requires New Architecture (out of scope for this fix)

---

## Rollback Plan

If issues occur:

**Android:**
```bash
cd android/gradle.properties
# Set hermesEnabled=false
cd android && ./gradlew clean assembleRelease
```

**iOS:**
```bash
cd ios/Podfile
# Set :hermes_enabled => false
cd ios && rm -rf Pods Podfile.lock && pod install --repo-update
```

**Reanimated:**
```bash
yarn remove react-native-reanimated
yarn add react-native-reanimated@3.16.2
```

---

## Files to Modify

| File | Change |
|------|--------|
| `package.json` | Update react-native-reanimated version |
| `android/gradle.properties` | Set `hermesEnabled=true` |
| `ios/Podfile` | Set `:hermes_enabled => true` |

---

## Dependencies

| Package | Current | Target | Risk |
|---------|---------|--------|------|
| react-native-reanimated | 3.16.2 | 3.19.5 | Low |
| Hermes | Disabled | Enabled | Medium |

---

## Timeline Estimate

| Step | Time |
|------|------|
| Pre-flight checks | 15 min |
| Reanimated upgrade | 5 min |
| Hermes enablement | 5 min |
| iOS pod reinstall | 10-15 min |
| Android clean build | 5-10 min |
| Release APK build | 5-10 min |
| Alignment verification | 10 min |
| Smoke tests | 20-30 min |
| **Total** | **~1.5 - 2 hours** |

---

## Success Criteria

- [ ] All `.so` files except `librnscreens.so` show `p_align = 0x4000` (16KB)
- [ ] Android release APK builds without errors
- [ ] iOS archive builds without errors
- [ ] App launches on both platforms
- [ ] Core functionality works (login, dashboard, navigation)
- [ ] `yarn test` passes

---

## Post-Fix Updates

After successful implementation:

1. Update `CLAUDE.md`:
   - Change `Hermes: OFF` → `Hermes: ON`
   - Update 16KB page size status

2. Update `UPGRADE.md`:
   - Add decision log entry for Hermes enablement
   - Document `librnscreens.so` deferral

3. Update team documentation:
   - Hermes is now enabled
   - No manual JSC handling needed
