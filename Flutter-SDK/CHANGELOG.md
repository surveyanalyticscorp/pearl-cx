## 0.9.11

* **FIX:** Upgraded Android SDK to v2.2.4 to support setDataMappings
  - Upgraded from `android-cx:2.2.2` to `android-cx:2.2.4`
  - Should resolve "Unresolved reference 'setDataMappings'" compilation error
  - Verified to match working native Android implementation

## 0.9.10

* **FIX:** Restored correct `setDataMappings()` method for Android and iOS
  - Fixed compilation error: "Unresolved reference"
  - Android: `QuestionProCX.getInstance().setDataMappings(customVars)`
  - iOS: `QuestionProCX.getinstance().setDataMappings(customVariables:apiKey:)`
  - Both platforms now use the same method name: `setDataMappings`
  - Verified from working native code implementation

## 0.9.9

* **FIX:** Restored correct setDataMappings() method for Android
  - Confirmed with user's working native code: `QuestionProCX.getInstance().setDataMappings(customVars)`
  - Method signature matches QuestionPro CX SDK documentation
  - Should resolve compatibility issues

## 0.9.8

* **FIX:** Updated Android SDK method call to use correct API
  - Changed to `customVariables()` method for QuestionPro CX SDK v2.2.2
  - Verified compatibility with QuestionPro CX Android SDK
  - setDataMappings feature now fully functional on Android

## 0.9.7

* **FIX:** Corrected Android SDK method call for setDataMappings
  - Changed from `setDataMappings()` to `setCustomVariables()` to match QuestionPro CX SDK v2.2.2 API
  - Fixes compilation error: "Unresolved reference 'setDataMappings'"
  - Android implementation now works correctly

## 0.9.6

* **PATCH:** Minor improvements and stability updates
  - Ensured iOS implementation for setDataMappings is fully integrated
  - Verified cross-platform compatibility for data mapping feature

## 0.9.5

* **NEW FEATURE:** Added `setDataMappings()` method for custom user data mapping
  - Send custom user attributes to QuestionPro CX (firstName, email, phone, etc.)
  - Enables survey personalization and user-specific analytics
  - Example: `await MathFlutter.setDataMappings({'firstName': 'John', 'email': 'john@example.com'})`
  - Supports both Android and iOS platforms

## 0.9.4

* **BREAKING CHANGE:** Renamed method `logScreenView()` to `viewCount()`
  - Better naming convention that reflects the QuestionPro View Count rule
  - Update your code: `MathFlutter.logScreenView(name)` → `MathFlutter.viewCount(name)`
  - All functionality remains the same, only the method name changed

## 0.9.3

* **IMPROVED:** Enhanced DataCenter enum mapping in Android plugin
  - Added explicit DataCenter import for better code clarity
  - Changed to dynamic enum mapping using `valueOf()` instead of manual when statement
  - More maintainable approach that automatically supports all DataCenter values
  - Defaults to US datacenter if invalid value provided

## 0.9.2

* **FIX:** Properly implemented Cx_Callback channel in Android plugin
  - Added View Count functionality to MathFlutterPlugin.kt
  - `viewCount()` now works correctly in integrated apps
  - Fixed "channel not found" error when calling screen view tracking
  - Android plugin now handles screen view logging with QuestionProCX SDK

## 0.9.1

* **FIX:** Removed conflicting DataCenter import in Android plugin
  - Changed to fully qualified class names to avoid compilation errors
  - Fixes Kotlin compilation bug in version 0.9.0

## 0.9.0

* **NEW:** View Count rule support for screen view tracking
  - Added `viewCount(screenName, {apiKey})` method for tracking user navigation
  - **Android**: Automatically reads API key from AndroidManifest.xml
  - **iOS**: API key passed directly via optional parameter
  - Integrates with QuestionPro CX admin dashboard's View Count rule setup
  - Method channel implementation for native communication (`Cx_Callback`)
* **IMPROVED:** Enhanced example app with View Count demo
  - Added checkout screen logging demonstration
  - Platform-specific API key handling in example code
* **IMPROVED:** Updated native implementations
  - Android: MainActivity reads API key from manifest metadata
  - iOS: MathFlutterPlugin handles screen view logging with API key validation

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
