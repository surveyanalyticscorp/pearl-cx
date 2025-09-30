# QuestionPro React Native Survey Intercept SDK

A React Native wrapper for the QuestionPro Survey Intercept SDK, enabling seamless integration of survey functionality into your React Native applications.

## Features

- ✅ **Cross-platform**: Works on both iOS and Android
- ✅ **TypeScript Support**: Full type definitions included
- ✅ **Event-driven**: Listen to survey events (shown, completed, dismissed)
- ✅ **Easy Integration**: Simple API with minimal setup
- ✅ **Native Performance**: Leverages native SDKs for optimal performance
- ✅ **Customizable**: Support for user variables and targeting

## Installation

### 1. Install the package

```bash
npm install @questionpro/react-native-intercept-sdk
```

or

```bash
yarn add @questionpro/react-native-intercept-sdk
```

### 2. iOS Setup

For iOS, you need to install the pod dependencies:

```bash
cd ios && pod install
```

**Important**: Add your existing QuestionPro Survey SDK dependency to the `react-native-intercept-sdk.podspec` file:

```ruby
# In react-native-intercept-sdk.podspec
s.dependency "QuestionProSurveySDK", "~> 1.0.0" # Replace with your SDK version
```

### 3. Android Setup

For Android, add your existing Survey SDK dependency to the module's `build.gradle` file:

```gradle
// In android/build.gradle
dependencies {
    implementation 'com.questionpro:survey-sdk:1.0.0' // Replace with your SDK version
    // or for local AAR:
    // implementation(name: 'survey-sdk', ext: 'aar')
}
```

### 4. Native SDK Integration

#### Android Integration

In your Android bridge module (`android/src/main/java/com/questionpro/interceptsdk/InterceptSdkModule.kt`), replace the TODO comments with actual calls to your Survey SDK:

```kotlin
// Example integration in configure() method:
SurveySDK.configure(
    context = reactApplicationContext,
    apiKey = apiKey,
    email = email,
    variables = convertReadableMapToHashMap(variables),
    callback = object : SurveySDKCallback {
        override fun onConfigured(success: Boolean) {
            promise.resolve(success)
        }
        override fun onError(error: String) {
            promise.reject("CONFIGURE_ERROR", error)
        }
    }
)
```

#### iOS Integration

In your iOS bridge module (`ios/InterceptSdk.swift`), replace the TODO comments with actual calls to your Survey SDK:

```swift
// Example integration in configure() method:
SurveySDK.configure(
    apiKey: apiKey,
    email: email,
    variables: variables
) { [weak self] success, error in
    DispatchQueue.main.async {
        if success {
            resolve(true)
        } else {
            reject("CONFIGURE_ERROR", error?.localizedDescription ?? "Configuration failed", error)
        }
    }
}
```

## Usage

### Basic Setup

```typescript
import React, { useEffect } from 'react';
import InterceptSdk from '@questionpro/react-native-intercept-sdk';

const App = () => {
  useEffect(() => {
    // Configure the SDK
    const configureSDK = async () => {
      try {
        const success = await InterceptSdk.configure({
          apiKey: 'your-api-key',
          email: 'user@example.com', // Optional
          variables: { // Optional
            userId: '12345',
            userType: 'premium'
          }
        });
        
        if (success) {
          console.log('SDK configured successfully');
        }
      } catch (error) {
        console.error('Failed to configure SDK:', error);
      }
    };

    configureSDK();
  }, []);

  return (
    // Your app content
  );
};
```

### Listening to Events

```typescript
import { useEffect } from 'react';
import InterceptSdk, { SurveyEvent } from '@questionpro/react-native-intercept-sdk';

const useInterceptSdk = () => {
  useEffect(() => {
    const unsubscribe = InterceptSdk.onEvent((event: SurveyEvent) => {
      switch (event.type) {
        case 'survey_shown':
          console.log('Survey shown:', event.data?.surveyId);
          break;
        case 'survey_completed':
          console.log('Survey completed:', event.data?.responses);
          // Handle survey completion (e.g., show thank you message)
          break;
        case 'survey_dismissed':
          console.log('Survey dismissed:', event.data?.surveyId);
          break;
        case 'error':
          console.error('SDK error:', event.data?.message);
          break;
      }
    });

    // Cleanup
    return unsubscribe;
  }, []);
};
```

