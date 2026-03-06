//
//  ApiServiceCX.swift
//  QuestionProCXFramework
//
//  Created by Prasad on 25/03/25.
//
import Foundation

enum HTTPMethod: String {
    case GET, POST, PUT, DELETE
}

enum ApiError: Error {
    case invalidURL
    case requestFailed(Error)
    case invalidResponse
    case decodingFailed(Error)
}

@MainActor
public class ApiServiceCX {
    @MainActor static let shared = ApiServiceCX()
    
    private init() {}
    
    func request<T: Decodable>(
        urlString: String,
        method: HTTPMethod = .GET,
        headers: [String: String]? = nil,
        body: Any? = nil,
        responseType: T.Type
    ) async throws -> T {
        
        guard let url = URL(string: urlString) else {
            throw ApiError.invalidURL
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = method.rawValue
        
        if let headers = headers {
            for (key, value) in headers {
                request.setValue(value, forHTTPHeaderField: key)
            }
        }
        
        if let body = body, method != .GET{
            request.httpBody = try JSONSerialization.data(withJSONObject: body, options: [])
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        }
        
        // ✅ Logging Request Details
        LogUtils.printMessage(message: "\n🔵 [API Request]")
        LogUtils.printMessage(message: "➡️ URL: \(url)")
        LogUtils.printMessage(message: "➡️ Method: \(method.rawValue)")
        if let headers = headers {
            LogUtils.printMessage(message: "➡️ Headers: \(headers)")
        }
        if let body = body, method != .GET {
            if let jsonData = try? JSONSerialization.data(withJSONObject: body, options: .prettyPrinted),
               let jsonString = String(data: jsonData, encoding: .utf8) {
                LogUtils.printMessage(message: "➡️ Body: \(jsonString)")
            }
        }
        
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            
            guard let httpResponse = response as? HTTPURLResponse else {
                LogUtils.printMessage(logTag: .LOG_ERROR, message: "❌ Invalid HTTP Response")
                throw ApiError.invalidResponse
            }
            LogUtils.printMessage(message: "\n🟢 [API Response]")
            LogUtils.printMessage(message: "⬅️ Status Code: \(httpResponse.statusCode)")
            
            
            if let responseString = String(data: data, encoding: .utf8) {
                LogUtils.printMessage(message: "⬅️ Response Body: \(responseString)")
            }
            
            let decodedResponse = try JSONDecoder().decode(T.self, from: data)
            return decodedResponse;
        } catch {
            LogUtils.printMessage(logTag: .LOG_ERROR, message: "❌ API Request Failed: \(error.localizedDescription)")
            throw ApiError.requestFailed(error)
        }
    }
}
