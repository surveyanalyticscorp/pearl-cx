//  Created by Nehal Sanklecha on 9/9/20.
//  Copyright © 2020 QuestionPro. All rights reserved.
//

#import "MobileCX_Library.h"
#import "GMDCircleLoader.h"
#import "NetworkManager.h"

@interface MobileCX_Library()<UIAlertViewDelegate,UIWebViewDelegate>

@property (nonatomic, strong)UIWindow *iBaseWindow;
@property (nonatomic, strong)UIView *iView;
@property (nonatomic, strong)UIWebView *iWebView;
@property (nonatomic, strong)NSString *iResponseURL;
@property (nonatomic, strong)NSString *iPopupMenuTitle;
@property (nonatomic, strong)NSString *iPopupMenuMessage;
@property (nonatomic, strong)NSString *iPopupMenuRightButtonTitle;
@property (nonatomic, strong)NSString *iPopupMenuLeftButtonTitle;
@property (nonatomic, assign)BOOL iPopUpViewFlag;
@property (nonatomic, assign, getter=isPresentViewFlag)BOOL iPresentViewFlag;
@property (nonatomic, strong)NSNumber *iTouchPointName;
@property (nonatomic, strong)NSString *iMobileCXApiKey ,*iCurrentViewName;
@end

@implementation MobileCX_Library

-(instancetype)initwithAPIKey:(NSString*)apiKey withWindow:(UIWindow*)aWindow {
    
    static MobileCX_Library *sharedManager = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedManager = [super init];
        self.iMobileCXApiKey =apiKey;
        self.iBaseWindow = aWindow;
        self.iCurrentViewName = @"";
    });
    return sharedManager;
}

-(void)getSurveyURL:(NSString*)surveyId completionHandler:(void(^)(NSString*, NSError*))callback{
    [NetworkManager invokeServiceWithSurveyID: surveyId
                                   withAPIKey: self.iMobileCXApiKey
                            completionHandler: callback];
}


-(void)showInAppSurvey:(NSString*)surveyId withSuperView:(UIView*)appSuperview {
    
    [self getSurveyURL:surveyId completionHandler:^(NSString *surveyUrl, NSError *error) {
#if Debug
        NSLog(@"Failed to load with error :%@",[error debugDescription]);
#endif
        if(error != nil) {
            return;
        }
        CGRect rect = [UIApplication sharedApplication].keyWindow.frame;
        CGRect screenRect = [[UIScreen mainScreen] bounds];
        rect.origin.x = 0;
        rect.origin.y = 0;
        rect.size.width = screenRect.size.width;
        rect.size.height = screenRect.size.height;

        self.iView = [[UIView alloc]initWithFrame:rect];
        self.iView.backgroundColor = [[UIColor grayColor] colorWithAlphaComponent:0.6];
        
        UIView *frontView = [[UIView alloc]init];
            frontView.frame = CGRectMake(30, self.iView.frame.size.height/4, self.iView.frame.size.width-60, self.iView.frame.size.height/2);

        frontView.backgroundColor = [UIColor whiteColor];
        
        self.iWebView=[[UIWebView alloc]initWithFrame:CGRectMake(00,16, frontView.frame.size.width, frontView.frame.size.height-16)];
        self.iWebView.delegate=self;
        NSURL *nsurl=[NSURL URLWithString: surveyUrl];
        NSURLRequest *nsrequest=[NSURLRequest requestWithURL:nsurl];
        [self.iWebView setBackgroundColor:[UIColor clearColor]];
        [self.iWebView loadRequest:nsrequest];
        [frontView addSubview:self.iWebView];
        
        [self.iView addSubview:frontView];
        [appSuperview addSubview:self.iView];
        [appSuperview bringSubviewToFront:self.iView];
        
        UIButton *doneButton = [UIButton buttonWithType: UIButtonTypeCustom];
        [doneButton addTarget:self action:@selector(aDismissWebview:) forControlEvents:UIControlEventTouchUpInside];
        
        NSBundle *bundle = [NSBundle bundleForClass:[self class]];
        UIImage *closeButtonImage = [UIImage imageNamed: @"close-button_2" inBundle: bundle compatibleWithTraitCollection: nil];
        
        [doneButton setBackgroundImage:closeButtonImage forState:UIControlStateNormal];
        [doneButton setBackgroundColor:[UIColor clearColor]];
        doneButton.layer.cornerRadius = doneButton.bounds.size.width/2;
        doneButton.frame = CGRectMake(self.iView.frame.size.width-80, -10, 30, 30);
        [frontView addSubview:doneButton];
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
    if (self.iView) {
        [self.iView removeFromSuperview];
    }
}

-(void)currentViewLoaded {
    self.iPresentViewFlag = TRUE;
}

-(void)currentViewUnLoaded {
    self.iPresentViewFlag = FALSE;
}

@end
