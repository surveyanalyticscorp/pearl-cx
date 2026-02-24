import 'package:flutter/services.dart';

/// Data center location for QuestionPro CX SDK initialization
enum DataCenter {
  /// United States data center
  us('US'),

  /// European Union data center
  eu('EU');

  const DataCenter(this.value);
  final String value;
}

/// QuestionPro CX Flutter SDK
class MathFlutter {
  // Method channel for main SDK operations
  static const MethodChannel _channel = MethodChannel('math_flutter');

  // Method channel for screen tracking callbacks
  static const MethodChannel _cxChannel = MethodChannel('Cx_Callback');

  /// Initialize the QuestionPro CX SDK
  ///
  /// [apiKey] is required for iOS, optional for Android (reads from manifest)
  /// [dataCenter] specifies the region (US or EU), defaults to US
  static Future<String> initializeSurvey({
    String? apiKey,
    DataCenter dataCenter = DataCenter.us,
  }) async {
    final String result = await _channel.invokeMethod<String>(
          'initializeSurvey',
          <String, dynamic>{
            'apiKey': apiKey,
            'dataCenter': dataCenter.value,
          },
        ) ??
        'SDK initialized';
    return result;
  }

  /// Launch a survey by its ID
  ///
  /// [surveyId] the unique identifier of the survey to display
  static Future<void> launchSurvey(String surveyId) async {
    await _channel.invokeMethod<void>(
      'launchSurvey',
      <String, dynamic>{'surveyId': surveyId},
    );
  }

  /// Log a screen view for tracking user navigation
  ///
  /// [screenName] the name of the screen being viewed (cannot be empty)
  static Future<String> viewCount(String screenName) async {
    if (screenName.isEmpty) {
      throw ArgumentError('screenName cannot be empty');
    }

    final String result = await _cxChannel.invokeMethod<String>(
          'nativeMethod',
          <String, dynamic>{
            'screen_name_key': screenName,
          },
        ) ??
        'Event logged';
    return result;
  }

  /// Set custom data mappings for user attributes
  ///
  /// [customVariables] a map of key-value pairs to associate with the user
  static Future<String> setDataMappings(
    Map<String, String> customVariables,
  ) async {
    final String result = await _channel.invokeMethod<String>(
          'setDataMappings',
          <String, dynamic>{
            'customVariables': customVariables,
          },
        ) ??
        'Data mappings set successfully';
    return result;
  }
}
