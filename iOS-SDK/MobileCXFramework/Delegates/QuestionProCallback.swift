//
//  QuestionProCallback.swift
//  QuestionProCXFramework
//
//  Created by Prasad on 04/07/25.
//

import Foundation


@MainActor public protocol QuestionProCallback: NSObjectProtocol {
    func refreshToken(completion: @escaping(_ newToken: String?) -> Void)
    
    func encryptData(data: String, completion: @escaping(_ encryptedData: String, _ headers: [String: String]) -> Void)
    
    func decryptData(apiResponse: (String, [String: String]), completion: @escaping(_ decryptedData: String?) -> Void)
}
