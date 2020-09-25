//
//  InAppSurveyViewManager.m
//  CustomerExperience
//
//  Created by Nehal on 25/09/20.
//

#import "InAppSurveyViewManager.h"
#import <InAppSurvey_CX/InAppSurveyView.h>


@implementation InAppSurveyViewManager

RCT_EXPORT_MODULE();

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(showSurvey:(NSString *)surveyId apiKey:(NSString *)apiKey)
{
  InAppSurveyView *view = [[InAppSurveyView alloc] initWithSurveyId: surveyId apiKey: apiKey];
  [view showInAppSurvey];
}

@end
