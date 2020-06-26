//
//  LocationHandler.swift
//  ios
//
//  Created by Jignesh on 29/05/18.
//  Copyright © 2018 Jignesh. All rights reserved.
//

import Foundation
import UIKit
import CoreLocation
import CoreGraphics
import CoreData
import FMDB

let kDepth:Double = 3000
let kAccuracy = 250
let kDistanceFilterInsideFence = 2.5
let kDistanceFilterOutsideFence = 50.0
let kTimeFilter = 10.0
let kStoreRadius = 299.0
let kTrackTypePolygon = "POLYGON"
let kTrackTypeFence = "FENCE"
let kTrackMovementTypeEntry = "ENTRY"
let kTrackMovementTypeExit = "EXIT"

final class LocationHandler: NSObject {
    
    static let sharedLocationHandler = LocationHandler()
    private override init() {
        super.init()
        self.iDBPath = ""
    }
    var iDBPath: String?
    var locationManager = CLLocationManager()
    var iLocationGroupList: [LocationGroupCache] = []
    var iNearestStoreList : [LocationCache] = []
    var isStoreAvaliable : Bool = false
    var isEnteredInPolygon : Bool = false
    
    func startMonitoringLocation(isContinuous : Bool) {
        // setup locationManager
        if isContinuous {
            self.locationManager = CLLocationManager()
        }else{
            self.locationManager.stopUpdatingLocation()
        }
        self.locationManager.delegate = self;
        self.locationManager.distanceFilter = kDistanceFilterInsideFence
        self.locationManager.desiredAccuracy = kCLLocationAccuracyNearestTenMeters
        if #available(iOS 9.0, *) {
            self.locationManager.allowsBackgroundLocationUpdates = true
        }
        self.locationManager.pausesLocationUpdatesAutomatically = false
        self.locationManager.requestAlwaysAuthorization()
        if CLLocationManager.locationServicesEnabled() {
            self.locationManager.startUpdatingLocation()
        }
    }
    
    func restartMonitoringLocation() {
        self.locationManager.stopUpdatingLocation()
        self.locationManager.requestAlwaysAuthorization()
        if CLLocationManager.locationServicesEnabled() {
            self.locationManager.startMonitoringSignificantLocationChanges()
        }
    }
    
    // Mark : - Method related to location frequency.
    
    func increaseLocationAccuracyandFrequency() {
        self.locationManager.distanceFilter = kDistanceFilterInsideFence
        self.locationManager.desiredAccuracy = kCLLocationAccuracyNearestTenMeters
    }
    
    func decreaseLocationAccuracyandFrequency() {
        self.locationManager.distanceFilter = kDistanceFilterOutsideFence
        self.locationManager.desiredAccuracy = kCLLocationAccuracyNearestTenMeters
    }
    
}

extension LocationHandler : CLLocationManagerDelegate {
    
    func checkLocationPermission() {
        // status is not determined
        let authrozeStatus : CLAuthorizationStatus = CLLocationManager.authorizationStatus()
        
        switch authrozeStatus{
        case .notDetermined:
            self.locationManager.requestAlwaysAuthorization()
            break
        case .denied:
            self.showAlert(title: "Location services were previously denied. Please enable location services for this app in Settings.")
            break
        case .authorizedWhenInUse:
            self.showAlert(title: "Location services access is while app in use currently. Please provide always allow access for this app in Settings.")
            break
        case .authorizedAlways:
            break
        default:
            break
        }
    }
    
