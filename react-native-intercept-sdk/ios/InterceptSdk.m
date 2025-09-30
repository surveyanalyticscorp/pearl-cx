#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

/**
 * Objective-C header file for the InterceptSdk Swift module
 * This file exposes the Swift module methods to React Native's Objective-C bridge
 */
@interface RCT_EXTERN_MODULE(InterceptSdk, RCTEventEmitter)

/**
 * Configure the Survey SDK
 * 
 * @param options Configuration dictionary with apiKey, email, and variables
 * @param resolve Promise resolver
 * @param reject Promise rejecter
 */
RCT_EXTERN_METHOD(configure:(NSDictionary *)options
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

/**
 * Notify the SDK of an event
 * 
 * @param eventName Name of the event
 * @param params Optional event parameters
 */
RCT_EXTERN_METHOD(notifyEvent:(NSString *)eventName
                  params:(NSDictionary *)params)

/**
 * Required for RCTEventEmitter to work properly
 */
+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

@end
