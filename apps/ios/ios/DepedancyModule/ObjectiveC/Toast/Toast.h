//
//  Toast.h
//  ToastDemo
//
//  Created by Ajithkumar MN on 04/11/14.


#import <UIKit/UIKit.h>

@interface Toast : UIView
+(void)showToastWithMessage:(NSString *)aMessage forDuration:(CGFloat)aDuration;
+(void)showToastWithMessageFromTop:(NSString *)aMessage forDuration:(CGFloat)aDuration;
@end
