// DottedLine.test.js
import React from 'react';
import {render, screen} from '@testing-library/react-native';
import DottedLine from '../../widgets/dashboardWidget/DottedLine';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<DottedLine />).toJSON();
  expect(tree).toMatchSnapshot();
});

// test('renders correctly', () => {
//   render(<DottedLine />);
//   expect(screen.toJSON()).toMatchSnapshot();
// });
// describe('DottedLine Component', () => {
//   it('should render with custom width', () => {
//     const customWidth = 50;
//     const {getByTestId} = render(<DottedLine width={customWidth} />);
//     const dottedLine = getByTestId('dotted-line');

//     expect(dottedLine.props.style).toMatchObject({
//       width: customWidth,
//     });
//   });

//   it('should render with custom color', () => {
//     const customColor = 'red';
//     const {getByTestId} = render(<DottedLine color={customColor} />);
//     const dottedLine = getByTestId('dotted-line');

//     expect(dottedLine.props.style).toMatchObject({
//       borderColor: customColor,
//     });
//   });
// });
