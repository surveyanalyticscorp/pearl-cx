Pod::Spec.new do |s|
  s.name             = 'math_flutter'
  s.version          = '0.8.0'
  s.summary          = 'QuestionPro CX Flutter plugin'
  s.description      = 'Flutter plugin for QuestionPro CX SDK integration on iOS and Android'
  s.homepage         = 'https://github.com/Dilpreet010/math_operations'
  s.license          = { :file => '../LICENSE' }
  s.author           = { 'Dilpreet Kaur' => 'dilpreet@example.com' }
  s.source           = { :path => '.' }

  s.source_files = 'Classes/**/*'
  s.dependency 'Flutter'
  s.dependency 'QuestionProCXFramework'

  s.platform = :ios, '14.0'
  s.swift_version = '5.0'

  # IMPORTANT for Flutter plugins
  s.static_framework = true
end
