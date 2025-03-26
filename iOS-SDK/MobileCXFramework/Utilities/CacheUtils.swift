//
//  CacheUtils.swift
//  QuestionProCXFramework
//
//  Created by Prasad on 21/03/25.
//

import Foundation

public class CacheUtils {
    
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
    
    
    public static func setInterceptForInterceptId(key: String, value: Data) {
        UserDefaults.standard.set(value, forKey: key)
    }
    
    public static func getInterceptForInterceptId(key: String) -> Data? {
        return UserDefaults.standard.data(forKey: key)
    }
    
    public static func getIntFromUserDefaults(key: String) -> Int?  {
        if let defaultValue = UserDefaults.standard.object(forKey: key) as? Int {
            return defaultValue
        }
        return 1
    }
    
    //set to UserDefaults
    public static func setToUserDefaults(key: String, value: Any) {
        UserDefaults.standard.set(value, forKey: key)
    }
    
    public static func resetIntUserDefaults(key: String) {
        UserDefaults.standard.removeObject(forKey: key)
        setToUserDefaults(key: key, value: 1)
    }
    
    public static func clearUserDefaults(key: String) {
        UserDefaults.standard.removeObject(forKey: key)
    }
}
