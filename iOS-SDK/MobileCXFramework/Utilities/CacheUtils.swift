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
    
    public static func clearUserDefaults(key: String) {
        UserDefaults.standard.removeObject(forKey: key)
    }
}
