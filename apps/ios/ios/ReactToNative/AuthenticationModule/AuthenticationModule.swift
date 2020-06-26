//
//  AuthenticationModule.swift
//  ios
//
//  Created by Jignesh on 16/05/18.
//  Copyright © 2018 Jignesh. All rights reserved.
//

import Foundation
import UIKit

@objc(AuthenticationModule)
class AuthenticationModule: NSObject {
    
    @objc(getAuthToken:errorCallback:)
    func getAuthToken(successCallback: RCTResponseSenderBlock, errorCallback: RCTResponseErrorBlock) -> Void {
        var authTokenList = [String]()
        let userInfoDict = GlobalData.getUserInfoFromUserDefault(kUserInfo)
         if let authTokenString = userInfoDict[kAuthToken] as? String, authTokenString.length > 0 {
            authTokenList.append(authTokenString)
         }else{
            authTokenList.append("")
        }
        successCallback(authTokenList)
    }
    
    @objc(refreshAuthToken:)
    func refreshAuthToken(successCallback: RCTResponseSenderBlock) -> Void {
        var authTokenList = [String]()
        let userInfoDict = GlobalData.getUserInfoFromUserDefault(kUserInfo)
        let iAuthenticateService = QPServiceAuthenticateInvocation()
        if let email = userInfoDict[kEmailID] as? String{
            iAuthenticateService.iEmailID = email
        }
        if let password = userInfoDict[kPassword] as? String{
            iAuthenticateService.iPassword = password
        }
        if let accessCode = userInfoDict[kAccessCode] as? String{
            iAuthenticateService.iAccessCode = accessCode
        }
        iAuthenticateService.invoke()
        iAuthenticateService.iAuthenticateServiceBlock = { responseString in
            if responseString.length > 0 {
                authTokenList.append(responseString)
            }else{
                authTokenList.append("")
                DispatchQueue.main.sync {
                    let appDelegate = UIApplication.shared.delegate as! AppDelegate
                    appDelegate.iWindow?.makeToast("Could not verify user, Please login again.", duration: 3.0, position: .top)
                    NotificationCenter.default.post(name: NSNotification.Name(kLogoutUser), object: nil)
                }
               
            }
        }
        successCallback(authTokenList);
    }
}
