//
//  NetworkManager.h
//  InAppSurvey_CX
//
//  Created by Nehal on 09/09/20.
//  Copyright © 2020 QuestionPro. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface NetworkManager : NSObject
+(void)invokeServiceWithSurveyID:(nonnull NSString*)surveyID
                      withAPIKey:(nonnull NSString*)apikey
               completionHandler:(void(^)(NSString*, NSError*))callback;

@end

NS_ASSUME_NONNULL_END
