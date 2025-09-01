//
//  TouchPoint.swift
//  MobileCXFramework
//
//  Created by Prasad on 30/07/24.
//

import Foundation

public class TouchPoint {
    
    public init(dataCenter: DataCenter, configType: ConfigType) {
        self.dataCenter = dataCenter;
        self.configType = configType;
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
    
    public enum ConfigType: String, Codable {
        case SURVEY
        case INTERCEPT
    }
    
    public var dataCenter = DataCenter.DATA_CENTER_US;
    public var configType: ConfigType
    public var customVariables: [Int: String]? = [:];
    
    public static func initTouchPoint(dataCenter: DataCenter, configType: ConfigType) -> TouchPoint {
        return TouchPoint(dataCenter: dataCenter, configType: configType)
    }
    
    public func setCustomVariables(_ customVariables: [Int: String]?) -> TouchPoint {
        self.customVariables = customVariables;
        return self;
    }
    
    public func getCustomVariables () -> [Int: String]? {
        return self.customVariables
    }
}
