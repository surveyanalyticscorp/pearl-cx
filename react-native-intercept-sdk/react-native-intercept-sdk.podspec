require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = package['name'].gsub('@questionpro/', '')
  s.version      = package['version']
  s.summary      = package['description']
  s.description  = package['description']
  s.homepage     = package['homepage']
  s.license      = package['license']
  s.authors      = package['author']

  s.platforms    = { :ios => "11.0" }
  s.source       = { :git => package['repository']['url'], :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,c,cc,cpp,m,mm,swift}"
  s.requires_arc = true

  s.dependency "React-Core"

  # Swift version configuration
  s.swift_version = "5.0"
  
  # TODO: Add your existing Survey SDK dependency here
  # Example:
  # s.dependency "QuestionProSurveySDK", "~> 1.0.0"
  # or if it's a local framework:
  # s.vendored_frameworks = 'ios/Frameworks/SurveySDK.framework'
end
