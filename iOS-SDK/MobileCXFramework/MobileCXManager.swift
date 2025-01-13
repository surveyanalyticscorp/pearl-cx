//
//  TouchPoint.swift
//  MobileCXFramework
//
//  Created by Prasad on 30/07/24.
//

import Foundation
import UIKit
import WebKit

public class QuestionProCXManager: NSObject, UIAlertViewDelegate, CXServiceDelegate, WKNavigationDelegate {
    public func CXServiceResponse(withURL response: [String : Any]) {
        print("CXServiceResponse", response);
        if let _ = response[ksurveyURL] {
            print("URL found");
            if let responseURL = response[ksurveyURL] as? String, !responseURL.isEmpty, responseURL != "Empty" {
                self.iResponseURL = responseURL
                let strUserDefaultKey = "\(self.iTouchPointName ?? 0)\(self.iCurrentViewName)"
                if !self.iPresentViewFlag {
                    GlobalDataCX.addValueToUserDefault(response, forKey: strUserDefaultKey)
                } else {
                    DispatchQueue.main.async {
                        self.showMessageInViewControllerWithResponse(responseInfo: response)
                    }
                    
                }
            }
        } else if let error = response["error"] as? [String: Any] {
            // Extract error message
            let errorMessage = error["message"] as? String ?? "Unknown error"
            // Present the alert (requires a view controller)
            DispatchQueue.main.async {
                if let topController = UIApplication.shared.windows[0].rootViewController {
                    // Show alert
                    let alert = UIAlertController(title: "", message: errorMessage, preferredStyle: .alert)
                    alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                    topController.present(alert, animated: true, completion: nil)
                }
            }
        }
    }
    
    public var iBaseWindow: UIWindow?
    public var iView: UIView?
    public var iWebView: WKWebView?
    public var iResponseURL: String?
    public var iPopupMenuTitle: String?
    public var iPopupMenuMessage: String?
    public var iPopupMenuRightButtonTitle: String?
    public var iPopupMenuLeftButtonTitle: String?
    public var iPopUpViewFlag: Bool = false
    public var iPresentViewFlag: Bool = false
    public var iTouchPointName: Int?
    public var iApiKey: String?
    public var iCurrentViewName: String = ""
    public var iDataCenter: TouchPoint.DataCenter?
    public var touchPoint: TouchPoint?
    
    public override init() {
    }

    public static let sharedManager: QuestionProCXManager = {
        let instance = QuestionProCXManager()
        GlobalDataCX.checkUUIDValueInKeyChain()
        instance.iPopupMenuTitle = "Feedback"
        instance.iPopupMenuMessage = "Would you like to give us some feedback?"
        instance.iPopupMenuRightButtonTitle = "No"
        instance.iPopupMenuLeftButtonTitle = "Yes"
        instance.iPresentViewFlag = true
        instance.iPopUpViewFlag = true
        return instance
    }()

    public func initwithAPIKey(apiKey: String, dataCenter: TouchPoint.DataCenter, withWindow aWindow: UIWindow) {
        self.iApiKey = apiKey
        self.iDataCenter = dataCenter
        self.iBaseWindow = aWindow
        self.iCurrentViewName = ""
    }

    public func touchPointBuilder(touchPointID: Int) -> TouchPoint {
        self.touchPoint?.surveyId = touchPointID
        return self.touchPoint!
    }

    public func launchFeedbackSurvey(touchPoint: TouchPoint) {
        
        GlobalDataCX.addToUserDefault(touchPoint.ShowInDialog, forKey: kisDialog)
        var responseInfo: [String: Any] = [:]
        let key = "\(String(describing: self.iTouchPointName))"
        responseInfo = GlobalDataCX.checkValueInUserDefault(forKey: key)!
        
        if let surveyURL = responseInfo[ksurveyURL] as? String, !surveyURL.isEmpty {
            self.iResponseURL = surveyURL
            showMessageInViewControllerWithResponse(responseInfo: responseInfo)
            GlobalDataCX.deleteUserDefaultValue(forKey: "\(self.iTouchPointName ?? 0)")
        } else {
            let aMobileCXServiceTxManager = MobileCXServiceTxManager()
            self.iTouchPointName = touchPoint.surveyId
            aMobileCXServiceTxManager.iDelegate = self
            aMobileCXServiceTxManager.invokeService(touchPoint: touchPoint, withAPIKey: self.iApiKey!, DataCenter: self.iDataCenter!)
        }
    }

