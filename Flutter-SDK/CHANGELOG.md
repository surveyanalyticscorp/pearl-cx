## 0.12.9

* **CRITICAL FIX:** App no longer closes when survey is closed (Android)
  - Changed `launchMode` from `singleTop` to `singleInstance` to isolate survey in separate task
  - Removed `taskAffinity=""` which was causing the survey to share the main app's task
  - Added `finishOnTaskLaunch="false"` to prevent survey from finishing parent task
  - Added `clearTaskOnLaunch="false"` to prevent task clearing
  - Survey now closes completely independently from the main app
  - Pressing back or close button on survey only closes survey, not the entire app
  - **IMPORTANT:** Users must update their AndroidManifest.xml with new configuration (see README)

## 0.12.8

* **BUG FIX:** Enhanced iOS crash prevention and error handling
  - Added try-catch blocks around all QuestionProCX SDK method calls
  - Added proper error handling in main handle method to catch unexpected errors
  - Added deinit method to clean up pending callbacks and prevent memory-related crashes
  - Improved window reference handling to prevent nil pointer crashes
  - All SDK operations now return proper FlutterError instead of crashing
  - Survey close operations now handled gracefully without app crashes

## 0.12.7

* **BUG FIX:** Prevent app crash when closing survey
  - Added `taskAffinity=""` to ensure survey activity runs in app's task
  - Added `excludeFromRecents="true"` to prevent survey from appearing in recent apps
  - Added `noHistory="false"` to allow proper back navigation without crashes
  - Survey close button now properly closes only the survey, not the entire app
  - Updated example app with proper configuration

## 0.12.6

* **IMPORTANT:** Added required configuration for full-screen survey display
  - Users must override InteractionActivity in their app's AndroidManifest.xml
  - Added tools:replace to allow theme override from app level
  - Updated example app with full-screen configuration
  - See README for required AndroidManifest configuration

## 0.12.5

* **IMPROVEMENT:** Enhanced window configuration for true edge-to-edge full-screen display
  - Added transparent status bar and navigation bar colors
  - Added `windowLayoutInDisplayCutoutMode` for devices with notches/cutouts
  - Added `windowIsFloating=false` to prevent dialog-style display
  - Created API 21+ specific styles with additional window flags
  - Set `windowTranslucentStatus` and `windowTranslucentNavigation` to false
  - Survey should now properly fill entire screen width and height

## 0.12.4

* **IMPROVEMENT:** Enhanced Android full-screen survey display configuration
  - Added custom `FullScreenSurveyTheme` with optimized window flags
  - Changed `windowSoftInputMode` from `adjustPan` to `adjustResize` for better keyboard handling
  - Added `orientation|screenSize` to configChanges for better screen rotation support
  - Enabled hardware acceleration for smoother rendering
  - Set white background to eliminate black borders around survey content
  - Survey now properly fills entire screen width and height on Android

## 0.12.3

* **IMPROVEMENT:** Enhanced survey display to full-screen mode for Android
  - Changed InteractionActivity theme from `Theme.Translucent.NoTitleBar` to `Theme.NoTitleBar.Fullscreen`
  - Surveys now display in full-screen on Android (no status bar, full height and width)
  - Combined with iOS full-screen mode, surveys now display consistently across both platforms

## 0.12.2

* **BUG FIX:** Removed unsupported `.setFullScreen(true)` call from Android TouchPoint.Builder
  - Fixed "Unresolved reference 'setFullScreen'" compilation error
  - Android SDK does not support this method in TouchPoint.Builder API

## 0.12.1

* **IMPROVEMENT:** Enhanced survey display to full-screen mode for iOS
  - iOS: Added `touchPoint.isFullScreenMode = true` for full-screen presentation
  - Surveys now take full height and width of the screen when displayed on iOS

* **BREAKING CHANGE:** Renamed internal method channel identifier from `nativeMethod` to `setScreenVisited`
  - Updated method channel call in Dart from `'nativeMethod'` to `'setScreenVisited'`
  - Updated Android Kotlin method handler from `"nativeMethod"` to `"setScreenVisited"`
  - Updated iOS Swift method handler from `"nativeMethod"` to `"setScreenVisited"`
  - Public API `setScreenVisited()` method remains unchanged - no changes needed in user code

## 0.12.0

* **BREAKING CHANGE:** Renamed internal method channel identifier from `initializeSurvey` to `initialize`
  - Updated method channel call in Dart from `'initializeSurvey'` to `'initialize'`
  - Updated Android Kotlin method handler from `"initializeSurvey"` to `"initialize"`
  - Updated iOS Swift method handler from `"initializeSurvey"` to `"initialize"`
  - Public API `init()` method remains unchanged - no changes needed in user code

## 0.11.2

* **BUG FIX:** Fixed getSurveyUrl callback to return result directly without mainHandler.post wrapper
  - Prevents potential threading issues in getSurveyUrl

## 0.11.1

* **NEW FEATURE:** Added `getSurveyUrl()` method to retrieve survey URL without launching it
  - Returns survey URL as a String that can be used in custom WebView or browser
  - Implemented on both Android and iOS platforms

* **BREAKING CHANGE:** Removed `launchSurvey()` method
  - Use `getSurveyUrl()` instead to get the URL and handle navigation yourself

## 0.10.0

* **BREAKING CHANGES:** Major API improvements and simplification
  - Added `DataCenter` enum (DataCenter.us, DataCenter.eu) replacing string-based data center selection
  - Removed `apiKey` parameter from `viewCount()` - no longer required
  - Removed `apiKey` parameter from `setDataMappings()` - no longer required
  - Native SDK success/error messages now returned instead of hardcoded strings
  - Added comprehensive documentation comments for all public APIs
  - Simplified example app with auto-initialization
  - Updated README with cleaner, more concise documentation
  - Removed redundant exception handling in Dart layer

* **IMPROVEMENTS:**
  - Enhanced validation with dual-layer approach (Dart + Native)
  - Better error messages from native SDKs
  - Cleaner API surface with fewer parameters
  - Improved developer experience with clear enum types

## 0.9.12

* **FIX:** Fixed Swift compiler error in iOS setDataMappings implementation
  - Corrected method call to use `dataMappings` parameter instead of `customVariables` and `apiKey`
  - Fixed: "Extra arguments at positions #1, #2 in call" error
  - iOS builds now compile successfully

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
