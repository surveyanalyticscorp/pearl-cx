import Foundation
import UIKit

@MainActor public protocol CXServiceDelegate: NSObjectProtocol {
    func CXServiceResponse(withURL response: [String: Any])
}

@MainActor
public class MobileCXServiceTxManager: NSObject, URLSessionDelegate, URLSessionTaskDelegate, URLSessionDataDelegate {
    public var response: URLResponse?
    public var receivedData: Data
    public weak var iDelegate: CXServiceDelegate?

    // Initialize the receivedData
    public override init() {
        self.receivedData = Data()
    }

    lazy var session: URLSession? = URLSession(configuration: .default, delegate: self, delegateQueue: nil)

    public func invokeService(touchPoint: TouchPoint, withAPIKey apikey: String, dataCenter: TouchPoint.DataCenter) {
        let dataCenterString = GlobalDataCX.getDataCenterString(dataCenter: dataCenter)
        let baseUrl = GlobalDataCX.getBaseUrl(dataCenter: dataCenterString)

        let path = "/a/api/v2/cx/transactions/survey-url"
        let body = self.createCXRequestWithTouchPointID(touchPoint: touchPoint)

        self.execute(method: "POST", baseUrl: baseUrl, path: path, body: body, apiKey: apikey)
    }

    public func createCXRequestWithTouchPointID(touchPoint: TouchPoint) -> String {
        var cxRequestDict: [String: Any] = [
            "surveyID": touchPoint.surveyId,
            "isManualSurvey": 1
        ]

        if !touchPoint.email.isEmpty {
            cxRequestDict["email"] = touchPoint.email
        } else {
            let aUUID = UUID().uuidString
            cxRequestDict["email"] = "\(aUUID)@questionpro.com"
        }

        if !touchPoint.firstName.isEmpty { cxRequestDict["firstName"] = touchPoint.firstName }
        if !touchPoint.lastName.isEmpty { cxRequestDict["lastName"] = touchPoint.lastName }
        if !touchPoint.mobile.isEmpty { cxRequestDict["mobile"] = touchPoint.mobile }
        if !touchPoint.segmentCode.isEmpty { cxRequestDict["S1"] = touchPoint.segmentCode }
        if !touchPoint.transactionLanguage.isEmpty { cxRequestDict["transactionLanguage"] = touchPoint.transactionLanguage }
        if let customVariables = touchPoint.customVariables {
            for (key, value) in customVariables {
                let customKey = "custom\(key)"
                cxRequestDict[customKey] = value
            }            
        }

        do {
            let uploadData = try JSONSerialization.data(withJSONObject: cxRequestDict, options: .prettyPrinted)
            return String(data: uploadData, encoding: .utf8) ?? ""
        } catch {
            print("Error serializing JSON: \(error)")
            return ""
        }
    }

    public func execute(method: String, baseUrl: String, path: String, body: String?, apiKey: String) {
        guard let url = URL(string: baseUrl + path) else { return }
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.timeoutInterval = 300

        if let body = body {
            request.httpBody = body.data(using: .utf8)
            request.setValue("application/json; charset=UTF-8", forHTTPHeaderField: "Content-Type")
        }
        request.setValue(apiKey, forHTTPHeaderField: "api-key")

//        printRequestDetails(request: request)

        // Create and resume the data task
        let task = session?.dataTask(with: request)
        task?.resume()
    }

    public func printRequestDetails(request: URLRequest) {
        print("URL: \(request.url?.absoluteString ?? "No URL")")
        print("HTTP Method: \(request.httpMethod ?? "No HTTP Method")")
        if let headers = request.allHTTPHeaderFields {
            print("Headers: \(headers)")
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

    // URLSessionDataDelegate methods
    nonisolated public func urlSession(_ session: URLSession, dataTask: URLSessionDataTask, didReceive data: Data) {
        Task { @MainActor in
            self.receivedData.append(data)
            handleHttpOK(data: self.receivedData)
        }
    }

    nonisolated public func urlSession(_ session: URLSession, dataTask: URLSessionDataTask, didReceive response: URLResponse, completionHandler: @escaping (URLSession.ResponseDisposition) -> Void) {
        Task { @MainActor in
                self.response = response                
            }
        completionHandler(.allow)
    }

    nonisolated public func urlSession(_ session: URLSession, task: URLSessionTask, didCompleteWithError error: Error?) {
        if let error = error {
            print("Task completed with error: \(error)")
        } else {
            print("Task completed successfully.")
        }
    }

    // Handling SSL/TLS challenges
    nonisolated public func urlSession(_ session: URLSession, didReceive challenge: URLAuthenticationChallenge, completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void) {
        if challenge.protectionSpace.authenticationMethod == NSURLAuthenticationMethodServerTrust {
            if let serverTrust = challenge.protectionSpace.serverTrust {
                let credential = URLCredential(trust: serverTrust)
                completionHandler(.useCredential, credential)
            }
        } else {
            completionHandler(.performDefaultHandling, nil)
        }
    }

    public func handleHttpOK(data: Data) {
        do {
            if let jsonData = try JSONSerialization.jsonObject(with: data, options: .mutableContainers) as? [String: Any] {
                if let response = jsonData["response"] as? [String: Any] {
                    processJson(json: response)
                } else {
                    print("No valid response in JSON.")
                }
            }
        } catch {
            print("Error parsing JSON: \(error)")
        }
    }

    public func processJson(json: [String: Any]) {
        if let surveyURL = json["surveyURL"] as? String {
//            print("processJson -> surveyURL: \(surveyURL)")
        }
        iDelegate?.CXServiceResponse(withURL: json)
    }
}
