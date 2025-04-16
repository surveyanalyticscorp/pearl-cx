//
//  CacheUtils.swift
//  QuestionProCXFramework
//
//  Created by Prasad on 21/03/25.
//

import Foundation

public class CacheUtils {
    
    @MainActor static let persistentDefaults = UserDefaults(suiteName: "com.questionProCX")!
    
    //get from UserDefaults
    public static func getFromUserDefaults(key: String) -> [String: Any]?  {
        var defaultValue = [String: Any]()
        if let defaultValue = UserDefaults.standard.object(forKey: key) as? [String: Any] {
            return defaultValue
        }
        return defaultValue
    }
    
    public static func setInterceptRulesForInterceptId(key: String, value: Data) {
        UserDefaults.standard.set(value, forKey: key)
    }
    
    public static func resetInterceptRulesForInterceptId(key: String) {
        UserDefaults.standard.removeObject(forKey: key)
    }
    
    public static func getInterceptRulesForInterceptId(key: String) -> Data? {
        return UserDefaults.standard.data(forKey: key)
    }
    
    public static func setIntercepts(key: String, value: Data) {
        UserDefaults.standard.set(value, forKey: key)
    }
    
    public static func getIntercepts(key: String) -> Data? {
        return UserDefaults.standard.data(forKey: key)
    }
    
    public static func getInterceptById(key: String) -> Data? {
        let intercepts = getIntercepts(key: kIntercepts);
        do {
            let allIntercepts = try JSONDecoder().decode([Intercept].self, from: intercepts!)
            for intercept in allIntercepts {
                if String(intercept.id) == key {
                    return try JSONEncoder().encode(intercept)
                }
            }
            
        }
        catch {
            return nil;
       }
        return nil
    }
    
    
    public static func setInterceptForInterceptId(key: String, value: [String]) {
        UserDefaults.standard.set(value, forKey: key)
    }
    
    public static func getInterceptForInterceptId(key: String) -> [String] {
        return UserDefaults.standard.object(forKey: key) as! [String]
    }
    
    public static func getIntFromUserDefaults(key: String) -> Int?  {
        if let defaultValue = UserDefaults.standard.object(forKey: key) as? Int {
            return defaultValue
        }
        return 0
    }
    
    //set to UserDefaults
    public static func setToUserDefaults(key: String, value: Any) {
        UserDefaults.standard.set(value, forKey: key)
    }
    
    public static func resetIntUserDefaults(key: String) {
        UserDefaults.standard.removeObject(forKey: key)
        setToUserDefaults(key: key, value: 0)
    }
    
    public static func getValueFromUserDefaults(key: String) -> Any? {
        let defaultValue = false;
        if let defaultValue = UserDefaults.standard.object(forKey: key) as? Bool {
            return defaultValue;
        }
        return defaultValue;
    }
    
    public static func getIsSurveyLaunched(key: String) -> Bool {
        let defaultValue = false;
        if let isSurveyLaunched = UserDefaults.standard.object(forKey: key) as? Bool {
            return isSurveyLaunched
        }
        return defaultValue
    }
    
    public static func setIsSurveyLaunched(key: String, value: Bool) {
        UserDefaults.standard.set(value, forKey: key)
    }
    
    public static func clearUserDefaults(key: String) {
        UserDefaults.standard.removeObject(forKey: key)
    }
    
    public static func clearAllUserDefaults() {
        UserDefaults.standard.dictionaryRepresentation().keys.forEach { key in
            print("clearing data for \(key)")
            UserDefaults.standard.removeObject(forKey: key)
        }
    }
    
    public static func setIsSurveyLaunchedForInterceptId(key: String, value: Bool) {
        UserDefaults.standard.set(value, forKey: key);
    }
    
    public static func getIsSurveyLaunchedForInterceptId(key: String) -> Bool {
        let defaultValue = false;
        print("isSurveyLaunchedForInterceptId \(String(describing: UserDefaults.standard.object(forKey: key) as? Bool))")
        if let isSurveyLaunched = UserDefaults.standard.object(forKey: key) as? Bool {
            return isSurveyLaunched
        }
        return defaultValue
    }
    
    @MainActor public static func setScreenVisitCountForInterceptId(key: String, value: Int) {
        UserDefaults.standard.set(value, forKey: key);
    }
    
    @MainActor public static func getScreenVisitCountForInterceptId(key: String) -> Int {
        if let defaultValue = UserDefaults.standard.object(forKey: key) as? Int {
            return defaultValue
        }
        return 1
    }
    
    @MainActor public static func resetScreenVisitCountForInterceptId(key: String) {
        setScreenVisitCountForInterceptId(key: key, value: 1)
    }
}
