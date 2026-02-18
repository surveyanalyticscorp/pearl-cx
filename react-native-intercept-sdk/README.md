# React Native Survey Intercept SDK

A React Native SDK wrapper for QuestionPro Survey Intercept SDK that provides JavaScript bridge to native Android and iOS survey functionality.

## Architecture

Following React Native >= 0.70 best practices:
- **Native SDK handles all UI components** - Survey display and interaction managed by native SDKs
- **JS wrapper only provides bridge** - Clean separation between React Native and native functionality
- **Event-driven communication** - Real-time survey lifecycle events (survey_shown, survey_completed, survey_dismissed)

## Features

- ✅ **Cross-platform**: Android Kotlin + iOS Swift bridges
- ✅ **TypeScript Support**: Full type definitions included
- ✅ **Event System**: Real-time survey lifecycle events
- ✅ **DataCenter Support**: US, EU, CA, SG, AU, AE, SA, KSA
- ✅ **Debug Logging**: Configurable debug mode
- ✅ **Screen Tracking**: setScreenVisited functionality
- ✅ **Data Mappings**: User data for survey targeting

## Installation

### 1. Install the package

```bash
npm install @npm-questionpro/react-native-survey-intercept
```

or

```bash
yarn add @npm-questionpro/react-native-survey-intercept
```

### 2. iOS Setup

Add the QuestionPro CX Framework to your iOS project:

#### Option 1: CocoaPods (Recommended)
Add to your `ios/Podfile`:
```ruby
pod 'react-native-survey-intercept', :path => '../node_modules/@npm-questionpro/react-native-survey-intercept'
pod 'QuestionProCXFramework', :git => 'https://github.com/surveyanalyticscorp/ios-cx.git', :tag => '2.2.6'
```

#### Option 2: Swift Package Manager
1. Open your iOS project in Xcode
2. Go to Project Settings > Package Dependencies
3. Add: `https://github.com/surveyanalyticscorp/ios-cx.git`
4. Select version `2.2.6` or later

### 3. Android Setup

#### AndroidManifest.xml Configuration

Add the following configuration to your `android/app/src/main/AndroidManifest.xml`:

```xml
<application>
    <!-- Add your API key -->
    <meta-data android:name="cx_manifest_api_key"
              android:value="your-api-key-here"/>
    
    <!-- Add the survey activity -->
    <activity android:name="com.questionpro.cxlib.InteractionActivity"
              android:theme="@android:style/Theme.Translucent.NoTitleBar"
              android:configChanges="keyboardHidden"
              android:windowSoftInputMode="adjustResize">
    </activity>
</application>
```

**Important**: Replace `your-api-key-here` with your actual QuestionPro API key.


## Usage

### Basic Configuration

```typescript
import InterceptSdk, {DataCenter} from '@npm-questionpro/react-native-survey-intercept';
// Configure the SDK
await InterceptSdk.configure({
  apiKey: 'your-api-key-here',
  dataCenter: DataCenter.US, // Optional: US, EU, CA, SG, AU, AE, SA, KSA
  enableDebug: true // Optional: Enable debug logging
});
```

### Data Mappings

Set user data for survey targeting and personalization:

```typescript
import InterceptSdk from '@npm-questionpro/react-native-survey-intercept';
import { DataMapping } from '@npm-questionpro/react-native-survey-intercept';

const setDataMappings = async () => {
  try {
    const dataMappings: DataMapping = {
      'firstName': 'first_name',
      'lastName': 'last_name',
      'emailAddress': 'sample@questionpro.com'
    };
    
    const result = await InterceptSdk.setDataMappings(dataMappings);
    console.log('✅ setDataMappings result:', result);
  } catch (error) {
    console.error('❌ setDataMappings error:', error);
  }
};

// Call the function
await setDataMappings();
```

### View Count / Screen Visited

Track screen visits to trigger surveys based on user navigation patterns.

#### How to Set-up View Count Rule on QuestionPro

