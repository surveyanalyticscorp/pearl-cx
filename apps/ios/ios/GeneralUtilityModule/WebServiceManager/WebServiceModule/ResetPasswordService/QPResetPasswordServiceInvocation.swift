//
//  QPResetPasswordServiceInvocation.swift
//  ios
//
//  Created by Jignesh Raiyani on 12/8/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit

protocol ResetPasswordServiceDelegate {
    
    func reserPasswordDidFinish(invocation: QPResetPasswordServiceInvocation) -> Void
    func reserPasswordDidFinishWithError( error: String, invocation: QPResetPasswordServiceInvocation) -> Void
}


class QPResetPasswordServiceInvocation: WebServiceAsyncInvocation {
    
    var iDelegate: ResetPasswordServiceDelegate?
    var iEmailID = ""
    var iAccessCode = ""

    
    override func invoke() -> Void {
        
        var path = String()
        let requestString = "/a/nativehtml/cx.auth.CXForgotPasswordOTP"
        let appDetailsDict = GlobalData.fetchAppDetailsDict()
        if let resetPasswordService = appDetailsDict?["kResetPasswordService"] as? String,
            let serviceHost = appDetailsDict?["kServiceHost"] as? String {
                path = serviceHost + resetPasswordService
        }else {
                path = kServiceHost + requestString
        }
        
       
        var bodyData = [String:Any]()
        if let appDetailsDict = GlobalData.fetchAppDetailsDict(),
            let isAccessCodeEnable = appDetailsDict["AccessCode"] as? Bool, isAccessCodeEnable {
            bodyData = ["emailAddress":self.iEmailID, "accessCode":self.iAccessCode, "platform":"ios", "deviceType":1]
        }else {
            bodyData = ["emailAddress":self.iEmailID, "platform":"ios", "deviceType":1, "accessCode": ""]
        }
        if let apikey = appDetailsDict?["kPanelAPIKey"] as? String, !apikey.isEmpty {
            bodyData["apiKey"] = apikey as AnyObject
        }else {
            bodyData["apiKey"] = "" as AnyObject
        }
       
        self.postMethod(path: path, bodyParam: bodyData)
    }
    
    override func handleHttpError(error : Error) {
        self.iDelegate?.reserPasswordDidFinishWithError(error: error.localizedDescription, invocation: self)
    }

    override func handleHttpOK(jsonObject : [String: Any]) {
         if let statusCode = jsonObject["statusCode"] as? Int, statusCode == 200 {
            self.iDelegate?.reserPasswordDidFinish(invocation: self)
         }else{
            if let validationErrorList = jsonObject["validationErrors"] as? NSArray,
                validationErrorList.count > 0,
                let validationDict = validationErrorList[0] as? NSDictionary,
                let validationMSG = validationDict["error"] as? String {
                self.iDelegate?.reserPasswordDidFinishWithError(error: validationMSG, invocation: self)
            }else{
                if  let errorAlert = jsonObject["errorAlert"] as? String {
                    self.iDelegate?.reserPasswordDidFinishWithError(error: errorAlert, invocation: self)
                }else{
                    self.iDelegate?.reserPasswordDidFinishWithError(error: "Error in Reset Password", invocation: self)
                }
            }
        }
    }
    
}
