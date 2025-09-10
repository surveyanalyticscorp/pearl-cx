//
//  TouchPoint.swift
//  MobileCXFramework
//
//  Created by Prasad on 30/07/24.
//

import Foundation
import UIKit
import WebKit

@MainActor
public class QuestionProCXManager: NSObject, UIAlertViewDelegate, CXServiceDelegate, WKNavigationDelegate, WKScriptMessageHandler {
    
    var currentTouchPoint = TouchPoint()
    public func apiSuccess(withURL response: [String: Any]) {
        if let _ = response[ksurveyURL] {
            if let responseURL = response[ksurveyURL] as? String, !responseURL.isEmpty, responseURL != "Empty" {
                let responseCopy = response
                DispatchQueue.main.async { [weak self] in
                    guard let self = self else { return }
                    self.iResponseURL = responseURL
                    let strUserDefaultKey = "\(self.iTouchPointName ?? 0)\(self.iCurrentViewName)"
                    let showInDialog = self.currentTouchPoint.ShowInDialog
                    if showInDialog {
                        self.showInAppSurvey(touchPoint: self.currentTouchPoint)
                    } else {
                        self.showMessageInViewControllerWithResponse(touchPoint: self.currentTouchPoint)
                    }
                    
                    self.launchSurveyOnApiSuccess(withURL: response)
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
                    alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { _ in self.errorAPIHandler() }))
                    topController.present(alert, animated: true, completion: nil)
                }
            }
        }
    }
    
    @MainActor private func launchSurveyOnApiSuccess(withURL response: [String: Any]) {
        if let _ = response[ksurveyURL] {
            if let responseURL = response[ksurveyURL] as? String, !responseURL.isEmpty, responseURL != "Empty" {
                let responseCopy = response // Create a copy of the response
                DispatchQueue.main.async { [weak self] in
                    guard let self = self else { return }
                    self.iResponseURL = responseURL
                    let strUserDefaultKey = "\(self.iTouchPointName ?? 0)\(self.iCurrentViewName)"
                    if !self.iPresentViewFlag {
                        GlobalDataCX.addValueToUserDefault(responseCopy, forKey: strUserDefaultKey)
                    } else {
                        if let url = self.iResponseURL, let nsurl = URL(string: url) {
                            let nsrequest = URLRequest(url: nsurl)
                            self.iWebView?.backgroundColor = UIColor.white
                            self.iWebView?.load(nsrequest)
                        }
                    }
                }
            }
        } else {
            guard let error = response["error"] as? [String: Any] else { return }
            
            let errorMessage = error["message"] as? String ?? "Unknown error"
            showApiErrorAlert(errorMessage: errorMessage)
        }
    }
    
    public func apiFailure(response: String) {
        
    }
    
    public func showApiError(message: String) {
        self.showApiErrorAlert(errorMessage: message)
    }
    
    func showApiErrorAlert(errorMessage: String) {
        DispatchQueue.main.async {
            if let topController = UIApplication.shared.windows.first?.rootViewController {
                let alert = UIAlertController(title: "", message: errorMessage, preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in
                    self.errorAPIHandler()
                })
                topController.present(alert, animated: true, completion: nil)
            }
        }
    }
    
    public func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "callbackHandler" {
            if let messageBody = message.body as? String {
                openInSafari(urlString: messageBody)
            }
        }
    }
    
    func openInSafari(urlString: String) {
        print("opening in safari \(urlString)")
        if let url = URL(string: urlString), UIApplication.shared.canOpenURL(url) {
            UIApplication.shared.open(url, options: [:], completionHandler: nil)
        } else {
            print("Invalid URL or Safari cannot open it.")
        }
    }
    
    let backButton = UIButton(type: .custom)
    
    func errorAPIHandler() {
        perform(#selector(self.aDismissWebview(_:)), with: self, afterDelay: 0)
    }
    
    private var iBaseWindow: UIWindow?
    private var iView: UIView?
    @MainActor
    private var iWebView: WKWebView?
    @MainActor
    private var iResponseURL: String?
    private var iPopupMenuTitle: String?
    private var iPopupMenuMessage: String?
    private var iPopupMenuRightButtonTitle: String?
    private var iPopupMenuLeftButtonTitle: String?
    private var iPopUpViewFlag: Bool = false
    @MainActor
    private var iPresentViewFlag: Bool = false
    @MainActor
    private var iTouchPointName: Int?
    private var iApiKey: String?
    @MainActor
    private var iCurrentViewName: String = ""
    private var iDataCenter: TouchPoint.DataCenter?
    private var touchPoint: TouchPoint?
    
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
    
    public func launchFeedbackSurvey(touchPoint: TouchPoint) {
        currentTouchPoint = touchPoint
        self.getAPIResponse(touchPoint: touchPoint)
    }
    
    private func closeSurveyWindow() {
        self.dismissSurveyPopup()
    }
    
    private func getAPIResponse (touchPoint: TouchPoint) {
        var responseInfo: [String: Any] = [:]
        let key = "\(String(describing: self.iTouchPointName))"
        responseInfo = GlobalDataCX.checkValueInUserDefault(forKey: key)!
        if let surveyURL = responseInfo[ksurveyURL] as? String, !surveyURL.isEmpty {
            self.iResponseURL = surveyURL
            GlobalDataCX.deleteUserDefaultValue(forKey: "\(self.iTouchPointName ?? 0)")
        } else {
            let aMobileCXServiceTxManager = MobileCXServiceTxManager()
            self.iTouchPointName = touchPoint.surveyId
            aMobileCXServiceTxManager.iDelegate = self
            aMobileCXServiceTxManager.invokeService(touchPoint: touchPoint, withAPIKey: self.iApiKey!, dataCenter: self.iDataCenter!)
        }
    }
    
    private func showMessageInViewControllerWithResponse(touchPoint: TouchPoint) {
        DispatchQueue.main.async {
            var rect = UIApplication.shared.keyWindow?.frame ?? CGRect.zero
            rect.origin.x = 0
            rect.origin.y = 0
            self.iView = UIView(frame: rect)
            self.iView?.backgroundColor = UIColor.black.withAlphaComponent(0.6)
            let frontView = UIView()
            frontView.frame = CGRect(x: 0, y: 70, width: self.iView!.frame.size.width, height: self.iView!.frame.size.height)
            frontView.backgroundColor = UIColor(red: 255/255.0, green: 255/255.0, blue: 255/255.0, alpha: 1.0)
            
            let preferences = WKPreferences()
            let configuration = WKWebViewConfiguration()
            if #available(iOS 14.0, *) {
                let webpagePreferences = WKWebpagePreferences()
                webpagePreferences.allowsContentJavaScript = true
                configuration.defaultWebpagePreferences = webpagePreferences
            } else {
                preferences.javaScriptEnabled = true
                configuration.preferences = preferences
            }
            let contentController = WKUserContentController()
            contentController.add(self, name: "callbackHandler")
            configuration.userContentController = contentController
            self.iWebView = WKWebView(frame: CGRect(x: 0, y: 30, width: frontView.frame.size.width, height: frontView.frame.size.height - 20), configuration: configuration)
            self.iWebView?.navigationDelegate = self
            self.iWebView?.allowsLinkPreview = false
            
            frontView.addSubview(self.iWebView!)
            self.iView?.addSubview(frontView)
            self.iBaseWindow?.addSubview(self.iView!)
            self.iBaseWindow?.bringSubviewToFront(self.iView!)
            let doneButton = UIButton(type: .custom)
            doneButton.addTarget(self, action: #selector(self.aDismissWebview(_:)), for: .touchUpInside)
            let headerView = UIView(frame: CGRect(x: 0, y: 0, width: frontView.frame.size.width, height: 40))
            if (touchPoint.themeColor != ""){
                if let color = UIColor(hex: touchPoint.themeColor!) {
                    headerView.backgroundColor = color
                }
            } else {
                headerView.backgroundColor = UIColor.white
            }
            frontView.addSubview(headerView)
            
            let closeButtonImage = UIImage(systemName: "xmark",
                                           withConfiguration: UIImage.SymbolConfiguration(pointSize: 16, weight: .bold))
            doneButton.setImage(closeButtonImage, for: .normal)
            doneButton.tintColor = UIColor(red: 27/255.0, green: 51/255.0, blue: 128/255.0, alpha: 1.0)
            doneButton.layer.cornerRadius = doneButton.bounds.size.width / 2
            doneButton.frame = CGRect(x: self.iView!.frame.size.width - 40, y: 15, width: 20, height: 20)
            frontView.addSubview(doneButton)
            
            self.backButton.addTarget(self, action: #selector(self.goToPreviousPage(_:)), for: .touchUpInside)
            let backButtonImage = UIImage(systemName: "chevron.backward",
                                          withConfiguration: UIImage.SymbolConfiguration(pointSize: 16, weight: .bold))
            self.backButton.setImage(backButtonImage, for: .normal)
            self.backButton.tintColor = UIColor(red: 27/255.0, green: 51/255.0, blue: 128/255.0, alpha: 1.0)
            self.backButton.layer.cornerRadius = self.backButton.bounds.size.width / 2
            self.backButton.frame = CGRect(x: 20, y: 6, width: 20, height: 20)
            self.backButton.isHidden = true
            frontView.addSubview(self.backButton)
        }
    }
    
    private func showInAppSurvey(touchPoint: TouchPoint) {
        DispatchQueue.main.async {
            var rect = UIApplication.shared.keyWindow?.frame ?? CGRect.zero
            let screenRect = UIScreen.main.bounds
            rect.origin.x = 0
            rect.origin.y = 0
            rect.size.width = screenRect.size.width
            rect.size.height = screenRect.size.height
            
            self.iView = UIView(frame: rect)
            self.iView?.backgroundColor = UIColor.gray.withAlphaComponent(0.6)
            
            let frontView = UIView(frame: CGRect(x: Int(screenRect.size.width * 0.1), y: Int(screenRect.size.height * 0.15), width: Int(screenRect.size.width * 0.8), height: Int(screenRect.size.height * 0.7)))
            frontView.backgroundColor = UIColor.white
            
            let preferences = WKPreferences()
            let configuration = WKWebViewConfiguration()
            if #available(iOS 14.0, *) {
                let webpagePreferences = WKWebpagePreferences()
                webpagePreferences.allowsContentJavaScript = true
                configuration.defaultWebpagePreferences = webpagePreferences
            } else {
                preferences.javaScriptEnabled = true
                configuration.preferences = preferences
            }
            let contentController = WKUserContentController()
            contentController.add(self, name: "callbackHandler")
            configuration.userContentController = contentController
            self.iWebView = WKWebView(frame: CGRect(x: 0, y: 30, width: frontView.frame.size.width, height: frontView.frame.size.height - 20), configuration: configuration)
            self.iWebView?.navigationDelegate = self
            self.iWebView?.allowsLinkPreview = false
            
            frontView.addSubview(self.iWebView!)
            
            self.iView?.addSubview(frontView)
            self.iBaseWindow?.addSubview(self.iView!)
            self.iBaseWindow?.bringSubviewToFront(self.iView!)
            let headerView = UIView(frame: CGRect(x: 0, y: 0, width: frontView.frame.size.width, height: 40))
            if (touchPoint.themeColor != ""){
                if let color = UIColor(hex: touchPoint.themeColor!) {
                    headerView.backgroundColor = color
                }
            } else {
                headerView.backgroundColor = UIColor.white
            }
            frontView.addSubview(headerView)
            let doneButton = UIButton(type: .custom)
            doneButton.addTarget(self, action: #selector(self.aDismissWebview(_:)), for: .touchUpInside)
            
            let closeButtonImage = UIImage(systemName: "xmark",
                                           withConfiguration: UIImage.SymbolConfiguration(pointSize: 16, weight: .bold))
            doneButton.setImage(closeButtonImage, for: .normal)
            doneButton.tintColor = UIColor(red: 27/255.0, green: 51/255.0, blue: 128/255.0, alpha: 1.0)
            doneButton.layer.cornerRadius = doneButton.bounds.size.width / 2
            doneButton.frame = CGRect(x: screenRect.size.width * 0.7, y: 10, width: 25, height: 25)
            frontView.addSubview(doneButton)
            
            self.backButton.addTarget(self, action: #selector(self.goToPreviousPage(_:)), for: .touchUpInside)
            let backButtonImage = UIImage(systemName: "chevron.backward",
                                          withConfiguration: UIImage.SymbolConfiguration(pointSize: 16, weight: .bold))
            self.backButton.setImage(backButtonImage, for: .normal)
            self.backButton.tintColor = UIColor(red: 27/255.0, green: 51/255.0, blue: 128/255.0, alpha: 1.0)
            self.backButton.layer.cornerRadius = self.backButton.bounds.size.width / 2
            self.backButton.frame = CGRect(x: 20, y: 10, width: 25, height: 25)
            self.backButton.isHidden = true
            frontView.addSubview(self.backButton)
        }
    }
    
    @MainActor
    public func webView(_ webView: WKWebView,
                        decidePolicyFor navigationAction: WKNavigationAction,
                        decisionHandler: @escaping @MainActor (WKNavigationActionPolicy) -> Void) {
        
        let url = webView.url
        
//        print(webView.url as Any)
        if (((url?.absoluteString.range(of: "exitsurvey")) != nil) || ((url?.absoluteString.range(of: "#autoClose") != nil))) {
            perform(#selector(aDismissWebview(_:)), with: self, afterDelay: 3.0)
        }
        
        let navigationType = navigationAction.navigationType
        if navigationType == .linkActivated {
            webView.load(navigationAction.request)
            decisionHandler(.cancel)
            self.backButton.isHidden = false
            return
        }
        decisionHandler(.allow)
    }
    
    public func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        GMDCircleLoader.setOnView(self.iWebView!, withTitle: "Please wait.", animated: true)
        let url = webView.url
        if (((url?.absoluteString.range(of: "exitsurvey")) != nil) || ((url?.absoluteString.range(of: "#autoClose") != nil))) {
            perform(#selector(aDismissWebview(_:)), with: self, afterDelay: 1.0)
        }
    }
    
    // WKNavigationDelegate method for when navigation finishes
    public func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
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
    
    @objc func goToPreviousPage(_ sender: Any) {
        self.iWebView?.goBack()
        self.backButton.isHidden = true
    }
    
    private func currentViewLoaded() {
        self.iPresentViewFlag = true
    }
    
    private func currentViewUnLoaded() {
        self.iPresentViewFlag = false
    }
    
    private func dismissSurveyPopup() {
        self.iView?.removeFromSuperview()
    }
}


