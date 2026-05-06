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
    let settings: Settings?
    let dataMappings: [DataMappings]
    let metaData: MetaData
    let widgetSettings: WidgetSettings?

    enum CodingKeys: String, CodingKey {
        case id, type, condition, surveyId, ruleGroupId, rules, settings, dataMappings, metaData, widgetSettings
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(Int.self, forKey: .id)
        type = try container.decode(String.self, forKey: .type)
        condition = try container.decode(String.self, forKey: .condition)
        surveyId = try container.decode(Int.self, forKey: .surveyId)
        ruleGroupId = try container.decode(Int.self, forKey: .ruleGroupId)
        rules = try container.decode([Rule].self, forKey: .rules)
        settings = try container.decodeIfPresent(Settings.self, forKey: .settings)
        dataMappings = try container.decode([DataMappings].self, forKey: .dataMappings)
        metaData = try container.decode(MetaData.self, forKey: .metaData)

        if type == InterceptType.PROMPT.rawValue {
            widgetSettings = try container.decodeIfPresent(WidgetSettings.self, forKey: .widgetSettings)
        } else if var ws = try container.decodeIfPresent(WidgetSettings.self, forKey: .widgetSettings) {
            ws.position = nil
            ws.widgetWindowHeight = nil
            ws.widgetWindowWidth = nil
            widgetSettings = ws
        } else {
            widgetSettings = nil
        }
    }
}

// MARK: - WidgetSettings Model
public struct WidgetSettings: Codable {
    let iconColor: String?
    let textColor: String
    let backgroundColor: String
    let widgetTitle: String
    var position: String?
    var widgetWindowHeight: Int?
    var widgetWindowWidth: Int?
}

public struct MetaData: Codable {
    public let matchedCount: Int
    public let excludedCount: Int
    public let visitorStatus: String
}

public struct DataMappings: Codable {
    public let variable: String
    public let displayName: String
    public var value: String

    // Provide default value when 'value' key is absent in API response
    enum CodingKeys: String, CodingKey { case variable, displayName, value }

    public init(variable: String, displayName: String, value: String = "") {
        self.variable = variable
        self.displayName = displayName
        self.value = value
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        variable = try container.decode(String.self, forKey: .variable)
        displayName = try container.decode(String.self, forKey: .displayName)
        value = try container.decodeIfPresent(String.self, forKey: .value) ?? "" // default empty if missing
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(variable, forKey: .variable)
        try container.encode(displayName, forKey: .displayName)
        try container.encode(value, forKey: .value)
    }
}

public struct Settings: Codable {
    let allowMultipleResponse: Bool
    let autoLanguageSelection: Bool
    let triggerDelayInSeconds: Int
    let autoCloseOnCompletion: Bool
    var samplingRate: Int = 100
    
    enum CodingKeys: String, CodingKey {
        case allowMultipleResponse, autoLanguageSelection, triggerDelayInSeconds, autoCloseOnCompletion, samplingRate
    }
    
    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        allowMultipleResponse = try container.decode(Bool.self, forKey: .allowMultipleResponse)
        autoLanguageSelection = try container.decode(Bool.self, forKey: .autoLanguageSelection)
        triggerDelayInSeconds = try container.decode(Int.self, forKey: .triggerDelayInSeconds)
        
        self.autoCloseOnCompletion = try container.decodeIfPresent(Bool.self, forKey: .autoCloseOnCompletion) ?? false
        self.samplingRate = try container.decodeIfPresent(Int.self, forKey: .samplingRate) ?? 100
    }
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
