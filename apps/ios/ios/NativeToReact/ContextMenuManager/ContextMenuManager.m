//
//  ContextMenuManager.m
//  ios
//
//  Created by Jignesh Raiyani on 10/6/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

#import "ContextMenuManager.h"
#import <UIKit/UIKit.h>

@implementation ContextMenuManager

+ (id)allocWithZone:(NSZone *) zone
{
    static ContextMenuManager *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [super allocWithZone:zone];
    });
    return sharedInstance;
}

RCT_EXPORT_MODULE();

- (NSArray<NSString*> *)supportedEvents {
    return @[@"ContextMenuItemClick",@"SceneTransition", @"reloadScreen", @"Logout", @"GoalsFilterAction", @"ObjEditAction", @"LanguagePicker"];
}

#pragma mark - send event from ObjcetiveC to React

-(void)refreshContextMenuWithdata:(NSDictionary*)aContextMenuDict {
    
    NSError * error;
    NSData * jsonData = [NSJSONSerialization dataWithJSONObject:aContextMenuDict options:0 error:&error];
    NSString * jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    NSDictionary *dataDict = @{@"DATA":jsonString};
    [self sendEventWithName:@"ContextMenuItemClick" body:dataDict];
    
}

#pragma mark - send event from ObjcetiveC to React

-(void)refreshProfileScreenWithdata:(NSString*)aProfileMenuDict withTitle:(NSString*)aTitle {

    NSDictionary *dataDict = @{@"Scene":aProfileMenuDict, @"Title": aTitle};
    [self sendEventWithName:@"SceneTransition" body:dataDict];
}

-(void)reloadHomeScreenForPulse {
    [self sendEventWithName:@"reloadScreen" body:@""];
}

-(void)showLanguagePicker {
    [self sendEventWithName:@"LanguagePicker" body:@""];
}

-(void)logoutUser {
    [self sendEventWithName:@"Logout" body:@""];
}

//@sujan Change objectives and goals screen based on filter options
-(void)reloadObjAndGoalsScreen:(NSString*)option {
    
    NSDictionary *dataDict = @{@"filter":option};
    [self sendEventWithName:@"GoalsFilterAction" body:dataDict];
}

//@sujan Edit the selected objectives and goals
-(void)editObjAndGoal {
    [self sendEventWithName:@"ObjEditAction" body:@""];
}

@end
