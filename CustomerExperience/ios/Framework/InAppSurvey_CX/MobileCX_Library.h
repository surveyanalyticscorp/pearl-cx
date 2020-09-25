//
//  MobileCX_Library.h
//  MobileCX_Library
//
//  Created by Jignesh Raiyani on 3/30/16.
//  Copyright © 2016 QuestionPro. All rights reserved.
//



#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>



@interface MobileCX_Library : NSObject

-(instancetype)initwithAPIKey:(NSString*)apiKey withWindow:(UIWindow*)aWindow;
-(void)showInAppSurvey:(NSString*)surveyId withSuperView:(UIView*)appSuperview;


@end
