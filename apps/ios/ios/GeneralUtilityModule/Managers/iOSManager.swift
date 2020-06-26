//
//  iOSManager.swift
//  ios
//
//  Created by Jignesh Raiyani on 9/23/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit

private let _sharedInstance = iOSManager()

class iOSManager {
    
    var iOptionMenuItems: [MenuLinks] = []
    var appUserInfo : AppUser = AppUser()
    
    class var sharedInstance: iOSManager {
        struct Singleton {
            static let instance: iOSManager = iOSManager()
        }
        
        return Singleton.instance
    }
    
    
}
