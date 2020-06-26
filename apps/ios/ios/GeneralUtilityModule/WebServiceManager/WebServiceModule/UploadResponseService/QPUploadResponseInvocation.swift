//
//  QPUploadResponseInvocation.swift
//  ios
//
//  Created by Jignesh on 22/01/18.
//  Copyright © 2018 QuestionPro Pvt Ltd. All rights reserved.
//

import Foundation
import UIKit

let kLocationID = "locationID"
let kLocationGroupID = "locationGroupID"
let kLocationName = "locationName"
let kTrackType = "trackType"
let kTrackMovementType = "trackMovementType"
let kBatteryLevel = "batteryLevel"
let kTimeStamp = "timeStamp"
let kUniqueKey = "uniqueKey"
let kOS = "os"

@objc protocol UploadResponseDelegate {
    
    func uploadResponseDidFinish(invocation: QPUploadResponseInvocation) -> Void
    func uploadResponseDidFinishWithError( error: String, invocation: QPUploadResponseInvocation) -> Void
}


class QPUploadResponseInvocation: WebServiceAsyncInvocation {
    
    var iDelegate: UploadResponseDelegate?

    
    override func invoke() -> Void {
        
        var path = String()
        let requestString = "/a/nativehtml/panel.locationsurvey.LocationTrack"
        if let appDetailsDict = GlobalData.fetchAppDetailsDict(),
            let loginService = appDetailsDict["kUploadResponseService"] as? String,
            let serviceHost = appDetailsDict["kServiceHost"] as? String {
            path = serviceHost + loginService
        }else {
            path = kServiceHost + requestString
        }
        let uploadResponseList : NSMutableArray = []
        let locationResponses = DataBaseController.fetchLocationResponse()
         for locationResponse in locationResponses  {
         var locationDict : [String : Any] = [:]
        locationDict[kLocationID] = NSNumber.init(value: locationResponse.locationID)
        locationDict[kLocationGroupID] = NSNumber.init(value: locationResponse.locationGroupID)
         if let name = locationResponse.locationName, name.length > 0 {
            locationDict[kLocationName] = locationResponse.locationName
         }else{
            locationDict[kLocationName] = "N/A"
         }
         if let trackType = locationResponse.trackType, trackType.length > 0 {
            locationDict[kTrackType] = locationResponse.trackType
         }else{
            locationDict[kTrackType] = "N/A"
         }
         if let trackMovementType = locationResponse.trackMovementType, trackMovementType.length > 0 {
            locationDict[kTrackMovementType] = locationResponse.trackMovementType
         }else{
            locationDict[kTrackMovementType] = "N/A"
         }
            locationDict[kBatteryLevel] = NSString(format: "%f", locationResponse.batteryLevel)
            locationDict[kTimeStamp] = NSNumber.init(value:locationResponse.timeStamp)
            locationDict[kUniqueKey] = NSNumber.init(value: locationResponse.uniqueKey)
            locationDict[kOS] = "iOS"
            uploadResponseList.add(locationDict)
         }
        let uploadResponseDict = ["locationTracks":uploadResponseList];
        self.postMethod(path: path, bodyParam: uploadResponseDict)
        UIApplication.shared.isNetworkActivityIndicatorVisible = true
    }
    
    
    override func handleHttpError(error : Error) {
        UIApplication.shared.isNetworkActivityIndicatorVisible = false
    }
    
   override func handleHttpOK(jsonObject : [String: Any]){
        UIApplication.shared.isNetworkActivityIndicatorVisible = false
        if let statusCode = jsonObject["statusCode"] as? Int,
            statusCode == 200 {
            DataBaseController.deleteLocationResponseFromDB()
            self.iDelegate?.uploadResponseDidFinish(invocation: self)
        }else{
            if let validationErrorList = jsonObject["validationErrors"] as? NSArray,
                validationErrorList.count > 0,
                let validationDict = validationErrorList[0] as? NSDictionary,
                let validationMSG = validationDict["error"] as? String {
                self.iDelegate?.uploadResponseDidFinishWithError(error: validationMSG, invocation: self)
            }else{
                if  let errorAlert = jsonObject["errorAlert"] as? String {
                    self.iDelegate?.uploadResponseDidFinishWithError(error: errorAlert, invocation: self)
                }else{
                    self.iDelegate?.uploadResponseDidFinishWithError(error: "Error in upload response", invocation: self)
                }
            }
        }
    }

    
}
