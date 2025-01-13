import UIKit
import QuestionProCXFramework

class SurveyManager {
    static let shared = SurveyManager()

    private init() {}
    public var iQuestionProCXManager = QuestionProCXManager.sharedManager
    

    func initializeSurvey(window: UIWindow) {
        let apiKey = "c3a95351-cacf-4f34-823c-99f5184fc5e9"        

        iQuestionProCXManager.initwithAPIKey(
            apiKey: apiKey,
            dataCenter: TouchPoint.DataCenter.DATA_CENTER_US,
            withWindow: window
        )
    }
    
    func launchSurvey(touchPoint: TouchPoint) {
        iQuestionProCXManager.launchFeedbackSurvey(touchPoint: touchPoint)
    }
}
