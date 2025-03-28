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
public class QuestionProCX: NSObject, UIAlertViewDelegate, ServiceDelegate, WKNavigationDelegate, SurveyLaunchDelegate {
    var satisfiedRulesForIntercept: [String: [[String]]] = [:]
    
    private func containsValue(for id: String, value: String) -> Bool {
        if let lists = satisfiedRulesForIntercept[id] {
            return lists.contains { $0.contains(value) }
        }
        return false
    }
    
    private func addValue(for id: String, newValue: String) {
        if var existingLists = satisfiedRulesForIntercept[id] {
            // ✅ Add to the last list if available, else create a new list
            if !existingLists.isEmpty {
                existingLists[existingLists.count - 1].append(newValue)
            } else {
                existingLists.append([newValue]) // Create a new list if empty
            }
            satisfiedRulesForIntercept[id] = existingLists
        } else {
            // ✅ If key doesn't exist, create a new entry
            satisfiedRulesForIntercept[id] = [[newValue]]
        }
    }
    
    @MainActor public func launchSurveyForIntercept(interceptId: Int, satisfiedRule: Rule) {
        print("satisfiedRule.name \(satisfiedRule.name)")
        print("intercept id \(interceptId)")
        addValue(for: String(interceptId), newValue: satisfiedRule.name)
                
        let isSurveyAlreadyLaunched = CacheUtils.getValueFromUserDefaults(key: kIsSurveyLaunched) as! Bool
        print("isSurveyAlreadyLaunched \(isSurveyAlreadyLaunched)")
        
        if let intercept = CacheUtils.getInterceptById(key: String(interceptId)) {
            do {
                let interceptData = try JSONDecoder().decode(Intercept.self, from: intercept)
                
                let showInDialog = interceptData.type == InterceptType.PROMPT.rawValue ? true : false
                
                if (interceptData.condition == InterceptCondition.AND.rawValue) {
                    print("AND condition")
                    let satisfiedRulesCount = satisfiedRulesForIntercept[String(interceptId)]?.flatMap { $0 }.count ?? 0
                    print("satisfiedRulesForIntercept ->",satisfiedRulesForIntercept)
                    print("satisfiedRulesCount \(satisfiedRulesCount)")
                    if (satisfiedRulesCount == interceptData.rules.count) {
                        print("all rules satisfied \(satisfiedRulesForIntercept.count == interceptData.rules.count)")
                        if (touchPoint != nil && !isSurveyAlreadyLaunched) {
                            print("Launching survey for intercept id -> ", interceptId)
                            CacheUtils.setToUserDefaults(key: kIsSurveyLaunched, value: true);
                            self.launchFeedbackSurvey(touchPoint: touchPoint!, showInDialog: showInDialog)
                        }
                    } else {
                        print("all rules are not satisfied for \(interceptId)")
                    }
                } else if (interceptData.condition == InterceptCondition.OR.rawValue){
                    print("OR condition")
                    if (touchPoint != nil && !isSurveyAlreadyLaunched) {
                        print("Launching survey for intercept id -> ", interceptId)
                        CacheUtils.setToUserDefaults(key: kIsSurveyLaunched, value: true);
                        self.launchFeedbackSurvey(touchPoint: touchPoint!, showInDialog: showInDialog)
                    }
                }
            } catch {
                
            }
        }
    }
    
    let backButton = UIButton(type: .custom)
    
