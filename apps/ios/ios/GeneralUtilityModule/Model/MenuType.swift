//
//  MenuType.swift
//  QuestionProCommunities
//
//  Created by Jignesh Raiyani on 8/26/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit



enum MenuTypes : String {
    
    case LOGOUT = "Logout"
    case SHARE = "Share"
    case LINK = "Link"
    case HOME = "Home"
    
    var description: String {
        return self.rawValue
    }
}