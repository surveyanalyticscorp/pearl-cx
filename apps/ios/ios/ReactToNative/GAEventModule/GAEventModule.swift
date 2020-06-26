//
//  GAEventModule.swift
//  ios
//
//  Created by Jignesh on 16/05/18.
//  Copyright © 2018 Jignesh. All rights reserved.
//

import Foundation
import UIKit

@objc(GAEventModule)
class GAEventModule: NSObject {
    
    @objc(addGAEvent:)
    func addGAEvent(aScreenName: String) -> Void {
        if aScreenName.length > 0 {
            GlobalData.setGAIforView(aScreenName: aScreenName)
        }
    }
}

