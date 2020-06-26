//
//  ContextMenuManager.h
//  ios
//
//  Created by Jignesh Raiyani on 10/6/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTViewManager.h>
#import <React/RCTEventEmitter.h>

@interface ContextMenuManager : RCTEventEmitter <RCTBridgeModule>

-(void)refreshContextMenuWithdata:(NSDictionary*)aContextMenuDict;

-(void)refreshProfileScreenWithdata:(NSString*)aProfileMenuDict withTitle:(NSString*)aTitle;

-(void)reloadHomeScreenForPulse;

-(void)logoutUser;

-(void)showLanguagePicker;
//@sujan Change objective and goals screen based on filter options
-(void)reloadObjAndGoalsScreen:(NSString*)option;

//@sujan Edit the selected objectives and goals
-(void)editObjAndGoal;

@end
