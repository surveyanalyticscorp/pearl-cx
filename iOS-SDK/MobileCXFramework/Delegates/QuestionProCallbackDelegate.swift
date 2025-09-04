//
//  QuestionPro.swift
//  QuestionProCXFramework
//
//  Created by Prasad on 28/08/25.
//

import Foundation

@MainActor public protocol QuestionProCallbackDelegate: NSObjectProtocol {
    func getSurveyURL(surveyURL: String)
}

