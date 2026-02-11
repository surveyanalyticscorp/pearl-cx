import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:math_flutter/math_flutter.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  const MethodChannel channel = MethodChannel('math_flutter');

  setUp(() {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(
      channel,
      (MethodCall methodCall) async {
        if (methodCall.method == 'initializeSurvey') {
          return 'SDK initialized';
        }
        if (methodCall.method == 'launchSurvey') {
          final surveyId = methodCall.arguments['surveyId'] as String?;
          if (surveyId == null || surveyId.isEmpty) {
            throw PlatformException(
              code: 'INVALID_ARGS',
              message: 'surveyId is required',
            );
          }
          return null; // success
        }
        throw PlatformException(
          code: 'METHOD_NOT_FOUND',
          message: methodCall.method,
        );
      },
    );
  });

  tearDown(() {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(channel, null);
  });

  test('initializeSurvey returns success message', () async {
    final result = await MathFlutter.initializeSurvey();
    expect(result, 'SDK initialized');
  });

  test('launchSurvey completes with valid surveyId', () async {
    await MathFlutter.launchSurvey('12345');
  });
}
