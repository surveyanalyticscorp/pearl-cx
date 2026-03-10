import 'package:flutter/services.dart';

/// Flutter plugin for QuestionPro CX SDK integration.
///
/// The QuestionPro CX SDK initializes automatically when the app starts
/// via MyApplication.onCreate() on the native Android side.
///
/// Usage:
/// ```dart
/// // Optional: Confirm SDK connection (no survey ID needed)
/// await MathFlutter.initializeSurvey();
///
/// // When ready to show a survey (requires survey ID)
/// await MathFlutter.launchSurvey('your_survey_id');
/// ```
class MathFlutter {
  static const MethodChannel _channel = MethodChannel('math_flutter');

  /// Confirms the QuestionPro CX SDK connection.
  ///
  /// The SDK is already initialized in MyApplication.onCreate() on the native side,
  /// so this method just verifies the platform channel connection is working.
  ///
  /// **No survey ID required** - Call this once (e.g., from main() or app startup).
  ///
  /// Returns a success message from the native platform.
  static Future<String> initializeSurvey() async {
    final String result =
        await _channel.invokeMethod<String>('initializeSurvey') ??
            'SDK initialized';
    return result;
  }

  /// Launches the QuestionPro survey screen for the given [surveyId].
  ///
  /// **Survey ID is required** - Get this from your QuestionPro account.
  ///
  /// The [surveyId] must be a valid survey ID (positive number as string).
  /// Opens the native InteractionActivity to display the survey.
  ///
  /// Example:
  /// ```dart
  /// await MathFlutter.launchSurvey('123456789');
  /// ```
  static Future<void> launchSurvey(String surveyId) async {
    await _channel.invokeMethod<void>('launchSurvey', <String, dynamic>{
      'surveyId': surveyId,
    });
  }
}
