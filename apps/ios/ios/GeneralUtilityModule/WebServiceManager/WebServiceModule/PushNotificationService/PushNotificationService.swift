//
//  PushNotificationService.swift
//  ios
//
//  Created by Jignesh Raiyani on 10/3/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit

/*
 *  This block is called when device token registration is called .
 */

typealias PushNotificationServiceBlock = (_ responseString : String) -> Void

class PushNotificationService: WebServiceAsyncInvocation {
    
    var iDeviceToken = ""

    var iPushNotificationServiceBlock : PushNotificationServiceBlock!
    
    override func invoke() -> Void {
        
        var path = String()
        let appDetailsDict = GlobalData.fetchAppDetailsDict()
        
        let requestString = "/a/nativehtml/flashlet.general.FlashLetRegisterPushToken"
        if (appDetailsDict["kPushNotificationService"] != nil && appDetailsDict["kServiceHost"] != nil) {
            path = (appDetailsDict["kServiceHost"]! as! String) + (appDetailsDict["kPushNotificationService"]! as! String) as String
        }else {
            path = kServiceHost + requestString
        }
        
        var bodyData = [:] as Dictionary<String, AnyObject>
        if self.iDeviceToken.characters.count > 0 {
            bodyData = ["token":self.iDeviceToken, "platform":"ios", "deviceType":NSNumber(int:1)]
        }

       // self.postMethod(path, bodyParam: bodyData)
        
    }
    
//    override func handleHttpError(error : Error) -> Bool {
//
//        if (self.iPushNotificationServiceBlock != nil) {
//            self.iPushNotificationServiceBlock(responseString:error.localizedDescription)
//        }
//        return true;
//
//    }
//
//    override func handleHttpOK(jsonObject : NSDictionary) -> Bool {
//
//        do {
//            if let jsonResult = try NSJSONSerialization.JSONObjectWithData(jsonData, options: []) as? NSDictionary {
//                print(jsonResult)
//                if let statuscode = jsonResult.valueForKey("statusCode"){
//
//                    if  statuscode as! NSObject == 400 {
//                        if (self.iPushNotificationServiceBlock != nil) {
//                            self.iPushNotificationServiceBlock(responseString:jsonResult.description)
//                        } } else {
//                        if (self.iPushNotificationServiceBlock != nil) {
//                            self.iPushNotificationServiceBlock(responseString:jsonResult.description)
//                        }
//                    }
//                }
//            }
//        } catch let error as NSError {
//            if (self.iPushNotificationServiceBlock != nil) {
//                self.iPushNotificationServiceBlock(responseString:error.localizedDescription)
//            }
//        }
//        return true;
//    }


}