    /* location delegates */
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print("error")
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        print("new location is \(String(describing: locations.last))")
        if locations.count > 0 {
            let newlocation : CLLocation = locations.last! as CLLocation
            self.fetchNearestStoreFromDBWithCurrentLocation(currentLocation: newlocation)
            self.checkLocationInsidePolygonOrNot(currentLocation: newlocation)
        }
        if GlobalData.isNextSyncAvaliable() {
            WebServiceTXManager.uploadLocationDataService(aDelegate: self)
            WebServiceTXManager.invokeLocationDataService(aDelegate: self)
        }
    }
    
    // MARK: - CLLocationManagerDelegate
    
    func locationManager(_ manager: CLLocationManager, didDetermineState state: CLRegionState, for region: CLRegion) {
        if state.rawValue == 1 {
            if GlobalData.addFenceEntryToUserDefault(aKey: region.identifier) {
                self.increaseLocationAccuracyandFrequency()
            }
        }
        else if state.rawValue == 2 {
            let (exit, storeExist) = GlobalData.removeFenceEntryFromUserDefault(aKey: region.identifier)
            if !storeExist {
                self.decreaseLocationAccuracyandFrequency()
            }else{
                self.increaseLocationAccuracyandFrequency()
            }
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didStartMonitoringFor region: CLRegion) {
        self.locationManager.requestState(for: region)
    }
    
    func locationManager(_ manager: CLLocationManager, didEnterRegion region: CLRegion) {
        
    }
    
    func locationManager(_ manager: CLLocationManager, didExitRegion region: CLRegion) {
        
    }
}

extension LocationHandler {
    
    // Method releated to Location module for POSITEv app
    func fetchNearestStoreFromDBWithCurrentLocation(currentLocation : CLLocation) {
        
        let depth: Double = self.feetToKilometers();
        var minLatitude: Double = 0
        var maxLatitude: Double = 0
        var minLongitude: Double = 0
        var maxLongitude: Double = 0
        
        let locationWithZeroBearing : CLLocation = self.fetchLocationBy(startLoc: currentLocation, bearing: 0,   depth: depth)
        let locationWithNinetyBearing : CLLocation = self.fetchLocationBy(startLoc: currentLocation, bearing: 90,  depth: depth)
        let locationWithOneEightyBearing : CLLocation = self.fetchLocationBy(startLoc: currentLocation, bearing: 180, depth: depth)
        let locationWithTwoSeventyBearing : CLLocation = self.fetchLocationBy(startLoc: currentLocation, bearing: 270, depth: depth)
        
        minLatitude =  locationWithOneEightyBearing.coordinate.latitude;
        maxLatitude =  locationWithZeroBearing.coordinate.latitude;
        minLongitude = locationWithTwoSeventyBearing.coordinate.longitude;
        maxLongitude = locationWithNinetyBearing.coordinate.longitude;
        
        let fileManager = FileManager.default
        if let dbPath = self.iDBPath,
            fileManager.fileExists(atPath: dbPath){
            let database = FMDatabase(path:dbPath)
            if !database.open() {
                return
            }
            // initializing empty array for locationCache
            var nearestStoreList = [LocationCache]()
            do {
                let radiant = self.degreesToRadians(value: currentLocation.coordinate.latitude)
                let cosine = cos(radiant)
                let fudge = pow(cosine, 2)
                let strWhere : String =  " where " + "latitude" + " > " + "\(minLatitude)" + " AND " + "latitude" + " < " + "\(maxLatitude)" + " AND " + "longitude" + " < " + "\(maxLongitude)" + " AND " + "longitude" + " > " + "\(minLongitude)"
                
                let orderByQuery = "(( \(currentLocation.coordinate.latitude) - latitude) * ( \(currentLocation.coordinate.latitude) - latitude) + ( \(currentLocation.coordinate.longitude) - longitude) * (\(currentLocation.coordinate.longitude) - longitude) * \(fudge))"
                
                let query = "select * from location \(strWhere) order by \(orderByQuery) limit 5"
                let rs = try database.executeQuery(query, values: nil)
                
                // if found any data itetrate through row
                while rs.next() {
                    var locationCache = LocationCache()
                    locationCache.id = NSNumber(value: rs.double(forColumn: kID))
                    locationCache.longitude = NSNumber(value: rs.double(forColumn: kLongitude))
                    locationCache.latitude = NSNumber(value: rs.double(forColumn: kLatitude))
                    locationCache.locationId = NSNumber(value: rs.double(forColumn: kLocation_id))
                    locationCache.locationGroupID = NSNumber(value: rs.double(forColumn: kLocation_group_id))
                    if let address = rs.string(forColumn: kAddress) {
                        locationCache.address = address
                    }else{
                        locationCache.address = ""
                    }
                    nearestStoreList.append(locationCache)
                }
            } catch let error as NSError {
                print("failed: \(error.localizedDescription)")
            }
            database.close()
            if nearestStoreList.count > 0 && self.compareLocationList(newLocation: nearestStoreList, location: self.iNearestStoreList) {
                self.iNearestStoreList = []
                self.iNearestStoreList = nearestStoreList
                for monitoredStore : CLRegion in self.locationManager.monitoredRegions {
                    self.locationManager.stopMonitoring(for: monitoredStore)
                }
                self.setNearestStoreForRegionMonitoring(nearestStoreList: nearestStoreList, currentLocation: currentLocation)
            }
        }else{
            return
        }
    }
    
