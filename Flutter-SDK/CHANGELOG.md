## 0.8.0

* Fixed iOS Swift compilation error - corrected TouchPoint.initTouchPoint() static method call
* Verified iOS build compiles successfully on macOS
* Updated podspec dependency configuration for CocoaPods compatibility
* iOS framework (QuestionProCXFramework v2.2.5) tested and verified

## 0.7.0

* Fixed iOS implementation - removed duplicate/corrupted code
* Updated podspec metadata for publication
* Verified cross-platform functionality for both Android and iOS

## 0.6.0

* **BREAKING CHANGE:** Platform-specific API key configuration
  - **Android**: API key is now read from `AndroidManifest.xml` metadata (`cx_manifest_api_key`)
    - `initializeSurvey()` no longer requires `apiKey` parameter on Android
    - Add `<meta-data android:name="cx_manifest_api_key" android:value="YOUR_KEY"/>` to your AndroidManifest.xml
  - **iOS**: API key must be provided via `initializeSurvey(apiKey: 'your_key')`
  - Use Platform.isIOS to provide apiKey conditionally in cross-platform code
* **NEW:** iOS platform support added
  - Full iOS implementation with QuestionPro CX SDK
  - Supports iOS 14.0+
  - Same API as Android for cross-platform consistency
* **SECURITY:** No hardcoded API keys in plugin code
  - Android: Reads from app's AndroidManifest.xml
  - iOS: Provided at runtime via parameter
* **IMPROVED:** Updated documentation with platform-specific setup guides
* **IMPROVED:** Added security best practices and troubleshooting guides to README
* **IMPROVED:** Example app demonstrates platform-specific initialization

## 0.5.0

* Bump version to 0.5.0

## 0.4.0

* Bump version to 0.4.0

## 0.3.0

* Bump version to 0.3.0

## 0.2.0

* Declare QuestionPro CX SDK dependency (JitPack) in plugin so it resolves when used from pub.dev
* Fix Android callback method names to match SDK: `onSuccess` / `onFailed`
* Fix plugin namespace to `com.example.math_flutter`

## 0.1.0

* Second release
* QuestionPro CX interaction SDK integration (Android)
* Added `MathFlutter.initializeSurvey()` to initialize the SDK
* Added `MathFlutter.launchSurvey(surveyId)` to launch surveys

## 0.0.1

* Initial release
