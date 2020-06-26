//
//  ActionBarModuleManager.m
//  ios
//
//  Created by Jignesh on 16/05/18.
//  Copyright © 2018 Jignesh. All rights reserved.
//
#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ActionBarModule, NSObject)

RCT_EXTERN_METHOD(updateTitleAndMenu:(NSString*)aActionBarInfo)
RCT_EXTERN_METHOD(toggleBackButton:(BOOL)showBackButton)
RCT_EXTERN_METHOD(updateObjAndGoalsContent:(NSString*)content)
RCT_EXTERN_METHOD(updateSelectedMenuItem:(NSString*)setAsk)
RCT_EXTERN_METHOD(updateLanguageMenuTitle:(NSString*)label)

@end
