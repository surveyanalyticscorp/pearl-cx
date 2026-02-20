import 'package:flutter/services.dart';

class MathFlutter {
  static const MethodChannel _channel = MethodChannel('math_flutter');
  static const MethodChannel _cxChannel = MethodChannel('Cx_Callback');

  static Future<String> initializeSurvey({
    String? apiKey,
    String dataCenter = 'US',
  }) async {
    final String result = await _channel.invokeMethod<String>(
          'initializeSurvey',
          <String, dynamic>{
            'apiKey': apiKey,
            'dataCenter': dataCenter,
          },
        ) ??
        'SDK initialized';
    return result;
  }

  static Future<void> launchSurvey(String surveyId) async {
    await _channel.invokeMethod<void>(
      'launchSurvey',
      <String, dynamic>{'surveyId': surveyId},
    );
  }

  static Future<String> viewCount(
    String screenName, {
    String? apiKey,
  }) async {
    try {
      final String result = await _cxChannel.invokeMethod<String>(
            'nativeMethod',
            <String, dynamic>{
              'screen_name_key': screenName,
              'apiKey': apiKey,
            },
          ) ??
          'Event logged';
      return result;
    } on PlatformException catch (e) {
      throw PlatformException(
        code: e.code,
        message: 'Error logging screen view: ${e.message}',
        details: e.details,
      );
    }
  }

  static Future<String> setDataMappings(
    Map<String, String> customVariables, {
    String? apiKey,
  }) async {
    try {
      final String result = await _channel.invokeMethod<String>(
            'setDataMappings',
            <String, dynamic>{
              'customVariables': customVariables,
              'apiKey': apiKey,
            },
          ) ??
          'Data mappings set successfully';
      return result;
    } on PlatformException catch (e) {
      throw PlatformException(
        code: e.code,
        message: 'Error setting data mappings: ${e.message}',
        details: e.details,
      );
    }
  }
}
