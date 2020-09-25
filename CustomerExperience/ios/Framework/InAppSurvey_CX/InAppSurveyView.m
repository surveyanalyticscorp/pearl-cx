//
//  InAppSurveyView.m
//  InAppSurvey_CX
//
//  Created by Nehal on 22/09/20.
//  Copyright © 2020 QuestionPro. All rights reserved.
//

#import "InAppSurveyView.h"
#import "GMDCircleLoader.h"
#import "NetworkManager.h"

@interface InAppSurveyView()<UIAlertViewDelegate,UIWebViewDelegate>

@property (nonatomic, strong)UIWebView *iWebView;
@property (nonatomic, strong)NSString *surveyId;
@property (nonatomic, strong)NSString *apiKey;

@end

@implementation InAppSurveyView

- (instancetype)initWithSurveyId:(NSString *)surveyId
                  apiKey:(NSString *)apiKey {
    self = [super init];
    if (self) {
        self.surveyId = surveyId;
        self.apiKey = apiKey;
    }
    return self;
}

-(void)getSurveyURL:(NSString*)surveyId completionHandler:(void(^)(NSString*, NSError*))callback{
    [NetworkManager invokeServiceWithSurveyID: surveyId
                                   withAPIKey: self.apiKey
                            completionHandler: callback];
}

-(void)showInAppSurvey {
    CGRect rect = [UIApplication sharedApplication].keyWindow.frame;
    CGRect screenRect = [[UIScreen mainScreen] bounds];
    rect.origin.x = 0;
    rect.origin.y = 0;
    rect.size.width = screenRect.size.width;
    rect.size.height = screenRect.size.height;
    [self setUp: rect];
}

-(void) setUp:(CGRect)frame {
      
    [self getSurveyURL:self.surveyId completionHandler:^(NSString *surveyUrl, NSError *error) {
    #if Debug
            NSLog(@"Failed to load with error :%@",[error debugDescription]);
    #endif
            if(error != nil) {
                return;
            }
        
            self.frame = frame;
            self.backgroundColor = [[UIColor grayColor] colorWithAlphaComponent:0.6];
            
            UIView *frontView = [[UIView alloc]init];
                frontView.frame = CGRectMake(30, frame.size.height/4, frame.size.width-60, frame.size.height/2);

            frontView.backgroundColor = [UIColor whiteColor];
            
            self.iWebView=[[UIWebView alloc]initWithFrame:CGRectMake(00,16, frontView.frame.size.width, frontView.frame.size.height-16)];
            self.iWebView.delegate=self;
            NSURL *nsurl=[NSURL URLWithString: surveyUrl];
            NSURLRequest *nsrequest=[NSURLRequest requestWithURL:nsurl];
            [self.iWebView setBackgroundColor:[UIColor clearColor]];
            [self.iWebView loadRequest:nsrequest];
            [frontView addSubview:self.iWebView];
            
            [self addSubview:frontView];
            
            UIButton *doneButton = [UIButton buttonWithType: UIButtonTypeCustom];
            [doneButton addTarget:self action:@selector(aDismissWebview:) forControlEvents:UIControlEventTouchUpInside];
            
            NSBundle *bundle = [NSBundle bundleForClass:[self class]];
            UIImage *closeButtonImage = [UIImage imageNamed: @"close-button_2" inBundle: bundle compatibleWithTraitCollection: nil];
            
            [doneButton setBackgroundImage:closeButtonImage forState:UIControlStateNormal];
            [doneButton setBackgroundColor:[UIColor clearColor]];
            doneButton.layer.cornerRadius = doneButton.bounds.size.width/2;
            doneButton.frame = CGRectMake(frame.size.width-80, -10, 30, 30);
            [frontView addSubview:doneButton];
        UIWindow *window = [UIApplication sharedApplication].keyWindow;
        UIViewController *viewContoller = window.rootViewController;
        [viewContoller.view addSubview: self];
        
        }];
    }

- (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)requestURL navigationType:(UIWebViewNavigationType)navigationType {
    NSURL *url = [requestURL URL];
    NSLog(@"##### url = %@",[url absoluteString]);
    NSRange range = [[url absoluteString] rangeOfString:@"#autoClose"];
    if (range.location != NSNotFound){
        [self performSelector:@selector(aDismissWebview:) withObject:self afterDelay:4.0];
    }
    return YES;
}


- (void)webViewDidStartLoad:(UIWebView *)webView {
    [GMDCircleLoader setOnView:self.iWebView withTitle:@"Loading..." animated:YES];
}

- (void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error {
    NSLog(@"Failed to load with error :%@",[error debugDescription]);
    [GMDCircleLoader hideFromView:self.iWebView animated:YES];
    
}

- (void)webViewDidFinishLoad:(UIWebView *)webView {
    [GMDCircleLoader hideFromView:self.iWebView animated:YES];
}

-(void)aDismissWebview:(id)sender {
    if (self) {
        [self removeFromSuperview];
    }
}

@end
