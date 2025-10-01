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
            // Mock implementation for now - will integrate with QuestionProCXFramework later
            /*let result: [String: Any] = [
                "success": true,
                "message": "iOS SDK configured successfully",
                "platform": "ios"
            ]
            resolve(result)*/

            do {
                // Extract API key from options
                guard let apiKey = options["apiKey"] as? String else {
                    reject("INVALID_API_KEY", "API key is required", nil)
                    return
                }
                
                // Initialize TouchPoint with US data center
                let touchPoint = TouchPoint.initTouchPoint(dataCenter: TouchPoint.DataCenter.DATA_CENTER_US)
                
                // Get main window for configuration
                guard let window = UIApplication.shared.windows.first else {
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
                
                print("🔧 [iOS] QuestionPro CX SDK configuration initiated")
                
            } catch {
                print("🔧 [iOS] Configuration error: \(error)")
                reject("CONFIGURATION_ERROR", error.localizedDescription, error)
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
        
        /let result: [String: Any] = [
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
        
        configureReject?("INIT_SDK_FAILED", "SDK initialization failed: \(error)", nil)
        configurePromise = nil
        configureReject = nil
    }
}