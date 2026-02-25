# React Native Intercept SDK

This is a React Native SDK wrapper for existing native Android and iOS survey SDK.

## Project Structure
- `/android` - Native Android bridge implementation (Kotlin)
- `/ios` - Native iOS bridge implementation (Swift) 
- `/src` - JavaScript/TypeScript wrapper and type definitions
- `/example` - Example React Native app usage

## Development Guidelines
- Target React Native >= 0.70
- Support both Android and iOS platforms
- Use TypeScript for type safety
- Native SDK handles all UI components
- JS wrapper only provides bridge to native functionality

## Key Components
- Android: Kotlin module extending ReactContextBaseJavaModule
- iOS: Swift module extending RCTEventEmitter  
- JS: NativeModules and NativeEventEmitter wrapper
- Events: survey_shown, survey_completed, survey_dismissed
