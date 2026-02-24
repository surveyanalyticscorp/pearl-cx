import Flutter
import UIKit
import QuestionProCXFramework

public class MathFlutterPlugin: NSObject, FlutterPlugin, QuestionProInitDelegate {

    private var window: UIWindow?
    private var isInitialized = false
    private var initResult: FlutterResult?

    public static func register(with registrar: FlutterPluginRegistrar) {
        let channel = FlutterMethodChannel(name: "math_flutter", binaryMessenger: registrar.messenger())
        let cxChannel = FlutterMethodChannel(name: "Cx_Callback", binaryMessenger: registrar.messenger())
        let instance = MathFlutterPlugin()
        registrar.addMethodCallDelegate(instance, channel: channel)
        registrar.addMethodCallDelegate(instance, channel: cxChannel)

        if let appDelegate = UIApplication.shared.delegate as? FlutterAppDelegate {
            instance.window = appDelegate.window ?? nil
        }
    }

    public func handle(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
        let args = call.arguments as? [String: Any]
        
        switch call.method {
        case "initializeSurvey":
            handleInitializeSurvey(args: args, result: result)
            
        case "launchSurvey":
            handleLaunchSurvey(args: args, result: result)
            
        case "nativeMethod":
            handleScreenViewMethod(args: args, result: result)
            
        case "setDataMappings":
            handleSetDataMappings(args: args, result: result)
            
        default:
            result(FlutterMethodNotImplemented)
        }
    }
    
    // MARK: - Method Handlers
    
    private func handleInitializeSurvey(args: [String: Any]?, result: @escaping FlutterResult) {
        guard let apiKey = args?["apiKey"] as? String, !apiKey.isEmpty else {
            result(FlutterError(
                code: "INVALID_ARGS",
                message: "apiKey is required for iOS",
                details: nil
            ))
            return
        }
        
        let dataCenter = args?["dataCenter"] as? String ?? "US"
        initializeSurvey(apiKey: apiKey, dataCenter: dataCenter, result: result)
    }
    
    private func handleLaunchSurvey(args: [String: Any]?, result: @escaping FlutterResult) {
        guard let surveyIdString = args?["surveyId"] as? String,
              let surveyId = Int64(surveyIdString),
              surveyId > 0 else {
            result(FlutterError(
                code: "INVALID_ARGS",
                message: "surveyId must be a positive number",
                details: nil
            ))
            return
        }
        
        launchSurvey(surveyId: surveyId, result: result)
    }
    
    private func handleScreenViewMethod(args: [String: Any]?, result: @escaping FlutterResult) {
        guard let screenName = args?["screen_name_key"] as? String, !screenName.isEmpty else {
            result(FlutterError(
                code: "INVALID_ARGS",
                message: "screen_name_key is required",
                details: nil
            ))
            return
        }
        
        logScreenView(screenName: screenName, result: result)
    }
    
    private func handleSetDataMappings(args: [String: Any]?, result: @escaping FlutterResult) {
        guard let customVariables = args?["customVariables"] as? [String: String], !customVariables.isEmpty else {
            result(FlutterError(
                code: "INVALID_ARGS",
                message: "customVariables cannot be null or empty",
                details: nil
            ))
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

        let appWindow = window ?? UIApplication.shared
            .connectedScenes
            .compactMap { ($0 as? UIWindowScene)?.windows.first }
            .first

        guard let validWindow = appWindow else {
            result(FlutterError(
                code: "NO_WINDOW",
                message: "Window not available",
                details: nil
            ))
            return
        }

        let dataCenterValue = dataCenter.uppercased() == "EU" 
            ? TouchPoint.DataCenter.DATA_CENTER_EU 
            : TouchPoint.DataCenter.DATA_CENTER_US

        let touchPoint = TouchPoint.initTouchPoint(dataCenter: dataCenterValue)

        // Store result callback for async response
        initResult = result

        QuestionProCX.getinstance().configure(
            apiKey: apiKey,
            touchPoint: touchPoint,
            withWindow: validWindow,
            initCallbackDelegate: self
        )
    }

    // MARK: - Launch Survey

    private func launchSurvey(surveyId: Int64, result: @escaping FlutterResult) {
        QuestionProCX.getinstance().setScreenName(screenName: "Survey_\(surveyId)")
        result("Survey trigger sent")
    }

    // MARK: - Log Screen View

    private func logScreenView(screenName: String, result: @escaping FlutterResult) {
        QuestionProCX.getinstance().setScreenName(screenName: screenName)
        result("Event logged")
    }
    
    // MARK: - Set Data Mappings
    
    private func setDataMappings(customVariables: [String: String], result: @escaping FlutterResult) {
        QuestionProCX.getinstance().setDataMappings(dataMappings: customVariables)
        result("Data mappings set successfully")
    }

    // MARK: - Init Callbacks

    public func initSDKSuccess() {
        isInitialized = true
        initResult?("QuestionPro CX SDK initialized successfully")
        initResult = nil
    }

    public func initSDKFailed(error: String) {
        initResult?(FlutterError(
            code: "INIT_FAILED",
            message: error.isEmpty ? "Initialization failed" : error,
            details: nil
        ))
        initResult = nil
    }
}
