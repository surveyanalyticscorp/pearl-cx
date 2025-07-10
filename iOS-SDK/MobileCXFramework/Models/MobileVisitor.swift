//
//  MobileVisitor.swift
//  QuestionProCXFramework
//
//  Created by Prasad on 25/03/25.
//

import Foundation

// MARK: - Root Model
public struct ApiResponse: Codable {
    let visitor: Visitor
    let project: Project
}

// MARK: - Visitor Model
public struct Visitor: Codable {
    let localDate: LocalDate
    let online: Bool
    let visits: Int
    let uuid: String
    let ip: String
    let country: String
    let city: String
    let userAgent: String
    let deviceType: String
    let os: String
    let browserType: String
    let browserEngine: String
    let projectId: Int
    let updatedAt: String
    let createdAt: String
    let id: Int
}

// MARK: - LocalDate Model
public struct LocalDate: Codable {
    let val: String
}

// MARK: - Project Model
public struct Project: Codable {
    let intercepts: [Intercept]
}

// MARK: - Intercept Model
public struct Intercept: Codable {
    let id: Int
    let type: String
    let condition: String
    let surveyId: Int
    let ruleGroupId: Int
    let rules: [Rule]
}

// MARK: - Rule Model
public struct Rule: Codable {
    let key: String
    let name: String
    let operand: String
    let value: String
    let rangeValues: String?
    let variable: String?
    let type: String
}


public func parseJson (jsonString: String) {
    if let jsonData = jsonString.data(using: .utf8) {
            do {
                let response = try JSONDecoder().decode(ApiResponse.self, from: jsonData)
                
                // Print all Intercept IDs
                for intercept in response.project.intercepts {
                    LogUtils.printMessage(message: "Intercept ID: \(intercept.id)")
                }
            } catch {
                LogUtils.printMessage(logTag: .LOG_ERROR, message: "❌ Error decoding JSON: \(error)")
            }
        }
}
