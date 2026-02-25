# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release of React Native Survey Intercept SDK
- Cross-platform support for iOS and Android
- TypeScript support with full type definitions
- Event-driven architecture for survey interactions
- Comprehensive example application
- Complete documentation and integration guide

### Features
- `configure()` method for SDK initialization
- `notifyEvent()` method for triggering survey evaluations  
- `onEvent()` method for listening to survey events
- Support for custom user variables and targeting
- Native performance through bridge to existing SDKs

### Supported Events
- `survey_shown` - When a survey is displayed to the user
- `survey_completed` - When a user completes a survey
- `survey_dismissed` - When a user dismisses a survey without completing
- `error` - When an error occurs in the SDK

## [1.0.0] - 2025-09-22

### Added
- Initial public release
