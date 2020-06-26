//
//  NavigationManagerBridge.m
//  ios
//
//  Created by Jignesh on 17/05/18.
//  Copyright © 2018 Jignesh. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(NavigationManager, NSObject)

RCT_EXTERN_METHOD(callBackEvent)
RCT_EXTERN_METHOD(notificationReload:(NSDictionary*)notification)
RCT_EXTERN_METHOD(doneAction)
RCT_EXTERN_METHOD(contextAction)
RCT_EXTERN_METHOD(objEditAction)

@end
