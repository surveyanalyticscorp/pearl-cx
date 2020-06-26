//
//  AppUser.swift
//  QuestionProCommunities
//
//  Created by Jignesh Raiyani on 8/26/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit

class AppUser: NSObject {
    
    var emailAddress : String?
    var subTitle : String?
    var password : String?
    var companyOrCommunityCode : String?
    var authToken : String?
    var companyLogoUrl : String?
    var mainMenu =  [MainMenu]()

    override init() {
    }
    
    class func fromJSON (responseDict : [String: Any]) -> AppUser {
        
        let appUser = AppUser()
        
        if let emailID = responseDict["title"] as? String {
            appUser.emailAddress = emailID
        }
        if  let subTitle = responseDict["subtitle"] as? String {
            appUser.subTitle = subTitle
        }
        if  let authToken = responseDict["authToken"] as? String {
            appUser.authToken = authToken
        }
        if  let companyCode = responseDict["companyCode"] as? String {
            appUser.companyOrCommunityCode = companyCode
        }
        if let mainMenu = responseDict["mainMenu"] as? [String: Any],
            let companyLogoUrl = mainMenu["companyLogoUrl"] as? String {
            appUser.companyLogoUrl = companyLogoUrl
        }
        if let mainMenu = responseDict["mainMenu"] as? [String: Any] {
            appUser.mainMenu = [MainMenu.fromJSON(menuDict: mainMenu)]
        }
        return appUser
    }

}
