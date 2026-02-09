# math_flutter

Flutter plugin for QuestionPro CX SDK integration on Android.

## Architecture Overview

### 1. Application Initialization

**MyApplication.kt**
- Declares `MyApplication` as the Application class
- SDK initializes **immediately** when app starts in `onCreate()`
- Creates TouchPoint with `DataCenter.US`
- Registers initialization callbacks

**AndroidManifest.xml**
- Declares `MyApplication` as application class: `android:name=".MyApplication"`
- Contains API key metadata: `cx_manifest_api_key`
- Registers `InteractionActivity` for survey display

### 2. Plugin Communication

**MathFlutterPlugin.kt**
- Creates MethodChannel: `"math_flutter"`
- Handles two methods:
  - `initializeSurvey`: Confirms SDK connection (no survey ID needed)
  - `launchSurvey`: Launches survey with given survey ID

### 3. Flutter/Dart Side

**MathFlutter.dart**
- Provides two static methods:
  - `initializeSurvey()`: Verifies platform channel connection
  - `launchSurvey(String surveyId)`: Displays survey screen

---

## Communication Flow

```
┌─────────────────────────────────────────────────────────┐
│  Flutter/Dart Layer (MathFlutter)                       │
│  ─────────────────────────────────────────────────      │
│  MethodChannel('math_flutter')                          │
│  └─> invokeMethod('initializeSurvey')                   │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼  Platform Channel
┌─────────────────────────────────────────────────────────┐
│  Native Android Layer (MathFlutterPlugin)               │
│  ─────────────────────────────────────────────────      │
│  MethodChannel.setMethodCallHandler                     │
│  └─> when "initializeSurvey"                            │
│      └─> result.success("SDK initialized in Application")│
└─────────────────────────────────────────────────────────┘
```

---

## Usage

### Basic Setup (No Survey ID Required)

```dart
import 'package:math_flutter/math_flutter.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Optional: Confirm SDK connection
  // SDK is already initialized in MyApplication.onCreate()
  await MathFlutter.initializeSurvey();
  
  runApp(MyApp());
}
```

**Your app will run successfully without any survey ID.** The SDK initializes automatically on the native side.

### Launching a Survey (Survey ID Required)

```dart
// Only needed when you want to display a survey to the user
await MathFlutter.launchSurvey('your_survey_id_here');

// Example: Add a button to launch survey
ElevatedButton(
  onPressed: () async {
    await MathFlutter.launchSurvey('123456789');
  },
  child: Text('Take Survey'),
)
```

---

## Current Behavior

When you run the app:
1. ✅ SDK initializes in `MyApplication.onCreate()` (Android native)
2. ✅ Flutter calls `initializeSurvey()` - confirms connection
3. ✅ App displays (no survey ID needed)

Survey ID is **only needed** when:
- You want to actually display a survey to the user
- You call `launchSurvey()` with a specific survey ID

---

## Key Components

### Android Native:
- **MyApplication.kt**: Initializes QuestionPro CX SDK on app startup
- **MathFlutterPlugin.kt**: Handles Flutter platform channel communication
- **AndroidManifest.xml**: Declares application class, API key, and InteractionActivity
- **InteractionActivity**: Native activity for displaying surveys (from QuestionPro SDK)

### Flutter/Dart:
- **MathFlutter**: Main plugin class with static methods
- **MethodChannel**: Bridge for Flutter ↔ Native communication

---

## Survey Launch Flow

```dart
// From Flutter side
await MathFlutter.launchSurvey('123');

// ↓ Platform Channel ↓

// Native side receives and launches InteractionActivity
val intent = Intent(activity, InteractionActivity::class.java)
intent.putExtra("SURVEY_ID", surveyId.toLong())
activity.startActivity(intent)
```

---

## Installation

Add to your `pubspec.yaml`:

```yaml
dependencies:
  math_flutter:
    path: ../math_flutter  # or use git/pub.dev URL
```

## Requirements

- Flutter SDK: `>=3.0.0`
- Dart SDK: `>=3.0.0 <4.0.0`
- Android minSdkVersion: 24
- QuestionPro CX Android SDK: 2.2.2

## License

See LICENSE file.
