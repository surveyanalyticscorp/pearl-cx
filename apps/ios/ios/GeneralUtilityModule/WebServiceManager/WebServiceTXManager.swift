//
//  WebServiceTXManager.swift
//  QuestionProCommunities
//
//  Created by Jignesh Raiyani on 8/21/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import Foundation
import UIKit

class WebServiceTXManager: NSObject {
    
    class func invokeGlobalLoginService (aDelegate : DataCenterServiceDelegate, aAccessCode : String) -> Bool {
        
        if GlobalData.checkInternetConnection() {
            let iGlobalDataService = QPServiceDataCenterInvocation()
            iGlobalDataService.iAccessCode = aAccessCode
            iGlobalDataService.iDelegate = aDelegate
            iGlobalDataService.invoke()
            return true
        } else {
            self.showNetworkAlert()
            return false
        }
    }
    

    class func invokeAuthenticateService (aDelegate : AuthenticateServiceDelegate, aEmailID : String, aPassword : String, aAccessCode : String, aSourceMode : String) -> Bool {

        if GlobalData.checkInternetConnection() {
            let iAuthenticateService = QPServiceAuthenticateInvocation()
            iAuthenticateService.iEmailID = aEmailID
            iAuthenticateService.iPassword = aPassword
            iAuthenticateService.iAccessCode = aAccessCode
            iAuthenticateService.iSourceMode = aSourceMode
            iAuthenticateService.iDelegate = aDelegate
            iAuthenticateService.invoke()
            return true
        } else {
            self.showNetworkAlert()
            return false
        }
    }
    
    class func invokeResetPasswordService (aDelegate : ResetPasswordServiceDelegate, aEmailID : String, aAccessCode : String) -> Bool {

        if GlobalData.checkInternetConnection() {
            let iResetService = QPResetPasswordServiceInvocation()
            iResetService.iEmailID = aEmailID
            iResetService.iAccessCode = aAccessCode
            iResetService.iDelegate = aDelegate
            iResetService.invoke()
            return true
        } else {
            self.showNetworkAlert()
            return false
        }
    }
    
    class func invokeOTPService (aDelegate : OTPServiceDelegate, aEmailID : String, aAccessCode : String, aOTP : String) -> Bool {

        if GlobalData.checkInternetConnection() {
            let iOTPService = QPOTPServiceInvocation()
            iOTPService.iEmailID = aEmailID
            iOTPService.iAccessCode = aAccessCode
            iOTPService.iOTPCode = aOTP
            iOTPService.iDelegate = aDelegate
            iOTPService.invoke()
            return true
        } else {
            self.showNetworkAlert()
            return false
        }
    }
    
    class func invokeUpdatePasswordService (aDelegate : UpdatePasswordServiceDelegate, aEmailID : String, aPassword : String, aAccessCode : String) -> Bool {
        
        if GlobalData.checkInternetConnection() {
            let iUpdatePasswordService = QPUpdatePasswordServiceInvocation()
            iUpdatePasswordService.iEmailID = aEmailID
            iUpdatePasswordService.iPassword = aPassword
            iUpdatePasswordService.iAccessCode = aAccessCode
            iUpdatePasswordService.iDelegate = aDelegate
            iUpdatePasswordService.invoke()
            return true
        } else {
            self.showNetworkAlert()
            return false
        }
    }
    
    class func uploadLocationDataService (aDelegate : UploadResponseDelegate) {
        
        if GlobalData.checkInternetConnection() {
            let uploadLocationDataService = QPUploadResponseInvocation()
            uploadLocationDataService.iDelegate = aDelegate
            uploadLocationDataService.invoke()
        } else {
            self.showNetworkAlert()
        }
    }
    
    class func invokeLocationDataService (aDelegate : LocationDataServiceDelegate) {
        
        if GlobalData.checkInternetConnection() {
            let uploadLocationDataService = QPLocationDataServiceInvocation()
            uploadLocationDataService.iDelegate = aDelegate
            uploadLocationDataService.invoke()
        } else {
            self.showNetworkAlert()
        }
    }
    
    class func invokeSignupService (aDelegate : SignUpServiceDelegate, aFirstName : String, aLastName : String, aEmailID : String, aPassword : String, aAccessCode : String) -> Bool {
        
        if GlobalData.checkInternetConnection() {
            
            let iSignupService = SignupServiceInvocation()
            iSignupService.iFirstName = aFirstName
            iSignupService.iLastName = aLastName
            iSignupService.iEmailID = aEmailID
            iSignupService.iPassword = aPassword
            iSignupService.iAccessCode = aAccessCode
            iSignupService.iDelegate = aDelegate
            iSignupService.invoke()
            return true
        } else {
            self.showNetworkAlert()
            return false
        }
    }
    
    class func showNetworkAlert (){
        let alert = UIAlertView(title: "No Internet Connection", message: "Make sure your device is connected to the internet.", delegate: nil, cancelButtonTitle: "OK")
        alert.show()

    }
}
