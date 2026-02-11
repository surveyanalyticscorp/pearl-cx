import 'package:flutter/services.dart';

class MathFlutter {
  static const MethodChannel _channel = MethodChannel('math_flutter');

  static Future<String> initializeSurvey({
    String? apiKey,
    String dataCenter = 'US',
  }) async {
    final String result = await _channel
            .invokeMethod<String>('initializeSurvey', <String, dynamic>{
          'apiKey': apiKey,
          'dataCenter': dataCenter,
        }) ??
        'SDK initialized';
    return result;
  }

  static Future<void> launchSurvey(String surveyId) async {
    await _channel.invokeMethod<void>('launchSurvey', <String, dynamic>{
      'surveyId': surveyId,
    });
  }
}
