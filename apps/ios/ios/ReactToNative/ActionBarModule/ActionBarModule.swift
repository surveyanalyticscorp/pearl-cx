//
//  ActionBarModule.swift
//  ios
//
//  Created by Jignesh on 16/05/18.
//  Copyright © 2018 Jignesh. All rights reserved.
//

import Foundation
import UIKit

@objc(ActionBarModule)
class ActionBarModule: NSObject {
    
    @objc(updateTitleAndMenu:)
    func updateTitleAndMenu(aActionBarInfo: NSString) -> Void {
        if aActionBarInfo.length > 0 {
            let data = aActionBarInfo.data(using: String.Encoding.utf8.rawValue, allowLossyConversion: false)!
            do {
                let json = try JSONSerialization.jsonObject(with: data, options: []) as! [String: AnyObject]
                DispatchQueue.main.sync {
                    NotificationCenter.default.post(name: NSNotification.Name(kUpdateActionBarInfo), object: json)
                }
            } catch let error as NSError {
                print("Failed to load: \(error.localizedDescription)")
            }
        }
    }
    
    @objc(toggleBackButton:)
    func toggleBackButton(showBackButton: Bool) -> Void {
        DispatchQueue.main.sync {
            NotificationCenter.default.post(name: NSNotification.Name(kUpdateBackButton), object: showBackButton as NSNumber)
        }
    }
    
    @objc(updateObjAndGoalsContent:)
    func updateObjAndGoalsContent(content : NSString) -> Void {
        let data = content.data(using: String.Encoding.utf8.rawValue, allowLossyConversion: false)!
        do {
            let json = try JSONSerialization.jsonObject(with: data, options: []) as! [String: AnyObject]
            DispatchQueue.main.sync {
                NotificationCenter.default.post(name: NSNotification.Name(kUpdateObjAndGoalsContent), object: json)
            }
        } catch let error as NSError {
            print("Failed to load: \(error.localizedDescription)")
        }
    }
    
    @objc(updateSelectedMenuItem:)
    func updateSelectedMenuItem(setAsk: NSString) -> Void {
         UserDefaults.standard.set(setAsk, forKey: kUpdateAsk)
         UserDefaults.standard.synchronize()
    }
    @objc(updateLanguageMenuTitle:)
    func updateLanguageMenuTitle(label: NSString) -> Void {
        UserDefaults.standard.set(label, forKey: kUpdateMenuTitle)
        UserDefaults.standard.synchronize()
    }
    
}

