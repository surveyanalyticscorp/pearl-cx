# math_flutter

Flutter plugin for QuestionPro CX SDK integration on **Android and iOS**.

Collect customer feedback and display surveys in your Flutter app using the QuestionPro CX platform.

---

## 🚀 Quick Start

### 1. Add to pubspec.yaml

```yaml
dependencies:
  math_flutter: ^0.8.0
```

### 2. Get Your API Key

Get your QuestionPro CX API key from your [QuestionPro account](https://www.questionpro.com/).

### 3. Platform Setup

#### Android Setup

Add the API key to your app's `android/app/src/main/AndroidManifest.xml`:

```xml
<application>
    <!-- Your existing config -->
    
    <!-- Add QuestionPro CX API key -->
    <meta-data
        android:name="cx_manifest_api_key"
        android:value="YOUR_API_KEY_HERE" />
</application>
```

**That's it for Android!** The plugin reads the API key from the manifest automatically.

#### iOS Setup

No additional configuration needed - API key is provided at runtime via code.

### 4. Initialize in Your App

```dart
import 'dart:io' show Platform;
import 'package:math_flutter/math_flutter.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize QuestionPro CX SDK
  if (Platform.isIOS) {
    // iOS: API key required as parameter
    await MathFlutter.initializeSurvey(
      apiKey: 'YOUR_API_KEY_HERE',
      dataCenter: 'US', // or 'EU'
    );
  } else {
    // Android: Reads from AndroidManifest.xml
    await MathFlutter.initializeSurvey(
      dataCenter: 'US', // or 'EU'
    );
  }
  
  runApp(MyApp());
}
```

### 5. Launch Surveys

```dart
// Display a survey to your users
await MathFlutter.launchSurvey('your_survey_id');

// Example: Add a button
ElevatedButton(
  onPressed: () async {
    await MathFlutter.launchSurvey('123456789');
  },
  child: Text('Take Survey'),
)
```

---

## 📖 API Reference

### `initializeSurvey()`

Initializes the QuestionPro CX SDK. Call this once during app startup.

```dart
Future<String> initializeSurvey({
  String? apiKey,
  String dataCenter = 'US',
})
```

**Parameters:**
- `apiKey` (optional): Your QuestionPro CX API key
  - **Required for iOS** (no manifest file)
  - **Optional for Android** (reads from AndroidManifest.xml)
- `dataCenter` (optional): `'US'` or `'EU'`. Defaults to `'US'`

**Returns:** Success message from the SDK

**Platform-Specific Examples:**

```dart
// Android - reads API key from AndroidManifest.xml
await MathFlutter.initializeSurvey(dataCenter: 'US');

// iOS - requires API key parameter  
await MathFlutter.initializeSurvey(
  apiKey: 'your_api_key_here',
  dataCenter: 'US',
);

// Cross-platform approach
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
- `surveyId` (required): The ID of the survey to display (as a string)

**Example:**
```dart
await MathFlutter.launchSurvey('123456789');
```

---

## 🏗️ Architecture Overview

### Communication Flow

```
┌─────────────────────────────────────────────────────────┐
│  Flutter/Dart Layer (MathFlutter)                       │
│  ─────────────────────────────────────────────────      │
│  MethodChannel('math_flutter')                          │
│  └─> initializeSurvey(apiKey: '...')                    │
│  └─> launchSurvey(surveyId: '...')                      │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼  Platform Channel
┌─────────────────────────────────────────────────────────┐
│  Native Platform (Android/iOS)                          │
│  ─────────────────────────────────────────────────      │
│  • Initializes QuestionPro CX SDK                       │
│  • Launches InteractionActivity/Survey View             │
└─────────────────────────────────────────────────────────┘
```

### Key Components

#### Android:
- **MathFlutterPlugin.kt**: Handles method channel communication and SDK initialization
- **AndroidManifest.xml**: Contains API key metadata and declares InteractionActivity
- **InteractionActivity**: Native activity provided by QuestionPro SDK for displaying surveys

#### iOS:
- **MathFlutterPlugin.swift**: Handles method channel communication and SDK initialization
- **QuestionProCXFramework**: Native iOS SDK from QuestionPro

#### Flutter/Dart:
- **MathFlutter**: Main plugin class with static methods
- **MethodChannel**: Bridge for Flutter ↔ Native communication

---

## 🔒 Security Best Practices

### Protecting Your API Key

#### Android
Your API key is stored in `AndroidManifest.xml` which is compiled into your app. Best practices:

**✅ Do:**
- Add `AndroidManifest.xml` API key configuration to your app repository (it's required for the app to work)
- Use different API keys for development and production builds
- Consider using build variants or flavors with different manifests for different environments
- Rotate API keys periodically in your QuestionPro account

**❌ Don't:**
- Share your production API key publicly
- Use the same API key across multiple unrelated apps
- Commit sensitive survey configurations to public repositories

#### iOS
Your API key is passed at runtime. Best practices:

**✅ Do:**
- Store API keys in secure configuration files
- Use environment variables or build configurations
- Use different API keys for development and production

**❌ Don't:**
- Hardcode production API keys in source code
- Commit API keys to public repositories
- Include API keys in client-side code that gets published

### Recommended Approach: Environment Variables

Use dart-define or environment-specific configuration:

```dart
// Pass via dart-define when building:
// flutter build --dart-define=QUESTIONPRO_API_KEY=your_key

const apiKey = String.fromEnvironment('QUESTIONPRO_API_KEY', defaultValue: '');

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  if (Platform.isIOS) {
    await MathFlutter.initializeSurvey(
      apiKey: apiKey,
      dataCenter: 'US',
    );
  } else {
    // Android reads from manifest
    await MathFlutter.initializeSurvey(dataCenter: 'US');
  }
  
  runApp(MyApp());
}
```

For Android, use different `AndroidManifest.xml` files per build variant:
```
android/app/src/
  ├── main/AndroidManifest.xml
  ├── debug/AndroidManifest.xml   (dev API key)
  └── release/AndroidManifest.xml (prod API key)
