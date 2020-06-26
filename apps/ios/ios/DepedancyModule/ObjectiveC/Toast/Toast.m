//
//  Toast.m
//  ToastDemo
//
//  Created by Ajithkumar MN on 04/11/14.


#import "Toast.h"

@implementation Toast{
    
    
}

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        // Initialization code
    }
    return self;
}



+(void)hideToast:(UIView *)view{
    
    [UIView animateWithDuration:0.8
                     animations:^{view.alpha = 0.0;}
                     completion:^(BOOL finished){
                         [view removeFromSuperview]; }];
    
}
 


+(void)showToastWithMessage:(NSString *)aMessage forDuration:(CGFloat)aDuration{
 
    if (aDuration==0) {
        aDuration=3;
    }
    
    UIWindow *window=[[UIApplication sharedApplication] keyWindow];
    if ([window viewWithTag:420]==nil) {
        
    UIView * view=[[UIView alloc] init];
    [window addSubview:view];
    view.tag=420;
    [view setTranslatesAutoresizingMaskIntoConstraints:NO];
    view.layer.cornerRadius=3;
    view.backgroundColor=[UIColor colorWithRed:0.0 green:0.0 blue:0.0 alpha:0.8];
    
    NSLayoutConstraint *contrains=[NSLayoutConstraint constraintWithItem:view attribute:NSLayoutAttributeCenterX relatedBy:NSLayoutRelationEqual toItem:window attribute:NSLayoutAttributeCenterX multiplier:1 constant:0.0];
    
    [window addConstraint:contrains];
    
    contrains=[NSLayoutConstraint constraintWithItem:view attribute:NSLayoutAttributeBottom relatedBy:NSLayoutRelationEqual toItem:window attribute:NSLayoutAttributeBottom multiplier:1 constant:-20.0];
    [window addConstraint:contrains];
    
    contrains=[NSLayoutConstraint constraintWithItem:view attribute:NSLayoutAttributeWidth relatedBy:NSLayoutRelationEqual toItem:nil attribute:NSLayoutAttributeNotAnAttribute multiplier:1 constant:280.0];
    [window addConstraint:contrains];
    
    
    UILabel *messageLabel=[[UILabel alloc] init];
    messageLabel.text=aMessage;
    messageLabel.numberOfLines=0;
    messageLabel.lineBreakMode=NSLineBreakByWordWrapping;
    messageLabel.font=[UIFont fontWithName:@"AppleSDGothicNeo-Regular" size:14.0];
    messageLabel.textColor=[UIColor whiteColor];
    messageLabel.textAlignment=NSTextAlignmentCenter;
    [view addSubview:messageLabel];
    
    [messageLabel setTranslatesAutoresizingMaskIntoConstraints:NO];
    
    contrains=[NSLayoutConstraint constraintWithItem:messageLabel attribute:NSLayoutAttributeCenterX relatedBy:NSLayoutRelationEqual toItem:view attribute:NSLayoutAttributeCenterX multiplier:1 constant:0.0];
    [view addConstraint:contrains];
    contrains=[NSLayoutConstraint constraintWithItem:messageLabel attribute:NSLayoutAttributeCenterY relatedBy:NSLayoutRelationEqual toItem:view attribute:NSLayoutAttributeCenterY multiplier:1 constant:0.0];
    [view addConstraint:contrains];
    contrains=[NSLayoutConstraint constraintWithItem:messageLabel attribute:NSLayoutAttributeWidth relatedBy:NSLayoutRelationEqual toItem:nil attribute:NSLayoutAttributeNotAnAttribute multiplier:1 constant:260.0];
    [view addConstraint:contrains];
    
    contrains=[NSLayoutConstraint constraintWithItem:messageLabel attribute:NSLayoutAttributeHeight relatedBy:NSLayoutRelationEqual toItem:view attribute:NSLayoutAttributeHeight multiplier:0.4 constant:0.0];
    [view addConstraint:contrains];
    
    view.alpha=0;
    [UIView animateWithDuration:0.8
                     animations:^{view.alpha = 1.0;}
                     completion:nil];
    
    [self performSelector:@selector(hideToast:) withObject:view afterDelay:2];

    }
    
}

