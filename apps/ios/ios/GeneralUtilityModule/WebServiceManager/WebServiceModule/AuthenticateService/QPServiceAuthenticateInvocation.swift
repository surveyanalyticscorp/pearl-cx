//
//  QPServiceAuthenticateInvocation.swift
//  QuestionProCommunities
//
//  Created by Jignesh Raiyani on 8/21/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit

protocol AuthenticateServiceDelegate {
    
    func authenticateDidFinish(invocation: QPServiceAuthenticateInvocation) -> Void
    func authenticateDidFinishWithError( error: String, invocation: QPServiceAuthenticateInvocation) -> Void
}
typealias AuthenticateServiceBlock = (_ responseString : String) -> Void


class QPServiceAuthenticateInvocation: WebServiceAsyncInvocation {
    
    var iDelegate: AuthenticateServiceDelegate?
    var iEmailID = ""
    var iPassword = ""
    var iAccessCode = ""
    var iSourceMode = ""
    var iAuthenticateServiceBlock : AuthenticateServiceBlock!

    
    override func invoke() -> Void {
        
        var path = String()
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        let requestString = "/a/nativehtml/survey.auth.SurveyLogin"
        if let appDetailsDict = GlobalData.fetchAppDetailsDict(),
            let loginService = appDetailsDict["kLoginService"] as? String,
            let serviceHost = appDetailsDict["kServiceHost"] as? String {
            path = serviceHost + loginService
        }else {
            path = kServiceHost + requestString
        }
        
        var bodyData = [String:Any]()
        bodyData["emailAddress"] = self.iEmailID
        bodyData["password"] = self.iPassword
        bodyData["platform"] = "ios"
        bodyData["deviceType"] = 1
        bodyData["sourceMode"] = self.iSourceMode
        bodyData["udId"] = GlobalData.getUUIDForDevice()
        if let appDetailsDict = GlobalData.fetchAppDetailsDict(),
            let isAccessCodeEnable = appDetailsDict["AccessCode"] as? Bool, isAccessCodeEnable {
            bodyData["accessCode"] = self.iAccessCode
        }else if (appDelegate.appType == PocketAppType.QUESTIONPRO_CX_APP && self.iAccessCode.length > 0) {
            bodyData["accessCode"] = self.iAccessCode
        }else{
            bodyData["accessCode"] = ""
        }
        if let appDetailsDict = GlobalData.fetchAppDetailsDict(),
            let apikey = appDetailsDict["kPanelAPIKey"] as? String, apikey.length > 0 {
            bodyData["apiKey"] = apikey
        }else {
            bodyData["apiKey"] = ""
        }
        self.postMethod(path: path, bodyParam: bodyData)
        
    }
    
    override func handleHttpError(error : Error) {
        self.iDelegate?.authenticateDidFinishWithError(error: error.localizedDescription as String, invocation: self)
        if (self.iAuthenticateServiceBlock != nil) {
            self.iAuthenticateServiceBlock("")
        }
    }
    
    override func handleHttpOK(jsonObject : [String: Any]){
        
        if let statusCode = jsonObject["statusCode"] as? Int, statusCode == 200 {
            var userInfoDict = [String : Any]()
            let appUserInfo : AppUser = AppUser.fromJSON(responseDict: jsonObject)
            appUserInfo.emailAddress = self.iEmailID
            appUserInfo.password = self.iPassword
            if self.iAccessCode.length > 0 {
                appUserInfo.companyOrCommunityCode = self.iAccessCode
                userInfoDict[kAccessCode] = self.iAccessCode
            }
            if let authTokenString = jsonObject[kAuthToken] as? String {
                appUserInfo.authToken = authTokenString
                userInfoDict[kAuthToken] = authTokenString
            }else{
                userInfoDict[kAuthToken] = ""
            }
            if var bodyDict = jsonObject[kBody] as? [String:Any] {
                if let mainMenuObject = jsonObject["mainMenu"] as? [String: Any] {
                    bodyDict[kProfilePic] = mainMenuObject["profileImageUrl"]
                    bodyDict[kEmailID] = mainMenuObject["title"] ?? self.iEmailID
                    userInfoDict[kEmailID] = mainMenuObject["title"] ?? self.iEmailID
                }
                userInfoDict[kBody] = bodyDict
            }
            userInfoDict[kPassword] = self.iPassword
            
            iOSManager.sharedInstance.appUserInfo = appUserInfo
            GlobalData.setUserInfoToUserDefault(key: kUserInfo, userInfo: userInfoDict)
            GlobalData.setAuthResponseToUserDefault(key: kAuthResponse, authResponse:jsonObject)
            self.iDelegate?.authenticateDidFinish(invocation: self)
            if (self.iAuthenticateServiceBlock != nil) {
                if let authTokenString = appUserInfo.authToken {
                    self.iAuthenticateServiceBlock(authTokenString)
                }
            }
        }else {
            if let validationErrorList = jsonObject["validationErrors"] as? NSArray,
                validationErrorList.count > 0,
                let validationDict = validationErrorList[0] as? NSDictionary,
                let validationMSG = validationDict["error"] as? String {
                self.iDelegate?.authenticateDidFinishWithError(error: validationMSG, invocation: self)
                if (self.iAuthenticateServiceBlock != nil) {
                    self.iAuthenticateServiceBlock("")
                }
            }else{
                if  let errorAlert = jsonObject["errorAlert"] as? String {
                    self.iDelegate?.authenticateDidFinishWithError(error: errorAlert, invocation: self)
                }else{
                    self.iDelegate?.authenticateDidFinishWithError(error: "Error in Authentication", invocation: self)
                }
                if (self.iAuthenticateServiceBlock != nil) {
                    self.iAuthenticateServiceBlock("")
                }
            }
        }
        
    }
    
    
}
