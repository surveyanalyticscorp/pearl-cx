# Android TargetSDK 35 Upgrade Guide

Constraint: this repo has a complex Android build. Never upgrade multiple major things at once unless required.
Primary objective: targetSdkVersion/compileSdkVersion to 35.
Secondary objective: keep CI green and release build working.

## Overview

This guide provides a step-by-step process to upgrade the Android `targetSdkVersion` from 34 to 35 for the CustomerExperience React Native application. Android API 35 corresponds to **Android 15 (VanillaIceCream)**.

### What Changes:

- **compileSdkVersion**: 34 → 35
- **targetSdkVersion**: 34 → 35

### What Remains the Same:

- **minSdkVersion**: 26 (no change required)
- **React Native version**: 0.67.2 (compatible with targetSDK 35)
- **Application ID, version codes, signing configs**: unchanged

## Current State Summary

Based on repository analysis:

| Component                     | Current Version | Status                                                |
| ----------------------------- | --------------- | ----------------------------------------------------- |
| React Native                  | 0.67.2          | ✅ Compatible                                         |
| Android Gradle Plugin         | 7.0.4           | ⚠️ Should upgrade to 7.3.0+ for better API 35 support |
| Gradle Wrapper                | 7.4             | ✅ Compatible (minimum for AGP 7.0.4)                 |
| Kotlin                        | 1.5.31          | ⚠️ Should upgrade to 1.6.21+ for better compatibility |
| NDK                           | 21.4.7075529    | ✅ Compatible                                         |
| Build Tools                   | 30.0.2          | ⚠️ Should upgrade to 34.0.0+                          |
| **Current compileSdkVersion** | 34              | Target: 35                                            |
| **Current targetSdkVersion**  | 34              | Target: 35                                            |
| **Current minSdkVersion**     | 26              | No change                                             |

### Build Configuration:

- **Build system**: Standard Android Gradle build (Groovy DSL)
- **Flavors**: Single flavor (no productFlavors detected)
- **Build types**: debug, release
- **Signing**: Custom keystore for debug, upload keystore for release
- **Hermes**: Disabled (enableHermes: false)
- **Proguard**: Disabled in release builds

## Upgrade Strategy

**Recommended Approach: Option 2 - Toolchain Alignment**

Given the current AGP version (7.0.4) and Kotlin version (1.5.31), we recommend upgrading the build toolchain alongside the target SDK to avoid compatibility issues and ensure optimal performance with API 35.

### Why Option 2 is recommended:

1. AGP 7.0.4 is from 2021 and lacks optimizations for API 35
2. Kotlin 1.5.31 predates many Android 15 features
3. Build tools 30.0.2 is significantly outdated
4. Small incremental upgrades reduce risk vs. major version jumps later

## Step-by-Step Procedure

### Step 1: Backup and Branch Setup

```bash
# Create a backup branch
git checkout -b feature/android-targetsdk-35-upgrade
git push -u origin feature/android-targetsdk-35-upgrade
```

✅ **Checkpoint**: Branch created and pushed to remote.

### Step 2: Update Build Tools Version

Edit `android/build.gradle`:

```gradle
buildscript {
    ext {
         buildToolsVersion = "34.0.0"  // Updated from "30.0.2"
        minSdkVersion = 26
        compileSdkVersion = 35         // Updated from 34
        targetSdkVersion = 35          // Updated from 34
        kotlinVersion = "1.6.21"      // Updated from "1.5.31"
        soLoaderVersion = "0.10.4"
    }
    // ... rest unchanged
    dependencies {
        classpath('com.android.tools.build:gradle:7.3.1')  // Updated from 7.0.4
        classpath 'com.google.gms:google-services:4.3.15'
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion"
    }
}
```

### Step 3: Verify Gradle Wrapper Compatibility

Check if Gradle wrapper needs update:

```bash
cd android
./gradlew --version
```

Expected output should show Gradle 7.4+. If not, update:

```bash
./gradlew wrapper --gradle-version 7.6.4
```

✅ **Checkpoint**: Gradle wrapper updated and verified.

### Step 4: Update Dependencies for API 35 Compatibility

Edit `android/app/build.gradle` dependencies section:

