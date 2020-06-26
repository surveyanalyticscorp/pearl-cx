//
//  DataBaseController.swift
//  SwiftCoreData
//
//  Created by Jignesh on 11/01/18.
//  Copyright © 2018 Jignesh. All rights reserved.
//

import Foundation
import CoreData

class DataBaseController {
    
    // MARK: - Private initilizer
    
    private init() {
    }
    
    // MARK: - Get context
    
    class func getContext() -> NSManagedObjectContext {
        if #available(iOS 10.0, *) {
            return  DataBaseController.persistentContainer.viewContext
        } else {
            // Fallback on earlier versions
            return DataBaseController.managedObjectContext
        }
    }
    
    // MARK: - Core Data stack
    
    @available(iOS 10.0, *)
    static var persistentContainer: NSPersistentContainer = {
        /*
         The persistent container for the application. This implementation
         creates and returns a container, having loaded the store for the
         application to it. This property is optional since there are legitimate
         error conditions that could cause the creation of the store to fail.
         */
        let container = NSPersistentContainer(name: "iOS")
        container.loadPersistentStores(completionHandler: { (storeDescription, error) in
            if let error = error as NSError? {
                // Replace this implementation with code to handle the error appropriately.
                // fatalError() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
                
                /*
                 Typical reasons for an error here include:
                 * The parent directory does not exist, cannot be created, or disallows writing.
                 * The persistent store is not accessible, due to permissions or data protection when the device is locked.
                 * The device is out of space.
                 * The store could not be migrated to the current model version.
                 Check the error message to determine what the actual problem was.
                 */
                fatalError("Unresolved error \(error), \(error.userInfo)")
            }
        })
        return container
    }()
    
    
    static var applicationDocumentsDirectory: NSURL = {
        let urls = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)
        return urls[urls.count-1] as NSURL
    }()
    
    static var managedObjectModel: NSManagedObjectModel = {
        let modelURL = Bundle.main.url(forResource: "iOS", withExtension: "momd")!
        return NSManagedObjectModel(contentsOf: modelURL)!
    }()
    
    static var persistentStoreCoordinator: NSPersistentStoreCoordinator = {
        let coordinator = NSPersistentStoreCoordinator(managedObjectModel: DataBaseController.managedObjectModel)
        let url = DataBaseController.applicationDocumentsDirectory.appendingPathComponent("iOS.sqlite")
        var failureReason = "There was an error creating or loading the application's saved data."
        do {
            try coordinator.addPersistentStore(ofType: NSSQLiteStoreType, configurationName: nil, at: url, options: nil)
        } catch {
            var dict = [String: AnyObject]()
            dict[NSLocalizedDescriptionKey] = "Failed to initialize the application's saved data" as AnyObject
            dict[NSLocalizedFailureReasonErrorKey] = failureReason as AnyObject
            
            dict[NSUnderlyingErrorKey] = error as NSError
            let wrappedError = NSError(domain: "YOUR_ERROR_DOMAIN", code: 9999, userInfo: dict)
            NSLog("Unresolved error \(wrappedError), \(wrappedError.userInfo)")
            abort()
        }
        return coordinator
    }()
    
    static var managedObjectContext: NSManagedObjectContext = {
        let coordinator = DataBaseController.persistentStoreCoordinator
        var managedObjectContext = NSManagedObjectContext(concurrencyType: .mainQueueConcurrencyType)
        managedObjectContext.persistentStoreCoordinator = coordinator
        return managedObjectContext
    }()
    
    // MARK: - Core Data Saving support
    
   class func saveContext () {
        if #available(iOS 10.0, *) {
            let context = persistentContainer.viewContext
            if context.hasChanges {
                do {
                    try context.save()
                } catch {
                    // Replace this implementation with code to handle the error appropriately.
                    // fatalError() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
                    let nserror = error as NSError
                    fatalError("Unresolved error \(nserror), \(nserror.userInfo)")
                }
            }
        } else {
            // Fallback on earlier versions
            if DataBaseController.managedObjectContext.hasChanges {
                do {
                    try DataBaseController.managedObjectContext.save()
                } catch {
                    // Replace this implementation with code to handle the error appropriately.
                    // abort() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
                    let nserror = error as NSError
                    NSLog("Unresolved error \(nserror), \(nserror.userInfo)")
                    abort()
                }
            }
        }
     }
    
    class func insertIntoLocationResponse(locationResponseCache :LocationResponseCache) {
        if #available(iOS 10.0, *) {
            let locationResponse = LocationResponse(context: DataBaseController.getContext())
            DataBaseController.fillLocationResonse(locationResponse: locationResponse, locationResponseCache: locationResponseCache)
        } else {
            // Fallback on earlier versions
            let entityDesc = NSEntityDescription.entity(forEntityName: "LocationResponse", in: DataBaseController.managedObjectContext)
            let locationResponse = LocationResponse.init(entity: entityDesc!, insertInto: DataBaseController.managedObjectContext)
            DataBaseController.fillLocationResonse(locationResponse: locationResponse, locationResponseCache: locationResponseCache)
        }
        DataBaseController.saveContext()
    }
    
    class func fillLocationResonse (locationResponse : LocationResponse, locationResponseCache :LocationResponseCache) {
        if let id = locationResponseCache.id?.intValue {
            locationResponse.id = Int32(id)
        }
        if let locationID = locationResponseCache.locationID?.intValue{
            locationResponse.locationID = Int32(locationID)
        }
        if let locationGroupID = locationResponseCache.locationGroupID?.intValue {
            locationResponse.locationGroupID = Int32(locationGroupID)
        }
        if let trackMovementType = locationResponseCache.trackMovementType {
            locationResponse.trackMovementType = trackMovementType
        }
        if let locationName : String = locationResponseCache.locationName {
            locationResponse.locationName = locationName
        }else{
            locationResponse.locationName = "N/A"
        }
        if let trackType = locationResponseCache.trackType {
            locationResponse.trackType = trackType
        }
        if let timeStamp : Int64 = locationResponseCache.timeStamp {
            locationResponse.timeStamp = timeStamp
        }
        if let batteryLevel : Float = locationResponseCache.batteryLevel {
            locationResponse.batteryLevel = batteryLevel
        }
        if let uniqueKey : Int64 = locationResponseCache.uniqueKey {
            locationResponse.uniqueKey = uniqueKey
        }
        DataBaseController.saveContext()
    }
    
    class func fetchLocationResponse() -> [LocationResponse] {
        if #available(iOS 10.0, *) {
            let fetchRequest : NSFetchRequest = LocationResponse.fetchRequest()
            do {
                let results = try DataBaseController.getContext().fetch(fetchRequest)
                let locationResponses = results
                if locationResponses.count > 0 {
                   return locationResponses
                }else{
                   return []
                }
             } catch  {
                print("error is \(error)")
                return []
            }
        }else{
            let fetchRequest = NSFetchRequest<NSFetchRequestResult>(entityName: "LocationResponse")
            fetchRequest.returnsObjectsAsFaults = false
            do {
                let results = try managedObjectContext.fetch(fetchRequest)
                let  locationResponses = results as! [LocationResponse]
                if locationResponses.count > 0 {
                    return locationResponses
                }else{
                    return []
                }
            } catch _ as NSError {
                return []
            }
        }
    }
    
    
    class func deleteLocationResponseFromDB() {
        let context = DataBaseController.getContext()
        let fetchRequest = NSFetchRequest<NSFetchRequestResult>(entityName: "LocationResponse")
        fetchRequest.returnsObjectsAsFaults = false
        do{
            let fetchedResults =  try context.fetch(fetchRequest) as? [NSManagedObject]
            for entity in fetchedResults! {
                context.delete(entity)
            }
            DataBaseController.saveContext()
        }catch _ {
                print("Could not delete")
        }
    }
    
}
