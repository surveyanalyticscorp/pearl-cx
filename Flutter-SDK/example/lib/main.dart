import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:math_flutter/math_flutter.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  _initConnection();
  runApp(const QpProjectApp());
}

Future<void> _initConnection() async {
  try {
    // SDK is already initialized in MyApplication.onCreate()
    // This just confirms the platform channel connection
    final String result = await MathFlutter.initializeSurvey();
    debugPrint('QuestionPro CX: $result');
  } on PlatformException catch (e) {
    debugPrint("QuestionPro CX init failed: ${e.message}");
  }
}

class QpProjectApp extends StatelessWidget {
  const QpProjectApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Container(),
    );
  }
}
