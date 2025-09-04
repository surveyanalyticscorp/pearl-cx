//
//  InterceptTimerMetaData.swift
//  QuestionProCXFramework
//
//  Created by Prasad on 24/04/25.
//

import Foundation

struct InterceptTimerMetaData {
    var remainingTime: Int
    var interceptId: Int
    var timer: Timer?
    var rule: Rule
    var delegate:SurveyLaunchDelegate
}
