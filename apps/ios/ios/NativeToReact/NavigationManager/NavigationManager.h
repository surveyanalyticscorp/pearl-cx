//
//  NavigationManager.h
//  ios
//
//  Created by Jignesh Raiyani on 9/22/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTViewManager.h>
#import <React/RCTEventEmitter.h>

@interface NavigationManager : RCTEventEmitter <RCTBridgeModule>


-(void)callBackEvent;
-(void)notificationReload:(NSDictionary*)notification;

// @sujan Done button action in the review summary page.
-(void)doneAction;

// @sujan Context menu action for objectives and goals.
-(void)contextAction;

// @sujan Context menu action to show edit option for objectives and goals.
-(void)objEditAction;

@end
