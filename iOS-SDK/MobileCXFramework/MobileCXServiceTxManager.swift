
// MobileCXFramework
//
// Created by Prasad on 30/07/24.
//
import Foundation
import UIKit
public protocol CXServiceDelegate: NSObjectProtocol {
  func CXServiceResponse(withURL response: [String: Any])
}
public class MobileCXServiceTxManager : NSObject, URLSessionDelegate, URLSessionTaskDelegate, URLSessionDataDelegate{
  public var response: URLResponse?
  public var receivedData: NSMutableData
  public weak var iDelegate: CXServiceDelegate?
  public override init() {
    self.receivedData = NSMutableData()
  }
  lazy var session: URLSession? = URLSession(configuration: URLSessionConfiguration.default, delegate: self, delegateQueue: nil)
  public func invokeService(touchPoint:TouchPoint!, withAPIKey apikey:String!, DataCenter iDataCenter: TouchPoint.DataCenter) {
      var path:String! = nil
      let header:String! = nil
    let dataCenterString:String! = GlobalDataCX.getDataCenterString(dataCenter: iDataCenter)
    let baseUrl:String! = GlobalDataCX.getBaseUrl(dataCenter: ((dataCenterString! as NSString) as String))
      path = String(format:"/a/api/v2/cx/transactions/survey-url")
      var body:String! = nil
    body = self.createCXRequestWithTouchPointID(touchPoint: touchPoint)
    self.execute(method: "POST", baseUrl:baseUrl, path:path, body:body, apiKey:apikey)
    }
  public func createCXRequestWithTouchPointID(touchPoint:TouchPoint!) -> String! {
    var cxRequestString:String! = nil
      let isManualSurvey:NSNumber! = 1
      let cxRequestDict:NSMutableDictionary! = NSMutableDictionary()
      cxRequestDict.setObject(touchPoint.surveyId, forKey:"surveyID" as NSCopying)
      cxRequestDict.setObject(isManualSurvey as Any, forKey:"isManualSurvey" as NSCopying)
      if !touchPoint.email.isEqual("") {
        cxRequestDict.setObject(touchPoint.email, forKey:"email" as NSCopying)
      } else {
        let aUUID = UUID().uuidString
        let defaultEmail = "\(aUUID)@questionpro.com"
        cxRequestDict.setObject(defaultEmail as Any, forKey:"email" as NSCopying)
      }
      if !touchPoint.firstName.isEqual("") {
        cxRequestDict.setObject(touchPoint.firstName, forKey:"firstName" as NSCopying)
      }
      if !touchPoint.lastName.isEqual("") {
        cxRequestDict.setObject(touchPoint.lastName, forKey:"lastName" as NSCopying)
      }
      if !touchPoint.mobile.isEqual("") {
        cxRequestDict.setObject(touchPoint.mobile, forKey:"mobile" as NSCopying)
      }
      if !touchPoint.segmentCode.isEqual("") {
        cxRequestDict.setObject(touchPoint.segmentCode, forKey:"S1" as NSCopying)
      }
      if !touchPoint.customVariable1.isEqual("") {
        cxRequestDict.setObject(touchPoint.customVariable1, forKey:"custom1" as NSCopying)
      }
      if !touchPoint.customVariable2.isEqual("") {
        cxRequestDict.setObject(touchPoint.customVariable2, forKey:"custom2" as NSCopying)
      }
      if !touchPoint.customVariable3.isEqual("") {
        cxRequestDict.setObject(touchPoint.customVariable3, forKey:"custom3" as NSCopying)
      }
      var error:NSError! = nil
      var uploadData:NSData!
      if JSONSerialization.isValidJSONObject(cxRequestDict as Any)
        {
        do {
          let uploadData = try JSONSerialization.data(withJSONObject: cxRequestDict as Any, options: .prettyPrinted)          
          if uploadData != nil && error == nil
            {
            cxRequestString = String(data: uploadData as Data, encoding: .utf8)
            print(cxRequestString ?? "")
            }
          // Use uploadData here
        } catch {
          print("Error serializing JSON: \(error)")
        }
        }
       return cxRequestString
    }
  public func execute(method:String!, baseUrl:String!, path:String!, body:String!, apiKey:String!) {
      let request:NSMutableURLRequest! = NSMutableURLRequest()
      let url:String! = NSMutableString(format:"%@%@", baseUrl,path) as String
      request.url = URL(string: url)
      request.httpMethod = method
      request.timeoutInterval = 300
      if (body != nil) {
        let data = body.data(using: .utf8)
        request.httpBody = data
        request.setValue("application/json; charset=UTF-8", forHTTPHeaderField:"Content-Type")
        request.setValue(apiKey, forHTTPHeaderField:"api-key")
      }
      printRequestDetails(request: request)
      let task = session?.dataTask(with: request as URLRequest)
      task?.resume()
      NSURLConnection(request: request as URLRequest, delegate:self)
    }
    
