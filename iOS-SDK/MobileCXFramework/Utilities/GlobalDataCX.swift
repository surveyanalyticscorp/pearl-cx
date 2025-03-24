//
//  GlobalData.swift
//  MobileCXFramework
//
//  Created by Prasad on 30/07/24.
//

import Foundation
import Security

public class GlobalData {
    
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


