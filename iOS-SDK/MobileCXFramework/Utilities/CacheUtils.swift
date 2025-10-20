//
//  CacheUtils.swift
//  QuestionProCXFramework
//
//  Created by Prasad on 21/03/25.
//

import Foundation


public class CacheUtils {

    nonisolated(unsafe) private static let sdkUserDefaults = UserDefaults(suiteName: "com.questionpro.cxsdk") ?? UserDefaults.standard
    
    //get from UserDefaults
    public static func getFromUserDefaults(key: String) -> [String: Any]?  {
        var defaultValue = [String: Any]()
        if let defaultValue = sdkUserDefaults.object(forKey: key) as? [String: Any] {
            return defaultValue
        }
        return defaultValue
    }
    
    public static func setInterceptRulesForInterceptId(key: String, value: Data) {
        sdkUserDefaults.set(value, forKey: key)
    }
    
    public static func resetInterceptRulesForInterceptId(key: String) {
        sdkUserDefaults.removeObject(forKey: key)
    }
    
    public static func getInterceptRulesForInterceptId(key: String) -> Data? {
        return sdkUserDefaults.data(forKey: key)
    }
    
    public static func setIntercepts(key: String, value: Data) {
        sdkUserDefaults.set(value, forKey: key)
    }
    
    public static func getIntercepts(key: String) -> Data? {
        return sdkUserDefaults.data(forKey: key)
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
        sdkUserDefaults.set(value, forKey: key)
    }
    
    public static func getInterceptForInterceptId(key: String) -> [String] {
        return sdkUserDefaults.object(forKey: key) as! [String]
    }
    
    public static func getIntFromUserDefaults(key: String) -> Int?  {
        if let defaultValue = sdkUserDefaults.object(forKey: key) as? Int {
            return defaultValue
        }
        return 0
    }
    
    //set to UserDefaults
    public static func setToUserDefaults(key: String, value: Any) {
        sdkUserDefaults.set(value, forKey: key)
    }
    
    public static func getFromUserDefaults<T>(key: String, type: T.Type) -> T? {
        return sdkUserDefaults.object(forKey: key) as? T
    }
    
    public static func resetIntUserDefaults(key: String) {
        sdkUserDefaults.removeObject(forKey: key)
        setToUserDefaults(key: key, value: 0)
    }
    
    public static func getValueFromUserDefaults(key: String) -> Any? {
        let defaultValue = false;
        if let defaultValue = sdkUserDefaults.object(forKey: key) as? Bool {
            return defaultValue;
        }
        return defaultValue;
    }
    
    public static func getIsSurveyLaunched(key: String) -> Bool {
        let defaultValue = false;
        if let isSurveyLaunched = sdkUserDefaults.object(forKey: key) as? Bool {
            return isSurveyLaunched
        }
        return defaultValue
    }
    
    public static func setIsSurveyLaunched(key: String, value: Bool) {
        sdkUserDefaults.set(value, forKey: key)
    }
    
    public static func clearUserDefaults(key: String) {
        sdkUserDefaults.removeObject(forKey: key)
    }
    
    public static func clearAllUserDefaults() {
        // ✅ Define keys to preserve during session clear
        let keysToPreserve: Set<String> = [kApiKey, kDataCenter, "interceptsSetup"]
        
        sdkUserDefaults.dictionaryRepresentation().keys.forEach { key in
            if keysToPreserve.contains(key) {
                LogUtils.printMessage(message: "🔒 Preserving key: \(key)")
            } else {
                LogUtils.printMessage(message: "🗑️ Clearing data for \(key)")
                sdkUserDefaults.removeObject(forKey: key)
            }
        }
        
        // Force synchronization to ensure changes are written
        sdkUserDefaults.synchronize()
        
        LogUtils.printMessage(message: "✅ Session cleared while preserving essential data")
    }
    
    public static func setIsSurveyLaunchedForInterceptId(key: String, value: Bool) {
        sdkUserDefaults.set(value, forKey: key);
    }
    
    public static func getIsSurveyLaunchedForInterceptId(key: String) -> Bool {
        let value = sdkUserDefaults.bool(forKey: key)
        LogUtils.printMessage(message: "isSurveyLaunchedForInterceptId (\(key)): \(value)")
        return value
    }
    
    @MainActor public static func setScreenVisitCountForInterceptId(key: String, value: Int) {
        sdkUserDefaults.set(value, forKey: key);
    }
    
    @MainActor public static func getScreenVisitCountForInterceptId(key: String) -> Int {
        if let defaultValue = sdkUserDefaults.object(forKey: key) as? Int {
            return defaultValue
        }
        return 1
    }
    
    @MainActor public static func resetScreenVisitCountForInterceptId(key: String) {
        setScreenVisitCountForInterceptId(key: key, value: 1)
    }
}
