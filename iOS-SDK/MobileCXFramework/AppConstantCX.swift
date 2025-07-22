//
//  AppConstantCX.swift
//  MobileCXFramework
//
//  Created by Prasad on 30/07/24.
//

import Foundation

public let ksurveyURL  = "surveyURL"
public let kisDialog = "isDialog"

/******* Keychain Constant *********/
public let kKeyChainWrapperBundleId = "com.surveyAnalytics.mobileCX"
public enum LogTag: String {
    case LOG_ERROR, LOG_INFO
    
    var method: String {
        switch self {
        case .LOG_ERROR: return "SDK_ERROR"
        case .LOG_INFO: return "SDK_INFO"
        }
    }
}
