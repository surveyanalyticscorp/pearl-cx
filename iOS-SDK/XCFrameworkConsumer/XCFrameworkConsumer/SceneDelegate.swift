import UIKit
import QuestionProCXFramework

@available(iOS 13.0, *)
class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?
    public var iQuestionProCXManager = QuestionProCXManager.sharedManager
    let touchPoint = TouchPoint()
    func scene(
        _ scene: UIScene,
        willConnectTo session: UISceneSession,
        options connectionOptions: UIScene.ConnectionOptions
    ) {
        guard let windowScene = (scene as? UIWindowScene) else { return }

        let window = UIWindow(windowScene: windowScene)
        let storyboard = UIStoryboard(name: "Main", bundle: nil)
        let initialViewController = storyboard.instantiateInitialViewController()
        self.window?.rootViewController = initialViewController
        self.window = window
        window.makeKeyAndVisible()
        
        self.initializeSDK(window: window);
        self.launchSurvey(surveyId: 1111)
    }
    
    func initializeSDK(window: UIWindow) {
        let apiKey = "REPLACE_WITH_YOUR_WORKSPACE_API_KEY";
        iQuestionProCXManager.initwithAPIKey(
            apiKey: apiKey,
            dataCenter: TouchPoint.DataCenter.DATA_CENTER_US,
            withWindow: window
        )
    }
        
    func launchSurvey(surveyId: Int) {
        let touchPoint = touchPoint.initTouchPoint(surveyId: surveyId)
        touchPoint.firstName = "Mobile"
        touchPoint.lastName = "QuestionPro"
        touchPoint.customVariable1 = "Custom1 Value"
        touchPoint.customVariable2 = "Custom2 Value"
        touchPoint.customVariable3 = "Custom3 Value"
        iQuestionProCXManager.launchFeedbackSurvey(touchPoint: touchPoint)
    }

    // Handle scene lifecycle events as needed
    func sceneDidDisconnect(_ scene: UIScene) { }
    func sceneDidBecomeActive(_ scene: UIScene) { }
    func sceneWillResignActive(_ scene: UIScene) { }
    func sceneWillEnterForeground(_ scene: UIScene) { }
    func sceneDidEnterBackground(_ scene: UIScene) { }
}
