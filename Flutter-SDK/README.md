# math_flutter

QuestionPro CX SDK integration for Flutter.

## Installation

```yaml
dependencies:
  math_flutter: ^0.12.8
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
  
  await MathFlutter.initializeSurvey(
    apiKey: 'YOUR_API_KEY',
    dataCenter: DataCenter.us,
  );
  
  runApp(MyApp());
}
```

### Launch Survey

```dart
await MathFlutter.launchSurvey('123456789');
```

### Track Screen Views

```dart
await MathFlutter.viewCount('Home_Screen');
```

### Set User Data

```dart
await MathFlutter.setDataMappings({
  'firstName': 'John',
  'lastName': 'Doe',
  'email': 'john@example.com',
});
```

## API Reference

### initializeSurvey()

```dart
Future<String> initializeSurvey({
  String? apiKey,
  DataCenter dataCenter = DataCenter.us,
})
```

Initialize the QuestionPro CX SDK.

- `apiKey` Required for iOS, optional for Android
- `dataCenter` DataCenter.us or DataCenter.eu

### launchSurvey()

```dart
Future<void> launchSurvey(String surveyId)
```

Display a survey to the user.

- `surveyId` Survey identifier

### viewCount()

```dart
Future<String> viewCount(String screenName)
```

Track screen view events.

- `screenName` Name of the screen being viewed

### setDataMappings()

```dart
Future<String> setDataMappings(Map<String, String> customVariables)
```

Set custom user attributes.

- `customVariables` Key-value pairs for user attributes

## Requirements

- Flutter >=3.0.0
- Dart >=3.0.0 <4.0.0
- Android API 24+
- iOS 14.0+

## Troubleshooting

**MISSING_API_KEY error**  
Ensure API key is in AndroidManifest.xml under application tag.

**Survey doesn't display**  
Initialize SDK before launching surveys. Verify survey ID is correct.

**iOS build fails**  
Run `cd ios && pod install`

## Example

See the `example/` directory for a complete implementation.

## License

MIT License

## Resources

- [QuestionPro CX](https://www.questionpro.com/)
- [Android SDK](https://github.com/surveyanalyticscorp/android-cx)
- [iOS SDK](https://github.com/surveyanalyticscorp/ios-cx)
