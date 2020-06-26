//
//  NavigationManager.m
//  ios
//
//  Created by Jignesh Raiyani on 9/22/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//


#import <UIKit/UIKit.h>
#import "NavigationManager.h"


@implementation NavigationManager

+ (id)allocWithZone:(NSZone *) zone
{
    static NavigationManager *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [super allocWithZone:zone];
    });
    return sharedInstance;
}

RCT_EXPORT_MODULE();

- (NSArray<NSString*> *)supportedEvents {
    return @[@"BackEvent", @"notificationReload", @"DoneAction", @"ObjAction", @"ObjEditMenu"];
}

#pragma mark - send event from ObjcetiveC to React


-(void)callBackEvent {
    [self sendEventWithName:@"BackEvent" body:@""];
}

-(void)notificationReload:(NSDictionary*)notification {
    [self sendEventWithName:@"notificationReload" body:notification];
}

// @sujan Done button action in the review summary page.
-(void)doneAction {
    [self sendEventWithName:@"DoneAction" body:@""];
}

// @sujan Context menu action to show filter options for objectives and goals.
-(void)contextAction {
    [self sendEventWithName:@"ObjAction" body:@""];
}

// @sujan Context menu action to show edit option for objectives and goals.
-(void)objEditAction {
    [self sendEventWithName:@"ObjEditMenu" body:@""];
}

@end