```gradle
dependencies {
    implementation fileTree(dir: "libs", include: ["*.jar"])
    implementation "com.facebook.react:react-native:+"

    implementation "androidx.swiperefreshlayout:swiperefreshlayout:1.1.0"
    implementation 'androidx.multidex:multidex:2.0.1'
    implementation 'com.squareup.okhttp3:okhttp:4.12.0'
    implementation 'org.jetbrains:annotations:24.0.1'          // Updated from 16.0.2
    implementation 'com.google.firebase:firebase-messaging:23.4.1'  // Updated from 23.0.8

    // ... rest of dependencies unchanged
}
```

### Step 5: Initial Clean Build Test

```bash
cd android
./gradlew clean
./gradlew assembleDebug --stacktrace
```

**Expected outcome**: Build should succeed. If it fails, check the Troubleshooting section.

✅ **Checkpoint**: Debug build completes successfully.

### Step 6: Test Release Build

```bash
./gradlew assembleRelease --stacktrace
```

✅ **Checkpoint**: Release build completes successfully.

### Step 7: Verify React Native Integration

From project root:

```bash
# Test React Native bundling
yarn android:debug-bundle

# Test full React Native build
yarn android:cleanBuildAssemble
```

✅ **Checkpoint**: React Native builds and bundles successfully.

### Step 8: Update Android Manifest (if needed)

API 35 introduces stricter requirements. Check `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
          package="com.questionpro.cxonthego">

    <!-- Existing permissions remain the same -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>
    <uses-permission android:name="android.permission.VIBRATE"/>

    <!-- Add this if you use file operations (likely with react-native-document-picker) -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"
                     android:maxSdkVersion="32" />

    <!-- For API 35, specify that your app targets notification permissions explicitly -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:name=".MainApplication"
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:allowBackup="false"
        android:theme="@style/AppTheme">

        <!-- Add for better API 35 compatibility -->
        <meta-data
            android:name="android.max_aspect"
            android:value="2.4" />

        <!-- ... rest of your existing application config -->
    </application>
</manifest>
```

### Step 9: Update Proguard Rules (if enabling minification)

Since your project has `enableProguardInReleaseBuilds = false`, this is optional, but add to `android/app/proguard-rules.pro` for future use:

```proguard
# React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }

# API 35 specific rules
-keep class androidx.** { *; }
-dontwarn androidx.**

# Firebase (you use firebase-messaging)
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**
```

## Verification Checklist

### Local Debug Build

```bash
cd android
./gradlew clean assembleDebug --stacktrace
```

- [ ] Build completes without errors
- [ ] APK generated in `android/app/build/outputs/apk/debug/`
- [ ] APK size is reasonable (compare with previous builds)

### Local Release Build

```bash
./gradlew clean assembleRelease --stacktrace
```

- [ ] Release build completes without errors
- [ ] APK is signed correctly
- [ ] No new lint warnings related to API 35

### React Native Bundle Test

```bash
yarn android:debug-bundle
```

- [ ] Bundle generation succeeds
- [ ] No new Metro bundle warnings

### Dependency Analysis

```bash
./gradlew :app:dependencies --configuration releaseRuntimeClasspath > deps_after.txt
```

- [ ] No conflicting dependencies
- [ ] All AndroidX dependencies use consistent versions
- [ ] Firebase dependencies are compatible

### Unit Tests (if applicable)

```bash
cd .. && yarn test:unit
```

- [ ] All existing unit tests pass

### Runtime Testing

1. Install APK on device/emulator running Android 15 (API 35)
2. Test core app functionality:
   - [ ] App launches successfully
   - [ ] Firebase messaging works
   - [ ] Document picker works (if used)
   - [ ] Network requests work
   - [ ] AsyncStorage operations work
   - [ ] Navigation flows work

## CI Updates

**Note**: No CI workflows detected in repository, but if added later:

### GitHub Actions Example:

```yaml
- name: Set up JDK 11
  uses: actions/setup-java@v3
  with:
    java-version: '11'
    distribution: 'temurin'

- name: Setup Android SDK
  uses: android-actions/setup-android@v2
  with:
    api-level: 35
    build-tools: 34.0.0
```

## Troubleshooting Matrix