    func fetchLocationBy(startLoc : CLLocation, bearing : Double, depth : Double) -> CLLocation {
        
        var  newLocation: CLLocation = CLLocation(latitude:  0,longitude: 0)
        let radius : Double = 6371.0 // earth's mean radius in km
        let lat1   : Double = degreesToRadians (value: startLoc.coordinate.latitude);
        let lng1   : Double = degreesToRadians (value: startLoc.coordinate.longitude);
        let brng   : Double = degreesToRadians(value: bearing);
        let lat2   : Double = asin((sin(lat1)*cos(depth/radius)) + cos(lat1) * sin(depth/radius) * cos(brng));
        var lng2   : Double = lng1 + atan2(sin(brng)*sin(depth/radius)*cos(lat1), cos(depth/radius)-sin(lat1)*sin(lat2));
        
        lng2 = fmod((lng2 + Double.pi) , (2 * Double.pi)) - Double.pi;
        // normalize to -180...+180
        if ((lat2==0) || (lng2==0)) {
            newLocation = CLLocation(latitude:  0,longitude: 0)
        }else{
            newLocation = CLLocation(latitude:radiansToDegrees(value: lat2),longitude: radiansToDegrees(value: lng2))
        }
        return newLocation;
    }
    
    func compareLocationList(newLocation : [LocationCache], location : [LocationCache]) -> Bool {
        if newLocation.count != location.count {
            return true
        }
        for i in 0..<newLocation.count {
            let newLocationCache = newLocation[i]
            let locationCache = location[i]
            if newLocationCache.locationId != locationCache.locationId {
                return true
            }
        }
        return false
    }
    
    func checkLocationInsidePolygonOrNot(currentLocation : CLLocation) {
        let testPoint = CGPoint(x: currentLocation.coordinate.latitude, y:  currentLocation.coordinate.longitude)
        for store : CLRegion in self.locationManager.monitoredRegions {
            let locationIDString = store.identifier
            if let memberID = Int(locationIDString) {
                let polygonCordinateList :[LocationShapeCache] = self.findPolygonInsideCircle(identifier: memberID)
                if polygonCordinateList.count > 0 {
                    var locationArray = [CLLocationCoordinate2D]()
                    for locationShapeCache in polygonCordinateList {
                        let cord = CLLocationCoordinate2D(latitude: Double(truncating: locationShapeCache.latitude!), longitude: Double(truncating: locationShapeCache.longitude!))
                        locationArray.append(cord)
                    }
                    let insidePolygon = self.checkLocationExistInPolygonIf(polygon: locationArray , contains: testPoint)
                    let lastIdentifier = GlobalData.getLocationSurveyFromUserDefault()
                    if  insidePolygon && store.identifier != lastIdentifier {
                        GlobalData.setLocationSurveyToUserDefault(aValue: store.identifier)
                        let key = GlobalData.convertDateToMiliSecond(date: Date())
                        GlobalData.setLocationResponseUniqueKeyToUserDefault(key: store.identifier, aValue: key)
                        self.increaseLocationAccuracyandFrequency()
                        self.fillLocationResponseCache(trackMovementType: TrackMovementType.Entry, trackType: TrackType.Polygon, store: store, uniqueKey: key)
                    }else if !insidePolygon  {
                        let locationAge = -currentLocation.timestamp.timeIntervalSinceNow
                        if currentLocation.horizontalAccuracy >= 11 || currentLocation.verticalAccuracy == -1 || locationAge > 5.0 {
                        }else{
                            if store.identifier == lastIdentifier {
                                let uniqueKey = GlobalData.getLocationResponseUniqueKeyFromUserDefault(key: store.identifier)
                                GlobalData.setLocationSurveyToUserDefault(aValue: "")
                                self.increaseLocationAccuracyandFrequency()
                                self.fillLocationResponseCache(trackMovementType: TrackMovementType.Exit, trackType: TrackType.Polygon, store: store, uniqueKey: uniqueKey)
                                GlobalData.removeLocationResponseUniqueKeyFromUserDefault(key: store.identifier)
                            }
                        }
                    }
                }
            }
        }
    }
    
