//
//  GlobalUtils.swift
//  QuestionProCXFramework
//
//  Created by Prasad on 05/08/25.
//

import Foundation
import UIKit


public class GlobalUtils {
    
    @MainActor public static func getDeviceId() -> String {
        if let identifier = UIDevice.current.identifierForVendor?.uuidString {
            return identifier
        }
        return "";
    }
    /// Fetches the host app's resolved language (like "en", "fr", "hi")
    public static func getAppLanguage() -> String {
        if let language = Bundle.main.preferredLocalizations.first {
            LogUtils.printMessage(message: "App Language: \(language)")
            return language
        } else {
            // Fallback to system preferred language
            let fallback = Locale.preferredLanguages.first ?? ""
            LogUtils.printMessage(message: "Fallback Language: \(fallback)")
            return fallback
        }
    }
}