```

---

## 📋 Requirements

- **Flutter:** `>=3.0.0`
- **Dart:** `>=3.0.0 <4.0.0`
- **Android:** minSdkVersion 24 (Android 7.0+)
- **iOS:** iOS 14.0+

---

## 🐛 Troubleshooting

### Android Issues

**Q: App crashes on launch or "MISSING_API_KEY" error**
- Ensure you've added the API key metadata to your app's `AndroidManifest.xml` (under `<application>` tag)
- Verify the metadata name is exactly: `cx_manifest_api_key`
- Make sure the value is not empty

**Q: Survey doesn't display**
- Check that you've called `initializeSurvey()` before `launchSurvey()`
- Verify the survey ID is correct
- Check that internet permissions are granted
- Ensure the survey is active in your QuestionPro account
- Check Android logcat for QuestionPro SDK error messages

### iOS Issues

**Q: Build fails with CocoaPods error**
- Run `cd ios && pod install && cd ..`
- Try `pod deintegrate` then `pod install`

**Q: Survey doesn't appear**
- Ensure you've called `initializeSurvey()` with a valid API key
- Check the survey ID matches your QuestionPro configuration
- Verify iOS deployment target is 14.0+

---

## 📦 Example App

See the `/example` folder for a complete working example.

```bash
cd example
flutter pub get
flutter run
```

---

## 📄 License

MIT License - see LICENSE file for details.

---

## 🔗 Resources

- [QuestionPro CX](https://www.questionpro.com/)
- [QuestionPro Android SDK](https://github.com/surveyanalyticscorp/android-cx)
- [QuestionPro iOS SDK](https://github.com/surveyanalyticscorp/ios-cx)
- [Report Issues](https://github.com/Dilpreet010/math_operations/issues)
