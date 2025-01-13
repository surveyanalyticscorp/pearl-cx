//
//  AppDelegate.swift
//  XCFrameworkConsumer
//
//  Created by Prasad on 30/07/24.
//

import UIKit
import QuestionProCXFramework

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    
    public var window: UIWindow?

    static var shared: AppDelegate {
        return UIApplication.shared.delegate as! AppDelegate
    }

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        if #available(iOS 13.0, *) {
            
        } else {
            if (self.window != nil) {
                SurveyManager.shared.initializeSurvey(window: window!)
            }
        }
        return true
    }
}

