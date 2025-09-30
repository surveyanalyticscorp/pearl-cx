# Installation Instructions

## Complete Integration Guide

This document provides detailed instructions for integrating the React Native Survey Intercept SDK with your existing native QuestionPro Survey SDKs.

## Prerequisites

Before starting, ensure you have:
- Existing QuestionPro Survey SDK for Android (`.aar` file or Maven dependency)
- Existing QuestionPro Survey SDK for iOS (`.framework` or CocoaPods dependency)
- React Native development environment set up
- API keys from QuestionPro

## Step 1: Install the React Native Package

```bash
npm install @questionpro/react-native-intercept-sdk
# or
yarn add @questionpro/react-native-intercept-sdk
```

## Step 2: Android Integration

### 2.1 Add Native SDK Dependency

Edit `android/build.gradle` in the React Native module:

```gradle
dependencies {
    // ... other dependencies
    
    // Option 1: If your SDK is published to Maven/JCenter
    implementation 'com.questionpro:survey-sdk:1.0.0'
    
    // Option 2: If you have a local AAR file
    implementation(name: 'questionpro-survey-sdk', ext: 'aar')
}
```

If using local AAR, also add the repository:

```gradle
repositories {
    flatDir {
        dirs 'libs' // Place your .aar file in android/libs/
    }
}
```

### 2.2 Update AndroidManifest.xml

Add required permissions for your Survey SDK:

```xml
<!-- In android/src/main/AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<!-- Add other permissions required by your Survey SDK -->
```

### 2.3 Register the Package

In your main React Native app's `MainApplication.java`:

```java
import com.questionpro.interceptsdk.InterceptSdkPackage;

@Override
protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
        new InterceptSdkPackage() // Add this line
    );
}
```

### 2.4 Implement Native SDK Calls

Edit `android/src/main/java/com/questionpro/interceptsdk/InterceptSdkModule.kt`:

Replace the TODO comments with actual calls to your Survey SDK. Example:

```kotlin
// In configure() method:
SurveySDK.getInstance().configure(
    context = reactApplicationContext,
    apiKey = apiKey,
    userEmail = email,
    customVariables = convertReadableMapToHashMap(variables)
) { success, error ->
    if (success) {
        promise.resolve(true)
    } else {
        promise.reject("CONFIGURE_ERROR", error ?: "Configuration failed")
    }
}

// In notifyEvent() method:
SurveySDK.getInstance().logEvent(
    eventName = eventName,
    parameters = convertReadableMapToHashMap(params)
) { result ->
    when (result.type) {
        SurveyEventType.SURVEY_SHOWN -> {
            emitEvent(EVENT_SURVEY_SHOWN, Arguments.createMap().apply {
                putString("surveyId", result.surveyId)
            })
        }
        SurveyEventType.SURVEY_COMPLETED -> {
            emitEvent(EVENT_SURVEY_COMPLETED, Arguments.createMap().apply {
                putString("surveyId", result.surveyId)
                putMap("responses", convertHashMapToWritableMap(result.responses))
            })
        }
        SurveyEventType.SURVEY_DISMISSED -> {
            emitEvent(EVENT_SURVEY_DISMISSED, Arguments.createMap().apply {
                putString("surveyId", result.surveyId)
            })
        }
    }
}
```

## Step 3: iOS Integration

### 3.1 Install Pod Dependencies

```bash
cd ios && pod install
```

### 3.2 Add Native SDK Dependency

Edit `react-native-intercept-sdk.podspec`:

```ruby
s.dependency "React-Core"

# Option 1: If your SDK is available via CocoaPods
s.dependency "QuestionProSurveySDK", "~> 1.0.0"

# Option 2: If you have a local framework
# s.vendored_frameworks = 'ios/Frameworks/QuestionProSurveySDK.framework'
```

### 3.3 Implement Native SDK Calls

Edit `ios/InterceptSdk.swift`:

Replace the TODO comments with actual calls to your Survey SDK. Example:

