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
public let kViewCount = "ViewCount"
public let kInterceptRulesForId = "InterceptRulesForId"
public let kSatisfiedRulesForId = "SatisfiedRulesForId"
public let kIsSurveyLaunched = "IsSurveyLaunched"
public let kIntercepts = "Intercepts"
public let kApiKey = "apiKey"
public let kDataCenter = "dataCenter"
private let kConfigType = "configType"

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
public let kMobileAPIProduction = "intercept-api.questionpro.com"

//API URLs
public let kMobileCXGetSurveyURL = "/api/v1/visitor/mobile"
//public let kGetSurveyURL = "/cx/transactions/survey-url"
public let kGetSurveyURL = "/api/v1/data-mapping/mobile/survey-url"
public let kSurveyFeedbackURL = "/api/v1/visitor/mobile/survey-feedback"
public let kCoreSurveyFeedbackURL = "/a/api/v2/surveys/"

let bundleIdentifier = Bundle.main.bundleIdentifier! as String
public let kPackageName = bundleIdentifier

public let kEnvironment = kProductionEnvironment

public enum InterceptType: String {
    case PROMPT, EMBED, SURVEY_URL
}

public enum InterceptRuleType: String {
    case TIME_SPENT, VIEW_COUNT, DAY, DATE
}

public enum InterceptCondition: String {
    case AND, OR
}

public enum InterceptSurveyLaunchEvent: String {
    case MATCHED, LAUNCHED
}

public enum LogTag: String {
    case LOG_ERROR, LOG_INFO
    
    var method: String {
        switch self {
        case .LOG_ERROR: return "SDK_ERROR"
        case .LOG_INFO: return "SDK_INFO"
        }
    }
    
}
