//
//  KeychainItemWrapper.swift
//  MobileCXFramework
//
//  Created by Prasad on 30/07/24.
//

import Foundation
import Security

public class KeychainItemWrapper {
    public  var keychainItemData: [String: Any] = [:]
    public  var genericPasswordQuery: [String: Any] = [:]

    public init(identifier: String, accessGroup: String?) {
        // Begin Keychain search setup.
        genericPasswordQuery[kSecClass as String] = kSecClassGenericPassword
        genericPasswordQuery[kSecAttrGeneric as String] = identifier
        
        if let accessGroup = accessGroup {
            #if TARGET_IPHONE_SIMULATOR
            // Ignore the access group if running on the iPhone simulator.
            #else
            genericPasswordQuery[kSecAttrAccessGroup as String] = accessGroup
            #endif
        }
        
        genericPasswordQuery[kSecMatchLimit as String] = kSecMatchLimitOne
        genericPasswordQuery[kSecReturnAttributes as String] = kCFBooleanTrue
        
        var outDictionary: CFTypeRef?
        
        if SecItemCopyMatching(genericPasswordQuery as CFDictionary, &outDictionary) != errSecSuccess {
            resetKeychainItem()
            keychainItemData[kSecAttrGeneric as String] = identifier
            if let accessGroup = accessGroup {
                #if TARGET_IPHONE_SIMULATOR
                // Ignore the access group if running on the iPhone simulator.
                #else
                keychainItemData[kSecAttrAccessGroup as String] = accessGroup
                #endif
            }
        } else {
            // Load the saved data from Keychain.
            keychainItemData = secItemFormatToDictionary(outDictionary as! [String: Any])!
        }
    }

    public func setObject(_ inObject: Any?, forKey key: String) {
        guard let inObject = inObject else { return }
        if let currentObject = keychainItemData[key], !isEqual(currentObject, inObject) {
            keychainItemData[key] = inObject
            writeToKeychain()
        }
    }

    public func objectForKey(_ key: String) -> Any? {
        return keychainItemData[key]
    }

    public  func resetKeychainItem() {
        if keychainItemData.isEmpty {
            keychainItemData = [:]
        } else {
            let tempDictionary = dictionaryToSecItemFormat(keychainItemData)
            let junk = SecItemDelete(tempDictionary as CFDictionary)
            assert(junk == errSecSuccess || junk == errSecItemNotFound, "Problem deleting current dictionary.")
        }
        
        // Default attributes for keychain item.
        keychainItemData[kSecAttrAccount as String] = ""
        keychainItemData[kSecAttrLabel as String] = ""
        keychainItemData[kSecAttrDescription as String] = ""
        keychainItemData[kSecValueData as String] = Data()
    }

    public  func dictionaryToSecItemFormat(_ dictionaryToConvert: [String: Any]) -> [String: Any] {
        var returnDictionary = dictionaryToConvert
        returnDictionary[kSecClass as String] = kSecClassGenericPassword
        
        if let passwordString = dictionaryToConvert[kSecValueData as String] as? String {
            returnDictionary[kSecValueData as String] = passwordString.data(using: .utf8)
        }
        
        return returnDictionary
    }

    public func secItemFormatToDictionary(_ dictionaryToConvert: [String: Any]) -> [String: Any]? {
        // Create a mutable copy of the dictionary to work with.
        var returnDictionary = dictionaryToConvert
        
        // Add the proper search key and class attribute.
        returnDictionary[kSecReturnData as String] = kCFBooleanTrue
        returnDictionary[kSecClass as String] = kSecClassGenericPassword
        
        // Convert the Swift dictionary to a Core Foundation dictionary.
        let cfDictionary = returnDictionary as CFDictionary
        
        // Create a variable to hold the password data.
        var passwordData: CFTypeRef?
        
        // Call SecItemCopyMatching with the dictionary and a pointer to the passwordData.
        let status = SecItemCopyMatching(cfDictionary, &passwordData)
        
        if status == errSecSuccess {
            // Remove the search key as it's no longer needed.
            returnDictionary.removeValue(forKey: kSecReturnData as String)
            
            // Handle passwordData by casting it to CFData and then to Data.
            if let data = passwordData  {
                let password = data as! Data
                #if !PASSWORD_USES_DATA
                let passwordString = String(data: password, encoding: .utf8)
                returnDictionary[kSecValueData as String] = passwordString
                #else
                returnDictionary[kSecValueData as String] = password
                #endif
            } else {
                assertionFailure("Password data is not of type CFData.")
                return nil
            }
        } else {
            // Handle errors.
            assertionFailure("Serious error, no matching item found in the keychain.\n")
            return nil
        }
        
        return returnDictionary
    }

    public  func writeToKeychain() {
        var attributes: CFTypeRef?
        var updateItem: [String: Any]?
        
        if SecItemCopyMatching(genericPasswordQuery as CFDictionary, &attributes) == errSecSuccess {
            updateItem = attributes as? [String: Any]
            updateItem?[kSecClass as String] = genericPasswordQuery[kSecClass as String]
            
            var tempCheck = dictionaryToSecItemFormat(keychainItemData)
            tempCheck.removeValue(forKey: kSecClass as String)
            
            #if TARGET_IPHONE_SIMULATOR
            tempCheck.removeValue(forKey: kSecAttrAccessGroup as String)
            #endif
            
            let result = SecItemUpdate(updateItem! as CFDictionary, tempCheck as CFDictionary)
        } else {
            let result = SecItemAdd(dictionaryToSecItemFormat(keychainItemData) as CFDictionary, nil)
        }
        
        if attributes != nil {
//            CFRelease(attributes!)
        }
    }
    
    public  func isEqual(_ obj1: Any, _ obj2: Any) -> Bool {
        return (obj1 as AnyObject).isEqual(obj2)
    }
}


