//
//  WebServiceAsyncInvocation.swift
//  QuestionProCommunities
//
//  Created by Jignesh Raiyani on 8/21/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit
import Alamofire

class WebServiceAsyncInvocation: NSObject {
        
    override init() {
        
     }
    
    func invoke() -> Void {
        
    }
    
    func getMethod(path : NSString) -> Void {
        
//        let urlString = (path as String)
//        let url = NSURL(string: urlString)// Creating URL
//        let request = NSMutableURLRequest(URL: url!)// Creating Http Request
//        request.HTTPMethod="GET"
//        request.timeoutInterval = 300
//        let connection: NSURLConnection = NSURLConnection(request: request, delegate: self, startImmediately: true)!
//        connection.start()
        
    }
    
    func postMethod(path : String , bodyParam : [String: Any]) -> Void {
        let HTTPHeaderField_ContentType = "Content-Type"     // MARK:- HeaderField
        let ContentType_ApplicationJson = "application/json" // MARK:- ContentType
        let appUserInfo :AppUser = iOSManager.sharedInstance.appUserInfo
        var headers = [String:String]()
        headers[HTTPHeaderField_ContentType] = ContentType_ApplicationJson
        if let authToken = appUserInfo.authToken, authToken.length > 0 {
             headers["Auth-Token"] = authToken
        }
        request(URL.init(string: path)!, method: .post, parameters: bodyParam, encoding: JSONEncoding.default, headers: headers).responseJSON { response in
            switch response.result {
            case .success:
                print(response)
                if let responseJSON = response.result.value as? [String: Any]{
                    self.handleHttpOK(jsonObject: responseJSON)
                }
                break
            case .failure(let error):
                if let error = response.result.error {
                    self.handleHttpError(error: error)
                }
                break
            }
        }
    }
    
//    func postMethod(path : NSString , bodyParam : NSDictionary) -> Void {
//
//        let configuration = URLSessionConfiguration.default
//        let urlSession = URLSession(configuration: configuration)
//        let HTTPHeaderField_ContentType = "Content-Type"     // MARK:- HeaderField
//        let ContentType_ApplicationJson = "application/json" // MARK:- ContentType
//        let HTTPMethod_Post = "POST"                          // MARK: HTTPMethod
//        let urlString = (path as String)
//        let callURL = URL.init(string: urlString)
//        var request = URLRequest.init(url: callURL!)
//        request.timeoutInterval = 300.0 // TimeoutInterval in Second
//        request.cachePolicy = URLRequest.CachePolicy.reloadIgnoringLocalCacheData
//        request.addValue(ContentType_ApplicationJson, forHTTPHeaderField: HTTPHeaderField_ContentType)
//        request.httpMethod = HTTPMethod_Post
//        do {
//            try request.httpBody = JSONSerialization.data(withJSONObject: bodyParam, options:[])
//        } catch let error as NSError {
//            print(error.localizedDescription)
//        }
//        let dataTask = urlSession.dataTask(with: request) { (data,response,error) in
//            if error != nil{
//                DispatchQueue.main.async(execute: {
//                    self.handleHttpError(error: error! as NSError)
//                })
//            }
//            do {
//                let resultJson = try JSONSerialization.jsonObject(with: data!, options: []) as? [String:AnyObject]
//                print("Result",resultJson!)
//                DispatchQueue.main.async(execute: {
//                    self.handleHttpOK(data: data! as NSData)
//                })
//            } catch {
//                print("Error -> \(error)")
//                DispatchQueue.main.async(execute: {
//                    self.handleHttpError(error: error as NSError)
//                })
//            }
//        }
//        dataTask.resume()
//    }
    
    func handleHttpError(error : Error) {
    }
    
    func handleHttpOK(jsonObject : [String: Any]) {
    }
    
    
}
