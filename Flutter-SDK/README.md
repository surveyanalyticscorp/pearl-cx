# math_flutter

QuestionPro CX SDK integration for Flutter.

## Installation

```yaml
dependencies:
  math_flutter: ^0.14.0
```

## Setup

### Android

Add your API key and survey activity configuration to `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">
    <application>
        <!-- QuestionPro CX API Key -->
        <meta-data
            android:name="cx_manifest_api_key"
            android:value="YOUR_API_KEY_HERE" />
        
        <!-- REQUIRED: Override activity theme for full-screen display -->
        <activity
            android:name="com.questionpro.cxlib.InteractionActivity"
            android:theme="@android:style/Theme.Black.NoTitleBar.Fullscreen"
            android:configChanges="keyboardHidden|orientation|screenSize"
            android:windowSoftInputMode="adjustResize"
            android:launchMode="singleInstance"
            android:excludeFromRecents="true"
            android:finishOnTaskLaunch="false"
            android:clearTaskOnLaunch="false"
            tools:replace="android:theme,android:configChanges,android:windowSoftInputMode,android:launchMode" />
    </application>
</manifest>
```

**Note:** 
- The `xmlns:tools` namespace is required in your manifest tag for `tools:replace` to work.
- `launchMode="singleInstance"` ensures the survey runs in its own task and doesn't affect your main app when closed.

### iOS

API key is passed during initialization.

## Usage

### Initialize SDK

Call once during app startup:

```dart
import 'package:math_flutter/math_flutter.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize SDK
  await MathFlutter.init(
    apiKey: 'YOUR_API_KEY',  // Required for iOS, optional for Android
    dataCenter: DataCenter.us,
  );
  
  // Setup survey URL listener
  MathFlutter.setupSurveyUrlListener();
  MathFlutter.onSurveyUrlReceived = (surveyUrl) {
    // Handle survey URL - open in WebView or browser
    print('Survey available: $surveyUrl');
  };
  
  runApp(MyApp());
}
```

### Track Screen Views

Track when users visit specific screens:

```dart
await MathFlutter.setScreenVisited('Home_Screen');
```

### Set User Data

Set custom user attributes for targeting:

```dart
await MathFlutter.setDataMappings({
  'firstName': 'John',
  'lastName': 'Doe',
  'email': 'john@example.com',
});
```

## API Reference

### init()

```dart
Future<String> init({
  String? apiKey,
  DataCenter dataCenter = DataCenter.us,
})
```
```

Initialize the QuestionPro CX SDK.

- `apiKey` Required for iOS, optional for Android (reads from AndroidManifest.xml)
- `dataCenter` DataCenter.us or DataCenter.eu

### setupSurveyUrlListener()

```dart
static void setupSurveyUrlListener()
```

Sets up listener to receive survey URLs from native SDK when business rules are triggered.

### onSurveyUrlReceived

```dart
static void Function(String surveyUrl)? onSurveyUrlReceived
```

Callback that gets invoked when a survey URL is available. Set this to handle survey URLs (e.g., open in WebView).

### setScreenVisited()

```dart
Future<String> setScreenVisited(String screenName)
```

Track screen view events. May trigger survey delivery based on configured rules.

- `screenName` Name of the screen being viewed

### setDataMappings()

```dart
Future<String> setDataMappings(Map<String, String> customVariables)
```

Set custom user attributes for survey targeting.

- `customVariables` Key-value pairs for user attributes

## Requirements

- Flutter >=2.0.0
- Dart >=2.17.0 <4.0.0
- Android API 24+
- iOS 14.0+

## Troubleshooting

**MISSING_API_KEY error on Android**  
Ensure API key is in AndroidManifest.xml under application tag with name `cx_manifest_api_key`.

**Survey URL not received**  
- Ensure `setupSurveyUrlListener()` is called after `init()`
- Check that `onSurveyUrlReceived` callback is set
- Verify business rules are configured correctly in QuestionPro dashboard
- Survey delivery depends on configured triggers (screen visits, user data, etc.)

**iOS build fails**  
Run `cd ios && pod install`

**App closes when survey is dismissed (Android)**  
Ensure AndroidManifest.xml has `launchMode="singleInstance"` for InteractionActivity.

## Example

See the `example/` directory for a complete implementation.

## License

MIT License

## Resources

- [QuestionPro CX](https://www.questionpro.com/)
- [Android SDK](https://github.com/surveyanalyticscorp/android-cx)
- [iOS SDK](https://github.com/surveyanalyticscorp/ios-cx)
