# math_flutter

Flutter plugin for QuestionPro CX SDK integration on Android and iOS.

## Quick Start

### Add to pubspec.yaml

```yaml
dependencies:
  math_flutter: ^0.9.9
```

### Get Your API Key

Get your QuestionPro CX API key from your [QuestionPro account](https://www.questionpro.com/).

### Platform Setup

#### Android Setup

Add the API key to your app's `android/app/src/main/AndroidManifest.xml`:

```xml
<application>
    <meta-data
        android:name="cx_manifest_api_key"
        android:value="YOUR_API_KEY_HERE" />
</application>
```

### Initialize in Your App

```dart
import 'dart:io' show Platform;
import 'package:math_flutter/math_flutter.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  if (Platform.isIOS) {
    await MathFlutter.initializeSurvey(
      apiKey: 'YOUR_API_KEY_HERE',
      dataCenter: 'US',
    );
  } else {
    await MathFlutter.initializeSurvey(
      dataCenter: 'US',
    );
  }
  
  runApp(MyApp());
}
```

### Launch Surveys

```dart
await MathFlutter.launchSurvey('your_survey_id');
```

### Track Screen Views

```dart
await MathFlutter.viewCount('Check_out');

if (Platform.isIOS) {
  await MathFlutter.viewCount(
    'Shopping_Cart',
    apiKey: 'your_api_key',
  );
} else {
  await MathFlutter.viewCount('Shopping_Cart');
}
```

### Set Custom User Data

```dart
await MathFlutter.setDataMappings(
  {
    'firstName': 'John',
    'lastName': 'Doe',
    'email': 'john@example.com',
    'userType': 'Premium',
  },
  apiKey: Platform.isIOS ? 'your_api_key' : null,
);
```

## API Reference

### `initializeSurvey()`

Initializes the QuestionPro CX SDK. Call this once during app startup.

```dart
Future<String> initializeSurvey({
  String? apiKey,
  String dataCenter = 'US',
})
```

**Parameters:**
- `apiKey`: Your QuestionPro CX API key (required for iOS, optional for Android)
- `dataCenter`: 'US' or 'EU' (defaults to 'US')

**Returns:** Success message from the SDK

**Example:**

```dart
if (Platform.isIOS) {
  await MathFlutter.initializeSurvey(
    apiKey: 'your_api_key',
    dataCenter: 'US',
  );
} else {
  await MathFlutter.initializeSurvey(dataCenter: 'US');
}
```

### `launchSurvey()`

Displays a survey to the user.

```dart
Future<void> launchSurvey(String surveyId)
```

**Parameters:**
- `surveyId`: The ID of the survey to display (as a string)

**Example:**
```dart
await MathFlutter.launchSurvey('123456789');
```

### `viewCount()`

Tracks screen view events for the View Count rule.

```dart
Future<String> viewCount(String screenName, {String? apiKey})
```

**Parameters:**
- `screenName`: The name of the screen to log
- `apiKey`: Your QuestionPro CX API key (required for iOS, optional for Android)

**Returns:** Success message from the SDK

**Example:**

```dart
if (Platform.isIOS) {
  await MathFlutter.viewCount(
    'Shopping_Cart',
    apiKey: 'your_api_key',
  );
} else {
  await MathFlutter.viewCount('Shopping_Cart');
}
```

### `setDataMappings()`

Sends custom user attributes to QuestionPro CX.

```dart
Future<String> setDataMappings(
  Map<String, String> customVariables, 
  {String? apiKey}
)
```

**Parameters:**
- `customVariables`: Map of key-value pairs representing user attributes
- `apiKey`: Your QuestionPro CX API key (required for iOS, optional for Android)

**Returns:** Success message from the SDK

**Example:**

```dart
await MathFlutter.setDataMappings(
  {
    'firstName': userName,
    'email': userEmail,
    'accountType': accountType,
  },
  apiKey: Platform.isIOS ? 'your_api_key' : null,
);
```

## Architecture Overview

### Communication Flow

```
┌─────────────────────────────────────────────────────────┐
│  Flutter/Dart Layer (MathFlutter)                       │
│  ─────────────────────────────────────────────────      │
│  MethodChannel('math_flutter')                          │
│  └─> initializeSurvey(apiKey: '...')                    │
│  └─> launchSurvey(surveyId: '...')                      │
│  └─> setDataMappings(customVariables: {...}) [v0.9.5]   │
│                                                           │
│  MethodChannel('Cx_Callback')                           │
│  └─> viewCount(screenName: '...')                       │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼  Platform Channel
┌─────────────────────────────────────────────────────────┐
│  Native Platform (Android/iOS)                          │
│  ─────────────────────────────────────────────────      │
│  • Initializes QuestionPro CX SDK                       │
│  • Launches InteractionActivity/Survey View             │
│  • Logs screen visits for View Count rules              │
│  • Sets custom user data mappings for personalization   │
└─────────────────────────────────────────────────────────┘
```

### Key Components

#### Android
- **MathFlutterPlugin.kt**: Handles method channel communication
- **AndroidManifest.xml**: Contains API key metadata
- **InteractionActivity**: Displays surveys

#### iOS
- **MathFlutterPlugin.swift**: Handles method channel communication
- **QuestionProCXFramework**: Native iOS SDK

#### Flutter
- **MathFlutter**: Main plugin class
- **MethodChannel**: Flutter-Native communication bridge

## Security Best Practices

- Use different API keys for development and production
- Rotate API keys periodically
- Use environment variables or build configurations
- Never commit production API keys to public repositories

**Example using environment variables:**

```dart
const apiKey = String.fromEnvironment('QUESTIONPRO_API_KEY', defaultValue: '');

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  if (Platform.isIOS) {
    await MathFlutter.initializeSurvey(
      apiKey: apiKey,
      dataCenter: 'US',
    );
  } else {
    await MathFlutter.initializeSurvey(dataCenter: 'US');
  }
  
  runApp(MyApp());
}
```

## Requirements

- **Flutter:** `>=3.0.0`
- **Dart:** `>=3.0.0 <4.0.0`
- **Android:** minSdkVersion 24 (Android 7.0+)
- **iOS:** iOS 14.0+

## Troubleshooting

### Android Issues

**MISSING_API_KEY error**
- Add API key metadata to AndroidManifest.xml under `<application>` tag
- Use metadata name: `cx_manifest_api_key`

**Survey doesn't display**
- Call `initializeSurvey()` before `launchSurvey()`
- Verify survey ID is correct
- Check survey is active in QuestionPro account

### iOS Issues

**Build fails**
- Run `cd ios && pod install`
- Try `pod deintegrate` then `pod install`

**Survey doesn't appear**
- Call `initializeSurvey()` with valid API key
- Verify survey ID and iOS deployment target is 14.0+

## Example App

See the `/example` folder for a complete working example.

```bash
cd example
flutter pub get
flutter run
```

## License

MIT License - see LICENSE file for details.

## Resources

- [QuestionPro CX](https://www.questionpro.com/)
- [QuestionPro Android SDK](https://github.com/surveyanalyticscorp/android-cx)
- [QuestionPro iOS SDK](https://github.com/surveyanalyticscorp/ios-cx)
- [Report Issues](https://github.com/Dilpreet010/math_operations/issues)
