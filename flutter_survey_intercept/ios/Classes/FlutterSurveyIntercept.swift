import Flutter
import UIKit
import QuestionProCXFramework

public class FlutterSurveyIntercept: NSObject, FlutterPlugin, QuestionProInitDelegate, QuestionProCallbackDelegate {

    private var window: UIWindow?
    private var isInitialized = false
    private var initResult: FlutterResult?
    private var surveyUrlChannel: FlutterMethodChannel?
    private var hasRepliedToInit = false
    private let initLock = NSLock()

    public static func register(with registrar: FlutterPluginRegistrar) {
        let channel = FlutterMethodChannel(name: "intercept_sdk", binaryMessenger: registrar.messenger())
        let cxChannel = FlutterMethodChannel(name: "Cx_Callback", binaryMessenger: registrar.messenger())
        let instance = FlutterSurveyIntercept()
        instance.surveyUrlChannel = channel
        registrar.addMethodCallDelegate(instance, channel: channel)
        registrar.addMethodCallDelegate(instance, channel: cxChannel)

        if let appDelegate = UIApplication.shared.delegate as? FlutterAppDelegate {
            instance.window = appDelegate.window
        }
    }

    public func handle(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
        let args = call.arguments as? [String: Any]
        
        switch call.method {
        case "initialize":
            initialize(args: args, result: result)
        case "setScreenVisited":
            setScreenVisited(args: args, result: result)
        case "setDataMappings":
            handleSetDataMappings(args: args, result: result)
        default:
            result(FlutterMethodNotImplemented)
        }
    }
    
    // MARK: - Method Handlers
    
    private func initialize(args: [String: Any]?, result: @escaping FlutterResult) {
        guard let apiKey = args?["apiKey"] as? String, !apiKey.isEmpty else {
            result(FlutterError(code: "INVALID_ARGS", message: "apiKey is required for iOS", details: nil))
            return
        }
        
        let dataCenter = args?["dataCenter"] as? String ?? "US"
        initializeSurvey(apiKey: apiKey, dataCenter: dataCenter, result: result)
    }
    
    private func setScreenVisited(args: [String: Any]?, result: @escaping FlutterResult) {
        guard let screenName = args?["screen_name_key"] as? String, !screenName.isEmpty else {
            result(FlutterError(code: "INVALID_ARGS", message: "screen_name_key is required", details: nil))
            return
        }
        
        setScreenName(screenName: screenName, result: result)
    }
    
    private func handleSetDataMappings(args: [String: Any]?, result: @escaping FlutterResult) {
        guard let customVariables = args?["customVariables"] as? [String: String], !customVariables.isEmpty else {
            result(FlutterError(code: "INVALID_ARGS", message: "customVariables cannot be null or empty", details: nil))
            return
        }
        
        setDataMappings(customVariables: customVariables, result: result)
    }

    // MARK: - SDK Initialization

    private func initializeSurvey(apiKey: String, dataCenter: String, result: @escaping FlutterResult) {
        if isInitialized {
            result("SDK already initialized")
            return
        }

        guard let appWindow = window ?? UIApplication.shared
            .connectedScenes
            .compactMap({ ($0 as? UIWindowScene)?.windows.first })
            .first else {
            result(FlutterError(code: "NO_WINDOW", message: "Window not available", details: nil))
            return
        }

        let dataCenterValue = dataCenter.uppercased() == "EU" 
            ? TouchPoint.DataCenter.DATA_CENTER_EU 
            : TouchPoint.DataCenter.DATA_CENTER_US

        let touchPoint = TouchPoint.initTouchPoint(dataCenter: dataCenterValue)
        touchPoint.platform = TouchPoint.PLATFORM.FLUTTER.rawValue
        
        initResult = result
        initLock.lock()
        hasRepliedToInit = false
        initLock.unlock()

        do {
            QuestionProCX.getinstance().configure(
                apiKey: apiKey,
                touchPoint: touchPoint,
                withWindow: appWindow,
                initCallbackDelegate: self,      
            )
            QuestionProCX.getinstance().setQuestionProCallbackDelegate(questionProCallbackDelegate: self)
        } catch {
            initLock.lock()
            defer { initLock.unlock() }
            if !hasRepliedToInit {
                hasRepliedToInit = true
                initResult?(FlutterError(
                    code: "INIT_EXCEPTION",
                    message: "SDK initialization failed: \(error.localizedDescription)",
                    details: nil
                ))
                initResult = nil
            }
        }
    }

    // MARK: - Screen View & Data Mappings

    private func setScreenName(screenName: String, result: @escaping FlutterResult) {
        do {
            QuestionProCX.getinstance().setScreenName(screenName: screenName)
            result("Event logged")
        } catch {
            result(FlutterError(code: "SCREEN_VIEW_ERROR", message: error.localizedDescription, details: nil))
        }
    }
    
    private func setDataMappings(customVariables: [String: String], result: @escaping FlutterResult) {
        do {
            QuestionProCX.getinstance().setDataMappings(dataMappings: customVariables)
            result("Data mappings set successfully")
        } catch {
            result(FlutterError(code: "DATA_MAPPING_ERROR", message: error.localizedDescription, details: nil))
        }
    }

    // MARK: - QuestionPro Delegate Callbacks

    public func initSDKSuccess() {
        initLock.lock()
        defer { initLock.unlock() }
        if !hasRepliedToInit {
            hasRepliedToInit = true
            isInitialized = true
            initResult?("QuestionPro CX SDK initialized successfully")
            initResult = nil
        }
    }

    public func initSDKFailed(error: String) {
        initLock.lock()
        defer { initLock.unlock() }
        if !hasRepliedToInit {
            hasRepliedToInit = true
            initResult?(FlutterError(code: "INIT_FAILED", message: error.isEmpty ? "Initialization failed" : error, details: nil))
            initResult = nil
        }
    }
    
    public func getSurveyURL(surveyURL: String) {
        guard !surveyURL.isEmpty else { return }
        surveyUrlChannel?.invokeMethod("onSurveyUrlReceived", arguments: ["surveyUrl": surveyURL])
    }
    
    deinit {
        initResult = nil
        window = nil
        surveyUrlChannel = nil
    }
}
