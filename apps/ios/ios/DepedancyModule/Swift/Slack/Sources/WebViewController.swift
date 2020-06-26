//
//  WebView.swift
//  OAuthSwift
//
//  Created by Dongri Jin on 2/11/15.
//  Copyright (c) 2015 Dongri Jin. All rights reserved.
//

//import OAuthSwift

#if os(iOS)
    import UIKit
    typealias WebView = UIWebView // WKWebView
#elseif os(OSX)
    import AppKit
    import WebKit
    typealias WebView = WKWebView
#endif
let kSlackUserAgent = "Mozilla/5.0 Google"
let kGlobalUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 8_0_2 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12A366 Safari/600.1."

class WebViewController: OAuthWebViewController {

    var targetURL : NSURL = NSURL()
    let webView : WebView = WebView()
    let navigationBar = UIView()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        #if os(iOS)
            self.setNavigationBar()
            // uncomment this line if you want slack login page webview in full screen mode.
//            self.webView.frame = UIScreen.mainScreen().bounds
            self.webView.frame = CGRect(x: 0, y:self.navigationBar.frame.height, width: self.view.frame.width, height : self.view.frame.height - self.navigationBar.frame.height )
            self.webView.scalesPageToFit = true
            self.webView.delegate = self
            self.view.addSubview(self.webView)
            // appended user agent value to allow google signin from slack login page.
            UserDefaults.standard.register(defaults: ["UserAgent": kSlackUserAgent + kGlobalUserAgent])
            loadAddressURL()
        #elseif os(OSX)
            
            self.webView.frame = self.view.bounds
            self.webView.navigationDelegate = self
            self.webView.translatesAutoresizingMaskIntoConstraints = false
            self.view.addSubview(self.webView)
            self.view.addConstraints(NSLayoutConstraint.constraintsWithVisualFormat("|-0-[view]-0-|", options: NSLayoutFormatOptions(rawValue: 0), metrics: nil, views: ["view":self.webView]))
            self.view.addConstraints(NSLayoutConstraint.constraintsWithVisualFormat("V:|-0-[view]-0-|", options: NSLayoutFormatOptions(rawValue: 0), metrics: nil, views: ["view":self.webView]))
        #endif
    }

    @objc func backButtonAction(sender: UIButton!) {
        UserDefaults.standard.register(defaults: ["UserAgent": kGlobalUserAgent])
        self.dismissWebViewController()
    }
    
    override func handle(_ url: URL) {
        targetURL = url as NSURL
        super.handle(url)
        self.loadAddressURL()
    }

    func loadAddressURL() {
        let req = URLRequest(url: targetURL as URL)
        #if os(iOS)
            self.webView.loadRequest(req)
        #elseif os(OSX)
            self.webView.load(req)
        #endif
    }

    
    func setNavigationBar() {
        navigationBar.frame = CGRect(x: 0, y : 14, width : self.view.frame.size.width, height : 44); // Offset by 20 pixels vertically to take the status bar into account
        navigationBar.backgroundColor = UIColor.white
        
        let leftButton = UIButton(type: .system) // let preferred over var here
        leftButton.frame = CGRect(x: 10, y : 00, width : 40,  height : 40)
        var leftImage = UIImage(named:"back-icon@2x.ios")
        leftImage = leftImage?.withRenderingMode(UIImageRenderingMode.alwaysOriginal)
        leftButton.setImage(leftImage, for: UIControlState.normal)
        
//        leftButton.setTitle("Back", forState: UIControlState.Normal)
        leftButton.addTarget(self, action:#selector(backButtonAction(sender:)), for: UIControlEvents.touchUpInside)
        navigationBar.addSubview(leftButton)
        // Make the navigation bar a subview of the current view controller
        self.view.addSubview(navigationBar)
    }
}

// MARK: delegate
#if os(iOS)
    extension WebViewController: UIWebViewDelegate {
        func webView(_ webView: UIWebView, shouldStartLoadWith request: URLRequest, navigationType: UIWebViewNavigationType) -> Bool {
            
            let urlRequest = request.url
            if (urlRequest?.absoluteString.lowercased().range(of: "code=")  != nil) && (urlRequest?.host?.contains("questionpro.com"))!{
                if let url = request.url,
                    let urlComponents = URLComponents(url: url, resolvingAgainstBaseURL: false){
                    let codeParameter = urlComponents.queryItems?.filter({ $0.name == "code" }).first
                    print(codeParameter?.value ?? "")
                    OAuth2Swift.handle(url: url)
                }
                UserDefaults.standard.register(defaults: ["UserAgent": kGlobalUserAgent])
                self.dismissWebViewController()
                
            }
            
            if let url = request.url, (url.scheme == "code=") {
                // Call here AppDelegate.sharedInstance.applicationHandleOpenURL(url) if necessary ie. if AppDelegate not configured to handle URL scheme
                // compare the url with your own custom provided one in `authorizeWithCallbackURL`
              //  self.dismissWebViewController()
            }
            return true
        }
    }

#elseif os(OSX)
    extension WebViewController: WKNavigationDelegate {
        
        func webView(webView: WKWebView, decidePolicyForNavigationAction navigationAction: WKNavigationAction, decisionHandler: (WKNavigationActionPolicy) -> Void) {
            
            // here we handle internally the callback url and call method that call handleOpenURL (not app scheme used)
            if let url = navigationAction.request.URL, url.scheme == "oauth-swift" {
                AppDelegate.sharedInstance.applicationHandleOpenURL(url)
                decisionHandler(.Cancel)
                
                self.dismissWebViewController()
                return
            }
            
            decisionHandler(.Allow)
        }
        
        /* override func  webView(webView: WebView!, decidePolicyForNavigationAction actionInformation: [NSObject : AnyObject]!, request: NSURLRequest!, frame: WebFrame!, decisionListener listener: WebPolicyDecisionListener!) {
        
        if request.URL?.scheme == "oauth-swift" {
        self.dismissWebViewController()
        }
        
        } */
    }
#endif
