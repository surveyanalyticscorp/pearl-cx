//
//  SurveyURL.swift
//  QuestionProCXFramework
//
//  Created by Prasad on 31/03/25.
//

public struct SurveyResponse: Codable {
    let response: CoreSurveyURL
    let requestID: String
}

public struct CoreSurveyURL: Codable {
    let name: String
    let url: String
}
