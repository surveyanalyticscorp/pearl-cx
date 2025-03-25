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
    public let pageVisitCount: Int = 3;
    public let appUserInteractionTimeInSeconds = 5.0;
    public let dateOfMonth: Int = 24;
    public let dayOfWeek: String = "Monday";
    public static var instance: SurveyLaunchLogicUtils?
    
    public static func getInstance() -> SurveyLaunchLogicUtils {
        if instance == nil {
            instance = SurveyLaunchLogicUtils();
        }
        return instance!
    }
    
    
    public func initializeIntercept(intercept: NSMutableDictionary) {
        let condition = intercept["condition"] as! String;
        switch condition {
        case "OR":
            if (checkSurveyLaunchDayLogic(dayOfWeek: intercept["day"] as! String) ||
                checkSurveyLaunchDateOfMonthLogic(dateOfMonth: intercept["date"] as! Int) ||
                checkPageVisitCountLogic(pageVisitCount: intercept["pageVisitCount"] as! Int)) {
                if ((intercept["timer"]) != nil) {
                    launchSurveyOnUserInteractionTimeLogic(userInteractionTimeInSeconds: intercept["timer"] as! Double)
                    return;
                }
                surveyLaunchDelegate?.launchSurvey();
            } else {
                print("none of conditions met for OR")
            }
            break;
        case "AND":
            if (checkSurveyLaunchDayLogic(dayOfWeek: intercept["day"] as! String) &&
                checkSurveyLaunchDateOfMonthLogic(dateOfMonth: intercept["date"] as! Int) &&
                checkPageVisitCountLogic(pageVisitCount: intercept["pageVisitCount"] as! Int)) {
                if ((intercept["timer"]) != nil) {
                    launchSurveyOnUserInteractionTimeLogic(userInteractionTimeInSeconds: intercept["timer"] as! Double)
                    return;
                }
                surveyLaunchDelegate?.launchSurvey();
            } else {
                print("none of conditions met for AND")
            }
            break;
        default:
            print("conditions not met");
            return;
        }
    }
    
    public func shouldLaunchSurvey(shouldLaunchSurvey: Bool) -> Void {
//        let pageVisitCount: Int = intercept.pageVisitCount as! Int;
//        let appUserInteractionTimeInSeconds: Double = intercept.appUserInteractionTimeInSeconds as! Double;
//        let dayOfMont: Int = intercept.dayOfMonth as! Int;
//        let dayOfTheWeek: String = intercept.dayOfTheWeek as! String;
        
        surveyLaunchDelegate?.launchSurvey();
    }
    
    public func checkSurveyLaunchDayLogic(dayOfWeek: String) -> Bool {
        if (self.dayOfWeek == dayOfWeek) {
            print("day of the week matched")
            return true;
        }
        print("day of the week not matched")
        return false;
    }
    
    public func checkPageVisitCountLogic(pageVisitCount: Int) -> Bool {
        print("Checking page visit count")
        if (self.pageVisitCount == pageVisitCount) {
            print("page count matched")
            return true;
        }
        print("page count not matched")
        return false;
    }
    
    public func launchSurveyOnUserInteractionTimeLogic(userInteractionTimeInSeconds: Double) -> Void {
        DispatchQueue.main.asyncAfter(deadline: .now() + userInteractionTimeInSeconds) {
            print("launching survey in 2 seconds ")
            self.surveyLaunchDelegate?.launchSurvey();
        }
    }
    
    public func getAppUserInteractionTimeInSeconds() -> Int {
        return Int(appUserInteractionTimeInSeconds);
    }
    
    public func checkSurveyLaunchDateOfMonthLogic(dateOfMonth: Int) -> Bool {
        if (self.dateOfMonth == dateOfMonth) {
            print("date of month matched")
            return true;
        }
        print("date of month not matched")
        return false;
    }
    
//    public func checkSurveyLaunchDayLogic(dayOfWeek: String) -> Void {
//        if (self.dayOfWeek == dayOfWeek) {
//            surveyLaunchDelegate?.launchSurvey();
//        }
//    }
//    
//    public func checkPageVisitCountLogic(pageVisitCount: Int) -> Void {
//        if (self.pageVisitCount == pageVisitCount) {
//            surveyLaunchDelegate?.launchSurvey();
//        }
//    }
//    
//    public static func checkSurveyLaunchUserInteractionTimeLogic(userInteractionTimeInSeconds: Double) -> Bool {
//        
//        DispatchQueue.main.asyncAfter(deadline: .now() + userInteractionTimeInSeconds) {
//            print("launching survey in 2 seconds ")
//        }
//        return false
//    }
//    
//    public func getAppUserInteractionTimeInSeconds() -> Int {
//        return Int(appUserInteractionTimeInSeconds);
//    }
//    
//    public func checkSurveyLaunchDateOfMonthLogic(dateOfMonth: Int) -> Void {
//        if (self.dateOfMonth == dateOfMonth) {
//            surveyLaunchDelegate?.launchSurvey();
//        }
//    }
}