+(void)showToastWithMessageFromTop:(NSString *)aMessage forDuration:(CGFloat)aDuration{
    
    if (aDuration==0) {
        aDuration=3;
    }
    
    UIWindow *window=[[UIApplication sharedApplication] keyWindow];
    if ([window viewWithTag:420]==nil) {
        
        UIView * view=[[UIView alloc] init];
        [window addSubview:view];
        view.tag=420;
        [view setTranslatesAutoresizingMaskIntoConstraints:NO];
        view.layer.cornerRadius=3;
        view.backgroundColor=[UIColor colorWithRed:0.0 green:0.0 blue:0.0 alpha:0.8];
        
        NSLayoutConstraint *contrains=[NSLayoutConstraint constraintWithItem:view attribute:NSLayoutAttributeCenterX relatedBy:NSLayoutRelationEqual toItem:window attribute:NSLayoutAttributeCenterX multiplier:1 constant:0.0];
        
        [window addConstraint:contrains];
        
        contrains=[NSLayoutConstraint constraintWithItem:view attribute:NSLayoutAttributeTop relatedBy:NSLayoutRelationEqual toItem:window attribute:NSLayoutAttributeTop multiplier:1 constant:50.0];
        [window addConstraint:contrains];
        
        contrains=[NSLayoutConstraint constraintWithItem:view attribute:NSLayoutAttributeWidth relatedBy:NSLayoutRelationEqual toItem:nil attribute:NSLayoutAttributeNotAnAttribute multiplier:1 constant:280.0];
        [window addConstraint:contrains];
        
        
        UILabel *messageLabel=[[UILabel alloc] init];
        messageLabel.text=aMessage;
        messageLabel.numberOfLines=0;
        messageLabel.lineBreakMode=NSLineBreakByWordWrapping;
        messageLabel.font=[UIFont fontWithName:@"AppleSDGothicNeo-Regular" size:14.0];
        messageLabel.textColor=[UIColor whiteColor];
        messageLabel.textAlignment=NSTextAlignmentCenter;
        [view addSubview:messageLabel];
        
        [messageLabel setTranslatesAutoresizingMaskIntoConstraints:NO];
        
        contrains=[NSLayoutConstraint constraintWithItem:messageLabel attribute:NSLayoutAttributeCenterX relatedBy:NSLayoutRelationEqual toItem:view attribute:NSLayoutAttributeCenterX multiplier:1 constant:0.0];
        [view addConstraint:contrains];
        contrains=[NSLayoutConstraint constraintWithItem:messageLabel attribute:NSLayoutAttributeCenterY relatedBy:NSLayoutRelationEqual toItem:view attribute:NSLayoutAttributeCenterY multiplier:1 constant:0.0];
        [view addConstraint:contrains];
        contrains=[NSLayoutConstraint constraintWithItem:messageLabel attribute:NSLayoutAttributeWidth relatedBy:NSLayoutRelationEqual toItem:nil attribute:NSLayoutAttributeNotAnAttribute multiplier:1 constant:260.0];
        [view addConstraint:contrains];
        
        contrains=[NSLayoutConstraint constraintWithItem:messageLabel attribute:NSLayoutAttributeHeight relatedBy:NSLayoutRelationEqual toItem:view attribute:NSLayoutAttributeHeight multiplier:0.4 constant:0.0];
        [view addConstraint:contrains];
        
        view.alpha=0;
        [UIView animateWithDuration:0.8
                         animations:^{view.alpha = 1.0;}
                         completion:nil];
        
        [self performSelector:@selector(hideToast:) withObject:view afterDelay:aDuration];
        
    }
    
}
/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect
{
    // Drawing code
}
*/

@end