```swift
// In configure() method:
QuestionProSurveySDK.shared.configure(
    apiKey: apiKey,
    userEmail: email,
    customVariables: variables
) { [weak self] result in
    DispatchQueue.main.async {
        switch result {
        case .success:
            resolve(true)
        case .failure(let error):
            reject("CONFIGURE_ERROR", error.localizedDescription, error)
        }
    }
}

// In notifyEvent() method:
QuestionProSurveySDK.shared.logEvent(
    name: eventName,
    parameters: params
) { [weak self] result in
    DispatchQueue.main.async {
        switch result {
        case .surveyShown(let surveyId):
            self?.sendEvent(withName: InterceptSdk.EVENT_SURVEY_SHOWN, body: [
                "surveyId": surveyId
            ])
        case .surveyCompleted(let surveyId, let responses):
            self?.sendEvent(withName: InterceptSdk.EVENT_SURVEY_COMPLETED, body: [
                "surveyId": surveyId,
                "responses": responses
            ])
        case .surveyDismissed(let surveyId):
            self?.sendEvent(withName: InterceptSdk.EVENT_SURVEY_DISMISSED, body: [
                "surveyId": surveyId
            ])
        case .error(let error):
            self?.sendEvent(withName: "error", body: [
                "message": error.localizedDescription
            ])
        }
    }
}
```

### 3.4 Add Required Info.plist Entries

Add any required permissions for your Survey SDK:

```xml
<!-- In ios/Info.plist -->
<key>NSCameraUsageDescription</key>
<string>This app needs camera access for survey functionality</string>
<key>NSMicrophoneUsageDescription</key>
<string>This app needs microphone access for survey functionality</string>
<!-- Add other permissions as required by your Survey SDK -->
```

## Step 4: JavaScript Integration

```typescript
import React, { useEffect } from 'react';
import InterceptSdk from '@questionpro/react-native-intercept-sdk';

const App = () => {
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        await InterceptSdk.configure({
          apiKey: 'YOUR_API_KEY',
          email: 'user@example.com',
          variables: {
            userId: '12345',
            userType: 'premium'
          }
        });
        
        // Set up event listener
        const unsubscribe = InterceptSdk.onEvent((event) => {
          console.log('Survey event:', event);
        });
        
        return unsubscribe;
      } catch (error) {
        console.error('SDK initialization failed:', error);
      }
    };

    const unsubscribe = initializeSDK();
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    // Your app content
  );
};
```

## Step 5: Testing

1. **Test Configuration**: Verify the SDK configures successfully
2. **Test Events**: Trigger events and verify they reach your native SDK
3. **Test Survey Flow**: Ensure surveys display and events are emitted correctly

## Customization Options

### Custom Event Mapping

You can map React Native events to different native SDK events:

```kotlin
// Android - in notifyEvent()
val nativeEventName = when (eventName) {
    "page_view" -> "screen_viewed"
    "button_click" -> "user_interaction"
    else -> eventName
}
```

```swift
// iOS - in notifyEvent()
let nativeEventName: String = {
    switch eventName {
    case "page_view": return "screen_viewed"
    case "button_click": return "user_interaction"
    default: return eventName
    }
}()
```

### Custom Data Transformation

Transform data between React Native and native formats:

```kotlin
// Android - Custom data transformation
private fun transformEventData(params: ReadableMap?): Map<String, Any> {
    val transformed = HashMap<String, Any>()
    // Apply your custom transformation logic
    return transformed
}
```

## Troubleshooting

### Build Issues

1. **Android Build Fails**:
   - Verify AAR file is in `android/libs/`
   - Check Gradle dependencies
   - Ensure minimum SDK version compatibility

2. **iOS Build Fails**:
   - Run `cd ios && pod install` again
   - Check framework dependencies
   - Verify iOS deployment target

3. **Runtime Issues**:
   - Check native SDK initialization
   - Verify API keys are correct
   - Enable debug logging in native SDKs

### Common Integration Patterns

1. **Delayed Configuration**: Configure SDK after user login
2. **Conditional Events**: Only track events for certain user types
3. **Custom Survey Triggers**: Implement custom logic for when to show surveys

This completes the integration guide. Your React Native app should now be able to communicate with your existing native Survey SDKs through this bridge module.
