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
public let kInterceptRulesForId = "InterceptRulesForId"
public let kSatisfiedRulesForId = "SatisfiedRulesForId"
public let kIsSurveyLaunched = "IsSurveyLaunched"
public let kIntercepts = "Intercepts"

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
public let kMobileAPIStaging = "cx-intercept-staging-api.questionpro.com"
public let kMobileAPIProduction = "api.questionpro.com/"

//API URLs
public let kMobileCXGetSurveyURL = "/api/v1/visitor/mobile"
public let kGetSurveyURL = "/cx/transactions/survey-url"

public let kEnvironment = kStagingEnvironment

public enum InterceptType: String {
    case PROMPT, EMBED
}

public enum InterceptRuleType: String {
    case TIME_SPENT, VIEW_COUNT, DAY, DATE
}

public enum InterceptCondition: String {
    case AND, OR
}
