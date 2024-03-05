import React from 'react';
import {create} from 'react-test-renderer';
import DottedLine from '../../widgets/dashboardWidget/DottedLine';

// // At the top of your test file or in a Jest setup file
// jest.mock('react-native-orientation-locker', () => {
//   return {
//     // Mock methods and properties as needed
//     lockToPortrait: jest.fn(),
//     unlockAllOrientations: jest.fn(),
//     // Add other methods and properties you use
//   };
// });
const tree = create(<DottedLine />);
test('Snapshot', () => {
  expect(tree).toMatchSnapshot();
});
