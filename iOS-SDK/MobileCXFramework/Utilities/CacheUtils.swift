//
//  CacheUtils.swift
//  QuestionProCXFramework
//
//  Created by Prasad on 05/01/26.
//

import Foundation

public class CacheUtils {

    nonisolated(unsafe) private static let sdkUserDefaults = UserDefaults(suiteName: "com.questionpro.cxsdk") ?? UserDefaults.standard
    
    //get from UserDefaults
    public static func get(key: String) -> [String: Any]?  {
        var defaultValue = [String: Any]()
        if let defaultValue = sdkUserDefaults.object(forKey: key) as? [String: Any] {
            return defaultValue
        }
        return defaultValue
    }
    
    public static func getInt(key: String) -> Int?  {
        if let defaultValue = sdkUserDefaults.object(forKey: key) as? Int {
            return defaultValue
        }
        return 0
    }
    
    public static func getInt64(key: String) -> Int64?  {
        if let defaultValue = sdkUserDefaults.object(forKey: key) as? Int64 {
            return defaultValue
        }
        return 0
    }
    
    //set to UserDefaults
    public static func set(key: String, value: Any) {
        sdkUserDefaults.set(value, forKey: key)
        sdkUserDefaults.synchronize()
    }
    
    public static func get<T>(key: String, type: T.Type) -> T? {
        return sdkUserDefaults.object(forKey: key) as? T
    }
    
    public static func resetInt(key: String) {
        sdkUserDefaults.removeObject(forKey: key)
        set(key: key, value: 0)
    }
    
    public static func getBool(key: String) -> Any? {
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
        sdkUserDefaults.synchronize()
    }
    
    
    
    public static func clearUserDefaults(key: String) {
        sdkUserDefaults.removeObject(forKey: key)
    }
    
    public static func clearAllUserDefaults() {
        
        sdkUserDefaults.dictionaryRepresentation().keys.forEach { key in
            sdkUserDefaults.removeObject(forKey: key)
        }
        
        // Force synchronization to ensure changes are written
        sdkUserDefaults.synchronize()
        
        LogUtils.printMessage(message: "✅ Session cleared")
    }
}
