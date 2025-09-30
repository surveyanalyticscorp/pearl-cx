import Foundation
import React

/**
 * React Native bridge module for QuestionPro Survey Intercept SDK (iOS)
 * 
 * This module serves as a bridge between React Native JavaScript and the native
 * QuestionPro Survey SDK for iOS. It handles configuration, event notifications,
 * and forwards events from the native SDK back to JavaScript.
 */
@objc(InterceptSdk)
class InterceptSdk: RCTEventEmitter {
    
    // Add initialization logging
    override init() {
        super.init()
        print("🔧 InterceptSdk iOS module initialized")
        print("🔍 iOS module name: \(String(describing: type(of: self)))")
    }
    
    // Add constants to help with module detection
    override func constantsToExport() -> [AnyHashable : Any]! {
        return [
            "isIOS": true,
            "moduleName": "InterceptSdk",
            "version": "1.0.0"
        ]
    }
    
    // Event names that will be emitted to JavaScript
    static let EVENT_SURVEY_SHOWN = "survey_shown"
    static let EVENT_SURVEY_COMPLETED = "survey_completed"
    static let EVENT_SURVEY_DISMISSED = "survey_dismissed"
    
    // Supported events for RCTEventEmitter
    override func supportedEvents() -> [String]! {
        return [
            InterceptSdk.EVENT_SURVEY_SHOWN,
            InterceptSdk.EVENT_SURVEY_COMPLETED,
            InterceptSdk.EVENT_SURVEY_DISMISSED,
            "error"
        ]
    }
    
    // Enable the module to be initialized on any thread
    override static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    /**
     * Configure the Survey SDK with API key and optional parameters
     * 
     * @param options Configuration object containing:
     *                - apiKey: String (required)
     *                - email: String (optional)
     *                - variables: Dictionary (optional)
     * @param resolve Promise resolver for success
     * @param reject Promise rejecter for errors
     */
    @objc
    func configure(_ options: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        print("start configure ios")
        guard let apiKey = options["apiKey"] as? String, !apiKey.isEmpty else {
            reject("INVALID_API_KEY", "API key is required", nil)
            return
        }
        
        let email = options["email"] as? String
        let variables = options["variables"] as? [String: Any]
        
        // TODO: Call your existing native SDK configure method here
        // For now, simulate success
        DispatchQueue.main.async {
            resolve(true)
        }
    }
    
    /**
     * Notify the SDK of an event occurrence
     * 
     * @param eventName Name of the event to notify
     * @param params Optional parameters for the event
     */
    @objc
    func notifyEvent(_ eventName: String, params: [String: Any]?) {
        
        // TODO: Call your existing native SDK notifyEvent method here
        // For demonstration, emit a sample event
        DispatchQueue.main.async { [weak self] in
            self?.sendEvent(withName: InterceptSdk.EVENT_SURVEY_SHOWN, body: [
                "eventName": eventName,
                "message": "Event triggered: \(eventName)"
            ])
        }
    }
    

    
    /**
     * Required method to specify which methods can be called from JavaScript
     */
    override func methodQueue() -> DispatchQueue! {
        return DispatchQueue.main
    }
}