    func findPolygonInsideCircle(identifier : Int) -> [LocationShapeCache] {
        let fileManager = FileManager.default
        if let dbPath = self.iDBPath,
            fileManager.fileExists(atPath: dbPath) {
            let database = FMDatabase(path:dbPath)
            if !database.open() {
                return []
            }
            var locationShapeList = [LocationShapeCache]()
            do {
                let query = "select * from location_shape where location_id = \(identifier)"
                let rs = try database.executeQuery(query, values: nil)
                while rs.next() {
                    var locationShapeCache = LocationShapeCache()
                    locationShapeCache.locationGroupID = NSNumber(value: rs.double(forColumn: kLocation_group_id))
                    locationShapeCache.locationId = NSNumber(value: rs.double(forColumn: kLocation_id))
                    locationShapeCache.latitude = NSNumber(value: rs.double(forColumn: kLatitude))
                    locationShapeCache.longitude = NSNumber(value: rs.double(forColumn: kLongitude))
                    locationShapeList.append(locationShapeCache)
                }
            } catch let error as NSError {
                print("failed: \(error.localizedDescription)")
            }
            database.close()
            return locationShapeList
        }else{
            return []
        }
    }
    
    func checkLocationExistInPolygonIf(polygon: [CLLocationCoordinate2D], contains point: CGPoint) -> Bool {
        if polygon.count <= 1 {
            return false //or if first point = test -> return true
        }
        let path = UIBezierPath()
        let locationCordinate : CLLocationCoordinate2D = polygon[0]
        
        let firstPoint = CGPoint(x: CGFloat(locationCordinate.latitude), y: CGFloat(locationCordinate.longitude))
        path.move(to: firstPoint)
        for index in 1...polygon.count-1 {
            let locationCor : CLLocationCoordinate2D = polygon[index]
            path.addLine(to: CGPoint(x: CGFloat(locationCor.latitude), y: CGFloat(locationCor.longitude)))
        }
        path.close()
        return path.contains(point)
    }
    
