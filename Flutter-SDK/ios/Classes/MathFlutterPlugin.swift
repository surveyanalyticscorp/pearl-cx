import Flutter
import UIKit
import QuestionProCXFramework

public class MathFlutterPlugin: NSObject, FlutterPlugin, QuestionProInitDelegate {

    private var window: UIWindow?
    private var isInitialized = false

    public static func register(with registrar: FlutterPluginRegistrar) {
        let channel = FlutterMethodChannel(name: "math_flutter", binaryMessenger: registrar.messenger())
        let instance = MathFlutterPlugin()
        registrar.addMethodCallDelegate(instance, channel: channel)

        // Try to get window from AppDelegate (may be nil on Scene-based apps)
        if let appDelegate = UIApplication.shared.delegate as? FlutterAppDelegate {
            instance.window = appDelegate.window ?? nil
        }
    }

    // MARK: - Method Channel

    public func handle(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
        switch call.method {

        case "initializeSurvey":
            let args = call.arguments as? [String: Any]
            let apiKey = args?["apiKey"] as? String
            let dataCenter = args?["dataCenter"] as? String ?? "US"
            
            // iOS requires API key (no manifest file like Android)
            guard let validApiKey = apiKey, !validApiKey.isEmpty else {
                result(FlutterError(
                    code: "INVALID_ARGS",
                    message: "apiKey is required for iOS. Please pass apiKey parameter: initializeSurvey(apiKey: 'your_key')",
                    details: nil
                ))
                return
            }
            
            initializeSurvey(apiKey: validApiKey, dataCenter: dataCenter, result: result)

        case "launchSurvey":
            if let args = call.arguments as? [String: Any],
               let surveyIdString = args["surveyId"] as? String,
               let surveyId = Int64(surveyIdString),
               surveyId > 0 {
                launchSurvey(surveyId: surveyId, result: result)
            } else {
                result(FlutterError(
                    code: "INVALID_ARGS",
                    message: "surveyId is required (positive number)",
                    details: nil
                ))
            }

        default:
            result(FlutterMethodNotImplemented)
        }
    }

    // MARK: - SDK Initialization (iOS 13+ / 14+ safe)

    private func initializeSurvey(apiKey: String, dataCenter: String, result: @escaping FlutterResult) {

        if isInitialized {
            result("SDK already initialized")
            return
        }

        if apiKey.isEmpty {
            result(FlutterError(
                code: "INVALID_ARGS",
                message: "apiKey cannot be empty",
                details: nil
            ))
            return
        }

        // Safe window retrieval for Scene-based apps (iOS 13+)
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

        let touchPoint = TouchPoint.initTouchPoint(
            dataCenter: dataCenterValue
        )

        QuestionProCX.getinstance().configure(
            apiKey: apiKey,
            touchPoint: touchPoint,
            withWindow: validWindow,
            initCallbackDelegate: self
        )

        isInitialized = true
        result("SDK initialized")
    }

    // MARK: - Launch Survey

    private func launchSurvey(surveyId: Int64, result: @escaping FlutterResult) {
        // iOS SDK triggers survey via screen name (Intercept rule required)
        QuestionProCX.getinstance().setScreenName(
            screenName: "Survey_\(surveyId)"
        )
        result("Survey trigger sent")
    }

    // MARK: - Init Callbacks

    public func initSDKSuccess() {
        print("QuestionPro CX SDK initialized successfully")
    }

    public func initSDKFailed(error: String) {
        print("QuestionPro CX SDK initialization failed: \(error)")
    }
}
