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
    var visitorApiResponse: ApiResponse!
    private var isSurveyDisplayed = false
    @MainActor public static var instance: QuestionProCX?
    var callbackDelegate: QuestionProDelegate?
    
    private func addRuleToSatisfiedRulesList(for id: String, newValue: String) {
        if var existingLists = satisfiedRulesForIntercept[id] {
            // ✅ Add to the last list if available and the value is not already present
            if let lastList = existingLists.last, !lastList.contains(newValue) {
                existingLists[existingLists.count - 1].append(newValue)
            } else if existingLists.isEmpty {
                existingLists.append([newValue]) // Create a new list if empty
            }
            satisfiedRulesForIntercept[id] = existingLists
        } else {
            // ✅ If key doesn't exist, create a new entry
            satisfiedRulesForIntercept[id] = [[newValue]]
        }
    }
    
    @MainActor public func launchSurveyForIntercept(interceptId: Int, satisfiedRule: Rule) {
        LogUtils.printMessage(message: "satisfiedRule.name \(satisfiedRule.name)")
        LogUtils.printMessage(message: "intercept id \(interceptId)")
        addRuleToSatisfiedRulesList(for: String(interceptId), newValue: satisfiedRule.name)
        
        if (CacheUtils.getIsSurveyLaunchedForInterceptId(key: kIsSurveyLaunched + String(interceptId))) {
            LogUtils.printMessage(message: "Survey already launched for this intercept id \(interceptId)")
            return;
        }
        if let intercept = CacheUtils.getInterceptById(key: String(interceptId)) {
            do {
                let interceptData = try JSONDecoder().decode(Intercept.self, from: intercept)
                
                let showInDialog = interceptData.type == InterceptType.PROMPT.rawValue ? true : false
                guard !self.isSurveyDisplayed else { return }
                if (interceptData.condition == InterceptCondition.AND.rawValue) {
                    LogUtils.printMessage(message: "AND condition")
                    let satisfiedRulesCount = satisfiedRulesForIntercept[String(interceptId)]?.flatMap { $0 }.count ?? 0
                    LogUtils.printMessage(message: "satisfiedRulesForIntercept -> \(satisfiedRulesForIntercept)")
                    if (satisfiedRulesCount == interceptData.rules.count) {
                        LogUtils.printMessage(message: "Launching survey for intercept id -> \(interceptId)")
                        self.fetchSurveyURLForSurveyId(interceptId: interceptId, interceptData: interceptData, interceptType: interceptData.type)
                    } else {
                        LogUtils.printMessage(message: "all rules are not satisfied for \(interceptId)")
                    }
                } else if (interceptData.condition == InterceptCondition.OR.rawValue){
                    LogUtils.printMessage(message: "OR condition")
                    self.fetchSurveyURLForSurveyId(interceptId: interceptId, interceptData: interceptData, interceptType: interceptData.type)
                }
            } catch {
                LogUtils.printMessage(message: "Error in launchSurveyForIntercept -> \(error)")
            }
        }
    }
    
    public func setScreenName(screenName: String) {
        LogUtils.printMessage(message: "Screen name \(screenName)")
        self.handleScreenNameViewCount(screenName: screenName)
    }
    
    func handleScreenNameViewCount(screenName: String) {
        if let intercepts = CacheUtils.getIntercepts(key: kIntercepts) {
            do {
                let interceptData = try JSONDecoder().decode([Intercept].self, from: intercepts)
                for intercept in interceptData {
                    for rule in intercept.rules {
                        if (InterceptRuleType.VIEW_COUNT.rawValue == rule.name) {
                            if (rule.key == screenName) {
                                var count = CacheUtils.getScreenVisitCountForInterceptId(key: String(intercept.id))
                                LogUtils.printMessage(message: "Count: \(count) for \(screenName)")
                                if (count == Int(rule.value)) {
                                    self.launchSurveyForIntercept(interceptId: intercept.id, satisfiedRule: rule)
                                    CacheUtils.setScreenVisitCountForInterceptId(key: String(intercept.id), value: 1)
                                } else {
                                    count += 1;
                                    CacheUtils.setScreenVisitCountForInterceptId(key: String(intercept.id), value: count)
                                }
                            }
                        }
                    }
                }
            } catch {
                LogUtils.printMessage(message: "error in view count for screen name");
            }
        }
    }
    
    let backButton = UIButton(type: .custom)
    
    @MainActor public func CXServiceResponse(withURL response: [String: Any]) {
        if let _ = response[ksurveyURL] {
            LogUtils.printMessage(message: "URL found")
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
    public var iApiKey: String = ""
    @MainActor
    public var iCurrentViewName: String = ""
    public var iDataCenter: TouchPoint.DataCenter?
    public var touchPoint: TouchPoint?
    
    public override init() {
    }

    public static func getinstance() -> QuestionProCX{
        if instance == nil {
            instance = QuestionProCX()
        }
        return instance!
    }
    
    public func fetchSurveyURLForSurveyId (interceptId: Int, interceptData: Intercept, interceptType: String) {
        let visitorId = visitorApiResponse.visitor.uuid
        var fetchSurveyURLResponse: SurveyURL!
        var bodyParam = [:] as [String: Any]
        bodyParam["visitedUserId"] = visitorId;
        bodyParam["interceptId"] = interceptId;
        bodyParam["surveyId"] = interceptData.surveyId;
        bodyParam["packageName"] = kPackageName;
        let fetchSurveyURL = APIUtils.getFetchSurveyURL()
        Task {
            do {
                let response: SurveyURL = try await ApiServiceCX.shared.request(
                    urlString: fetchSurveyURL,
                    method: .POST,
                    headers: [
                        "x-app-key": self.iApiKey,
                        "package-name": kPackageName,
                    ],
                    body: bodyParam,
                    responseType: SurveyURL.self
                )
                fetchSurveyURLResponse = response
                self.iResponseURL = fetchSurveyURLResponse.surveyURL
                
                if (interceptType == InterceptType.SURVEY_URL.rawValue) {
                    CacheUtils.setIsSurveyLaunchedForInterceptId(key: kIsSurveyLaunched + String(interceptId), value: true);
                    self.callbackDelegate?.getSurveyURL(surveyURL: self.iResponseURL!)
                } else {
                    let showInDialog = interceptType == InterceptType.PROMPT.rawValue ? true : false
                    LogUtils.printMessage(message: "Survey URL = \(self.iResponseURL!)")
                    CacheUtils.setIsSurveyLaunchedForInterceptId(key: kIsSurveyLaunched + String(interceptId), value: true);
                    self.launchFeedbackSurvey(showInDialog: showInDialog)
                }
                APIUtils.updateInterceptSurveyLaunchEvent(interceptData: interceptData, visitorId: visitorId, surveyType: InterceptSurveyLaunchEvent.LAUNCHED.rawValue);
            } catch {
                self.callbackDelegate?.getSurveyURL(surveyURL: "")
                LogUtils.printMessage(message: "API error -> \(error)")
                self.iResponseURL = ""
                CacheUtils.setIsSurveyLaunchedForInterceptId(key: kIsSurveyLaunched + String(interceptId), value: false);
            }
        }
    }
    
    
    
    public func fetchAndSetupIntercepts() async {
        let surveyLogicUtilsInstance = SurveyLaunchLogicUtils.getInstance();
        let mobileVisitorAPIURL = APIUtils.getVisitorMobileAPIURL()
        do {
            let response: ApiResponse = try await ApiServiceCX.shared.request(
                urlString: mobileVisitorAPIURL,
                method: .GET,
                headers: [
                    "x-app-key": self.iApiKey,
                    "package-name": kPackageName,
                ],
                responseType: ApiResponse.self
                )
           
            visitorApiResponse = response
            self.callbackDelegate?.initSDKSuccess()
            let intercepts = visitorApiResponse.project.intercepts
            
            do {
                let encodedData = try JSONEncoder().encode(intercepts)
                CacheUtils.setIntercepts(key: kIntercepts, value: encodedData)
            } catch {
                LogUtils.printMessage(message: "Erro while saving all intercepts: \(error)")
            }
            
            for intercept in intercepts {
                var interceptRules: [String] = []
                for interceptRule in intercept.rules {
                    interceptRules.append(interceptRule.name)
                }
                
                CacheUtils.setInterceptForInterceptId(key: String(intercept.id), value: interceptRules)
                
                for rule in intercept.rules {
                    if (rule.name == InterceptRuleType.DAY.rawValue) {
                        surveyLogicUtilsInstance.checkSurveyLaunchDayLogic(days: rule.value,  interceptId: intercept.id, interceptRule: rule, completionDelegate: self)
                    } else if (rule.name == InterceptRuleType.DATE.rawValue) {
                        surveyLogicUtilsInstance.checkSurveyLaunchDateOfMonthLogic(dates: rule.value,  interceptId: intercept.id, interceptRule: rule, completionDelegate: self)
                    } else if (rule.name == InterceptRuleType.TIME_SPENT.rawValue) {
                        Task {
                            for await timeLeft in  TimerUtils.startTimer(timeInterval: Int(rule.value)!, interceptId: intercept.id, interceptRule: rule, completionDelegate: self) {
                                LogUtils.printMessage(message: "⏳ Time left: \(timeLeft) sec for \(intercept.id)")
                            }
                        }
                    }
                }
            }
        } catch {
            self.callbackDelegate?.initSDKFailed(error: error)
            LogUtils.printMessage(message: "API error: \(error)")
        }
    }

    public func configure(apiKey: String, touchPoint: TouchPoint, withWindow aWindow: UIWindow, callbackDelegate: QuestionProDelegate?) {
        CacheUtils.setToUserDefaults(key: kApiKey, value: apiKey)
        CacheUtils.setToUserDefaults(key: kDataCenter, value: touchPoint.dataCenter.rawValue)
        self.iApiKey = apiKey
        self.iDataCenter = touchPoint.dataCenter
        self.iBaseWindow = aWindow
        self.iCurrentViewName = ""
        self.callbackDelegate = callbackDelegate
        self.touchPoint = touchPoint;
        SurveyLaunchLogicUtils.getInstance().surveyLaunchDelegate = self;
        Task {
            await self.fetchAndSetupIntercepts()
        }
    }
    
    public func enableLogs(enabledLogs: Bool) {
        LogUtils.enableLogging(isLogsEnabled: enabledLogs)
    }

    public func launchFeedbackSurvey(showInDialog: Bool) {
        LogUtils.printMessage(message: "survey url to load: \(String(describing: iResponseURL))")
        if (!self.isSurveyDisplayed) {
            self.showSurvey(isInAppSurvey: showInDialog)
            self.loadSurveyURLInWebView();
        }
    }
    
    public func showSurvey(isInAppSurvey: Bool) {
        DispatchQueue.main.async {
            
            self.isSurveyDisplayed = true
            
            var rect = UIApplication.shared.keyWindow?.frame ?? CGRect.zero
            rect.origin.x = 0
            rect.origin.y = 0
            let screenRect = UIScreen.main.bounds
            rect.size.width = screenRect.size.width
            rect.size.height = screenRect.size.height
            
            self.iView = UIView(frame: rect)
            self.iView?.backgroundColor = UIColor.black.withAlphaComponent(0.6)

            let frontView = UIView(frame: CGRect(
                x: isInAppSurvey ? screenRect.size.width * 0.1 : 0,
                y: isInAppSurvey ? screenRect.size.height * 0.15 : 70,
                width: isInAppSurvey ? screenRect.size.width * 0.8 : self.iView!.frame.size.width,
                height: isInAppSurvey ? screenRect.size.height * 0.7 : self.iView!.frame.size.height
            ))
            frontView.backgroundColor = .white
            
            let configuration = WKWebViewConfiguration()
            if #available(iOS 14.0, *) {
                let webpagePreferences = WKWebpagePreferences()
                webpagePreferences.allowsContentJavaScript = true
                configuration.defaultWebpagePreferences = webpagePreferences
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
            
            doneButton.frame = isInAppSurvey ? CGRect(x: screenRect.size.width * 0.7, y: 10, width: 25, height: 25) : CGRect(x: self.iView!.frame.size.width - 40, y: 15, width: 20, height: 20)
            
            
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
    
    public func clearSession() {
        LogUtils.printMessage(message: "Cleraing all user defaults..")
        CacheUtils.clearAllUserDefaults()
    }

    public func stopQuestionProCXManager() {
        LogUtils.printMessage(message: "Manager stopped..")
    }
    
    public func loadSurveyURLInWebView() {
        LogUtils.printMessage(message: "Loading into webview -> \(String(describing: self.iResponseURL))")
        DispatchQueue.main.async {
            if let url = self.iResponseURL, let nsurl = URL(string: url) {
                let nsrequest = URLRequest(url: nsurl)
                self.iWebView?.backgroundColor = UIColor.white
                self.iWebView?.load(nsrequest)
            }
        }
    }
    
    @MainActor
    public func webView(_ webView: WKWebView,
                        decidePolicyFor navigationAction: WKNavigationAction,
                        decisionHandler: @escaping @MainActor (WKNavigationActionPolicy) -> Void) {
        
        let url = webView.url
        
        LogUtils.printMessage(message: webView.url!.absoluteString)
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
        LogUtils.printMessage(message: "Web view did finish loading")
        GMDCircleLoader.hideFromView(self.iWebView!, animated: true)
        }

        // WKNavigationDelegate method for when navigation fails
    public func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        LogUtils.printMessage(message: "Failed to load with error: \(error.localizedDescription)")
        GMDCircleLoader.hideFromView(self.iWebView!, animated: true)
    }

    @objc func aDismissWebview(_ sender: Any) {
        self.iView?.removeFromSuperview()
        self.isSurveyDisplayed = false
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