    func setNearestStoreForRegionMonitoring(nearestStoreList : [LocationCache], currentLocation : CLLocation) {
        
        for locationCache : LocationCache in nearestStoreList {
            var latitute : Double = 0.00
            var longitute : Double = 0.00
            if let latitu = locationCache.latitude {
                latitute = Double(truncating: latitu)
            }
            if let longitut = locationCache.longitude {
                longitute = Double(truncating: longitut)
            }
            let  actualLocation: CLLocation = CLLocation(latitude:latitute, longitude:longitute)
            let distanceInMeters = actualLocation.distance(from: currentLocation)
            
            var address : String = ""
            var groupID : NSNumber = 0
            var locationID : NSNumber = 0
            if let addr = locationCache.address {
                address = addr
            }
            if let grpID = locationCache.locationGroupID {
                groupID = grpID
            }
            if let loctionid = locationCache.locationId {
                locationID = loctionid
            }
            
            // check if can monitor regions
            if CLLocationManager.isMonitoringAvailable(for: CLCircularRegion.self) {
                // setup region
                var title = ""
                if let locationID = locationCache.locationId {
                    title = locationID.stringValue
                }
                let region = CLCircularRegion(center: CLLocationCoordinate2D(latitude: latitute,longitude: longitute), radius: kStoreRadius, identifier: title)
                self.locationManager.startMonitoring(for: region)
            }
            let appDelegate = UIApplication.shared.delegate as! AppDelegate
            if (distanceInMeters<50 && appDelegate.appType == PocketAppType.QUESTIONPRO_COMMUNITY_APP) {
                self.queryLocationGroupDatabaseTable(locationName: address, locationGroupID:groupID, locationId:locationID)
                break
            }
        }
    }
    
    func queryLocationGroupDatabaseTable(locationName:String, locationGroupID:NSNumber, locationId:NSNumber)  {
        if let dbPath = self.iDBPath {
            let database = FMDatabase(path:dbPath)
            if !database.open() {
                return
            }
            do{
                let query = "select * from location_group where location_group_id =\(locationGroupID)"
                let rs = try database.executeQuery(query, values: nil)
                while rs.next() {
                    var locationGroupCache = LocationGroupCache()
                    locationGroupCache.id = NSNumber(value: rs.double(forColumn: kID))
                    locationGroupCache.location_group_id = NSNumber(value: rs.double(forColumn: kLocation_group_id))
                    locationGroupCache.panel_id = NSNumber(value: rs.double(forColumn: kPanelID))
                    locationGroupCache.qpoint = NSNumber(value: rs.double(forColumn: kQ_point))
                    locationGroupCache.radius = NSNumber(value: rs.double(forColumn: kRadius))
                    locationGroupCache.timer = NSNumber(value: rs.double(forColumn: kTimer))
                    locationGroupCache.startDate = NSNumber(value: rs.double(forColumn: kStartDate))
                    locationGroupCache.endDate = NSNumber(value: rs.double(forColumn: kEndDate))
                    if let surveyID = rs.string(forColumn: kSurvey_id_list) {
                        locationGroupCache.surveyID = surveyID
                    }else{
                        locationGroupCache.surveyID = ""
                    }
                    if let name = rs.string(forColumn: kName) {
                        locationGroupCache.surveyName = name
                    }else{
                        locationGroupCache.surveyName = ""
                    }
                    self.iLocationGroupList.append(locationGroupCache)
                }
            } catch let error as NSError {
                print("failed error 1 : \(error.localizedDescription)")
            }
            database.close()
            self.compareDatesAndShowLocalNotification(locationName: locationName, locationGroupID:locationGroupID, locationId: locationId)
        }else{
            return
        }
    }
    
}

