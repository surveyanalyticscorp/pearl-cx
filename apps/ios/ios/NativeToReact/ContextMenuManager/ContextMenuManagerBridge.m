//
//  ContextMenuManagerBridge.m
//  ios
//
//  Created by Jignesh on 17/05/18.
//  Copyright © 2018 Jignesh. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ContextMenuManager, NSObject)

RCT_EXTERN_METHOD(refreshContextMenuWithdata:(NSDictionary*)aContextMenuDict)
RCT_EXTERN_METHOD(refreshProfileScreenWithdata:(NSString*)aProfileMenu withTitle:(NSString*)aTitle)
RCT_EXTERN_METHOD(logoutUser)
RCT_EXTERN_METHOD(reloadHomeScreenForPulse)
RCT_EXTERN_METHOD(reloadObjAndGoalsScreen:(NSString*)option)
RCT_EXTERN_METHOD(editObjAndGoal)

@end
