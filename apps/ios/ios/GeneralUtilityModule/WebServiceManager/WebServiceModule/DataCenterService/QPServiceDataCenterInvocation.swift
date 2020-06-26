//
//  QPServiceDataCenterInvocation.swift
//  ios
//
//  Created by Jignesh on 17/03/17.
//  Copyright © 2017 QuestionPro Pvt Ltd. All rights reserved.
//

import Foundation

protocol DataCenterServiceDelegate {
    
    func globalLoginAuthDidFinish(invocation: QPServiceDataCenterInvocation) -> Void
    func globalLoginAuthDidFinishWithError( error: String, invocation: QPServiceDataCenterInvocation) -> Void
    
}

/*
 *  This block is called when refresh authtoken called.
 */

//typealias DataCenterServiceBlock = (_ responseString : String, _ errorDescription : Error) -> Void


class QPServiceDataCenterInvocation: WebServiceAsyncInvocation {
    
    var iDelegate: DataCenterServiceDelegate?
    var iAccessCode = ""
    
    override func invoke() -> Void {
        
        var path = String()
        let appDetailsDict = GlobalData.fetchAppDetailsDict()
        
        let requestString = "/a/nativehtml/panel.auth.PanelRequestHandler"
        if (appDetailsDict?["kGlobalDataService"] != nil && appDetailsDict?["kGlobalDataServiceHost"] != nil) {
            path = (appDetailsDict?["kGlobalDataServiceHost"]! as! String) + (appDetailsDict?["kGlobalDataService"]! as! String) as String
        }else {
            path = kServiceHost + requestString
        }
        
        var bodyData = [:] as Dictionary<String, AnyObject>
        if appDetailsDict?["AccessCode"] as! Bool == true {
            bodyData = ["accessCode":self.iAccessCode, "platform":"ios", "deviceType":1] as [String : AnyObject]
        }else {
            bodyData = ["platform":"ios", "deviceType":1] as [String : AnyObject]
        }
        if let apikey = appDetailsDict?["kPanelAPIKey"] as? String, !apikey.isEmpty {
            bodyData["apiKey"] = apikey as AnyObject
        }else {
            bodyData["apiKey"] = "" as AnyObject
        }
        
        self.postMethod(path: path, bodyParam: bodyData)
        
    }
    
    override func handleHttpError(error : Error) {
        self.iDelegate?.globalLoginAuthDidFinishWithError(error: error.localizedDescription as String, invocation: self)
    }

    override func handleHttpOK(jsonObject : [String: Any]) {
        
         if let statusCode = jsonObject["statusCode"] as? Int, statusCode == 200 {
            if let bodyDict = jsonObject["body"] as? [String:Any],
                let mobileAPIURL = bodyDict["mobileAPIURL"] as? String {
                GlobalData.writeGlobalLoginURLToPlist(key: "kServiceHost", globalURL: mobileAPIURL)
                self.iDelegate?.globalLoginAuthDidFinish(invocation: self)
            }else{
                if  let errorAlert = jsonObject["errorAlert"] as? String {
                    self.iDelegate?.globalLoginAuthDidFinishWithError(error: errorAlert, invocation: self)
                }
            }
         }else{
            if  let errorAlert = jsonObject["errorAlert"] as? String {
                self.iDelegate?.globalLoginAuthDidFinishWithError(error: errorAlert, invocation: self)
            }else{
                self.iDelegate?.globalLoginAuthDidFinishWithError(error: "Error in data center authentication", invocation: self)
            }
        }
    }

    
}
