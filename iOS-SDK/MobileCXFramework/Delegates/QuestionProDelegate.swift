//
//  QuestionProDelegate.swift
//  QuestionProCXFramework
//
//  Created by Prasad on 07/04/25.
//

import Foundation

@MainActor public protocol QuestionProDelegate: NSObjectProtocol {
    func initSDKSuccess()
    func initSDKFailed(error: String)
    func getSurveyURL(surveyURL: String)
}
