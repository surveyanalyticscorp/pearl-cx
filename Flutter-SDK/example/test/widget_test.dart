import 'package:flutter_test/flutter_test.dart';
import 'package:math_flutter_example/main.dart';

void main() {
  testWidgets('App should start without survey ID',
      (WidgetTester tester) async {
    await tester.pumpWidget(const QpProjectApp());

    expect(find.text('SDK Initialized!'), findsOneWidget);
    expect(find.text('No survey ID needed to run.'), findsOneWidget);
  });
}
