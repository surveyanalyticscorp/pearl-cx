//
//  SurveyLaunchLogicUtils.swift
//  QuestionProCXFramework
//
//  Created by Prasad on 24/03/25.
//

import Foundation

@MainActor public protocol SurveyLaunchDelegate: NSObjectProtocol {
    func launchSurvey()
}

@MainActor
public class SurveyLaunchLogicUtils: NSObject {
    public weak var surveyLaunchDelegate: SurveyLaunchDelegate?
    public static let pageVisitCount: Int = 2;
    public static let appUserInteractionTimeInSeconds = 3.0;
    public static let dateOfMonth: Int = 24;
    public static let dayOfWeek: String = "Monday";
    
    
    public func shouldLaunchSurvey(intercept: NSDictionary) -> Bool {
//        let pageVisitCount: Int = intercept.pageVisitCount as! Int;
//        let appUserInteractionTimeInSeconds: Double = intercept.appUserInteractionTimeInSeconds as! Double;
//        let dayOfMont: Int = intercept.dayOfMonth as! Int;
//        let dayOfTheWeek: String = intercept.dayOfTheWeek as! String;
        
        surveyLaunchDelegate?.launchSurvey();
        return true;
    }
    
    public static func checkSurveyLaunchDayLogic(dayOfWeek: String) -> Bool {
        if (self.dayOfWeek == dayOfWeek) {
            return true;
        }
        return false;
    }
    
    public static func checkPageVisitCountLogic(pageVisitCount: Int) -> Bool {
        if (self.pageVisitCount == pageVisitCount) {
            return true;
        }
        return false;
    }
    
    public static func checkSurveyLaunchUserInteractionTimeLogic(userInteractionTimeInSeconds: Double) -> Bool {
        
        DispatchQueue.main.asyncAfter(deadline: .now() + userInteractionTimeInSeconds) {
            print("launching survey in 2 seconds ")
        }
        return false
    }
    
    public static func getAppUserInteractionTimeInSeconds() -> Int {
        return Int(appUserInteractionTimeInSeconds);
    }
    
    public static func checkSurveyLaunchDateOfMonthLogic(dateOfMonth: Int) -> Bool {
        if (self.dateOfMonth == dateOfMonth) {
            return true;
        }
        return false;
    }
}
