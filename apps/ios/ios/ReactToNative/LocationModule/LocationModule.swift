//
//  LocationModule.swift
//  ios
//
//  Created by Jignesh on 16/05/18.
//  Copyright © 2018 Jignesh. All rights reserved.
//

import Foundation
@objc(LocationModule)
class LocationModule: NSObject {
    
    @objc(updateDatabaseFileLocation:)
    func updateDatabaseFileLocation(dbLocation : NSString) -> Void {
        DispatchQueue.main.sync {
            NotificationCenter.default.post(name: NSNotification.Name(kDatabaseLocation), object: dbLocation)
        }
    }
}

