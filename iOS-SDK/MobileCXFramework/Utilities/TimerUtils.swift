//
//  TimerUtils.swift
//  QuestionProCXFramework
//
//  Created by Prasad on 26/03/25.
//
import Foundation


public class TimerUtils {
    
    private var timers: [Int: Timer] = [:]
    private var continuations: [Int: AsyncStream<Int>.Continuation] = [:]
    private var remainingTimes: [Int: Int] = [:]
    private var rules: [Int: Rule] = [:]
    private var delegates: [Int: SurveyLaunchDelegate] = [:]
    
    @MainActor public static var instance: TimerUtils?
    
    @MainActor public static func getinstance() -> TimerUtils {
        if instance == nil {
            instance = TimerUtils()
        }
        return instance!
    }
    
    private init() {}
    
    
    public func startTimer( timeInterval: Int, interceptId: Int,
                            interceptRule: Rule, completionDelegate: SurveyLaunchDelegate) -> AsyncStream<Int> {
        rules[interceptId] = interceptRule
        delegates[interceptId] = completionDelegate
        remainingTimes[interceptId] = timeInterval

        return AsyncStream { continuation in
            continuations[interceptId] = continuation
            startInternalTimer(for: interceptId)
        }
    }
    
    private func startInternalTimer(for interceptId: Int) {
        guard let remaining = remainingTimes[interceptId],
                let delegate = delegates[interceptId],
                let rule = rules[interceptId] else { return }
        let timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] t in
            guard let self = self else { return }
            if let current = self.remainingTimes[interceptId], current > 0 {
                self.continuations[interceptId]?.yield(current)
                self.remainingTimes[interceptId] = current - 1
            } else {
                t.invalidate()
                self.continuations[interceptId]?.finish()
                self.clearState(for: interceptId)
                DispatchQueue.main.async {
                    delegate.launchSurveyForIntercept(interceptId: interceptId, satisfiedRule: rule)
                }
            }
        }
        RunLoop.current.add(timer, forMode: .common)
        timers[interceptId] = timer
    }
    
    public func pauseAllTimers() {
        for (interceptId, timer) in timers {
            timer.invalidate()
            timers.removeValue(forKey: interceptId)
            print("⏸ Paused timer for interceptId: \(interceptId)")
        }
    }

    public func resumeAllTimers() {
        for interceptId in remainingTimes.keys {
            guard timers[interceptId] == nil else { continue }
            print("▶️ Resuming timer for interceptId: \(interceptId)")
            startInternalTimer(for: interceptId)
        }
    }

    public func stopTimer(for interceptId: Int) {
        timers[interceptId]?.invalidate()
        continuations[interceptId]?.finish()
        clearState(for: interceptId)
    }

    public func stopAllTimers() {
        for (id, _) in timers {
            stopTimer(for: id)
        }
    }

    private func clearState(for interceptId: Int) {
        timers.removeValue(forKey: interceptId)
        remainingTimes.removeValue(forKey: interceptId)
        continuations.removeValue(forKey: interceptId)
        delegates.removeValue(forKey: interceptId)
        rules.removeValue(forKey: interceptId)
    }
}


