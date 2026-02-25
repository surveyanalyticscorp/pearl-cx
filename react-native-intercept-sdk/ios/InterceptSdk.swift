import Foundation
import React
import QuestionProCXFramework 

@objc(InterceptSdk)
class InterceptSdk: RCTEventEmitter, QuestionProInitDelegate {
    
    // Store promises for async callbacks
    private var configurePromise: RCTPromiseResolveBlock?
    private var configureReject: RCTPromiseRejectBlock?

    override init() {
        super.init()
        print("🔧 [iOS] InterceptSdk module initialized")
        NSLog("🔧 [iOS] InterceptSdk module initialized")
    }

    @objc override static func moduleName() -> String! {
        print("✅ Returning module name: InterceptSdk")
        return "InterceptSdk"
    }
    
    // CRITICAL: Required for proper module registration
    override func constantsToExport() -> [AnyHashable : Any]! {
        print("🔧 [iOS] constantsToExport called - registering module")
        NSLog("🔧 [iOS] constantsToExport called - registering module")
        return [
            "platform": "ios",
            "version": "1.0.0",
            "isReady": true
        ]
    }
    
    // Required for RCTEventEmitter - define supported events
    override func supportedEvents() -> [String]! {
        return [
            "InterceptSdkEvent",
            "survey_shown",
            "survey_completed", 
            "survey_dismissed"
        ]
    }
    
    // Required for React Native bridge
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    // Configure method matching Android implementation
    @objc
    func configure(_ options: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        print("🔧 [iOS] Configure method called with options: \(options)")

         // Store promises for async callback
        self.configurePromise = resolve
        self.configureReject = reject
        
        DispatchQueue.main.async {
            do {
                // Extract API key from options
                guard let apiKey = options["apiKey"] as? String else {
                    reject("INVALID_API_KEY", "API key is required", nil)
                    return
                }
                
                // Extract DataCenter from options (default to US)
                let dataCenterString = options["dataCenter"] as? String ?? "US"
                
                // Extract debug setting from options (default to false)
                let enableDebug = options["enableDebug"] as? Bool ?? false
                
                // Map string to TouchPoint.DataCenter enum
                let dataCenter: TouchPoint.DataCenter
                switch dataCenterString.uppercased() {
                case "US":
                    dataCenter = TouchPoint.DataCenter.DATA_CENTER_US
                case "EU":
                    dataCenter = TouchPoint.DataCenter.DATA_CENTER_EU
                case "CA":
                    dataCenter = TouchPoint.DataCenter.DATA_CENTER_CA
                case "SG":
                    dataCenter = TouchPoint.DataCenter.DATA_CENTER_SG
                case "AU":
                    dataCenter = TouchPoint.DataCenter.DATA_CENTER_AU
                case "SA":
                    dataCenter = TouchPoint.DataCenter.DATA_CENTER_SA
                case "KSA":
                    dataCenter = TouchPoint.DataCenter.DATA_CENTER_KSA
                default:
                    dataCenter = TouchPoint.DataCenter.DATA_CENTER_US
                }
            
                if enableDebug {
                    print("🔧 [iOS] Using DataCenter: \(dataCenter)")
                    print("🔧 [iOS] Debug mode enabled")
                }

                // Initialize TouchPoint with data center
                let touchPoint = TouchPoint.initTouchPoint(dataCenter: dataCenter);
                touchPoint.platform = TouchPoint.PLATFORM.REACT_NATIVE.rawValue;
                

                // Get main window for configuration
                var window: UIWindow?
                if #available(iOS 13.0, *) {
                    window = UIApplication.shared.connectedScenes
                        .first { $0.activationState == .foregroundActive }
                        .flatMap { $0 as? UIWindowScene }?
                        .windows
                        .first { $0.isKeyWindow }
                } else {
                    window = UIApplication.shared.keyWindow
                }

                // Get main window for configuration
                guard let window = window else {
                    reject("NO_WINDOW", "Unable to get main window", nil)
                    return
                }
                
                // Configure QuestionPro CX SDK
                QuestionProCX.getinstance().configure(
                    apiKey: apiKey,
                    touchPoint: touchPoint,
                    withWindow: window,
                    initCallbackDelegate: self
                )
                
                if enableDebug {
                    print("🔧 [iOS] QuestionPro CX SDK configuration initiated")
                }
                
            } catch {
                print("🔧 [iOS] Configuration error: \(error)")
                reject("CONFIGURATION_ERROR", error.localizedDescription, error)
            }
        }
    }

    @objc
    func setScreenVisited(_ screenName: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        print("🔧 [iOS] setScreenVisited called: \(screenName)")
        
        DispatchQueue.main.async {
            do {
                // Call QuestionPro CX SDK setScreenName
                QuestionProCX.getinstance().setScreenName(screenName: screenName)

                let result: [String: Any] = [
                    "success": true,
                    "screenName": screenName,
                    "message": "Screen visited successfully",
                    "timestamp": Date().timeIntervalSince1970
                ]
                resolve(result)
                
            } catch {
                print("🔧 [iOS] setScreenVisited error: \(error)")
                reject("SET_SCREEN_VISITED_ERROR", error.localizedDescription, error)
            }
        }
    }

    @objc
    func setDataMappings(_ dataMappings: [String: String], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        print("🔧 [iOS] setDataMappings called with: \(dataMappings)")
        
        DispatchQueue.main.async {
            do {
                // Call QuestionPro CX SDK setDataMappings
                QuestionProCX.getinstance().setDataMappings(dataMappings: dataMappings)
                
                let result: [String: Any] = [
                    "success": true,
                    "message": "Data mappings set successfully",
                    "mappingsCount": dataMappings.count,
                    "timestamp": Date().timeIntervalSince1970
                ]
                resolve(result)
                
            } catch {
                print("🔧 [iOS] setDataMappings error: \(error)")
                reject("SET_DATA_MAPPINGS_ERROR", error.localizedDescription, error)
            }
        }
    }
    
    // NotifyEvent method matching Android implementation  
    @objc
    func notifyEvent(_ eventType: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        print("🔧 [iOS] NotifyEvent called: \(eventType)")
        
        let result: [String: Any] = [
            "success": true,
            "eventType": eventType,
            "timestamp": Date().timeIntervalSince1970
        ]
        resolve(result)
    }
    
    // StartSurvey method for consistency with Android
    @objc  
    func startSurvey(_ surveyId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        print("🔧 [iOS] StartSurvey called: \(surveyId)")
        
        let result: [String: Any] = [
            "success": true,
            "surveyId": surveyId,
            "message": "Survey started successfully"
        ]
        resolve(result)
    }
}

extension InterceptSdk {
    
    func initSDKSuccess() {
        print("🔧 [iOS] QuestionPro CX SDK initialization success")
        
        let result: [String: Any] = [
            "success": true,
            "message": "iOS SDK configured successfully with QuestionPro CX",
            "platform": "ios"
        ]
        
        configurePromise?(result)
        configurePromise = nil
        configureReject = nil
    }
    
    func initSDKFailed(error: String) {
        print("🔧 [iOS] QuestionPro CX SDK initialization failed: \(error)")
        
        configureReject?("INIT_SDK_FAILED", error, nil)
        configurePromise = nil
        configureReject = nil
    }
}