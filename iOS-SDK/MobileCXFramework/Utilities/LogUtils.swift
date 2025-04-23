//
//  LogUtils.swift
//  QuestionProCXFramework
//
//  Created by Prasad on 23/04/25.
//

public class LogUtils {
    nonisolated(unsafe) static var enableLogging = false
    
    public static func enableLogging(isLogsEnabled: Bool) {
        self.enableLogging = isLogsEnabled
    }
    public static func printMessage(message: String) {
        if (self.enableLogging) {
            print(message)
        }
    }
}
