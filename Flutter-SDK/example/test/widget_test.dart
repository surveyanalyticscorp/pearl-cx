import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:math_flutter_example/main.dart';

void main() {
  testWidgets('App displays correctly with all buttons',
      (WidgetTester tester) async {
    // Build the app
    await tester.pumpWidget(const MyApp());

    // Verify the app title is displayed
    expect(find.text('QuestionPro CX Demo'), findsOneWidget);

    // Verify all three buttons are present
    expect(find.text('Launch Survey'), findsOneWidget);
    expect(find.text('Log Screen View'), findsOneWidget);
    expect(find.text('Set Data Mappings'), findsOneWidget);

    // Verify buttons are ElevatedButton widgets
    expect(find.byType(ElevatedButton), findsNWidgets(3));
  });

  testWidgets('Buttons are tappable', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());

    // Find buttons
    final launchSurveyButton = find.text('Launch Survey');
    final logScreenViewButton = find.text('Log Screen View');
    final setDataMappingsButton = find.text('Set Data Mappings');

    // Verify buttons exist and are enabled
    expect(launchSurveyButton, findsOneWidget);
    expect(logScreenViewButton, findsOneWidget);
    expect(setDataMappingsButton, findsOneWidget);

    // Verify buttons can be tapped (won't actually call native code in tests)
    await tester.tap(logScreenViewButton);
    await tester.pump();

    await tester.tap(setDataMappingsButton);
    await tester.pump();
  });

  testWidgets('App layout is centered', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());

    // Verify the main layout uses Center widget
    expect(find.byType(Center), findsWidgets);

    // Verify there's a Column for button layout
    expect(find.byType(Column), findsWidgets);
  });
}
