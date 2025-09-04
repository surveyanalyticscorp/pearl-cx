//
//  APIUtils.swift
//  QuestionProCXFramework
//
//  Created by Prasad on 21/03/25.
//

import Foundation

public class APIUtils {
    
    public static func getBaseURL() -> URLComponents {
        let dataCenter: String = CacheUtils.getFromUserDefaults(key: kDataCenter, type: String.self)!
        let baseURL = getBaseUrl(dataCenter: dataCenter)
        var components = URLComponents()
        components.scheme = "https"
        
        // Set the correct host based on environment
        if kEnvironment == kProductionEnvironment {
            components.host = baseURL
        } else if kEnvironment == kStagingEnvironment {
            components.host = kMobileAPIStaging
        }
        
        return components
    }

    public static func getVisitorMobileAPIURL() -> String {
        var components = getBaseURL()
        components.path = kMobileCXGetSurveyURL
        return components.url?.absoluteString ?? ""
    }
    
    public static func getFetchSurveyURL() -> String {
        var components = getBaseURL()
        components.path = kGetSurveyURL
        return components.url?.absoluteString ?? ""
    }
    
    public static func getUpdateInterceptSurveyLaunchEventURL() -> String {
        var components = getBaseURL()
        components.path = kSurveyFeedbackURL
        return components.url?.absoluteString ?? ""
    }
    
    public static func getCoreSurveyFeedbackURL() -> String {
        var components = getBaseURL()
        components.path = kCoreSurveyFeedbackURL
        return components.url?.absoluteString ?? ""
    }
    
    @MainActor
    public static func updateInterceptSurveyLaunchEvent(interceptData: Intercept, visitorId: String, surveyType: String) -> Void {
        let apiKey: String = CacheUtils.getFromUserDefaults(key: kApiKey, type: String.self)!
        var bodyParam = [:] as [String: Any]
        bodyParam["ruleGroupId"] = interceptData.ruleGroupId;
        bodyParam["interceptId"] = interceptData.id;
        bodyParam["surveyId"] = interceptData.surveyId;
        bodyParam["surveyType"] = surveyType
        let updateInterceptSurveyLaunchEventURL = self.getUpdateInterceptSurveyLaunchEventURL()
        
        Task {
            do {
                let response: InterceptSurveyLaunchEventResponse = try await ApiServiceCX.shared.request(
                    urlString: updateInterceptSurveyLaunchEventURL,
                    method: .POST,
                    headers: [
                        "x-app-key": apiKey,
                        "package-name": kPackageName,
                        "visitor-id": visitorId
                    ],
                    body: bodyParam,
                    responseType: InterceptSurveyLaunchEventResponse.self
                )
            } catch {
                
            }
        }
    }
    
    public static func getBaseUrl(dataCenter: String) -> String {
            switch dataCenter {
            case "DATA_CENTER_US":
                return "intercept-api.questionpro.com"
            case "DATA_CENTER_AE":
                return "intercept-api.questionpro.ae"
            case "DATA_CENTER_AU":
                return "intercept-api.questionpro.au"
            case "DATA_CENTER_EU":
                return "intercept-api.questionpro.eu"
            case "DATA_CENTER_CA":
                return "intercept-api.questionpro.ca"
            case "DATA_CENTER_SG":
                return "intercept-api.questionpro.sg"
            default:
                return "intercept-api.questionpro.com"
            }
        }
}
