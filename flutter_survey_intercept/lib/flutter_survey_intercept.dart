import 'package:flutter/services.dart';

enum DataCenter {
  us('US'),
  eu('EU'),
  ca('CA'),
  au('AU'),
  sg('SG'),
  ae('AE'),
  sa('SA'),
  ksa('KSA');

  const DataCenter(this.value);
  final String value;
}

class FlutterSurveyIntercept {
  static const MethodChannel _channel = MethodChannel('intercept_sdk');
  static const MethodChannel _cxChannel = MethodChannel('Cx_Callback');

  /// Callback triggered when native SDK delivers a survey URL (based on rules)
  static void Function(String surveyUrl)? getSurveyUrl;

  /// Setup listener to receive automatic survey URL callbacks from native SDK
  static void getSurveyUrlListener() {
    _channel.setMethodCallHandler((call) async {
      if (call.method == 'onSurveyUrlReceived') {
        final url = (call.arguments as Map?)?['surveyUrl'] as String? ?? '';
        if (url.isNotEmpty) getSurveyUrl?.call(url);
      }
    });
  }

  static Future<String> init({
    required String apiKey,
    required DataCenter dataCenter,
  }) async {
    return await _channel.invokeMethod<String>('initialize', {
          'apiKey': apiKey,
          'dataCenter': dataCenter.value,
        }) ??
        'SDK initialized';
  }

  static Future<String> setScreenVisited({required String screenName}) async {
    if (screenName.isEmpty) throw ArgumentError('screenName cannot be empty');
    return await _cxChannel.invokeMethod<String>('setScreenVisited', {
          'screen_name_key': screenName,
        }) ??
        'Event logged';
  }

  static Future<String> setDataMappings({
    required Map<String, String> customVariables,
  }) async {
    return await _channel.invokeMethod<String>('setDataMappings', {
          'customVariables': customVariables,
        }) ??
        'Data mappings set successfully';
  }
}
