# flutter_survey_intercept

A Flutter plugin for QuestionPro CX SDK integration, enabling survey intercept functionality on iOS and Android platforms.

## Features

* Seamless integration with QuestionPro CX SDK
* Survey intercept capabilities for mobile applications
* Cross-platform support (iOS 14.0+ and Android)
* Native bridge implementation for both platforms

## Getting started

Add this to your package's `pubspec.yaml` file:

```yaml
dependencies:
  flutter_survey_intercept: ^0.0.1
```

Then run:
```bash
flutter pub get
```

### Android Configuration

**1. Add JitPack Repository**

In your app's `android/build.gradle` (project level), add JitPack to the repositories:

```gradle
allprojects {
    repositories {
        google()
        mavenCentral()
        maven { url = uri("https://jitpack.io") }  // Required for QuestionProCX SDK
    }
}
```

Or if using newer Gradle (settings.gradle):

```gradle
dependencyResolutionManagement {
    repositories {
        google()
        mavenCentral()
        maven { url = uri("https://jitpack.io") }  // Required for QuestionProCX SDK
    }
}
```

**2. Configure AndroidManifest.xml**

Add the following permissions and API key to your `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
```

Inside the `<application>` tag, add your API key:

```xml
<meta-data
    android:name="cx_manifest_api_key"
    android:value="Your Api key" />
```

**Note:** Most manifest merger conflicts are already handled by the plugin. If you still encounter issues, add `xmlns:tools="http://schemas.android.com/tools"` to your `<manifest>` tag and `tools:replace="android:label"` to your `<application>` tag.

## Usage

Import the package in your Dart code:

```dart
import 'package:flutter_survey_intercept/flutter_survey_intercept.dart';
```

## Additional information

This plugin integrates the QuestionPro CX SDK for survey intercept capabilities in Flutter applications.

For issues or questions, please contact the package maintainer.