### Triggering Events

```typescript
import InterceptSdk from '@questionpro/react-native-intercept-sdk';

// Simple event
InterceptSdk.notifyEvent('page_view');

// Event with parameters
InterceptSdk.notifyEvent('product_purchase', {
  productId: 'abc123',
  price: 29.99,
  category: 'electronics'
});

// User action events
InterceptSdk.notifyEvent('button_click', {
  buttonId: 'cta-button',
  page: 'home'
});
```

## API Reference

### `configure(options: ConfigureOptions): Promise<boolean>`

Configures the Survey SDK with the provided options.

**Parameters:**
- `options.apiKey` (string, required): Your QuestionPro API key
- `options.email` (string, optional): User email for targeting
- `options.variables` (object, optional): Custom variables for survey targeting

**Returns:** Promise that resolves to `true` if configuration was successful

### `notifyEvent(eventName: string, params?: EventParams): void`

Notifies the SDK of an event occurrence, which may trigger survey evaluation.

**Parameters:**
- `eventName` (string): Name of the event
- `params` (object, optional): Event parameters

### `onEvent(callback: EventCallback): UnsubscribeFunction`

Subscribes to events from the native SDK.

**Parameters:**
- `callback` (function): Function to call when events are received

**Returns:** Function to unsubscribe from events

### `removeAllListeners(): void`

Removes all event listeners. Call this when your component unmounts.

## Types

### `ConfigureOptions`

```typescript
interface ConfigureOptions {
  apiKey: string;
  email?: string;
  variables?: Record<string, any>;
}
```

### `SurveyEvent`

```typescript
interface SurveyEvent {
  type: 'survey_shown' | 'survey_completed' | 'survey_dismissed' | 'error';
  data?: {
    surveyId?: string;
    responses?: Record<string, any>;
    message?: string;
    [key: string]: any;
  };
}
```

## Example Project

See the `/example` directory for a complete React Native app demonstrating the SDK usage.

To run the example:

```bash
cd example
npm install
npx react-native run-ios
# or
npx react-native run-android
```

## Requirements

- React Native >= 0.70
- iOS >= 11.0
- Android API Level >= 21
- Existing QuestionPro Survey SDK for iOS and Android

## Common Integration Patterns

### React Hook Pattern

```typescript
import { useEffect, useCallback } from 'react';
import InterceptSdk, { SurveyEvent } from '@questionpro/react-native-intercept-sdk';

export const useSurveySDK = (apiKey: string, userEmail?: string) => {
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const configure = async () => {
      try {
        const success = await InterceptSdk.configure({
          apiKey,
          email: userEmail,
        });
        setIsConfigured(success);
      } catch (error) {
        console.error('SDK configuration failed:', error);
      }
    };

    configure();
  }, [apiKey, userEmail]);

  const trackEvent = useCallback((eventName: string, params?: Record<string, any>) => {
    if (isConfigured) {
      InterceptSdk.notifyEvent(eventName, params);
    }
  }, [isConfigured]);

  return { isConfigured, trackEvent };
};
```

### Navigation Tracking

```typescript
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import InterceptSdk from '@questionpro/react-native-intercept-sdk';

export const useNavigationTracking = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Track page view when screen comes into focus
      InterceptSdk.notifyEvent('page_view', {
        screenName: navigation.getCurrentRoute()?.name,
        timestamp: Date.now(),
      });
    });

    return unsubscribe;
  }, [navigation]);
};
```

## Troubleshooting

### Common Issues

1. **Module not found error**: Ensure you've run `cd ios && pod install` for iOS projects
2. **Android build fails**: Check that your Survey SDK dependency is correctly added to `android/build.gradle`
3. **Events not firing**: Verify that the SDK is properly configured before calling `notifyEvent`
4. **TypeScript errors**: Make sure you have the latest version installed and check for peer dependency issues

### Debug Mode

Enable debug logging by adding the following to your native SDK configuration:

```typescript
// This depends on your native SDK's debug capabilities
InterceptSdk.configure({
  apiKey: 'your-api-key',
  variables: {
    debugMode: true // If your native SDK supports this
  }
});
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please contact [support@questionpro.com](mailto:support@questionpro.com) or create an issue in this repository.
