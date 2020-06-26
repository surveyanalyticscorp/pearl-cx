//
//  ContextMenu.swift
//  QuestionProCommunities
//
//  Created by Jignesh Raiyani on 8/29/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit

class ContextMenu: NSObject {
    
    var menuItems = [MenuLinks]()
    
    class func fromJSON (menuDict : [String:Any]) -> ContextMenu {
        let contextMenu = ContextMenu()
        if let menuLinks : NSArray = menuDict["menuLinks"] as? NSArray {
            for i in 0 ..< menuLinks.count {
                if let menuItem = menuLinks[i] as? [String: Any] {
                    contextMenu.menuItems.append(MenuLinks.fromJSON(jsonDict: menuItem))
                }
            }
        }
        return contextMenu
    }


}
