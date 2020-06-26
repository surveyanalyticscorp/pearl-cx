//
//  LocationResponse+CoreDataProperties.swift
//  
//
//  Created by Jignesh on 18/01/18.
//
//  This file was automatically generated and should not be edited.
//

import Foundation
import CoreData


extension LocationResponse {

    @nonobjc public class func fetchRequest() -> NSFetchRequest<LocationResponse> {
        return NSFetchRequest<LocationResponse>(entityName: "LocationResponse")
    }

    @NSManaged public var id: Int32
    @NSManaged public var locationID: Int32
    @NSManaged public var trackMovementType: String?
    @NSManaged public var locationGroupID: Int32
    @NSManaged public var locationName: String?
    @NSManaged public var trackType: String?
    @NSManaged public var timeStamp: Int64
    @NSManaged public var batteryLevel: Float
    @NSManaged public var uniqueKey: Int64

}