    @MainActor public func CXServiceResponse(withURL response: [String: Any]) {
        if let _ = response[ksurveyURL] {
            print("URL found")
            if let responseURL = response[ksurveyURL] as? String, !responseURL.isEmpty, responseURL != "Empty" {
                let responseCopy = response // Create a copy of the response
                DispatchQueue.main.async { [weak self] in
                    guard let self = self else { return }
                    self.iResponseURL = responseURL
                    let strUserDefaultKey = "\(self.iTouchPointName ?? 0)\(self.iCurrentViewName)"
                    if !self.iPresentViewFlag {
                        CacheUtils.setToUserDefaults(key: strUserDefaultKey, value: responseCopy)
                    } else {
                        if let url = self.iResponseURL, let nsurl = URL(string: url) {
                            let nsrequest = URLRequest(url: nsurl)
                            self.iWebView?.backgroundColor = UIColor.white
                            self.iWebView?.load(nsrequest)
                        }
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
                    alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { _ in self.errorAPIHandler() }))
                    topController.present(alert, animated: true, completion: nil)
                }
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
    @MainActor
    public var iCurrentViewName: String = ""
    public var iDataCenter: TouchPoint.DataCenter?
    public var touchPoint: TouchPoint?
    
    public override init() {
    }

    public static let getInstance: QuestionProCX = {
        let instance = QuestionProCX()
        instance.iPopupMenuTitle = "Feedback"
        instance.iPopupMenuMessage = "Would you like to give us some feedback?"
        instance.iPopupMenuRightButtonTitle = "No"
        instance.iPopupMenuLeftButtonTitle = "Yes"
        instance.iPresentViewFlag = true
        instance.iPopUpViewFlag = true
        return instance
    }()

    public func initwithAPIKey(apiKey: String, touchPoint: TouchPoint, dataCenter: TouchPoint.DataCenter, withWindow aWindow: UIWindow) {
        self.iApiKey = apiKey
        self.iDataCenter = dataCenter
        self.iBaseWindow = aWindow
        self.iCurrentViewName = ""
        
        self.touchPoint = touchPoint;
        SurveyLaunchLogicUtils.getInstance().surveyLaunchDelegate = self;
        let surveyLogicUtilsInstance = SurveyLaunchLogicUtils.getInstance();
        let mobileVisitorAPIURL = APIUtils.getVisitorMobileAPIURL()
        var visitorApiResponse: ApiResponse!
        Task {
            do {
                let response: ApiResponse = try await ApiServiceCX.shared.request(
                    urlString: mobileVisitorAPIURL,
                    method: .GET,
                    headers: [
                        "x-app-key": "e37da3ff-858c-4358-af11-a727377dfac2",
                        "package-name": "com.questionpro",
                    ],
                    responseType: ApiResponse.self
                    )
               
                visitorApiResponse = response
                
                do {
                    let encodedData = try JSONEncoder().encode(visitorApiResponse.project.intercepts)
                    CacheUtils.setIntercepts(key: kIntercepts, value: encodedData)
                } catch {
                    print("Erro while saving all intercepts:", error)
                }
                
                for intercept in visitorApiResponse.project.intercepts {
                    var viewCount: Int = CacheUtils.getViewCountForInterceptId(key: kViewCount + String(intercept.id));
                    var interceptRules: [String] = []
                    for interceptRule in intercept.rules {
                        interceptRules.append(interceptRule.name)
                    }
                    
                    CacheUtils.setInterceptForInterceptId(key: String(intercept.id), value: interceptRules)
                    
                    for rule in intercept.rules {
                        if (rule.name == InterceptRuleType.TIME_SPENT.rawValue) {
                            Task {
                                for await timeLeft in  TimerUtils.startTimer(timeInterval: Int(rule.value)!, interceptId: intercept.id, interceptRule: rule, completionDelegate: self) {
                                    print("⏳ Time left: \(timeLeft) sec for \(intercept.id)")
                                }
                            }
                        } else if (rule.name == InterceptRuleType.VIEW_COUNT.rawValue) {
                            viewCount += 1
                            CacheUtils.setViewCountForInterceptId(key: kViewCount + String(intercept.id), value: viewCount)
                            print("AppLaunch count -> ",CacheUtils.getViewCountForInterceptId(key: kViewCount + String(intercept.id)))
                            surveyLogicUtilsInstance.checkPageVisitCountLogic(pageVisitCount: Int(rule.value)!, interceptId: intercept.id, interceptRule: rule, completionDelegate: self)
                        } else if (rule.name == InterceptRuleType.DAY.rawValue) {
                            surveyLogicUtilsInstance.checkSurveyLaunchDayLogic(dayValue: rule.value,  interceptId: intercept.id, interceptRule: rule, completionDelegate: self)
                        } else if (rule.name == InterceptRuleType.DATE.rawValue) {
                            surveyLogicUtilsInstance.checkSurveyLaunchDateOfMonthLogic(date: Int(rule.value)!,  interceptId: intercept.id, interceptRule: rule, completionDelegate: self)
                        }
                    }
                }
            } catch {
                print("API error: \(error)")
            }
        }
        
    }

    public func touchPointBuilder(touchPointID: Int) -> TouchPoint {
        self.touchPoint?.surveyId = touchPointID
        return self.touchPoint!
    }

    public func launchFeedbackSurvey(touchPoint: TouchPoint, showInDialog: Bool) {
        if (showInDialog) {
            self.showInAppSurvey(touchPoint: touchPoint);
        } else {
            self.showMessageInViewControllerWithResponse(touchPoint: touchPoint)
        }
    }
    
    public func resetQuestionProCXManager() {
        print("Cleraing all user defaults..")
        CacheUtils.clearAllUserDefaults()
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
    
    public func getAPIResponse (touchPoint: TouchPoint) {
        var responseInfo: [String: Any] = [:]
        let key = "\(String(describing: self.iTouchPointName))"
        responseInfo = CacheUtils.getFromUserDefaults(key: key)!
        if let surveyURL = responseInfo[ksurveyURL] as? String, !surveyURL.isEmpty {
            self.iResponseURL = surveyURL
            CacheUtils.clearUserDefaults(key: "\(self.iTouchPointName ?? 0)")
        } else {
            let apiService = ApiService()
            self.iTouchPointName = touchPoint.surveyId
            apiService.iDelegate = self
            apiService.invokeService(touchPoint: touchPoint, withAPIKey: self.iApiKey!, dataCenter: self.iDataCenter!)
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
            
            self.iWebView = WKWebView(frame: CGRect(x: 0, y: 30, width: frontView.frame.size.width, height: frontView.frame.size.height - 20), configuration: configuration)
            self.iWebView?.navigationDelegate = self
            self.iWebView?.allowsLinkPreview = false
            
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
            
            attributedString.addAttribute(.foregroundColor, value: UIColor.white, range: NSRange(location: 0, length: attributedString.length))
            
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
            self.backButton.frame = CGRect(x: 20, y: 15, width: 20, height: 20)
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
            
            self.iWebView = WKWebView(frame: CGRect(x: 0, y: 30, width: frontView.frame.size.width, height: frontView.frame.size.height - 20), configuration: configuration)
            self.iWebView?.navigationDelegate = self
            self.iWebView?.allowsLinkPreview = false
            
            frontView.addSubview(self.iWebView!)

            self.iView?.addSubview(frontView)
            self.iBaseWindow?.addSubview(self.iView!)
            self.iBaseWindow?.bringSubviewToFront(self.iView!)
            let headerView = UIView(frame: CGRect(x: 0, y: 0, width: frontView.frame.size.width, height: 40))
            headerView.backgroundColor = UIColor.white
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
        
        print(webView.url as Any)
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
        print("##### url = \(url?.absoluteString ?? "")")
        if (((url?.absoluteString.range(of: "exitsurvey")) != nil) || ((url?.absoluteString.range(of: "#autoClose") != nil))) {
            perform(#selector(aDismissWebview(_:)), with: self, afterDelay: 1.0)
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
        CacheUtils.setToUserDefaults(key: kIsSurveyLaunched, value: false);
        self.iView?.removeFromSuperview()
        let isSurveyAlreadyLaunched = CacheUtils.getValueFromUserDefaults(key: kIsSurveyLaunched) as! Bool
        print("aDismissWebview isSurveyAlreadyLaunched: \(isSurveyAlreadyLaunched)")
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