extension LocationHandler {
    // Method related to coredata
    func fillLocationResponseCache(trackMovementType : TrackMovementType, trackType : TrackType, store : CLRegion, uniqueKey : Int64 ) {
        var locationResponseCache = LocationResponseCache()
        switch trackMovementType {
        case .Entry:
            locationResponseCache.trackMovementType = kTrackMovementTypeEntry
            break
        case .Exit:
            locationResponseCache.trackMovementType = kTrackMovementTypeExit
            break
        }
        
        switch trackType {
        case .Fence:
            locationResponseCache.trackType = kTrackTypeFence
            break
        case .Polygon:
            locationResponseCache.trackType = kTrackTypePolygon
            break
        }
        let locationIDString: String = store.identifier
        if let locationIDInt = Int(locationIDString){
            let locationID = NSNumber.init(value: locationIDInt)
            locationResponseCache.locationID = locationID as NSNumber
            if let dbPath = self.iDBPath {
                let database = FMDatabase(path:dbPath)
                if !database.open() {
                    return
                }
                do{
                    let query = "select * from location where location_id =\(locationID)"
                    let rs = try database.executeQuery(query, values: nil)
                    while rs.next() {
                        locationResponseCache.locationGroupID = NSNumber(value: rs.double(forColumn: kLocation_group_id))
                        if let name = rs.string(forColumn: kAddress){
                            if name.length > 0 {
                                locationResponseCache.locationName = name
                            }else {
                                locationResponseCache.locationName = store.identifier
                            }
                        }else {
                            locationResponseCache.locationName = ""
                        }
                    }
                } catch let error as NSError {
                    print("failed error 1 : \(error.localizedDescription)")
                }
                database.close()
            }
        }
        locationResponseCache.timeStamp = GlobalData.convertDateToMiliSecond(date:self.currentDateWithUTCFormat())
        locationResponseCache.batteryLevel = UIDevice.current.batteryLevel*100
        locationResponseCache.uniqueKey = uniqueKey
        print("insert method called \(locationResponseCache)")
        if let fence : String = locationResponseCache.trackType, let movement : String = locationResponseCache.trackMovementType {
           // self.testNotificationForLocationSurvey(storeName: store.identifier,fence: "\(uniqueKey )" + fence + movement)
        }
        DataBaseController.insertIntoLocationResponse(locationResponseCache: locationResponseCache)
    }
    
    func compareDatesAndShowLocalNotification(locationName:String, locationGroupID:NSNumber, locationId:NSNumber) {
        
        for locationGroupCache : LocationGroupCache in self.iLocationGroupList {
            let date = Date()
            let timeInterval = date.timeIntervalSince1970
            let todaysDateInInterval = TimeInterval(timeInterval)
            let todaysDate = Date(timeIntervalSince1970: TimeInterval(todaysDateInInterval))
            var startTime: Int = 0
            var endTime:Int = 0
            if let time = locationGroupCache.startDate?.intValue {
                startTime = time
            }
            if let time = locationGroupCache.endDate?.intValue {
                endTime = time
            }
            let startDate  = Date(timeIntervalSince1970: TimeInterval(startTime/1000))
            let endDate    = Date(timeIntervalSince1970: TimeInterval(endTime/1000))
            if ((todaysDate >= startDate) && (todaysDate <= endDate)) {
                /* gathering details for userinfo */
                let userInfoDict = GlobalData.getUserInfoFromUserDefault(kUserInfo)
                var memberID: Int = 0
                if let bodyDict : NSDictionary = userInfoDict[kBody] as? NSDictionary, let ID = bodyDict["ID"] as? CLong {
                    memberID = ID
                }
                var surveyID : Int = 0
                if let surveyidString = locationGroupCache.surveyID,
                    let id = Int(surveyidString) {
                    surveyID = id
                }
                let locationstr = GlobalData.getLocationSurveyFromUserDefault()
                if locationstr.length > 0 {
                    let locationIDList = locationstr.components(separatedBy: ",")
                    if locationIDList.count > 1 {
                        if let locIDString = locationIDList.first,
                            let locID = Int(locIDString),
                            let locSurveyIDString = locationIDList.last,
                            let locSurveyID = Int(locSurveyIDString),locID == locationId.intValue && locSurveyID == surveyID {
                        }else{
                            self.sendAlertForLocationSurvey(locationName: locationName, surveyID: surveyID, locationGroupID: locationGroupID, locationId: locationId, memberID: memberID)
                        }
                    }else{
                        self.sendAlertForLocationSurvey(locationName: locationName, surveyID: surveyID, locationGroupID: locationGroupID, locationId: locationId, memberID: memberID)
                    }
                }else{
                    self.sendAlertForLocationSurvey(locationName: locationName, surveyID: surveyID, locationGroupID: locationGroupID, locationId: locationId, memberID: memberID)
                }
            }
        }
    }
}

extension LocationHandler {
    
