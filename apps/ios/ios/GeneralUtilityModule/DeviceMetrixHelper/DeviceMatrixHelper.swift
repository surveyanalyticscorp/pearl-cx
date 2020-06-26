//
//  DeviceMatrixHelper.swift
//  ios
//
//  Created by Jignesh Raiyani on 9/28/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import Foundation
import UIKit

public class DeviceMatrixHelper {
    
    public class var isIpad:Bool {
        return UIDevice.current.userInterfaceIdiom == .pad
    }
}

