//
//  SurveyLaunchLogicUtils.swift
//  QuestionProCXFramework
//
//  Created by Prasad on 24/03/25.
//

import Foundation

@MainActor public protocol SurveyLaunchDelegate: NSObjectProtocol {
    func launchSurveyForIntercept(interceptId: Int, satisfiedRule: Rule)
}

@MainActor public protocol ScreenVisitDelegate: NSObjectProtocol {
    func trackScreenVisit(screenName: String)
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
    
    public func checkSurveyLaunchDayLogic(days: String, interceptId: Int, interceptRule: Rule, completionDelegate: SurveyLaunchDelegate) -> Void {
        let formatter = DateFormatter();
        formatter.dateFormat = "EEEE";
        let dayOfWeek = formatter.string(from: Date());
        let dayArray = days.components(separatedBy: ",").map { $0.trimmingCharacters(in: .whitespaces) }
        if (dayArray.contains(dayOfWeek)) {
            completionDelegate.launchSurveyForIntercept(interceptId: interceptId, satisfiedRule: interceptRule)
        }
    }
    
//    public func checkPageVisitCountLogic(pageVisitCount: Int, interceptId: Int, interceptRule: Rule, completionDelegate: SurveyLaunchDelegate) -> Void {
//        let appLaunchCount = CacheUtils.getViewCountForInterceptId(key: kViewCount + String(interceptId))
//        if (appLaunchCount == pageVisitCount) {
//            completionDelegate.launchSurveyForIntercept(interceptId: interceptId, satisfiedRule: interceptRule)
//            CacheUtils.resetViewCountForInterceptId(key: kViewCount + String(interceptId))
//        }
//    }
    
    public func getAppUserInteractionTimeInSeconds() -> Int {
        return Int(appUserInteractionTimeInSeconds);
    }
    
    public func checkSurveyLaunchDateOfMonthLogic(dates: String, interceptId: Int, interceptRule: Rule, completionDelegate: SurveyLaunchDelegate) -> Void {
        let dateOfMonth: Int = Calendar.current.component(.day, from: Date())
        let datesArray = dates.components(separatedBy: ",").map{ $0.trimmingCharacters(in: .whitespaces) }
        if (datesArray.contains(String(dateOfMonth))) {
            completionDelegate.launchSurveyForIntercept(interceptId: interceptId, satisfiedRule: interceptRule)
        }
    }
}
