//
//  MenuLinks.swift
//  QuestionProCommunities
//
//  Created by Jignesh Raiyani on 8/26/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit

class MenuLinks: NSObject {

    var id : NSNumber?
    var name : String?
    var title : String?
    var data : [String:Any]?
    var url : String?
    var separator : NSNumber?
    var type : String?
    var active : NSNumber?
    var orderNumber : NSNumber?
    var questionTitle : String?
    var totalResponses : NSNumber?
    var category : String?
    
    override init() {
        
    }
    
    class func fromJSON(jsonDict : [String: Any]) -> MenuLinks {
        
        let menuLinks : MenuLinks = MenuLinks()
        
        if let name = jsonDict["name"] as? String {
                menuLinks.name = name
            }
        if let title = jsonDict["title"] as? String {
                menuLinks.title = title
            }
        if let data = jsonDict["data"] as? [String:Any] {
                menuLinks.data = data
            }
        if let type = jsonDict["type"] as? String {
                menuLinks.type = type
            }
        if let url = jsonDict["url"] as? String {
                menuLinks.url = url
            }
        if let separator = jsonDict["separator"] as? Bool {
                menuLinks.separator = NSNumber(value: separator)
            }
        if let active = jsonDict["active"] as? Int {
                menuLinks.active = NSNumber(value: active)
            }
        if let orderNumber = jsonDict["orderNumber"] as? Int {
                menuLinks.orderNumber = NSNumber(value: orderNumber)
            }
        if let questionTitle = jsonDict["questionTitle"] as? String {
                menuLinks.questionTitle = questionTitle
            }
        if let totalResponse = jsonDict["totalResponse"] as? Int {
                menuLinks.totalResponses = NSNumber(value: totalResponse)
            }
        if let category = jsonDict["category"] as? String {
                menuLinks.category = category
            }
        
        return menuLinks
    }
        
}
