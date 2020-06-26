//
//  QPUpdatePasswordServiceInvocation.swift
//  ios
//
//  Created by Jignesh Raiyani on 12/20/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit
import Alamofire

@objc protocol LocationDataServiceDelegate {
    
    func LocationDataDidFinish(invocation: QPLocationDataServiceInvocation, aDBPath: String) -> Void
    @objc optional func LocationDataDidFinishWithError( error: String, invocation: QPLocationDataServiceInvocation) -> Void
}


class QPLocationDataServiceInvocation: WebServiceAsyncInvocation {
    
    var iDelegate: LocationDataServiceDelegate?
    
    override func invoke() -> Void {
        
        var path = String()
        let requestString = "/a/nativehtml/panel.locationsurvey.LocationSurveys"
        if let appDetailsDict = GlobalData.fetchAppDetailsDict(),
            let updatePasswordService = appDetailsDict["kLocationDataService"] as? String,
            let serviceHost = appDetailsDict["kServiceHost"] as? String {
            path = serviceHost + updatePasswordService
        }else {
            path = kServiceHost + requestString
        }
        
        let bodyData = [String:Any]()
        self.postMethod(path: path, bodyParam: bodyData)
        
    }
    
    
    override func handleHttpError(error : Error) {
        print(error)
    }

    override func handleHttpOK(jsonObject : [String: Any]) {
        if let statusCode = jsonObject["statusCode"] as? Int,
            let dict = jsonObject["body"] as? [String: Any],
            let locationSurveyDBTimestamp = dict["locationSurveyDBTimestamp"] as? Int64,
            let surveyDBFile = dict["surveyDBFile"] as? String,
            statusCode == 200 {
            if surveyDBFile.length > 0 {
                let lastSyncTimeStamp = GlobalData.getLocationTimeStampFromUserDefault()
                let documentsURL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
                let fileURL = documentsURL.appendingPathComponent("LocationSurvey.sqlite")
                if lastSyncTimeStamp != locationSurveyDBTimestamp {
                    let destination: DownloadRequest.DownloadFileDestination = { _, _ in
                        return (fileURL, [.removePreviousFile, .createIntermediateDirectories])
                    }
                    Alamofire.download(surveyDBFile, to: destination).downloadProgress {progress in
                        }.response { defaultDownloadResponse in
                            // TODO: Handle cancelled error
                            if let error = defaultDownloadResponse.error {
                                print("Download Failed with error - \(error)")
                                // self.iDelegate?.LocationDataDidFinishWithError(error: "Error in downloading location", invocation: self)
                                return
                            }
                            GlobalData.setLocationTimeStampToUserDefault(aLocationTimeStamp: locationSurveyDBTimestamp)
                            self.iDelegate?.LocationDataDidFinish(invocation: self, aDBPath: fileURL.path)
                    }
                }else{
                    self.iDelegate?.LocationDataDidFinish(invocation: self, aDBPath: fileURL.path)
                }
            }
        }else{
//            if let validationErrorList = jsonObject["validationErrors"] as? NSArray,
//                validationErrorList.count > 0,
//                let validationDict = validationErrorList[0] as? NSDictionary,
//                let validationMSG = validationDict["error"] as? String {
//                self.iDelegate?.LocationDataDidFinishWithError(error: validationMSG, invocation: self)
//            }else{
//                if  let errorAlert = jsonObject["errorAlert"] as? String {
//                    self.iDelegate?.LocationDataDidFinishWithError(error: errorAlert, invocation: self)
//                }else{
//                    self.iDelegate?.LocationDataDidFinishWithError(error: "Error in downloading location", invocation: self)
//                }
//            }
        }
    }

}
