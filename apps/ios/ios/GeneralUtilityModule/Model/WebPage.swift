    //
//  WebPage.swift
//  QuestionProCommunities
//
//  Created by Jignesh Raiyani on 8/29/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit

class WebPage: NSObject {

    var id : NSNumber?
    var title : String?
    var memberCount : NSNumber?
    var mainMenu =  [MainMenu]()
    var contextMenu =  [ContextMenu]()
    
    // @sujan Show employee image or static done button on the navigation bar.
    var rightButtonImg: String?
    var isStatic = false
    
    // @sujan For portions of objectives and goals.
    var showMenuIcon = false
    var showStat = true
    // @sachin CX close button
    var showCloseButton = false
    override init() {
    }
    
    class func fromJSON (responseDict : [String: Any]) -> WebPage {
        
        let webPage = WebPage()
        if let title = responseDict["title"] as? String {
            webPage.title = title
        }
        if let body = responseDict["body"] as? [String: Any],
            let memberCount = body["memberCount"] as? Int {
            GlobalData.writeEmployDetailsToPlist(memberCount: String(memberCount))
        }
        if let contextMenu = responseDict["contextMenu"] as? [String:Any] {
            webPage.contextMenu = [ContextMenu.fromJSON(menuDict: contextMenu)]
        }
        // @sujan Show employee image or static done button on the navigation bar.
        if let image = responseDict["image"] as? String {
            webPage.rightButtonImg = image
        }
        if let isStatic = responseDict["isStatic"] as? Bool {
            webPage.isStatic = isStatic
        }
        if let showMenu = responseDict["showMenu"] as? Bool {
            webPage.showMenuIcon = showMenu
        }
        if let showStat = responseDict["showStat"] as? Bool {
            webPage.showStat = showStat
        }
        if let showCloseButton = responseDict["showCloseButton"] as? Bool {
            webPage.showCloseButton = showCloseButton
        }
        return webPage
    }

    
}
