//
//  NetworkManager.m
//  InAppSurvey_CX
//
//  Created by Nehal on 09/09/20.
//  Copyright © 2020 QuestionPro. All rights reserved.
//

#import "NetworkManager.h"
#import <UIKit/UIKit.h>

#define kMobileCXServiceUrl    @"https://cxlabs2.questionpro.com/a/api/"


@implementation NetworkManager


+(void)invokeServiceWithSurveyID:(NSString*)surveyID
                      withAPIKey:(NSString*)apikey
               completionHandler:(void(^)(NSString*, NSError*))callback
{
    NSString* path = nil;
    path = [NSString stringWithFormat:@"questionpro.cx.getSurveyURL?apiKey=%@",apikey];
    
    NSMutableDictionary* body = [self createCXRequestWithSurveyId:surveyID];
    NSString* url = [NSMutableString stringWithFormat:@"%@%@", kMobileCXServiceUrl,path];
    [self makeRestAPICall:url :body completionHandler:callback];
    
}


+(NSMutableDictionary*)createCXRequestWithSurveyId:(NSString*)surveyID {
    
    NSMutableDictionary *cxRequestDict = [[NSMutableDictionary alloc] init];
    [cxRequestDict setObject:@"" forKey:@"firstName"];
    [cxRequestDict setObject:@"" forKey:@"lastName"];
    [cxRequestDict setObject:@"No Language" forKey:@"transactionLanguage"];
    [cxRequestDict setObject:@"" forKey:@"mobile"];
    [cxRequestDict setObject:@"S1" forKey:@"segmentCode"];
    
    NSDateFormatter *dateFormatter=[[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:@"dd/MM/yyyy"];
    NSDate *currentDate = [NSDate date];
    NSString *dateString = [dateFormatter stringFromDate:currentDate];
    [cxRequestDict setObject:dateString forKey:@"transactionDate"];
    
    NSString* email = [NSString stringWithFormat:@"%@@questionpro.com",[[[UIDevice currentDevice] identifierForVendor] UUIDString]];
    [cxRequestDict setObject:email forKey:@"email"];
    
    [cxRequestDict setObject:surveyID forKey:@"surveyID"];
    return cxRequestDict;
}

+(void) makeRestAPICall : (NSString*) reqURLStr : (NSDictionary*) userDictionary completionHandler:(void(^)(NSString*, NSError*))callback {
    __block NSMutableDictionary *resultsDictionary;
    
    if ([NSJSONSerialization isValidJSONObject:userDictionary]) {
        NSError* error;
        NSData* jsonData = [NSJSONSerialization dataWithJSONObject:userDictionary options:NSJSONWritingPrettyPrinted error: &error];
        NSURL* url = [NSURL URLWithString:reqURLStr];
        NSMutableURLRequest* request = [NSMutableURLRequest requestWithURL:url cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:30.0];
        [request setHTTPMethod:@"POST"];
        [request setValue:@"application/json" forHTTPHeaderField:@"Accept"];
        [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
        [request setValue:[NSString stringWithFormat:@"%lu",(unsigned long)[jsonData length]] forHTTPHeaderField:@"Content-length"];
        [request setHTTPBody:jsonData];//set data
        __block NSError *error1 = [[NSError alloc] init];
        
        NSURLSession *session = [NSURLSession sessionWithConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration]];
        [[session dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
            if ([data length]>0 && error == nil) {
                resultsDictionary = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableLeaves error:&error1];
                NSDictionary* results = resultsDictionary[@"response"];
                NSString* surveyURL = results[@"SurveyURL"];
                NSLog(@"resultsDictionary is %@",resultsDictionary);
                dispatch_async(dispatch_get_main_queue(), ^{
                    callback(surveyURL, nil);
                });
                
            } else if ([data length]==0 && error ==nil) {
                NSLog(@" download data is null");
                dispatch_async(dispatch_get_main_queue(), ^{
                    callback(@"", nil);
                });
            } else if( error!=nil) {
                NSLog(@" error is %@",error);
                dispatch_async(dispatch_get_main_queue(), ^{
                    callback(nil, error);
                });
            }
        }] resume];
    }
}

@end




