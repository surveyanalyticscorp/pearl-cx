//
//  QPOTPServiceInvocation.swift
//  ios
//
//  Created by Jignesh Raiyani on 12/20/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit

protocol OTPServiceDelegate {
    
    func otpServiceDidFinish(invocation: QPOTPServiceInvocation) -> Void
    func otpServiceDidFinishWithError( error: String, invocation: QPOTPServiceInvocation) -> Void
}


class QPOTPServiceInvocation: WebServiceAsyncInvocation {
    
    var iDelegate: OTPServiceDelegate?
    var iOTPCode = ""
    var iEmailID = ""
    var iAccessCode = ""
    
    override func invoke() -> Void {
        
        
        var path = String()
        let appDetailsDict = GlobalData.fetchAppDetailsDict()
        
        let requestString = "/a/nativehtml/cx.auth.ValidateCXUserOTP"
        if (appDetailsDict?["kOTPService"] != nil && appDetailsDict?["kServiceHost"] != nil) {
            path = (appDetailsDict?["kServiceHost"]! as! String) + (appDetailsDict?["kOTPService"]! as! String) as String
        }else {
            path = kServiceHost + requestString
        }
        
        var bodyData = [:] as Dictionary<String, AnyObject>
        bodyData = ["emailAddress":self.iEmailID, "accessCode":self.iAccessCode, "otp":self.iOTPCode, "platform":"ios", "deviceType":1] as [String : AnyObject]
        if let apikey = appDetailsDict?["kPanelAPIKey"] as? String, !apikey.isEmpty {
            bodyData["apiKey"] = apikey as AnyObject
        }else {
            bodyData["apiKey"] = "" as AnyObject
        }
        
        self.postMethod(path: path, bodyParam: bodyData)
        
    }
    
    override func handleHttpError(error : Error) {
        self.iDelegate?.otpServiceDidFinishWithError(error: error.localizedDescription, invocation: self)
    }

    override func handleHttpOK(jsonObject : [String: Any]) {
        
        if let statusCode = jsonObject["statusCode"] as? Int, statusCode == 200 {
            self.iDelegate?.otpServiceDidFinish(invocation: self)
        }else{
            if let validationErrorList = jsonObject["validationErrors"] as? NSArray,
                validationErrorList.count > 0,
                let validationDict = validationErrorList[0] as? NSDictionary,
                let validationMSG = validationDict["error"] as? String {
                self.iDelegate?.otpServiceDidFinishWithError(error: validationMSG, invocation: self)
            }else{
                if  let errorAlert = jsonObject["errorAlert"] as? String {
                    self.iDelegate?.otpServiceDidFinishWithError(error: errorAlert, invocation: self)
                }else{
                    self.iDelegate?.otpServiceDidFinishWithError(error: "Error in OTP Authentication", invocation: self)
                }
            }
        }
    }


    
}
