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
        body: [String: Any]? = nil,
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
        
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            
            guard let httpResponse = response as? HTTPURLResponse else {
                throw ApiError.invalidResponse
            }
            
            let decodedResponse = try JSONDecoder().decode(T.self, from: data)
            return decodedResponse;
        } catch {
            throw ApiError.requestFailed(error)
        }
    }
}
