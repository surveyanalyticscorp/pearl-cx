//
//  MainMenu.swift
//  QuestionProCommunities
//
//  Created by Jignesh Raiyani on 8/26/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit

class MainMenu: NSObject {

    var menuItems = [MenuLinks]()
    var testString : String?
    
    override init() {
    }
    
    class func fromJSON (menuDict : [String: Any]) -> MainMenu {
        let mainMenu = MainMenu()
        if let menuLinks = menuDict["menuLinks"] as? NSArray {
            for i in 0 ..< menuLinks.count {
                if let menuItem = menuLinks[i] as? [String: Any] {
                    mainMenu.menuItems.append(MenuLinks.fromJSON(jsonDict: menuItem))
                }
            }
        }
        return mainMenu
    }
    
}
