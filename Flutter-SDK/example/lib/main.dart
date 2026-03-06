import 'package:flutter/material.dart';
import 'package:math_flutter/math_flutter.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  MathFlutter.setupSurveyUrlListener();
  MathFlutter.onSurveyUrlReceived = (url) {
    debugPrint('Survey URL received via callback: $url');
  };

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: const HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  void initState() {
    super.initState();
    //  MathFlutter.setupSurveyUrlListener();
    _initializeSdk();
  }

  Future<void> _initializeSdk() async {
    final result = await MathFlutter.init(
      apiKey: 'YOUR_API_KEY',
      dataCenter: DataCenter.us,
    );
    debugPrint('Initialization result: $result');
  }

  Future<void> _logScreenView() async {
    try {
      String result;
      result = await MathFlutter.setScreenVisited('check_out');
      debugPrint('Screen view logged successfully: $result');
    } catch (e) {
      debugPrint('Error logging screen view: $e');
    }
  }

  Future<void> _setDataMappings() async {
    try {
      final Map<String, String> customData = {
        'firstName': 'QuestionPro',
        'lastname': '1',
        'email': 'questionpro@example.com',
      };

      String result;
      result = await MathFlutter.setDataMappings(customData);
      debugPrint('Data mappings set successfully: $result');
    } catch (e) {
      debugPrint('Error setting data mappings: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('QuestionPro CX Demo')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ElevatedButton(
                onPressed: _logScreenView,
                child: const Text('Log Screen View'),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _setDataMappings,
                child: const Text('Set Data Mappings'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
