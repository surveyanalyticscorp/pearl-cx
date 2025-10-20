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
    
    // Store original timer intervals for restarting from beginning
    private var originalTimeIntervals: [Int: Int] = [:]
    
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
        originalTimeIntervals[interceptId] = timeInterval // Store original interval

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
    
    // MARK: - Pause/Resume Functions (existing functionality)
    public func pauseAllTimers() {
        for (interceptId, timer) in timers {
            timer.invalidate()
            timers.removeValue(forKey: interceptId)
            LogUtils.printMessage(message: "⏸ Paused timer for interceptId: \(interceptId)")
        }
    }

    public func resumeAllTimers() {
        for interceptId in remainingTimes.keys {
            guard timers[interceptId] == nil else { continue }
            LogUtils.printMessage(message: "▶️ Resuming timer for interceptId: \(interceptId)")
            startInternalTimer(for: interceptId)
        }
    }
    
    // MARK: - Stop/Restart Functions (new functionality)
    public func stopAllTimersOnBackground() {
        for (interceptId, timer) in timers {
            timer.invalidate()
            timers.removeValue(forKey: interceptId)
            LogUtils.printMessage(message: "🛑 Stopped timer for interceptId: \(interceptId) due to background")
        }
        
        // Clear continuations but keep other data for restarting
        for (interceptId, continuation) in continuations {
            continuation.finish()
            LogUtils.printMessage(message: "🔚 Finished continuation for interceptId: \(interceptId)")
        }
        continuations.removeAll()
    }
    
    public func restartAllTimersFromBeginning() -> [Int: AsyncStream<Int>] {
        var newStreams: [Int: AsyncStream<Int>] = [:]
        
        // Restart all timers that have stored configurations
        for interceptId in originalTimeIntervals.keys {
            guard let originalInterval = originalTimeIntervals[interceptId],
                  let rule = rules[interceptId],
                  let delegate = delegates[interceptId] else { continue }
            
            // Reset remaining time to original interval
            remainingTimes[interceptId] = originalInterval
            
            LogUtils.printMessage(message: "🔄 Restarting timer from beginning for interceptId: \(interceptId)")
            
            // Create new AsyncStream
            let stream = AsyncStream<Int> { continuation in
                continuations[interceptId] = continuation
                startInternalTimer(for: interceptId)
            }
            
            newStreams[interceptId] = stream
        }
        
        return newStreams
    }
    
    // MARK: - Individual Timer Controls
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
        originalTimeIntervals.removeValue(forKey: interceptId)
    }
    
    // MARK: - Utility Functions
    public func getActiveTimerIds() -> [Int] {
        return Array(timers.keys)
    }
    
    public func getRemainingTime(for interceptId: Int) -> Int? {
        return remainingTimes[interceptId]
    }
    
    public func getOriginalInterval(for interceptId: Int) -> Int? {
        return originalTimeIntervals[interceptId]
    }
}
