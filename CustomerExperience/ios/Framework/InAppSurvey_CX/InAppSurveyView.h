//
//  InAppSurveyView.h
//  InAppSurvey_CX
//
//  Created by Nehal on 22/09/20.
//  Copyright © 2020 QuestionPro. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface InAppSurveyView : UIView

- (instancetype)initWithSurveyId:(nonnull NSString *)surveyId
                          apiKey:(nonnull NSString *)apiKey ;
-(void)showInAppSurvey ;
@end

NS_ASSUME_NONNULL_END
