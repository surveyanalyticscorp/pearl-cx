//
//  APIUtils.swift
//  QuestionProCXFramework
//
//  Created by Prasad on 21/03/25.
//

import Foundation

public class APIUtils {
    
    public static func getBaseURL() -> URLComponents {
        var components = URLComponents()
        components.scheme = "https"
        
        // Set the correct host based on environment
        if kEnvironment == kProductionEnvironment {
            components.host = kMobileAPIProduction
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
    
    @MainActor
    public static func updateInterceptSurveyLaunchEvent(interceptData: Intercept, visitorId: String, surveyType: String) -> Void {
        
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
                        "x-app-key": kXAPPKey,
                        "package-name": kPackageName,
                        "visitor-id": visitorId
                    ],
                    body: bodyParam,
                    responseType: InterceptSurveyLaunchEventResponse.self
                )
                print("Analytics: Update survey launch event success...")
            } catch {
                print("Analytics: Update survey launch event failed...")
            }
        }
        
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
}
