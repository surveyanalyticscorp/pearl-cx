import 'dart:io' show Platform;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:math_flutter/math_flutter.dart';

void main() {
  runApp(const QpProjectApp());
}

class QpProjectApp extends StatelessWidget {
  const QpProjectApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'QuestionPro CX Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
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
  bool _isInitialized = false;
  String _statusMessage = 'Not initialized';
  final _apiKeyController = TextEditingController(text: 'YOUR_API_KEY_HERE');
  final _surveyIdController = TextEditingController(text: '123456789');

  @override
  void dispose() {
    _apiKeyController.dispose();
    _surveyIdController.dispose();
    super.dispose();
  }

  Future<void> _initializeSdk() async {
    try {
      setState(() => _statusMessage = 'Initializing...');

      final String result;
      if (Platform.isIOS) {
        // iOS requires API key parameter
        result = await MathFlutter.initializeSurvey(
          apiKey: _apiKeyController.text,
          dataCenter: 'US',
        );
      } else {
        // Android reads API key from AndroidManifest.xml
        result = await MathFlutter.initializeSurvey(
          dataCenter: 'US',
        );
      }

      setState(() {
        _isInitialized = true;
        _statusMessage = result;
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('✓ $result'), backgroundColor: Colors.green),
        );
      }
    } on PlatformException catch (e) {
      setState(() {
        _isInitialized = false;
        _statusMessage = 'Failed: ${e.message}';
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text('✗ ${e.message}'), backgroundColor: Colors.red),
        );
      }
    }
  }

  Future<void> _launchSurvey() async {
    if (!_isInitialized) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please initialize SDK first'),
          backgroundColor: Colors.orange,
        ),
      );
      return;
    }

    try {
      await MathFlutter.launchSurvey(_surveyIdController.text);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('✓ Survey launched')),
        );
      }
    } on PlatformException catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('✗ Launch failed: ${e.message}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  Future<void> _logCheckoutScreen() async {
    try {
      final String result;

      if (Platform.isIOS) {
        // iOS: Pass API key directly from code
        result = await MathFlutter.viewCount(
          'Check_out',
          apiKey: _apiKeyController.text,
        );
      } else {
        // Android: API key is read from AndroidManifest.xml
        result = await MathFlutter.viewCount('Check_out');
      }

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('✓ $result - Screen: Check_out'),
            backgroundColor: Colors.green,
          ),
        );
      }
      print('Response from Native: $result');
    } on PlatformException catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('✗ Error: ${e.message}'),
            backgroundColor: Colors.red,
          ),
        );
      }
      print('Error calling native method: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('QuestionPro CX Demo'),
        elevation: 2,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          _isInitialized
                              ? Icons.check_circle
                              : Icons.info_outline,
                          color: _isInitialized ? Colors.green : Colors.grey,
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            'Status: $_statusMessage',
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            Text(
              '1. Initialize SDK',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 8),
            if (Platform.isIOS) ...[
              TextField(
                controller: _apiKeyController,
                decoration: const InputDecoration(
                  labelText: 'API Key (iOS Required)',
                  border: OutlineInputBorder(),
                  hintText: 'Enter your QuestionPro API key',
                ),
              ),
              const SizedBox(height: 8),
            ] else ...[
              Card(
                color: Colors.blue.shade50,
                child: const Padding(
                  padding: EdgeInsets.all(12),
                  child: Row(
                    children: [
                      Icon(Icons.info_outline, color: Colors.blue),
                      SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Android: API key is read from AndroidManifest.xml',
                          style: TextStyle(fontSize: 13),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
            const SizedBox(height: 12),
            FilledButton.icon(
              onPressed: _isInitialized ? null : _initializeSdk,
              icon: const Icon(Icons.power_settings_new),
              label: const Text('Initialize SDK'),
            ),
            const SizedBox(height: 32),
            Text(
              '2. Launch Survey',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _surveyIdController,
              decoration: const InputDecoration(
                labelText: 'Survey ID',
                border: OutlineInputBorder(),
                hintText: 'Enter survey ID',
              ),
            ),
            const SizedBox(height: 12),
            FilledButton.icon(
              onPressed: _isInitialized ? _launchSurvey : null,
              icon: const Icon(Icons.launch),
              label: const Text('Launch Survey'),
            ),
            const SizedBox(height: 32),
            Text(
              '3. Log Screen View (View Count Rule)',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 8),
            Card(
              color: Colors.green.shade50,
              child: const Padding(
                padding: EdgeInsets.all(12),
                child: Row(
                  children: [
                    Icon(Icons.visibility, color: Colors.green),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Logs "Check_out" screen view for View Count rule tracking',
                        style: TextStyle(fontSize: 13),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            FilledButton.icon(
              onPressed: _logCheckoutScreen,
              icon: const Icon(Icons.shopping_cart_checkout),
              label: const Text('Log Checkout Screen View'),
              style: FilledButton.styleFrom(
                backgroundColor: Colors.green,
              ),
            ),
            const SizedBox(height: 32),
            const Divider(),
            const SizedBox(height: 16),
            Text(
              'Instructions',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 8),
            Text(
              Platform.isAndroid
                  ? 'Android Setup:\n'
                      '1. Add API key to AndroidManifest.xml:\n'
                      '   <meta-data android:name="cx_manifest_api_key"\n'
                      '              android:value="YOUR_KEY" />\n'
                      '2. Click "Initialize SDK"\n'
                      '3. Enter a valid survey ID\n'
                      '4. Click "Launch Survey"'
                  : 'iOS Setup:\n'
                      '1. Enter your QuestionPro API key above\n'
                      '2. Click "Initialize SDK"\n'
                      '3. Enter a valid survey ID\n'
                      '4. Click "Launch Survey"',
              style: const TextStyle(color: Colors.grey, fontSize: 13),
            ),
          ],
        ),
      ),
    );
  }
}
