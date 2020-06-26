//
//  SignupServiceInvocation.swift
//  ios
//
//  Created by Jignesh on 05/10/17.
//  Copyright © 2017 QuestionPro Pvt Ltd. All rights reserved.
//

import Foundation

import UIKit

protocol SignUpServiceDelegate {
    
    func signupDidFinish(invocation: SignupServiceInvocation) -> Void
    func signupDidFinishWithStatus(statusMessage: String, invocation: SignupServiceInvocation) -> Void
    func signupDidFinishWithError( error: String, invocation: SignupServiceInvocation) -> Void
}

class SignupServiceInvocation: WebServiceAsyncInvocation {
    
    var iDelegate: SignUpServiceDelegate?
    var iFirstName = ""
    var iLastName = ""
    var iEmailID = ""
    var iPassword = ""
    var iAccessCode = ""
    
    
    override func invoke() -> Void {
        
        var path = String()
        let appDetailsDict = GlobalData.fetchAppDetailsDict()
        
        let requestString = "/a/nativehtml/survey.auth.PanelMemberSignUp"
        if (appDetailsDict?["kSignupService"] != nil && appDetailsDict?["kServiceHost"] != nil) {
            path = (appDetailsDict?["kServiceHost"]! as! String) + (appDetailsDict?["kSignupService"]! as! String) as String
        }else {
            path = kServiceHost + requestString
        }
        
        var bodyData = [:] as Dictionary<String, AnyObject>
        if let apikey = appDetailsDict?["kPanelAPIKey"] as? String, !apikey.isEmpty {
            bodyData = ["firstName":self.iFirstName, "lastName":self.iLastName, "emailAddress":self.iEmailID, "password":self.iPassword, "platform":"ios", "deviceType":1, "apiKey":apikey] as [String : AnyObject] as [String : AnyObject]
        }else {
            bodyData = ["firstName":self.iFirstName, "lastName":self.iLastName, "emailAddress":self.iEmailID, "password":self.iPassword, "platform":"ios", "deviceType":1] as [String : AnyObject]
        }
        
        if appDetailsDict?["AccessCode"] as! Bool == true {
            bodyData["accessCode"] = self.iAccessCode as AnyObject
        }
        
        self.postMethod(path: path, bodyParam: bodyData)
        
    }
    
    override func handleHttpError(error : Error) {
        self.iDelegate?.signupDidFinishWithError(error: error.localizedDescription, invocation: self)
    }
    
    override func handleHttpOK(jsonObject : [String: Any]) {
    
                if let statuscode = jsonObject[ "statusCode"] as? Int {
                    
                    if statuscode == 200 {
                        if let bodyDict = jsonObject[ kBody] as? NSDictionary,
                            let memberStatus = bodyDict.value(forKey: kMemberStatus) as? String, memberStatus != "Verified"{
                            self.iDelegate?.signupDidFinishWithStatus(statusMessage: kSignupValidationMSG, invocation: self)
                            
                        }
                        
                        let userInfoDict : NSMutableDictionary = [:]
                        let appUserInfo : AppUser = AppUser.fromJSON(responseDict: jsonObject )
                        appUserInfo.emailAddress = self.iEmailID
                        appUserInfo.password = self.iPassword
                        if !self.iAccessCode.isEmpty {
                            appUserInfo.companyOrCommunityCode = self.iAccessCode
                            userInfoDict[kAccessCode] = self.iAccessCode
                        }
                        
                        if (jsonObject[ kAuthToken] != nil) {
                            appUserInfo.authToken = jsonObject[ kAuthToken] as? String
                            userInfoDict[kAuthToken] = jsonObject[ kAuthToken] as! String
                        }else{
                            userInfoDict[kAuthToken] = ""
                        }
                        if (jsonObject[ kBody] != nil) {
                            var bodyDict = jsonObject[ kBody] as? [String: Any]
                            if jsonObject["mainMenu.title"] != nil {
                                bodyDict?[kEmailID] = jsonObject["mainMenu.title"]
                            }
                            if jsonObject["mainMenu.profileImageUrl"] != nil {
                                bodyDict?[kProfilePic] = jsonObject["mainMenu.profileImageUrl"]
                            }
                            if jsonObject["mainMenu.title"] != nil {
                                userInfoDict[kEmailID] = jsonObject["mainMenu.title"] as! String
                                bodyDict?[kEmailID] = jsonObject["mainMenu.title"] as! String
                            }else{
                                userInfoDict[kEmailID] = self.iEmailID
                                bodyDict?[kEmailID] = self.iEmailID
                            }
                            userInfoDict[kBody] = bodyDict
                        }
                        
                        
                        
                        userInfoDict[kPassword] = self.iPassword
                        
                        iOSManager.sharedInstance.appUserInfo = appUserInfo
                        GlobalData.setUserInfoToUserDefault(key: kUserInfo, userInfo: userInfoDict as! [String : Any])
                        GlobalData.setAuthResponseToUserDefault(key: kAuthResponse, authResponse:jsonObject )
                        self.iDelegate?.signupDidFinish(invocation: self)
                        
                    }else{
                        
                        if (jsonObject[ "validationErrors"] != nil) {
                            let validationErrorList = jsonObject[ "validationErrors"] as? [[String: String]]
                            
                            if !(validationErrorList?.isEmpty)!  {
                                self.iDelegate?.signupDidFinishWithError(error: validationErrorList![0]["error"]!, invocation: self)
                            } else {
                                if  (jsonObject["errorAlert"] != nil) {
                                    self.iDelegate?.signupDidFinishWithError(error: jsonObject[ "errorAlert"] as! String , invocation: self)
                                }else{
                                    self.iDelegate?.signupDidFinishWithError(error: "", invocation: self)
                                }
                            }
                        }else {
                            if(jsonObject[ "errorAlert"] != nil) {
                                self.iDelegate?.signupDidFinishWithError(error:jsonObject[ "errorAlert"] as! String , invocation: self)
                            }
                        }
                    }
                }
                
            }
    
}
