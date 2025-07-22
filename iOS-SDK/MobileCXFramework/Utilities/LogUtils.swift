//
//  LogUtils.swift
//  QuestionProCXFramework
//
//  Created by Prasad on 22/07/25.
//

public class LogUtils {
    nonisolated(unsafe) static var enableLogging = false
    
    public static func enableLogging(isLogsEnabled: Bool) {
        self.enableLogging = isLogsEnabled
    }
    public static func printMessage(logTag: LogTag = .LOG_INFO , message: String) {
        if (self.enableLogging && logTag == .LOG_ERROR) {
            print(message)
        }
    }
}
