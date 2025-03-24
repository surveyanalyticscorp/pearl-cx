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

let kProductionEnvironment = "PRODUCTION"
let kStagingEnvironment = "STAGING"

//User defaults constant keys
public let kPageVisitCountKey = "PageVisitCountKey"

//API request types
public enum APIRequestType: String {
    case GET
    case POST
    
    var method: String {
        switch self {
        case .GET: return "GET"
        case .POST: return "POST"
        }
    }
}

//API Serivce constants
public let kMobileAPIStaging = "cx-intercept-staging-api.questionpro.com/api/v1/"
public let kMobileAPIProduction = "api.questionpro.com/api/v1/"

//API URLs
public let kMobileCXGetSurveyURL = "visitor/mobile"
public let kGetSurveyURL = "/cx/transactions/survey-url"

public let kEnvironment = kStagingEnvironment

