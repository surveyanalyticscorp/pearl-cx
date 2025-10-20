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
public class QuestionProCX: NSObject, UIAlertViewDelegate, WKNavigationDelegate, WKScriptMessageHandler, SurveyLaunchDelegate {
    var satisfiedRulesForIntercept: [String: [[String]]] = [:]
    var visitorApiResponse: ApiResponse!
    private var isSurveyDisplayed = false
    @MainActor public static var instance: QuestionProCX?
    var initCallbackDelegate: QuestionProInitDelegate?
    var questionProCallbackDelegate: QuestionProCallbackDelegate?
    private var activeTimerTasks: [Int: Task<Void, Never>] = [:]
    
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
    
    private func resetSatisfiedRulesList() {
        satisfiedRulesForIntercept.removeAll()
    }
    
    @MainActor public func launchSurveyForIntercept(interceptId: Int, satisfiedRule: Rule) {
        LogUtils.printMessage(message: "satisfiedRule.name \(satisfiedRule.name)")
        LogUtils.printMessage(message: "intercept id \(interceptId)")
        addRuleToSatisfiedRulesList(for: String(interceptId), newValue: satisfiedRule.name)
        if let task = activeTimerTasks[interceptId] {
            task.cancel()
            activeTimerTasks.removeValue(forKey: interceptId)
            LogUtils.printMessage(message: "🗑️ Cleaned up timer task for intercept \(interceptId)")
        }
        if let intercept = CacheUtils.getInterceptById(key: String(interceptId)) {
            do {
                let interceptData = try JSONDecoder().decode(Intercept.self, from: intercept)
                let showInDialog = interceptData.type == InterceptType.PROMPT.rawValue ? true : false
                let allowMultipleResponse = interceptData.settings?.allowMultipleResponse ?? false
                LogUtils.printMessage(logTag: .LOG_INFO, message: "allowMultipleResponse \(allowMultipleResponse)")
                if (!allowMultipleResponse && CacheUtils.getIsSurveyLaunchedForInterceptId(key: kIsSurveyLaunched + String(interceptId))) {
                    LogUtils.printMessage(message: "Survey already launched for this intercept id \(interceptId)")
                    return;
                }
                
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
                } else {
                    LogUtils.printMessage(message: "OR condition")
                    self.fetchSurveyURLForSurveyId(interceptId: interceptId, interceptData: interceptData, interceptType: interceptData.type)
                }
            } catch {
                LogUtils.printMessage(logTag: .LOG_ERROR, message: "Error in launchSurveyForIntercept -> \(error)")
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
                LogUtils.printMessage(logTag: .LOG_ERROR, message: "error in view count for screen name");
            }
        }
    }
    
    let backButton = UIButton(type: .custom)

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
    
    func setCustomVariables(customVariables: [Int: String]) -> [[String: String]] {
        var customVariablesPayload : [[String: String]] = []
        for (key, value) in customVariables {
            let customKey = "custom\(key)"
            let customVars: [String: String] = [
                "variableName": customKey,
                "value": value
            ]
            customVariablesPayload.append(customVars)
        }
        
        LogUtils.printMessage(message: "Body Custom Variables: ----------> \(String(describing: customVariablesPayload))")
        
        if let jsonData = try? JSONSerialization.data(withJSONObject: customVariablesPayload, options: .prettyPrinted),
               let jsonString = String(data: jsonData, encoding: .utf8) {
            LogUtils.printMessage(message: " ----------> ✅ JSON Output:\n\(jsonString)")
            }
        return customVariablesPayload
    }
    
    public func fetchSurveyURLForSurveyId (interceptId: Int, interceptData: Intercept, interceptType: String) {
        let visitorId = visitorApiResponse.visitor.uuid
        var fetchSurveyURLResponse: SurveyURL!
        var bodyParam = [:] as [String: Any]
        bodyParam["visitedUserId"] = visitorId;
        bodyParam["interceptId"] = interceptId;
        bodyParam["surveyId"] = interceptData.surveyId;
        bodyParam["packageName"] = kPackageName;
        var triggerDelayInSeconds = interceptData.settings?.triggerDelayInSeconds ?? 0
        
        if ((interceptData.settings) != nil) {
            let settings = interceptData.settings
            if (settings!.autoLanguageSelection) {
                bodyParam["surveyLanguage"] = GlobalUtils.getAppLanguage()
            }
        }
        
        if (touchPoint?.customVariables != nil) {
            let customVariables = self.touchPoint?.customVariables
            LogUtils.printMessage(message: "Custom Variables: \(String(describing: customVariables))")
                    
            bodyParam["data"] = setCustomVariables(customVariables: customVariables!)
        }
        
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
                    self.questionProCallbackDelegate?.getSurveyURL(surveyURL: self.iResponseURL!)
                } else {
                    let showInDialog = interceptType == InterceptType.PROMPT.rawValue ? true : false
                    LogUtils.printMessage(message: "Survey URL = \(self.iResponseURL!)")
                    CacheUtils.setIsSurveyLaunchedForInterceptId(key: kIsSurveyLaunched + String(interceptId), value: true);
                    self.launchSurvey(showInDialog: showInDialog, triggerDelayInSeconds: triggerDelayInSeconds)
                }
                APIUtils.updateInterceptSurveyLaunchEvent(interceptData: interceptData, visitorId: visitorId, surveyType: InterceptSurveyLaunchEvent.LAUNCHED.rawValue);
            } catch {
                self.questionProCallbackDelegate?.getSurveyURL(surveyURL: "")
                LogUtils.printMessage(logTag: .LOG_ERROR, message: "API error -> \(error)")
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
            LogUtils.printMessage(message: "fetch and etup intercepts  \(response)")
            visitorApiResponse = response
            self.initCallbackDelegate?.initSDKSuccess()
            let intercepts = visitorApiResponse.project.intercepts
            
            do {
                let encodedData = try JSONEncoder().encode(intercepts)
                CacheUtils.setIntercepts(key: kIntercepts, value: encodedData)
            } catch {
                LogUtils.printMessage(logTag: .LOG_ERROR, message: "Error while saving all intercepts: \(error)")
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
                        // ✅ Store the timer task properly
                        let task = Task {
                            for await timeLeft in TimerUtils.getinstance().startTimer(timeInterval: Int(rule.value)!, interceptId: intercept.id, interceptRule: rule, completionDelegate: self) {
                                LogUtils.printMessage(message: "⏳ Time left: \(timeLeft) sec for \(intercept.id)")
                            }
                            // Clean up task when timer completes
                            self.activeTimerTasks.removeValue(forKey: intercept.id)
                        }
                        self.activeTimerTasks[intercept.id] = task
                    }
                }
            }
        } catch {
            self.initCallbackDelegate?.initSDKFailed(error: error.localizedDescription)
            LogUtils.printMessage(logTag: .LOG_ERROR, message: "API error: \(error)")
        }
    }
    
    func appLifecycleStateListener() {
        NotificationCenter.default.addObserver(
            forName: UIApplication.didEnterBackgroundNotification,
            object: nil,
            queue: .main
        ) { _ in
            LogUtils.printMessage(message: "📦 App did enter background")
            Task {
                await MainActor.run {
                    // ✅ Cancel all active timer tasks
                    for task in self.activeTimerTasks.values {
                        task.cancel()
                    }
                    self.activeTimerTasks.removeAll()
                    
                    // Stop timers in TimerUtils
                    TimerUtils.getinstance().stopAllTimersOnBackground()
                }
            }
        }
        
        NotificationCenter.default.addObserver(
            forName: UIApplication.willTerminateNotification,
            object: nil,
            queue: .main
        ) { _ in
            LogUtils.printMessage(message: "📦 App Killed")
            Task {
                await MainActor.run {
                    // ✅ Cancel all active timer tasks
                    for task in self.activeTimerTasks.values {
                        task.cancel()
                    }
                    self.activeTimerTasks.removeAll()
                    
                    // Stop timers in TimerUtils
                    TimerUtils.getinstance().stopAllTimersOnBackground()
                    
                    self.clearSession()
                    self.resetSatisfiedRulesList()
                }
            }
        }

        NotificationCenter.default.addObserver(
            forName: UIApplication.didBecomeActiveNotification,
            object: nil,
            queue: .main
        ) { _ in
            Task {
                await MainActor.run {
                    LogUtils.printMessage(message: "🎯 App became active")
                    
                    // ✅ Get the returned AsyncStreams and consume them properly
                    let newStreams = TimerUtils.getinstance().restartAllTimersFromBeginning()
                    
                    // ✅ Create tasks to consume each stream
                    for (interceptId, stream) in newStreams {
                        let task = Task {
                            for await timeLeft in stream {
                                LogUtils.printMessage(message: "⏳ Restarted Timer - Time left: \(timeLeft) sec for intercept \(interceptId)")
                            }
                            // Clean up when timer completes naturally
                            self.activeTimerTasks.removeValue(forKey: interceptId)
                        }
                        self.activeTimerTasks[interceptId] = task
                    }
                    
                    LogUtils.printMessage(message: "✅ Restarted \(newStreams.count) timers from beginning")
                }
            }
        }
    }

    private func debugTimerStates() {
        let activeTaskIds = activeTimerTasks.keys.sorted()
        let timerUtilsIds = TimerUtils.getinstance().getActiveTimerIds().sorted()
        
        LogUtils.printMessage(message: "🔍 === TIMER STATE DEBUG ===")
        LogUtils.printMessage(message: "🔍 Active Timer Tasks: \(activeTaskIds)")
        LogUtils.printMessage(message: "🔍 TimerUtils Active IDs: \(timerUtilsIds)")
        LogUtils.printMessage(message: "🔍 Task Count: \(activeTimerTasks.count)")
        LogUtils.printMessage(message: "🔍 TimerUtils Count: \(timerUtilsIds.count)")
        
        if activeTaskIds != timerUtilsIds {
            LogUtils.printMessage(message: "⚠️ MISMATCH detected between tasks and timers!")
        } else {
            LogUtils.printMessage(message: "✅ Timer states are synchronized")
        }
        LogUtils.printMessage(message: "🔍 === END DEBUG ===")
    }
    
    private func setupIntercepts() {
        LogUtils.printMessage(message: "Setting up intercepts")
        SurveyLaunchLogicUtils.getInstance().surveyLaunchDelegate = self;
        Task {
            await self.fetchAndSetupIntercepts()
        }
    }
    
    private func setupCoreSurvey() {
        LogUtils.printMessage(message: "Setting up core survey")
    }
    
    public func launchFeedbackSurvey(surveyId: Int) {
        let fetchSurveyURL = APIUtils.getCoreSurveyFeedbackURL() + String(surveyId)
        Task {
            do {
                let response: SurveyResponse = try await ApiServiceCX.shared.request(
                    urlString: fetchSurveyURL,
                    method: .GET,
                    headers: [
                        "api-key": self.iApiKey,
                        "Content-Type": "application/json; charSet=UTF-8"
                    ],
                    responseType: SurveyResponse.self
                )
                
                LogUtils.printMessage(message: "Core survey url \(response.response.url)")
                self.iResponseURL = response.response.url
                
                let showInDialog: Bool = true
                let triggerDelayInSeconds: Int = 0
                
                self.launchSurvey(showInDialog: showInDialog, triggerDelayInSeconds: triggerDelayInSeconds)
            } catch {
                LogUtils.printMessage(logTag: .LOG_ERROR, message: "API error -> \(error)")
                self.iResponseURL = ""
            }
        }
    }

    public func configure(apiKey: String, touchPoint: TouchPoint, withWindow aWindow: UIWindow, initCallbackDelegate: QuestionProInitDelegate?) {
        self.clearSession()
        CacheUtils.clearUserDefaults(key: kApiKey)
        CacheUtils.clearUserDefaults(key: kDataCenter)
        self.resetSatisfiedRulesList()
        
        CacheUtils.setToUserDefaults(key: kApiKey, value: apiKey)
        CacheUtils.setToUserDefaults(key: kDataCenter, value: touchPoint.dataCenter.rawValue)
        self.iApiKey = apiKey
        self.iDataCenter = touchPoint.dataCenter
        self.iBaseWindow = aWindow
        self.iCurrentViewName = ""
        self.initCallbackDelegate = initCallbackDelegate
        self.touchPoint = touchPoint;
        
        setupIntercepts()
        
        self.appLifecycleStateListener()
    }
    
    public func setQuestionProCallbackDelegate(questionProCallbackDelegate: QuestionProCallbackDelegate) {
        self.questionProCallbackDelegate = questionProCallbackDelegate
    }
    
    public func enableLogs(enabledLogs: Bool) {
        LogUtils.enableLogging(isLogsEnabled: enabledLogs)
    }
    
    public func launchSurvey(showInDialog: Bool, triggerDelayInSeconds: Int) {
        LogUtils.printMessage(message: "Survey URL to load: \(String(describing: iResponseURL))")
        DispatchQueue.main.asyncAfter(deadline: .now() + .seconds(triggerDelayInSeconds)) {
            LogUtils.printMessage(message: "Executed after \(triggerDelayInSeconds) seconds")
            self.showSurvey(isInAppSurvey: showInDialog)
            self.loadSurveyURLInWebView()
        }
    }
    
    public func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
            if message.name == "callbackHandler" {
                if let messageBody = message.body as? String {
                    LogUtils.printMessage(message: "Received message: \(messageBody)")
                    if (messageBody.contains("closeThankyouPage")) {
                        perform(#selector(self.aDismissWebview(_:)), with: self, afterDelay: 3)
                    } else {
                        openInSafari(urlString: messageBody)
                    }
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
                x: isInAppSurvey ? screenRect.size.width * 0.05 : 0,
                y: isInAppSurvey ? screenRect.size.height * 0.15 : 70,
                width: isInAppSurvey ? screenRect.size.width * 0.9 : self.iView!.frame.size.width,
                height: isInAppSurvey ? screenRect.size.height * 0.7 : self.iView!.frame.size.height
            ))
            frontView.backgroundColor = .white
            
            let configuration = WKWebViewConfiguration()
            if #available(iOS 14.0, *) {
                let webpagePreferences = WKWebpagePreferences()
                webpagePreferences.allowsContentJavaScript = true
                configuration.defaultWebpagePreferences = webpagePreferences
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
            headerView.backgroundColor = UIColor.white
            frontView.addSubview(headerView)
            let doneButton = UIButton(type: .custom)
            doneButton.addTarget(self, action: #selector(self.aDismissWebview(_:)), for: .touchUpInside)

            let closeButtonImage = UIImage(systemName: "xmark",
                                           withConfiguration: UIImage.SymbolConfiguration(pointSize: 16, weight: .bold))
            doneButton.setImage(closeButtonImage, for: .normal)
            doneButton.tintColor = UIColor(red: 27/255.0, green: 51/255.0, blue: 128/255.0, alpha: 1.0)
            doneButton.layer.cornerRadius = doneButton.bounds.size.width / 2
            
            doneButton.frame = isInAppSurvey ? CGRect(x: screenRect.size.width * 0.80, y: 15, width: 25, height: 25) : CGRect(x: self.iView!.frame.size.width - 40, y: 15, width: 20, height: 20)
            
            
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
    
    private func clearSession() {
        LogUtils.printMessage(message: "Cleraing all user defaults..")
        CacheUtils.clearAllUserDefaults()
    }

    public func closeSurveyWindow() {
        self.iView?.removeFromSuperview()
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


