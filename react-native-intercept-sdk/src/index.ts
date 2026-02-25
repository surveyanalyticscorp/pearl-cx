import { NativeModules, Platform, NativeEventEmitter } from 'react-native';
import { ConfigureOptions, DataMapping } from './types';

/*export interface ConfigureOptions {
  apiKey: string;
  dataCenter: DataCenter;
  enableDebug?: boolean;
}*/

interface SurveyResult {
  success: boolean;
  message?: string;
  surveyId?: string;
  eventId?: string;
}

export interface EventData {
  type: string;
  data?: any;
}

export enum DataCenter {
  US = 'US',
  EU = 'EU',
  CA = 'CA',
  SG = 'SG',
  AU = 'AU',
  AE = 'AE',
  SA = 'SA',
  KSA = 'KSA'
}

const LINKING_ERROR =
  `The package '@questionpro/react-native-intercept-sdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'cd ios && pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

//console.log('🔍 Available NativeModules:', Object.keys(NativeModules));
//console.log('🔍 Looking for InterceptSdk:', !!NativeModules.InterceptSdk);
//console.log('🔍 InterceptSdk methods:', NativeModules.InterceptSdk ? Object.keys(NativeModules.InterceptSdk) : 'Not found');

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
  private enableDebug: boolean = false;

  constructor() {
    // Enhanced debugging for iOS
    if (this.enableDebug) {
      console.log('🔍 Platform:', Platform.OS);
      console.log('🔍 Available NativeModules:', Object.keys(NativeModules));
    }
    
    // Check if native module is available
    this.isNativeAvailable = !!NativeModules.InterceptSdk;
    if (this.enableDebug) {
      console.log('🔍 Looking for InterceptSdk:', this.isNativeAvailable);
    }
    
    if (Platform.OS === 'ios' && this.enableDebug) {
      console.log('🔍 iOS: Checking for InterceptSdk in NativeModules...');
      console.log('🔍 iOS: InterceptSdk exists:', !!NativeModules.InterceptSdk);
      if (NativeModules.InterceptSdk) {
        console.log('🔍 iOS: InterceptSdk constants:', NativeModules.InterceptSdk.getConstants?.());
      }
    }
    
    if (this.isNativeAvailable && NativeModules.InterceptSdk) {
      this.eventEmitter = new NativeEventEmitter(NativeModules.InterceptSdk);
      if (this.enableDebug) {
        console.log('✅ EventEmitter created for InterceptSdk');
      }
    } else {
      if (this.enableDebug) {
        console.log('❌ Native module not available, will use mock implementation');
      }
    }
  }

  async configure(options: ConfigureOptions): Promise<SurveyResult> {
    // Set debug mode based on options
    this.enableDebug = options.enableDebug || false;
    
    if (this.enableDebug) {
      console.log('InterceptSDK: Configure called with options:', options);
    }
    
    if (this.isNativeAvailable) {
      try {
        const result = await InterceptSdkNative.configure(options);
        if (this.enableDebug) {
          console.log('InterceptSDK: Native configure result:', result);
        }
        return result;
      } catch (error) {
        if (this.enableDebug) {
          console.error('InterceptSDK: Native configure failed, falling back to JS:', error);
        }
        return{
          success: false,
          message: `Native configure failed: ${error}`
        }
        // Fall through to JavaScript implementation
      }
    }
    
    // JavaScript fallback
    return {
      success: true,
      message: `SDK configured successfully with debug: ${options.enableDebug || false} (JS fallback implementation)`
    };
  }

  async setScreenVisited(screenName: string): Promise<any> {
    if (this.enableDebug) {
      console.log('InterceptSDK: setScreenVisited called with screenName:', screenName);
    }
    
    if (this.isNativeAvailable) {
      try {
        const result = await InterceptSdkNative.setScreenVisited(screenName);
        if (this.enableDebug) {
          console.log('InterceptSDK: Native setScreenVisited result:', result);
        }
        return result;
      } catch (error) {
        if (this.enableDebug) {
          console.error('InterceptSDK: Native setScreenVisited failed: ', error);
        }
        return{
          success: false,
          message: `Native setScreenVisited failed: ${error}`
        }
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
    if (this.enableDebug) {
      console.log('InterceptSDK: setDataMappings called with:', dataMappings);
    }
    
    if (this.isNativeAvailable) {
      try {
        const result = await InterceptSdkNative.setDataMappings(dataMappings);
        if (this.enableDebug) {
          console.log('InterceptSDK: Native setDataMappings result:', result);
        }
        return result;
      } catch (error) {
        if (this.enableDebug) {
          console.error('InterceptSDK: Native setDataMappings failed, falling back to JS:', error);
        }
        // Fall through to JavaScript implementation
        return{
          success: false,
          message: `Native setDataMappings failed: ${error}`
        }
      }
    }
    
    return {
      success: true,
      message: `Data mappings set successfully`,
      mappingsCount: Object.keys(dataMappings).length
    };
  }


  async startSurvey(surveyId: string): Promise<SurveyResult> {
    if (this.enableDebug) {
      console.log('InterceptSDK: startSurvey called with surveyId:', surveyId);
    }
    
    if (this.isNativeAvailable) {
      try {
        const result = await InterceptSdkNative.startSurvey(surveyId);
        if (this.enableDebug) {
          console.log('InterceptSDK: Native startSurvey result:', result);
        }
        return result;
      } catch (error) {
        if (this.enableDebug) {
          console.error('InterceptSDK: Native startSurvey failed, falling back to JS:', error);
        }
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
    if (this.enableDebug) {
      console.log('InterceptSDK: notifyEvent called with eventType:', eventType);
    }
    
    if (this.isNativeAvailable) {
      try {
        const result = await InterceptSdkNative.notifyEvent(eventType);
        if (this.enableDebug) {
          console.log('InterceptSDK: Native notifyEvent result:', result);
        }
        return result;
      } catch (error) {
        if (this.enableDebug) {
          console.error('InterceptSDK: Native notifyEvent failed, falling back to JS:', error);
        }
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
    if (this.enableDebug) {
      console.log('InterceptSDK: onEvent called');
    }
    
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
        if (this.enableDebug) {
          console.log('InterceptSDK: Native event listener unsubscribed');
        }
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
        if (this.enableDebug) {
          console.log('InterceptSDK: JS fallback event listener unsubscribed');
        }
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
