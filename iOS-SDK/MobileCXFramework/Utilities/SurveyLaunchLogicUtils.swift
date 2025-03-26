//
//  SurveyLaunchLogicUtils.swift
//  QuestionProCXFramework
//
//  Created by Prasad on 24/03/25.
//

import Foundation

@MainActor public protocol SurveyLaunchDelegate: NSObjectProtocol {
    func launchSurvey()
    func launchSurveyForIntercept(interceptId: Int, satisfiedRule: Rule)
}

@MainActor
public class SurveyLaunchLogicUtils: NSObject {
    public weak var surveyLaunchDelegate: SurveyLaunchDelegate?
    public let pageVisitCount: Int = 0;
    public let appUserInteractionTimeInSeconds = 0;
    public static var instance: SurveyLaunchLogicUtils?
    
    public static func getInstance() -> SurveyLaunchLogicUtils {
        if instance == nil {
            instance = SurveyLaunchLogicUtils();
        }
        return instance!
    }
    
    public func checkSurveyLaunchDayLogic(dayValue: String, interceptId: Int, interceptRule: Rule, completionDelegate: SurveyLaunchDelegate) -> Void {
        let formatter = DateFormatter();
        formatter.dateFormat = "EEEE";
        let dayOfWeek = formatter.string(from: Date());
        if (dayOfWeek == dayValue) {
            completionDelegate.launchSurveyForIntercept(interceptId: interceptId, satisfiedRule: interceptRule)
        }
    }
    
    public func checkPageVisitCountLogic(pageVisitCount: Int, interceptId: Int, interceptRule: Rule, completionDelegate: SurveyLaunchDelegate?) -> Void {
        let appLaunchCount = CacheUtils.getIntFromUserDefaults(key: kPageVisitCountKey)
        if (appLaunchCount == pageVisitCount) {
            completionDelegate?.launchSurveyForIntercept(interceptId: interceptId, satisfiedRule: interceptRule)
            CacheUtils.resetIntUserDefaults(key: kPageVisitCountKey)
        }
    }
    
    public func launchSurveyOnUserInteractionTimeLogic(userInteractionTimeInSeconds: Double) -> Void {
        DispatchQueue.main.asyncAfter(deadline: .now() + userInteractionTimeInSeconds) {
            self.surveyLaunchDelegate?.launchSurvey();
        }
    }
    
    public func getAppUserInteractionTimeInSeconds() -> Int {
        return Int(appUserInteractionTimeInSeconds);
    }
    
    public func checkSurveyLaunchDateOfMonthLogic(date: Int, interceptId: Int, interceptRule: Rule, completionDelegate: SurveyLaunchDelegate?) -> Void {
        let dateOfMonth: Int = Calendar.current.component(.day, from: Date())
        if (dateOfMonth == date) {
            completionDelegate!.launchSurveyForIntercept(interceptId: interceptId, satisfiedRule: interceptRule)
        }
    }
}
