import React from 'react';
import renderer from 'react-test-renderer';
import MarketingScreen from './MarketingScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';

test('renders correctly', () => {
  const tree = renderer
    .create(
      <SafeAreaProvider>
        <MarketingScreen />
      </SafeAreaProvider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
