require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-intercept-sdk"
  s.version      = package["version"]
  s.summary      = "React Native SDK wrapper for QuestionPro Survey Intercept SDK"
  s.description  = "A React Native wrapper that provides JavaScript bridge to native Android and iOS QuestionPro survey SDK for mobile app integration."
  s.homepage     = "https://github.com/questionpro/react-native-intercept-sdk"
  s.license      = { :type => "MIT", :file => "LICENSE" }
  s.authors      = { "QuestionPro" => "support@questionpro.com" }

  s.platforms    = { :ios => "15.0" }
  s.source       = { :path => "." }

  # Include all iOS source files
  s.source_files = "ios/**/*.{m,swift}"
  
  # React Native dependency (targeting RN >= 0.70)
  s.dependency "React-Core"
  
  # QuestionPro CX Framework dependency
  s.dependency "QuestionProCXFramework"
  
  # Swift configuration
  s.swift_version = "5.0"
  
  # iOS deployment target (compatible with RN >= 0.70)
  s.ios.deployment_target = "15.0"
  
  # Required for Swift modules
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES'
  }

  s.requires_arc = true
  s.static_framework = true

end