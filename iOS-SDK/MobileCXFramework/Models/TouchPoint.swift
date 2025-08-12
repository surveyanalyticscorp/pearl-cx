//
//  TouchPoint.swift
//  MobileCXFramework
//
//  Created by Prasad on 30/07/24.
//

import Foundation

public class TouchPoint {
    
    public init() {
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
    public func initTouchPoint(dataCenter: DataCenter, customVariables: [Int: String]? = nil) -> TouchPoint {
        
        self.dataCenter = dataCenter;
        self.customVariables = customVariables;
        return self;
    }
}