The 'View Count' rule, found in the 'Rules set-up' section of the admin dashboard, allows administrators to control when an intercept is displayed to users based on their mobile application navigation. This rule uses two parameters:
- **screen_name**: Specify the screen(s) to monitor  
- **count**: Set the view threshold before the intercept is triggered

**Set up the rule:**
1. Select the rule 'view count' from the mobile intercept settings
2. Set 'screen name' (for example: 'checkout_screen')  
3. Set the count (After how many events you want to launch the survey)

#### How to Use in the SDK

```typescript
import InterceptSdk from '@npm-questionpro/react-native-survey-intercept';

const launchFeedbackSurvey = async () => {
  try {
    const result = await InterceptSdk.setScreenVisited('checkout_screen');
    console.log('✅ Survey launch result:', result);
  } catch (error) {
    console.error('❌ Launch survey error:', error);
  }
};

// Call when user visits a specific screen
await launchFeedbackSurvey();
```

## API Reference

### Configuration Options

```typescript
interface ConfigureOptions {
  apiKey: string;           // Required: Your QuestionPro API key
  dataCenter?: DataCenter;  // Required: Data center region
  enableDebug?: boolean;    // Optional: Enable debug logging
}

enum DataCenter {
  US = 'US',    // United States (default)
  EU = 'EU',    // Europe
  CA = 'CA',    // Canada
  SG = 'SG',    // Singapore
  AU = 'AU',    // Australia
  AE = 'AE',    // UAE
  SA = 'SA',    // Saudi Arabia
  KSA = 'KSA'   // Kuwait, Saudi Arabia
}
```

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `configure()` | `ConfigureOptions` | `Promise<SurveyResult>` | Initialize the SDK with API key and settings |
| `setScreenVisited()` | `screenName: string` | `Promise<any>` | Track screen visits for survey targeting |
| `setDataMappings()` | `data: DataMapping` | `Promise<any>` | Set user data for survey personalization |



## Platform Support

- **React Native**: >= 0.70
- **iOS**: >= 15.0
- **Android**: >= API 21 (Android 5.0)

## Native SDK Versions

- **iOS**: QuestionPro CX Framework v2.2.4+
- **Android**: QuestionPro CX SDK v2.2.3+

**Returns:** Function to unsubscribe from events

### `removeAllListeners(): void`

Removes all event listeners. Call this when your component unmounts.


## Troubleshooting

### iOS Build Issues

1. **Module not found**: Ensure QuestionProCXFramework is added to your project
2. **Pod install fails**: Try `pod install --repo-update`
3. **Swift compilation errors**: Verify iOS deployment target >= 15.0

### Android Build Issues

1. **Gradle sync fails**: Check Android SDK versions in `android/build.gradle`
2. **Kotlin compilation errors**: Ensure Kotlin version >= 1.8.0

### Debug Mode

Enable debug logging to troubleshoot issues:

```typescript
await InterceptSdk.configure({
  apiKey: 'your-api-key',
  enableDebug: true
});
```



## Troubleshooting

### iOS Build Issues

1. **Module not found**: Ensure QuestionProCXFramework is added to your project
2. **Pod install fails**: Try `pod install --repo-update`
3. **Swift compilation errors**: Verify iOS deployment target >= 15.0

### Android Build Issues

1. **Gradle sync fails**: Check Android SDK versions in `android/build.gradle`
2. **Kotlin compilation errors**: Ensure Kotlin version >= 1.8.0


## License

MIT License. See [LICENSE](LICENSE) file for details.

## Support

For technical support and questions:
- **Email**: support@questionpro.com
- **Documentation**: [QuestionPro Developer Docs](https://api.questionpro.com/)
- **Issues**: [GitHub Issues](https://github.com/questionpro/react-native-survey-intercept/issues)

---

**Note**: This is a bridge SDK. All survey UI components are handled by the native QuestionPro CX SDKs, ensuring optimal performance and native user experience.
