//
//  GlobalDataCX.swift
//  MobileCXFramework
//
//  Created by Prasad on 30/07/24.
//

import Foundation
import Security

public class GlobalDataCX {
    
    static func writeValueToKeyChain() {
        let aUUID = UUID().uuidString
        let keychain = KeychainItemWrapper(identifier: kKeyChainWrapperBundleId, accessGroup: nil)
        keychain.setObject(aUUID, forKey: kSecValueData as String)
    }
    
    public static func getDataCenterString(dataCenter: TouchPoint.DataCenter) -> String {
        switch dataCenter {
        case TouchPoint.DataCenter.DATA_CENTER_US:
            return "US"
        case TouchPoint.DataCenter.DATA_CENTER_AE:
            return "AE"
        case TouchPoint.DataCenter.DATA_CENTER_CA:
            return "CA"
        case TouchPoint.DataCenter.DATA_CENTER_AU:
            return "AU"
        case TouchPoint.DataCenter.DATA_CENTER_EU:
            return "EU"
        case TouchPoint.DataCenter.DATA_CENTER_SG:
            return "SG"
        case TouchPoint.DataCenter.DATA_CENTER_SA:
            return "SA"
        case TouchPoint.DataCenter.DATA_CENTER_KSA:
            return "KSA"
        default:
            return "US"
        }
    }
    
    public static func getBaseUrl(dataCenter: String) -> String {
        switch dataCenter {
        case "US":
            return "https://api.questionpro.com"
        case "AE":
            return "https://api.questionpro.ae"
        case "AU":
            return "https://api.questionpro.au"
        case "EU":
            return "https://api.questionpro.eu"
        case "CA":
            return "https://api.questionpro.ca"
        case "SG":
            return "https://api.questionpro.sg"
        case "SA":
            return "https://api.surveyanalytics.com"
        case "KSA":
            return "https://api.questionprosa.com"
        default:
            return "https://api.questionpro.com"
        }
    }
    
    public static func getUUIDValueFromKeyChain() -> String? {
        let keychain = KeychainItemWrapper(identifier: kKeyChainWrapperBundleId, accessGroup: nil)
        if let strudid = keychain.objectForKey(kSecValueData as String) as? String{
            return strudid
        }
        return nil
    }
    
    public static func checkUUIDValueInKeyChain() -> Bool {
        let keychain = KeychainItemWrapper(identifier: kKeyChainWrapperBundleId, accessGroup: nil)
        if let strudid = keychain.objectForKey(kSecValueData as String) as? String, !strudid.isEmpty {
            return true
        } else {
            writeValueToKeyChain()
            return false
        }
    }
    
    public static func addValueToUserDefault(_ aValue: Any, forKey aTouchPointIDKey: String) {
        UserDefaults.standard.set(aValue, forKey: aTouchPointIDKey)
        UserDefaults.standard.synchronize()
    }
    
    public static func addToUserDefault(_ value: Int, forKey key: String) {
        print("ADding to user defaults->", value)
        UserDefaults.standard.set(value, forKey: key)
        UserDefaults.standard.synchronize()
    }
    
    public static func getValueFromUserDefault(_ key: String) -> Int? {
        if let defaultValue = UserDefaults.standard.object(forKey: key) as? Int {
            return defaultValue
        }
        return nil
    }
    
    public static func deleteUserDefaultValue(forKey aTouchPointIDKey: String) {
        UserDefaults.standard.removeObject(forKey: aTouchPointIDKey)
        UserDefaults.standard.synchronize()
    }
    
    public static func checkValueInUserDefault(forKey aTouchPointIDKey: String) -> [String: Any]? {
        var defaultValue = [String: Any]()
        if let defaultValue = UserDefaults.standard.object(forKey: aTouchPointIDKey) as? [String: Any] {
            return defaultValue
        }
        return defaultValue
    }
}


