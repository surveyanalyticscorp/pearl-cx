//
//  AuthenticationModuleManager.m
//  ios
//
//  Created by Jignesh on 16/05/18.
//  Copyright © 2018 Jignesh. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(AuthenticationModule, NSObject)

RCT_EXTERN_METHOD(getAuthToken:(RCTResponseSenderBlock)successCallback errorCallback:(RCTResponseErrorBlock)errorCallback)
RCT_EXTERN_METHOD(refreshAuthToken:(RCTResponseSenderBlock)successCallback)

@end
