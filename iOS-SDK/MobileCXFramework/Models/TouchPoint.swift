//
//  TouchPoint.swift
//  MobileCXFramework
//
//  Created by Prasad on 30/07/24.
//

import Foundation

public class TouchPoint {
    
    public init(dataCenter: DataCenter) {
        self.dataCenter = dataCenter;
    }
    
    public enum DataCenter: String, Codable {
       case DATA_CENTER_US
       case DATA_CENTER_AE
       case DATA_CENTER_CA
       case DATA_CENTER_AU
       case DATA_CENTER_EU
       case DATA_CENTER_SG
       case DATA_CENTER_SA
       case DATA_CENTER_KSA
    }
    
    public var dataCenter = DataCenter.DATA_CENTER_US;
    public var customVariables: [Int: String]? = [:];
    
    public static func initTouchPoint(dataCenter: DataCenter) -> TouchPoint {
        return TouchPoint(dataCenter: dataCenter)
    }
}
