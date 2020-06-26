//
//  GAEventModuleManager.m
//  ios
//
//  Created by Jignesh on 16/05/18.
//  Copyright © 2018 Jignesh. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(GAEventModule, NSObject)

RCT_EXTERN_METHOD(addGAEvent:(NSString*)aScreenName)

@end
