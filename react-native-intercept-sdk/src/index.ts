import { NativeModules, Platform, NativeEventEmitter } from 'react-native';
import { DataMapping } from './types';

export interface ConfigureOptions {
  apiKey: string;
  domain?: string;
  userId?: string;
  enableDebug?: boolean;
}

export interface SurveyResult {
  success: boolean;
  message?: string;
  surveyId?: string;
  eventId?: string;
}

export interface EventData {
  type: string;
  data?: any;
}

const LINKING_ERROR =
  `The package '@questionpro/react-native-intercept-sdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'cd ios && pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

//console.log('🔍 Available NativeModules:', Object.keys(NativeModules));
//console.log('🔍 Looking for InterceptSdk:', !!NativeModules.InterceptSdk);
console.log('🔍 InterceptSdk methods:', NativeModules.InterceptSdk ? Object.keys(NativeModules.InterceptSdk) : 'Not found');

// Get the native module
const InterceptSdkNative = NativeModules.InterceptSdk
  ? NativeModules.InterceptSdk
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

class InterceptSdkImpl {
  private isNativeAvailable: boolean;
  private eventEmitter?: NativeEventEmitter;

  constructor() {
    // Enhanced debugging for iOS
    console.log('🔍 Platform:', Platform.OS);
    console.log('🔍 Available NativeModules:', Object.keys(NativeModules));
    
    // Check if native module is available
    this.isNativeAvailable = !!NativeModules.InterceptSdk;
    console.log('🔍 Looking for InterceptSdk:', this.isNativeAvailable);
    
    if (Platform.OS === 'ios') {
      console.log('🔍 iOS: Checking for InterceptSdk in NativeModules...');
      console.log('🔍 iOS: InterceptSdk exists:', !!NativeModules.InterceptSdk);
      if (NativeModules.InterceptSdk) {
        console.log('🔍 iOS: InterceptSdk constants:', NativeModules.InterceptSdk.getConstants?.());
      }
    }
    
    if (this.isNativeAvailable && NativeModules.InterceptSdk) {
      this.eventEmitter = new NativeEventEmitter(NativeModules.InterceptSdk);
      console.log('✅ EventEmitter created for InterceptSdk');
    } else {
      console.log('❌ Native module not available, will use mock implementation');
    }
  }

  async configure(options: ConfigureOptions): Promise<SurveyResult> {
    console.log('InterceptSDK: Configure called with options:', options);
    
    if (this.isNativeAvailable) {
      try {
        const result = await InterceptSdkNative.configure(options);
        console.log('InterceptSDK: Native configure result:', result);
        return result;
      } catch (error) {
        console.error('InterceptSDK: Native configure failed, falling back to JS:', error);
        // Fall through to JavaScript implementation
      }
    }
    
    // JavaScript fallback
    return {
      success: true,
      message: 'SDK configured successfully (JS fallback implementation)'
    };
  }

  async setScreenVisited(screenName: string): Promise<any> {
    console.log('InterceptSDK: setScreenVisited called with screenName:', screenName);
    
    if (this.isNativeAvailable) {
      try {
        const result = await InterceptSdkNative.setScreenVisited(screenName);
        console.log('InterceptSDK: Native setScreenVisited result:', result);
        return result;
      } catch (error) {
        console.error('InterceptSDK: Native setScreenVisited failed, falling back to JS:', error);
        // Fall through to JavaScript implementation
      }
    }
    
    // JavaScript fallback
    return {
      success: true,
      message: `Screen "${screenName}" marked as visited (JS fallback implementation)`
    };
  }


async setDataMappings(dataMappings: DataMapping): Promise<any> {
    console.log('InterceptSDK: setDataMappings called with:', dataMappings);
    
    if (this.isNativeAvailable) {
      try {
        const result = await InterceptSdkNative.setDataMappings(dataMappings);
        console.log('InterceptSDK: Native setDataMappings result:', result);
        return result;
      } catch (error) {
        console.error('InterceptSDK: Native setDataMappings failed, falling back to JS:', error);
        // Fall through to JavaScript implementation
      }
    }
    
    // JavaScript fallback
    return {
      success: true,
      message: `Data mappings set successfully (JS fallback implementation)`,
      mappingsCount: Object.keys(dataMappings).length
    };
  }


  async startSurvey(surveyId: string): Promise<SurveyResult> {
    console.log('InterceptSDK: startSurvey called with surveyId:', surveyId);
    
    if (this.isNativeAvailable) {
      try {
        const result = await InterceptSdkNative.startSurvey(surveyId);
        console.log('InterceptSDK: Native startSurvey result:', result);
        return result;
      } catch (error) {
        console.error('InterceptSDK: Native startSurvey failed, falling back to JS:', error);
        // Fall through to JavaScript implementation
      }
    }
    
    // JavaScript fallback
    return {
      success: true,
      surveyId: surveyId,
      message: 'Survey started successfully (JS fallback implementation)'
    };
  }

  async notifyEvent(eventType: string): Promise<SurveyResult> {
    console.log('InterceptSDK: notifyEvent called with eventType:', eventType);
    
    if (this.isNativeAvailable) {
      try {
        const result = await InterceptSdkNative.notifyEvent(eventType);
        console.log('InterceptSDK: Native notifyEvent result:', result);
        return result;
      } catch (error) {
        console.error('InterceptSDK: Native notifyEvent failed, falling back to JS:', error);
        // Fall through to JavaScript implementation
      }
    }
    
    // JavaScript fallback
    return {
      success: true,
      eventId: 'js_fallback_' + Date.now(),
      message: 'Event notified successfully (JS fallback implementation)'
    };
  }

  onEvent(callback: (event: EventData) => void): () => void {
    console.log('InterceptSDK: onEvent called');
    
    if (this.isNativeAvailable && this.eventEmitter) {
      // Use native event emitter
      const subscription = this.eventEmitter.addListener('InterceptSdkEvent', callback);
      
      // Simulate a native event after 2 seconds for testing
      setTimeout(() => {
        callback({
          type: 'native_test_event',
          data: {
            message: 'Test event from native module integration',
            timestamp: new Date().toISOString(),
            platform: Platform.OS
          }
        });
      }, 2000);
      
      return () => {
        subscription.remove();
        console.log('InterceptSDK: Native event listener unsubscribed');
      };
    } else {
      // JavaScript fallback
      const timeout = setTimeout(() => {
        callback({
          type: 'js_fallback_event',
          data: {
            message: 'Simulated event from JS fallback implementation',
            timestamp: new Date().toISOString(),
            platform: Platform.OS
          }
        });
      }, 3000);

      return () => {
        clearTimeout(timeout);
        console.log('InterceptSDK: JS fallback event listener unsubscribed');
      };
    }
  }

  // Additional method to check if native module is available
  isNativeModuleAvailable(): boolean {
    return this.isNativeAvailable;
  }

  // Method to get implementation type
  getImplementationType(): 'native' | 'javascript' {
    return this.isNativeAvailable ? 'native' : 'javascript';
  }
}

const InterceptSdk = new InterceptSdkImpl();

export default InterceptSdk;