    // Method related to Notification and Alert
    func showAlert(title: String) {
        let alert = UIAlertController(title: title, message: nil, preferredStyle:UIAlertControllerStyle.alert)
        alert.addAction(UIAlertAction(title: "Cancel", style:UIAlertActionStyle.default, handler: { (action) in
        }))
        let settingsAction = UIAlertAction(title: "Settings", style: .cancel) { (_) -> Void in
            let settingsUrl = URL(string: UIApplicationOpenSettingsURLString)
            if let url = settingsUrl {
                alert.dismiss(animated: true, completion: nil)
                UIApplication.shared.openURL(url)
            }
        }
        alert.addAction(settingsAction)
        UIApplication.shared.keyWindow?.rootViewController?.present(alert, animated: true, completion: nil)
    }
    
    
    func testNotificationForLocationSurvey(storeName : String, fence : String) {
        let alertString : String = "\(storeName)"
        let notification = UILocalNotification()
        if #available(iOS 8.2, *) {
            notification.alertTitle = fence
        } else {
            // Fallback on earlier versions
        }
        notification.alertBody = alertString
        notification.fireDate = Date(timeIntervalSinceNow:1)
        notification.timeZone = NSTimeZone.default
        notification.repeatInterval = NSCalendar.Unit.day
        notification.soundName = UILocalNotificationDefaultSoundName
        notification.alertAction="open"
        UIApplication.shared.presentLocalNotificationNow(notification)
    }
    
    func sendAlertForLocationSurvey(locationName : String, surveyID : Int, locationGroupID : NSNumber, locationId : NSNumber, memberID : Int ) {
        let alertString : String = "New location survey \(locationName)"
        let member:[String:Any] = ["type":1, "memberID":memberID, "surveyID":surveyID, "locationGroupID":locationGroupID, "locationID":locationId, "message":"Survey Available"]
        let memberDetails : [String:Any] = ["info":member]
        let notification = UILocalNotification()
        if #available(iOS 8.2, *) {
            notification.alertTitle = "New Survey"
        }
        notification.alertBody = alertString
        notification.fireDate = Date(timeIntervalSinceNow: 1)
        notification.timeZone = NSTimeZone.default
        notification.repeatInterval = NSCalendar.Unit.day
        notification.soundName = UILocalNotificationDefaultSoundName
        notification.userInfo = memberDetails
        notification.alertAction="open"
        UIApplication.shared.presentLocalNotificationNow(notification)
        let locationValue = "\(locationId),\(surveyID)"
        GlobalData.setLocationSurveyToUserDefault(aValue: locationValue)
    }
}

extension LocationHandler: UploadResponseDelegate, LocationDataServiceDelegate {
    //MARK: - Delegate Methods, UploadResponseDelegate
    func uploadResponseDidFinish(invocation: QPUploadResponseInvocation) {
    }
    
    func uploadResponseDidFinishWithError( error: String, invocation: QPUploadResponseInvocation) -> Void {
        
    }
    
    func LocationDataDidFinish(invocation: QPLocationDataServiceInvocation, aDBPath: String) -> Void {
        if aDBPath.length > 0 {
            
        }
    }
}

extension LocationHandler  {
    
    // supported method for time zone
    func currentDateWithUTCFormat() -> Date {
        let formatter = DateFormatter()
        formatter.dateFormat = "dd-MM-yyyy hh:mm:ss.SSS"
        formatter.timeZone = TimeZone(identifier: "UTC")
        let dateString = formatter.string(from: Date())
        print("date value is = \(dateString)")
        let convertedDate = formatter.date(from: dateString)
        return convertedDate!
    }
    
    // supported method for different calculation
    func degreesToRadians (value:Double) -> Double {
        return value * Double.pi / 180.0
    }
    
    func radiansToDegrees (value:Double) -> Double {
        return value * 180.0 / Double.pi
    }
    
    func feetToKilometers() -> Double {
        return kDepth/3280.8;
    }
}
