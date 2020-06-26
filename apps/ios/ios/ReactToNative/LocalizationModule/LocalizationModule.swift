//
//  LocalizationModule.swift
//  ios
//
//  Created by Jignesh on 16/05/18.
//  Copyright © 2018 Jignesh. All rights reserved.
//

import Foundation
import UIKit

@objc(LocalizationModule)
class LocalizationModule: NSObject {
    
    @objc(updatePreferedLanguage:)
    func updatePreferedLanguage(aLanguageID: NSString) -> Void {
        DispatchQueue.main.sync {
            NotificationCenter.default.post(name: NSNotification.Name(kUpdateLanguageInfo), object:aLanguageID)
        }
    }
}
