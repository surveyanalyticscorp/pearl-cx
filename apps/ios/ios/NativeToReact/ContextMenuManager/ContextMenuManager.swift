//
//  ContextMenuManager.swift
//  ios
//
//  Created by Jignesh on 14/05/18.
//  Copyright © 2018 Jignesh. All rights reserved.
//

import Foundation

@objc(ContextMenuManager)
class ContextMenuManager:  RCTEventEmitter {
    
    @objc override func supportedEvents() -> [String]! {
        return ["ContextMenuItemClick", "SceneTransition", "Logout", "reloadScreen", "GoalsFilterAction", "ObjEditAction", "LanguagePicker"];
    }
    
    @objc(refreshProfileScreenWithdata:aTitle:)
    func refreshProfileScreenWithdata(aProfileMenu : NSString, aTitle : NSString) {
        let dataDict : [String:Any] = ["Scene":aProfileMenu, "Title":aTitle]
        self.sendEvent(withName: "SceneTransition", body: dataDict)
    }
    
    @objc func logoutUser() {
        self.sendEvent(withName: "Logout", body: "")
    }
    
    @objc func showLanguagePicker() {
        self.sendEvent(withName: "LanguagePicker", body: "")
    }
    
    @objc func refreshContextMenuWithdata(aContextMenuDict : [String:Any]) {
        var dataDict = [String:Any]()
        if let theJSONData = try? JSONSerialization.data(withJSONObject: aContextMenuDict,options: []) {
            let theJSONText = String(data: theJSONData,encoding: .utf8)
            dataDict = ["DATA":theJSONText ?? ""]
            print("JSON string = \(theJSONText!)")
        }
        self.sendEvent(withName: "ContextMenuItemClick", body: dataDict)
    }
    
    @objc func reloadHomeScreenForPulse() {
        self.sendEvent(withName: "reloadScreen", body: "")
    }
    
    @objc func reloadObjAndGoalsScreen(option : NSString) {
        let dataDict : [String:Any] = ["filter":option]
        self.sendEvent(withName: "GoalsFilterAction", body: dataDict)
    }
    
    @objc func editObjAndGoal() {
        self.sendEvent(withName: "ObjEditAction", body: "")
    }
    
    
}
