//
//  QPUpdatePasswordServiceInvocation.swift
//  ios
//
//  Created by Jignesh Raiyani on 12/20/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit

protocol UpdatePasswordServiceDelegate {
    
    func updatePasswordDidFinish(invocation: QPUpdatePasswordServiceInvocation, aMessage: String) -> Void
    func updatePasswordDidFinishWithError( error: String, invocation: QPUpdatePasswordServiceInvocation) -> Void
}


class QPUpdatePasswordServiceInvocation: WebServiceAsyncInvocation {
    
    var iDelegate: UpdatePasswordServiceDelegate?
    var iEmailID = ""
    var iAccessCode = ""
    var iPassword = ""
    
    override func invoke() -> Void {
        
        var path = String()
        let requestString = "/a/nativehtml/panel.auth.PanelMemberUpdatePassword"
        let appDetailsDict = GlobalData.fetchAppDetailsDict()
        if let updatePasswordService = appDetailsDict?["kUpdatePasswordService"] as? String,
            let serviceHost = appDetailsDict?["kServiceHost"] as? String {
            path = serviceHost + updatePasswordService
        }else {
            path = kServiceHost + requestString
        }
        
        var bodyData = [String:Any]()
            bodyData = ["emailAddress":self.iEmailID, "password":self.iPassword, "accessCode":self.iAccessCode, "platform":"ios", "deviceType":1]
        
        if let apikey = appDetailsDict?["kPanelAPIKey"] as? String, !apikey.isEmpty {
            bodyData["apiKey"] = apikey as AnyObject
        }else {
            bodyData["apiKey"] = "" as AnyObject
        }
        self.postMethod(path: path, bodyParam: bodyData)
        
    }
    
    override func handleHttpError(error : Error) {
        self.iDelegate?.updatePasswordDidFinishWithError(error: error.localizedDescription, invocation: self)
    }

    override func handleHttpOK(jsonObject : [String: Any]) {
        if let statusCode = jsonObject["statusCode"] as? Int,
            let dict = jsonObject["body"] as? [String: Any],
            let message = dict["message"] as? String,
            statusCode == 200 {
            self.iDelegate?.updatePasswordDidFinish(invocation: self, aMessage: message)
        }else{
            if let validationErrorList = jsonObject["validationErrors"] as? NSArray,
                validationErrorList.count > 0,
                let validationDict = validationErrorList[0] as? NSDictionary,
                let validationMSG = validationDict["error"] as? String {
                self.iDelegate?.updatePasswordDidFinishWithError(error: validationMSG, invocation: self)
            }else{
                if  let errorAlert = jsonObject["errorAlert"] as? String {
                    self.iDelegate?.updatePasswordDidFinishWithError(error: errorAlert, invocation: self)
                }else{
                    self.iDelegate?.updatePasswordDidFinishWithError(error: "Error in reseting password", invocation: self)
                }
            }
        }
    }

}