  public func printRequestDetails(request: NSMutableURLRequest) {
    print("URL: \(request.url?.absoluteString ?? "No URL")")
    print("HTTP Method: \(request.httpMethod)")
    if let headers = request.allHTTPHeaderFields {
      print("Headers:")
      for (key, value) in headers {
        print("\(key): \(value)")
      }
    } else {
      print("No Headers")
    }
    if let bodyData = request.httpBody {
      let bodyString = String(data: bodyData, encoding: .utf8) ?? "Unable to convert body data to string"
      print("Body: \(bodyString)")
    } else {
      print("No Body")
    }
  }
  public func get(baseUrl:String!, Path path:String!) {
      let request:NSMutableURLRequest! = NSMutableURLRequest()
      let url:String! = NSMutableString(format:"%@%@", baseUrl,path) as String
      request.url = URL(string: url)
      request.httpMethod = "GET"
      request.timeoutInterval = 300
      NSURLConnection(request: request as URLRequest, delegate:self)
    }
    
  public func urlSession(_ session: URLSession, didBecomeInvalidWithError error: Error?) {
      print("Session invalidated with error: \(String(describing: error))")
    }
    
    // URLSessionTaskDelegate method
  public func urlSession(_ session: URLSession, task: URLSessionTask, didCompleteWithError error: Error?) {
      if let error = error {
        print("Task completed with error: \(error)")
      }
    }
    
    
    // URLSessionDataDelegate method
  public func urlSession(_ session: URLSession, dataTask: URLSessionDataTask, didReceive data: Data) {
      receivedData.append(data as Data)
      self.handleHttpOK(data: self.receivedData as Data)
    }
    
    
    // URLSessionDataDelegate method
  public func urlSession(_ session: URLSession, dataTask: URLSessionDataTask, didReceive response: URLResponse, completionHandler: @escaping (URLSession.ResponseDisposition) -> Void) {
      self.response = response
      if let httpResponse = response as? HTTPURLResponse {
          let headers = httpResponse.allHeaderFields
          
          for (key, value) in headers {
              if let keyString = key as? String, let valueString = value as? String {
                  print("\(#function) HEADER[\(keyString)] => \(valueString)")
              }
          }
      }
    completionHandler(.allow)
    }
    
    // Handling SSL/TLS Challenges (use with caution)
       public func urlSession(_ session: URLSession, didReceive challenge: URLAuthenticationChallenge, completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void) {
            if challenge.protectionSpace.authenticationMethod == NSURLAuthenticationMethodServerTrust {
                let serverTrust = challenge.protectionSpace.serverTrust
                let credential = URLCredential(trust: serverTrust!)
                completionHandler(.useCredential, credential)
            } else {
                completionHandler(.performDefaultHandling, nil)
            }
        }
    
    
  public func connection(connection:NSURLConnection!, didReceiveData data:NSData!) {
      receivedData.append(data as Data)
    }
    
  public func connection(connection:NSURLConnection!, canAuthenticateAgainstProtectionSpace protectionSpace:URLProtectionSpace!) -> Bool {
      return (protectionSpace.authenticationMethod == NSURLAuthenticationMethodServerTrust)
    }
    
  public func connection(connection:NSURLConnection!, didReceiveAuthenticationChallenge challenge:URLAuthenticationChallenge!) {
    self.handleAuthenticationChallenge(challenge: challenge)
    }
    
  public func connection(connection:NSURLConnection!, willSendRequestForAuthenticationChallenge challenge:URLAuthenticationChallenge!) {
      self.handleAuthenticationChallenge(challenge: challenge)
    }
    
  public func handleAuthenticationChallenge(challenge:URLAuthenticationChallenge!) {
      if (challenge.protectionSpace.authenticationMethod == NSURLAuthenticationMethodServerTrust) {
        let serverTrust:SecTrust = challenge.protectionSpace.serverTrust!
        var trustResult:SecTrustResultType
        challenge.sender?.use(URLCredential(trust: challenge.protectionSpace.serverTrust!),
                   for:challenge)
      }
    }
    
  public func handleHttpError(code:Int) -> Bool {
      return true
    }
    
  public func connection(connection:NSURLConnection!, didFailWithError error:NSError!) {
//      self.handleHttpError(code: self.response!.statusCode)
    }
    
  public func connectionDidFinishLoading(connection:NSURLConnection!) {
      self.handleHttpOK(data: self.receivedData as Data)
    }
    
  public func handleHttpOK(data: Data) -> Bool {
      do {
          // Deserialize JSON data into a dictionary
          if let jsonData = try JSONSerialization.jsonObject(with: data, options: .mutableContainers) as? [String: Any] {
              
              // Check if the JSON data is valid
              if JSONSerialization.isValidJSONObject(jsonData) {
                  
                  // Check for the "response" key
                  if let response = jsonData["response"] as? [String: Any] {
                      processJson(json: jsonData)
                  }
              } else {
                  print("data is not JSON")
              }
          } else {
              // Handle invalid JSON
              print("Invalid Data")
          }
      } catch {
          // Handle JSON serialization error
          print("Error parsing JSON: \(error.localizedDescription)")
      }
      
      return false
  }
    
  public func processJson(json: [String: Any]) {
      if let jsonDict = json["response"] as? [String: Any] {
        let surveyURL = jsonDict["surveyURL"] as? String
        print("processJson-> surveyURL", surveyURL);
        // Check if iDelegate responds to the selector
        if let delegate = iDelegate {
          delegate.CXServiceResponse(withURL: jsonDict)
        }
      }
    }
}
