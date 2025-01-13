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
    
    public enum DataCenter {
       case DATA_CENTER_US
       case DATA_CENTER_AE
       case DATA_CENTER_CA
       case DATA_CENTER_AU
       case DATA_CENTER_EU
       case DATA_CENTER_SG
       case DATA_CENTER_SA
       case DATA_CENTER_KSA
    }
    
    public var surveyId = 0;
    public var  email = "";
    public var  firstName = "";
    public var  lastName = "";
    public var  mobile = "";
    public var  segmentCode = "";
    public var ShowInDialog = 0;
    public var  customVariable1 = "";
    public var  customVariable2 = "";
    public var  customVariable3 = "";
    
    public func initTouchPoint(surveyId: Int) -> TouchPoint {
        self.surveyId = surveyId;
        self.email = "";
        self.firstName = "";
        self.lastName = "";
        self.mobile = "";
        self.segmentCode = "";
        self.ShowInDialog = 0;
        self.customVariable1 = "";
        self.customVariable2 = "";
        self.customVariable3 = "";
        return self;
    }
}
