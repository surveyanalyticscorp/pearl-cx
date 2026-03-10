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

Add the following permissions and API key to your `android/app/src/main/AndroidManifest.xml` if not already added:

```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
```


Also inside the `<application>` tag, register the QuestionPro interaction activity:

```xml
<activity
    android:name="com.questionpro.cxlib.InteractionActivity"
    tools:replace="android:exported,android:theme"
    android:exported="true"
    android:theme="@android:style/Theme.Material.Light.NoActionBar" />
```

**Note:** Most manifest merger conflicts are already handled by the plugin. If you still encounter issues, add `xmlns:tools="http://schemas.android.com/tools"` to your `<manifest>` tag and `tools:replace="android:label"` to your `<application>` tag.

### iOS Configuration

Add the QuestionPro CX framework dependency to your iOS `Podfile` (typically located at `ios/Podfile`). Inside your app target (for example, `target 'Runner' do`), add:

```ruby
pod 'QuestionProCXFramework', :git => 'https://github.com/surveyanalyticscorp/ios-cx'
```

Then run:

```bash
cd ios
pod install
cd ..
```

## Usage

Import the package in your Dart code:

```dart
import 'package:flutter_survey_intercept/flutter_survey_intercept.dart';
```

### Basic integration

1. **Initialize the SDK** (for example in your first screen’s `initState`):

```dart
Future<void> initializeSdk() async {
    final result = await FlutterSurveyIntercept.init(
        apiKey: 'YOUR_API_KEY',
        dataCenter: DataCenter.us,
    );
    debugPrint('Initialization result: $result');
}
```

Set the `dataCenter` value according to your QuestionPro account's data center (for example, `DataCenter.eu` for EU accounts, `DataCenter.us` for US accounts). Supported values include `DataCenter.us`, `DataCenter.eu`, `DataCenter.ca`, `DataCenter.au`, `DataCenter.sg`, `DataCenter.ae`, `DataCenter.sa`, and `DataCenter.ksa`.

2. **Track screen visits** to drive view-count–based rules:

```dart
Future<void> setScreenVisited() async {
    try {
                final result = await FlutterSurveyIntercept.setScreenVisited(
                    screenName: 'check_out',
                );
        debugPrint('Screen view logged successfully: $result');
    } catch (e) {
        debugPrint('Error logging screen view: $e');
    }
}
```

3. **Send custom variables via data mappings** (used by targeting rules):

```dart
Future<void> setDataMappings() async {
    try {
        final customData = <String, String>{
            'firstName': 'QuestionPro',
            'lastname': '1',
            'email': 'questionpro@example.com',
        };

                final result = await FlutterSurveyIntercept.setDataMappings(
                    customVariables: customData,
                );
        debugPrint('Data mappings set successfully: $result');
    } catch (e) {
        debugPrint('Error setting data mappings: $e');
    }
}
```

4. **Register the survey URL listener** (typically in `main()` before `runApp`):

```dart
void main() {
    // Start listening for survey URLs from the native SDK
    FlutterSurveyIntercept.getSurveyUrlListener();

    // Handle survey URL when rules are satisfied
    FlutterSurveyIntercept.getSurveyUrl = (url) {
        debugPrint('Survey URL received: $url');
        // TODO: Open this URL in a WebView or browser
    };
}
```

When the configured rules (view count, data mappings, etc.) are satisfied, the SDK will invoke your `FlutterSurveyIntercept.getSurveyUrl` callback with the survey URL, which you can present to the user.

## Additional information

This plugin integrates the QuestionPro CX SDK for survey intercept capabilities in Flutter applications.

For issues or questions, please contact the package maintainer.