    public func stopQuestionProCXManager() {
        print("Manager stopped..")
    }

    public func setPopupMenuTitle(aTitle: String, message aMessage: String, rightButtonTitle aRightButtonTitle: String, leftButtonTitle aLeftButtonTitle: String) {
        self.iPopupMenuTitle = aTitle
        self.iPopupMenuMessage = aMessage
        self.iPopupMenuRightButtonTitle = aRightButtonTitle
        self.iPopupMenuLeftButtonTitle = aLeftButtonTitle
    }

    public func showMessageInViewControllerWithResponse(responseInfo: [String: Any]) {
        var popUpFlag = false
        let isDialog = GlobalDataCX.getValueFromUserDefault("\(kisDialog)")
        popUpFlag = isDialog == 1

        DispatchQueue.main.async {
            var rect = UIApplication.shared.keyWindow?.frame ?? CGRect.zero
            rect.origin.x = 0
            rect.origin.y = 0
            self.iView = UIView(frame: rect)
            self.iView?.backgroundColor = UIColor.black.withAlphaComponent(0.6)
            let frontView = UIView()
            if popUpFlag {
                frontView.frame = CGRect(x: 0, y: 70, width: self.iView!.frame.size.width, height: self.iView!.frame.size.height)
            } else {
                frontView.frame = CGRect(x: 0, y: 70, width: self.iView!.frame.size.width, height: self.iView!.frame.size.height)
            }
            frontView.backgroundColor = UIColor(red: 27/255.0, green: 51/255.0, blue: 128/255.0, alpha: 1.0)
            self.iWebView = WKWebView(frame: CGRect(x: 0, y: 50, width: frontView.frame.size.width, height: frontView.frame.size.height - 120))
            self.iWebView?.navigationDelegate = self
            if let url = self.iResponseURL, let nsurl = URL(string: url) {
                let nsrequest = URLRequest(url: nsurl)
                self.iWebView?.backgroundColor = UIColor.white
                self.iWebView?.load(nsrequest)
            }
            frontView.addSubview(self.iWebView!)
            self.iView?.addSubview(frontView)
            self.iBaseWindow?.addSubview(self.iView!)
            self.iBaseWindow?.bringSubviewToFront(self.iView!)
            let doneButton = UIButton(type: .custom)
            doneButton.addTarget(self, action: #selector(self.aDismissWebview(_:)), for: .touchUpInside)

            let headerView = UIView(frame: CGRect(x: 0, y: 10, width: frontView.frame.size.width - 50, height: 80))
            let hedearTextView = UITextView(frame: CGRect(x: 10, y: 10, width: frontView.frame.size.width - 50, height: 50))
            hedearTextView.backgroundColor = UIColor.clear
            hedearTextView.textAlignment = .left
            hedearTextView.textColor = UIColor.white
            
            let headerText = "Powered by QuestionPro";
            let boldText = (headerText as NSString).range(of: "QuestionPro")
            let plainText = (headerText as NSString).range(of: "Powered by")
            let attributedString = NSMutableAttributedString(string: headerText)
            
            
            if let regularFontURL = Bundle.main.url(forResource: "FiraSans-Regular", withExtension: "ttf") {
                CTFontManagerRegisterFontsForURL(regularFontURL as CFURL, .process, nil);
            } 
            
            if let boldFontURL = Bundle.main.url(forResource: "FiraSans-Bold", withExtension: "ttf") {
                CTFontManagerRegisterFontsForURL(boldFontURL as CFURL, .process, nil)
            }
            
            if let regularFont = UIFont(name: "FiraSans-Regular", size: 16.0) {
                attributedString.addAttribute(.font, value: regularFont, range: plainText)
            }
        
            if let boldFont = UIFont(name: "FiraSans-Bold", size: 16.0) {
                attributedString.addAttribute(.font, value: boldFont, range: boldText)
            }
//            attributedString.addAttribute(.font, value: UIFont.boldSystemFont(ofSize: 16.0), range: boldText)
//            attributedString.addAttribute(.font, value: UIFont.systemFont(ofSize: 16.0), range: plainText)
            attributedString.addAttribute(.foregroundColor, value: UIColor.white, range: NSRange(location: 0, length: attributedString.length))
            hedearTextView.attributedText = attributedString
            
            frontView.addSubview(headerView)
            frontView.addSubview(hedearTextView)
            
            let closeButtonImage = UIImage(systemName: "xmark",
                                           withConfiguration: UIImage.SymbolConfiguration(pointSize: 16, weight: .bold))
            doneButton.setImage(closeButtonImage, for: .normal)
            doneButton.tintColor = UIColor.white
            doneButton.layer.cornerRadius = doneButton.bounds.size.width / 2
            if popUpFlag {
                doneButton.frame = CGRect(x: self.iView!.frame.size.width - 80, y: 10, width: 20, height: 20)
            } else {
                doneButton.frame = CGRect(x: self.iView!.frame.size.width - 40, y: 15, width: 20, height: 20)
            }
            
            frontView.addSubview(doneButton)
        }
        
    }

    public func showInAppSurvey(surveyUrl: String, withSuperView appSuperview: UIView) {
        var rect = UIApplication.shared.keyWindow?.frame ?? CGRect.zero
        let screenRect = UIScreen.main.bounds
        rect.origin.x = 0
        rect.origin.y = 0
        rect.size.width = screenRect.size.width
        rect.size.height = screenRect.size.height

        self.iView = UIView(frame: rect)
        self.iView?.backgroundColor = UIColor.gray.withAlphaComponent(0.6)

        let frontView = UIView(frame: CGRect(x: 30, y: 70, width: self.iView!.frame.size.width - 60, height: self.iView!.frame.size.height - 140))
        frontView.backgroundColor = UIColor.white

        self.iWebView = WKWebView(frame: CGRect(x: 0, y: 20, width: frontView.frame.size.width, height: frontView.frame.size.height - 20))
        self.iWebView?.navigationDelegate = self
        if let nsurl = URL(string: surveyUrl) {
            let nsrequest = URLRequest(url: nsurl)
            self.iWebView?.backgroundColor = UIColor.clear
            self.iWebView?.load(nsrequest)
        }
        frontView.addSubview(self.iWebView!)

        self.iView?.addSubview(frontView)
        appSuperview.addSubview(self.iView!)
        appSuperview.bringSubviewToFront(self.iView!)

        let doneButton = UIButton(type: .custom)
        doneButton.addTarget(self, action: #selector(aDismissWebview(_:)), for: .touchUpInside)

        let closeButtonImage = UIImage(systemName: "xmark",
                                       withConfiguration: UIImage.SymbolConfiguration(pointSize: 16, weight: .bold))
        doneButton.setImage(closeButtonImage, for: .normal)
        doneButton.tintColor = UIColor.white
        doneButton.layer.cornerRadius = doneButton.bounds.size.width / 2
        doneButton.frame = CGRect(x: self.iView!.frame.size.width - 80, y: -10, width: 25, height: 25)
        frontView.addSubview(doneButton)
    }
    
    public func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        if let url = navigationAction.request.url {
            if url.absoluteString.contains("#autoClose") {
                perform(#selector(aDismissWebview(_:)), with: self, afterDelay: 4.0)
            }
        }
        decisionHandler(.allow)
    }
    
    public func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        print("Web view did start loading")
        GMDCircleLoader.setOnView(self.iWebView!, withTitle: "Loading...", animated: true)
        let url = webView.url
        print("##### url = \(url?.absoluteString ?? "")")
        if (url?.absoluteString.range(of: "#autoClose")) != nil {
            perform(#selector(aDismissWebview(_:)), with: self, afterDelay: 4.0)
        }
    }

        // WKNavigationDelegate method for when navigation finishes
    public func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            print("Web view did finish loading")
        GMDCircleLoader.hideFromView(self.iWebView!, animated: true)
        }

        // WKNavigationDelegate method for when navigation fails
    public func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        print("Failed to load with error: \(error.localizedDescription)")
        GMDCircleLoader.hideFromView(self.iWebView!, animated: true)
    }

    @objc func aDismissWebview(_ sender: Any) {
        self.iView?.removeFromSuperview()
    }

    public func currentViewLoaded() {
        self.iPresentViewFlag = true
    }

    public func currentViewUnLoaded() {
        self.iPresentViewFlag = false
    }
}