| Symptom                                                                            | Likely Cause                    | Fix                                                               |
| ---------------------------------------------------------------------------------- | ------------------------------- | ----------------------------------------------------------------- |
| `AAPT2 error: check logs for details`                                              | Build tools version mismatch    | Update `buildToolsVersion` to "34.0.0"                            |
| `Duplicate class androidx.*`                                                       | AndroidX dependency conflicts   | Run `./gradlew :app:dependencies` and align versions              |
| `Unable to make field private final java.lang.String java.io.File.path accessible` | Java 17 with old AGP            | Verify using JDK 11, or upgrade AGP to 7.4+                       |
| `Task :app:lintVitalRelease FAILED`                                                | New lint rules in API 35        | Add `lintOptions { abortOnError false }` temporarily              |
| `Could not resolve all artifacts for configuration ':app:debugRuntimeClasspath'`   | Version conflicts               | Clear Gradle cache: `./gradlew clean --build-cache`               |
| React Native bundle fails                                                          | Metro cache issues              | Run `yarn start:resetCache`                                       |
| Firebase messaging doesn't work on API 35                                          | Notification permission changes | Update `AndroidManifest.xml` with `POST_NOTIFICATIONS` permission |
| OkHttp SSL errors                                                                  | Network security config changes | Add network security config if needed                             |

### Common Fix Commands:

```bash
# Clear all caches
./gradlew clean cleanBuildCache
cd .. && yarn cache clean && yarn
cd android

# Force dependency resolution
./gradlew --refresh-dependencies assembleDebug

# Check for dependency conflicts
./gradlew :app:dependencyInsight --dependency androidx.core --configuration releaseRuntimeClasspath
```

## Rollback Plan

### Option 1: Git Revert (Recommended)

```bash
git checkout main
git branch -D feature/android-targetsdk-35-upgrade
git push origin --delete feature/android-targetsdk-35-upgrade
```

### Option 2: Manual Revert (if changes already merged)

Revert these files to their original values:

1. **android/build.gradle**:

   ```gradle
   buildToolsVersion = "30.0.2"
   compileSdkVersion = 34
   targetSdkVersion = 34
   kotlinVersion = "1.5.31"
   ```

   ```gradle
   classpath('com.android.tools.build:gradle:7.0.4')
   ```

2. **android/app/build.gradle**: Revert dependency versions
3. **android/gradle/wrapper/gradle-wrapper.properties**: Revert if changed

### Emergency Hotfix Process:

```bash
git checkout main
git revert <commit-hash> --no-edit
./gradlew clean assembleRelease
# Test and deploy hotfix
```

## Final PR Checklist

### For Code Reviewers:

- [ ] **Build files updated correctly**: Verify `compileSdkVersion` and `targetSdkVersion` are both 35
- [ ] **Dependencies are compatible**: Check Firebase, AndroidX versions are API 35 compatible
- [ ] **No hardcoded API levels**: Ensure no hardcoded references to API 34
- [ ] **Manifest permissions updated**: Verify `POST_NOTIFICATIONS` permission added if needed
- [ ] **Build tools alignment**: Verify AGP, Gradle, and Kotlin versions are aligned
- [ ] **Tests pass locally**: All existing functionality works on API 35 devices
- [ ] **APK size impact**: Compare APK sizes before/after upgrade
- [ ] **Performance impact**: No significant performance regressions
- [ ] **Backward compatibility**: App still works on minSdkVersion 26 devices

### For QA Testing:

- [ ] Test on Android 15 (API 35) devices/emulators
- [ ] Test on Android 14 (API 34) devices for regression
- [ ] Test on minimum supported Android 8.0 (API 26) devices
- [ ] Focus testing on notifications, file operations, and network requests
- [ ] Verify Firebase messaging works across all API levels

### Final Deployment Notes:

1. **Google Play Console**: Update your app's target API level to 35 in the console
2. **Release Notes**: Include "Updated for Android 15 compatibility" in your release notes
3. **Monitoring**: Monitor crash reports closely for the first 48 hours after release
4. **Rollback Readiness**: Keep previous APK ready for quick rollback if needed

---

**Todo Items for Verification:**

- TODO: verify actual React Native bundle size impact on API 35
- TODO: verify if any custom native modules need updates for API 35
- TODO: test with actual device notifications on Android 15 beta/preview devices
- TODO: verify if any third-party libraries need updates (check react-native-device-info, react-native-firebase compatibility specifically)
