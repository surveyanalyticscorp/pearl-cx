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
    public func showApiError(message: String) {
        self.showApiErrorAlert(errorMessage: message)
    }
    
    public func apiSuccess(response: String, headers: [String: String]) {
        LogUtils.printMessage(message:"Api call successfull...")

        // Step 1: Decrypt
        self.callback?.decryptData(apiResponse: (response, headers)) { decryptedData in
            LogUtils.printMessage(message: "🔓 Decrypted data: \(decryptedData ?? "nil")")
            // Step 2: Convert string back to dictionary
            if ((decryptedData) != nil) {
                guard
                    let rawData = decryptedData?.data(using: .utf8),
                    let parsedJSON = try? JSONSerialization.jsonObject(with: rawData),
                    let dictionary = parsedJSON as? [String: Any]
                else {
                    LogUtils.printMessage(logTag: LogTag.LOG_ERROR, message: "❌ Failed to re-parse decrypted string into dictionary.")
                    return
                }

                if let url = dictionary["surveyURL"] as? String, !url.isEmpty {
                    LogUtils.printMessage(message: "✅ surveyURL: \(url)")
                    if let response = dictionary["response"] as? [String: Any] {
                        self.launchSurveyOnApiSuccess(withURL: response)
                    }
                } else {
                    self.iView?.removeFromSuperview()
                    LogUtils.printMessage(logTag: LogTag.LOG_ERROR, message: "❌ surveyURL is missing or empty")
                }
            } else {
                LogUtils.printMessage(message:"decryptedData is nil")
            }
        }
    }
    
    public func apiFailure(touchPoint: TouchPoint, apiKey: String, apiBaseUrl: String, port: String, accessToken: String) {
        self.callback?.refreshToken {
            
            [weak self] newToken in
            guard let self = self else { return }

            LogUtils.printMessage(message: "🔁 Refreshed Token: \(newToken ?? "nil")")

            let serviceManager = MobileCXServiceTxManager()
            serviceManager.iDelegate = self

            serviceManager.invokeSeviceForExternalApi(touchPoint: touchPoint, withAPIKey: apiKey,
                                                  apiBaseUrl: apiBaseUrl, accessToken: accessToken,
                                                  port: port, callback: self.callback!)
            }
    }
    
    private var callback: QuestionProCallback?
    
    private func setCallback(_ callback: QuestionProCallback) {
        self.callback = callback
    }
    
    public func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "callbackHandler" {
            if let messageBody = message.body as? String {
                LogUtils.printMessage(message: "Received message: \(messageBody)")
                openInSafari(urlString: messageBody)
            }
        }
    }
    
    func openInSafari(urlString: String) {
        
        if let url = URL(string: urlString), UIApplication.shared.canOpenURL(url) {
            UIApplication.shared.open(url, options: [:], completionHandler: nil)
        } else {
            LogUtils.printMessage(logTag: LogTag.LOG_ERROR, message: "Invalid URL or Safari cannot open it.")
        }
    }
    
    let backButton = UIButton(type: .custom)
    
    @MainActor public func launchSurveyOnApiSuccess(withURL response: [String: Any]) {
        if let _ = response[ksurveyURL] {
            if let responseURL = response[ksurveyURL] as? String, !responseURL.isEmpty, responseURL != "Empty" {
                LogUtils.printMessage(message:"Survey URL -> \(responseURL)")
                let responseCopy = response // Create a copy of the response
                DispatchQueue.main.async { [weak self] in
                    guard let self = self else { return }
                    self.iResponseURL = responseURL
                    let strUserDefaultKey = "\(self.iTouchPointName ?? 0)\(self.iCurrentViewName)"
                    if !self.iPresentViewFlag {
                        GlobalDataCX.addValueToUserDefault(responseCopy, forKey: strUserDefaultKey)
                    } else {
                        if let url = self.iResponseURL, let nsurl = URL(string: url) {
                            LogUtils.printMessage(message:"Loading survey in webview...`")
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

    func errorAPIHandler() {
        perform(#selector(self.aDismissWebview(_:)), with: self, afterDelay: 0)
    }
    
    public var iBaseWindow: UIWindow?
    public var iView: UIView?
    @MainActor
    public var iWebView: WKWebView?
    @MainActor
    public var iResponseURL: String?
    public var iPopupMenuTitle: String?
    public var iPopupMenuMessage: String?
    public var iPopupMenuRightButtonTitle: String?
    public var iPopupMenuLeftButtonTitle: String?
    public var iPopUpViewFlag: Bool = false
    @MainActor
    public var iPresentViewFlag: Bool = false
    @MainActor
    public var iTouchPointName: Int?
    public var iApiKey: String?
    public var iApiBaseUrl: String?
    public var iAccessToken: String?
    public var iPort: String?
    @MainActor
    public var iCurrentViewName: String = ""
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

    public func initWithAPIKey(apiKey: String, apiBaseUrl: String, accessToken: String, port: String = "", callback: QuestionProCallback, withWindow aWindow: UIWindow) {
        self.iApiKey = apiKey
        self.iBaseWindow = aWindow
        self.iApiBaseUrl = apiBaseUrl
        self.iAccessToken = accessToken
        self.iPort = port
        setCallback(callback)
        self.iCurrentViewName = ""
    }

    public func touchPointBuilder(touchPointID: Int) -> TouchPoint {
        self.touchPoint?.surveyId = touchPointID
        return self.touchPoint!
    }

    public func launchFeedbackSurvey(touchPoint: TouchPoint) {
        var ShowInDialog = touchPoint.ShowInDialog
        if (ShowInDialog) {
            self.showInAppSurvey(touchPoint: touchPoint);
        } else {
            self.showMessageInViewControllerWithResponse(touchPoint: touchPoint)
        }
    }

    public func stopQuestionProCXManager() {
    }

    public func setPopupMenuTitle(aTitle: String, message aMessage: String, rightButtonTitle aRightButtonTitle: String, leftButtonTitle aLeftButtonTitle: String) {
        self.iPopupMenuTitle = aTitle
        self.iPopupMenuMessage = aMessage
        self.iPopupMenuRightButtonTitle = aRightButtonTitle
        self.iPopupMenuLeftButtonTitle = aLeftButtonTitle
    }
    
    public func getAPIResponse (touchPoint: TouchPoint) {
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
//            aMobileCXServiceTxManager.invokeService(touchPoint: touchPoint, withAPIKey: self.iApiKey!, dataCenter: self.iDataCenter!, callback: self.callback!)
            aMobileCXServiceTxManager.invokeSeviceForExternalApi(touchPoint: touchPoint, withAPIKey: self.iApiKey!, apiBaseUrl: self.iApiBaseUrl!, accessToken: self.iAccessToken!, port: self.iPort!, callback: self.callback!)
        }
    }

    public func showMessageInViewControllerWithResponse(touchPoint: TouchPoint) {
        self.getAPIResponse(touchPoint: touchPoint)
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

    public func showInAppSurvey(touchPoint: TouchPoint) {
        self.getAPIResponse(touchPoint: touchPoint)
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
        LogUtils.printMessage(message: "##### url = \(url?.absoluteString ?? "")")
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
        LogUtils.printMessage(logTag: LogTag.LOG_ERROR, message: "Failed to load with error: \(error.localizedDescription)")
        GMDCircleLoader.hideFromView(self.iWebView!, animated: true)
    }

    @objc func aDismissWebview(_ sender: Any) {
        self.iView?.removeFromSuperview()
    }
    
    @objc func goToPreviousPage(_ sender: Any) {
        self.iWebView?.goBack()
        self.backButton.isHidden = true
    }

    public func currentViewLoaded() {
        self.iPresentViewFlag = true
    }

    public func currentViewUnLoaded() {
        self.iPresentViewFlag = false
    }
}


