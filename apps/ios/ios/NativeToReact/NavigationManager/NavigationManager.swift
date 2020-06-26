//
//  NavigationManager.swift
//  ios
//
//  Created by Jignesh on 17/05/18.
//  Copyright © 2018 Jignesh. All rights reserved.
//

import Foundation
import UIKit

@objc(NavigationManager)
class NavigationManager:  RCTEventEmitter {
    
    @objc override func supportedEvents() -> [String]! {
        return ["BackEvent", "notificationReload", "DoneAction", "ObjAction", "ObjEditMenu"];
    }
    
    @objc func callBackEvent() {
        self.sendEvent(withName: "BackEvent", body: "")
    }
    
    @objc func notificationReload(aNotification:[String:Any]) {
        self.sendEvent(withName: "notificationReload", body: aNotification)
    }
    
    @objc func doneAction() {
        self.sendEvent(withName: "DoneAction", body:"")
    }
    
    @objc func contextAction() {
        self.sendEvent(withName: "ObjAction", body:"")
    }
    
    @objc func objEditAction() {
        self.sendEvent(withName: "ObjEditMenu", body:"")
    }
}
