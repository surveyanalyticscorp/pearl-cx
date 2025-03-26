//
//  TimerUtils.swift
//  QuestionProCXFramework
//
//  Created by Prasad on 26/03/25.
//
import Foundation


public class TimerUtils {
    
    var timer: Timer? = nil
    @MainActor public static var instance: TimerUtils?
    
    @MainActor public static func getinstance() -> TimerUtils{
        if instance == nil {
            instance = TimerUtils()
        }
        return instance!
    }
    
    public static func startTimer(timeInterval: Int, interceptId: Int, interceptRule: Rule, completionDelegate: SurveyLaunchDelegate) -> AsyncStream<Int> {
        AsyncStream { continuation in
            var remainingTimeInSeconds = Int(timeInterval)

            let timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { timer in
                if remainingTimeInSeconds > 0 {
                    continuation.yield(Int(remainingTimeInSeconds))
                    remainingTimeInSeconds -= 1
                } else {
                    timer.invalidate()
                    continuation.finish()
                    DispatchQueue.main.async {
                        completionDelegate.launchSurveyForIntercept(interceptId: interceptId, satisfiedRule: interceptRule)
                    }
                }
            }
            RunLoop.current.add(timer, forMode: .common)
        }
    }
}


