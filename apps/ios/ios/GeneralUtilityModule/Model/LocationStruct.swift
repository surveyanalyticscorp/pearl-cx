//
//  LocationStruct.swift
//  ios
//
//  Created by Jignesh on 04/12/17.
//  Copyright © 2017 QuestionPro Pvt Ltd. All rights reserved.
//

import Foundation
import UIKit

struct LocationCache {
    
    var id : NSNumber?
    var address: String?
    var longitude: NSNumber?
    var latitude: NSNumber?
    var locationId: NSNumber?
    var locationGroupID: NSNumber?
}

struct LocationGroupCache {
    
    var id : NSNumber?
    var location_group_id : NSNumber?
    var panel_id : NSNumber?
    var surveyID: String?
    var surveyName: String?
    var qpoint : NSNumber?
    var radius: NSNumber?
    var timer: NSNumber?
    var startDate: NSNumber?
    var endDate: NSNumber?
    
}


struct PolygonCache {
    var polyDict = [NSDictionary]();
    mutating func addTask(task: NSDictionary){
        polyDict.append(task)
    }
}

struct LocationShapeCache {
    var id : NSNumber?
    var locationGroupID: NSNumber?
    var locationId: NSNumber?
    var latitude: NSNumber?
    var longitude: NSNumber?

}

struct LocationResponseCache {
    var id : NSNumber?
    var locationID: NSNumber?
    var locationGroupID: NSNumber?
    var locationName: String?
    var trackType: String?
    var trackMovementType: String?
    var timeStamp: Int64?
    var batteryLevel: Float?
    var uniqueKey: Int64?
}


enum TrackMovementType : String {
    case Entry = "ENTRY"
    case Exit = "EXIT"
}


enum TrackType : String {
    case Fence = "FENCE"
    case Polygon = "POLYGON"
}
