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
    
    public static func setDataMappings(dataMappings: [DataMappings]) {
        // Store full encoded array of DataMappings (variable, displayName, value)
        do {
            let encoded = try JSONEncoder().encode(dataMappings)
            sdkUserDefaults.set(encoded, forKey: kDataMappings)
            LogUtils.printMessage(message: "💾 Saved dataMappings count=\(String(describing: dataMappings))")
            logDataMappings(interceptId: kDataMappings, action: "SAVE", mappings: dataMappings)
        } catch {
            LogUtils.printMessage(message: "❌ Error encoding dataMappings: \(error)")
        }
    }

    // Append new mappings, replacing existing entries with the same displayName ("last wins" semantics).
    // Case-insensitive match; leading/trailing whitespace in displayName is trimmed before comparison/storage.
    @discardableResult
    public static func appendDataMappings(newMappings: [DataMappings]) -> [DataMappings] {
        guard !newMappings.isEmpty else {
            LogUtils.printMessage(message: "ℹ️ appendDataMappings called with empty array; skipping")
            return getDataMappings() ?? []
        }
        if var existing = getDataMappings() {
            // Normalize existing displayNames (trim + case-insensitive index)
            var indexByDisplayName: [String: Int] = [:]
            for (idx, dm) in existing.enumerated() {
                let trimmed = dm.displayName.trimmingCharacters(in: .whitespacesAndNewlines)
                if trimmed != dm.displayName { // persist trimmed version
                    existing[idx] = DataMappings(variable: dm.variable, displayName: trimmed, value: dm.value)
                }
                indexByDisplayName[trimmed.lowercased()] = idx
            }
            for dm in newMappings {
                let incomingTrimmed = dm.displayName.trimmingCharacters(in: .whitespacesAndNewlines)
                let keyLower = incomingTrimmed.lowercased()
                if let idx = indexByDisplayName[keyLower] {
                    // Replace existing; preserve prior non-empty value if new value is empty
                    let prior = existing[idx]
                    let mergedValue = dm.value.isEmpty ? prior.value : dm.value
                    existing[idx] = DataMappings(variable: dm.variable, displayName: incomingTrimmed, value: mergedValue)
                } else {
                    existing.append(DataMappings(variable: dm.variable, displayName: incomingTrimmed, value: dm.value))
                    indexByDisplayName[keyLower] = existing.count - 1
                }
            }
            setDataMappings(dataMappings: existing) // Reuse save + SAVE log
            logDataMappings(interceptId: kDataMappings, action: "APPEND", mappings: existing)
            return existing
        } else {
            // No existing -> trim and save new
            let trimmedNew = newMappings.map { DataMappings(variable: $0.variable,
                                                           displayName: $0.displayName.trimmingCharacters(in: .whitespacesAndNewlines),
                                                           value: $0.value) }
            setDataMappings(dataMappings: trimmedNew)
            logDataMappings(interceptId: kDataMappings, action: "APPEND", mappings: trimmedNew)
            return trimmedNew
        }
    }

    public static func getDataMapping() -> [String: String]? {
        // Legacy dictionary retrieval (if any) — but new storage uses encoded array
        if let dict = sdkUserDefaults.object(forKey: kDataMappings) as? [String:String] { return dict }
        return nil
    }

    // New: retrieve full decoded array of DataMappings for an intercept
    public static func getDataMappings() -> [DataMappings]? {
        guard let data = sdkUserDefaults.data(forKey: kDataMappings) else { return nil }
        do {
            let decoded = try JSONDecoder().decode([DataMappings].self, from: data)
            LogUtils.printMessage(message: "📦 Fetched dataMappings count=\(String(describing: decoded))")
            logDataMappings(interceptId: kDataMappings, action: "FETCH", mappings: decoded)
            return decoded
        } catch {
            LogUtils.printMessage(message: "❌ Error decoding dataMappings : \(error)")
            return nil
        }
    }

    // Merge user-provided mappings (displayName -> value) into existing stored mappings.
    // Only updates entries whose displayName matches; ignores unknown displayNames.
    
    public static func mergeUserDataMappings(userMappings: [String:String]) -> [DataMappings]? {
        // If no existing list, create one with variable="" and provided values (trim displayName)
        guard var existing = getDataMappings() else {
            let fresh: [DataMappings] = userMappings.map { (rawDisplay, value) in
                let trimmed = rawDisplay.trimmingCharacters(in: .whitespacesAndNewlines)
                return DataMappings(variable: "", displayName: trimmed, value: value)
            }
            setDataMappings(dataMappings: fresh)
            LogUtils.printMessage(message: "🆕 Created initial dataMappings list from user input; count=\(fresh.count)")
            logDataMappings(interceptId: kDataMappings, action: "MERGE_INIT", mappings: fresh)
            return fresh
        }

        // Build case-insensitive trimmed index for existing
        var indexByDisplayName: [String:Int] = [:]
        for (idx, dm) in existing.enumerated() {
            let trimmed = dm.displayName.trimmingCharacters(in: .whitespacesAndNewlines)
            if trimmed != dm.displayName {
                existing[idx] = DataMappings(variable: dm.variable, displayName: trimmed, value: dm.value)
            }
            indexByDisplayName[trimmed.lowercased()] = idx
        }

        var updatedCount = 0
        for (rawDisplayName, rawValue) in userMappings {
            let trimmedName = rawDisplayName.trimmingCharacters(in: .whitespacesAndNewlines)
            let newValue = rawValue
            let keyLower = trimmedName.lowercased()
            if let idx = indexByDisplayName[keyLower] {
                let current = existing[idx]
                if (current.value != newValue) && (!newValue.isEmpty || current.value.isEmpty) {
                    existing[idx] = DataMappings(variable: current.variable, displayName: trimmedName, value: newValue)
                    updatedCount += 1
                } else if current.displayName != trimmedName { // update casing if changed
                    existing[idx] = DataMappings(variable: current.variable, displayName: trimmedName, value: current.value)
                }
            } else {
                existing.append(DataMappings(variable: "", displayName: trimmedName, value: newValue))
                indexByDisplayName[keyLower] = existing.count - 1
                updatedCount += 1
            }
        }

        setDataMappings(dataMappings: existing)
        LogUtils.printMessage(message: "🔄 Merged user dataMappings; new/updated entries=\(updatedCount)")
        logDataMappings(interceptId: kDataMappings, action: "MERGE", mappings: existing)
        return existing
    }

    // Convenience: update a single mapping by displayName
    @discardableResult
    public static func updateDataMappingValue(displayName: String, value: String) -> Bool {
        guard var existing = getDataMappings() else { return false }
        let incomingTrimmed = displayName.trimmingCharacters(in: .whitespacesAndNewlines)
        var changed = false
        for i in 0..<existing.count {
            let existingTrimmed = existing[i].displayName.trimmingCharacters(in: .whitespacesAndNewlines)
            if existingTrimmed.compare(incomingTrimmed, options: .caseInsensitive) == .orderedSame {
                if existing[i].value != value {
                    let dm = existing[i]
                    existing[i] = DataMappings(variable: dm.variable, displayName: incomingTrimmed, value: value)
                    changed = true
                } else if existing[i].displayName != incomingTrimmed { // adjust casing/trim
                    let dm = existing[i]
                    existing[i] = DataMappings(variable: dm.variable, displayName: incomingTrimmed, value: dm.value)
                }
                break
            }
        }
        if changed {
            setDataMappings(dataMappings: existing)
            logDataMappings(interceptId: kDataMappings, action: "UPDATE", mappings: existing)
        }
        return changed
    }

    public static func getDataMappingValue(displayName: String) -> String? {
        let trimmedIncoming = displayName.trimmingCharacters(in: .whitespacesAndNewlines)
        let val = getDataMappings()?.first { dm in
            dm.displayName.trimmingCharacters(in: .whitespacesAndNewlines).compare(trimmedIncoming, options: .caseInsensitive) == .orderedSame
        }?.value
        LogUtils.printMessage(message: "🔍 Lookup dataMapping displayName=\(trimmedIncoming) value=\(val ?? "nil")")
        return val
    }

    // MARK: - Private logging helper
    private static func logDataMappings(interceptId: String, action: String, mappings: [DataMappings]) {
        guard !mappings.isEmpty else {
            LogUtils.printMessage(message: "ℹ️ \(action) dataMappings interceptId=\(interceptId) EMPTY")
            return
        }
        LogUtils.printMessage(message: "---- \(action) DataMappings interceptId=\(interceptId) ----")
        for dm in mappings {
            LogUtils.printMessage(message: "• variable=\(dm.variable) displayName=\(dm.displayName) value=\(dm.value)")
        }
        LogUtils.printMessage(message: "----------------------------------------------")
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
