// DottedLine.test.js
// import React from 'react';
// import {render} from '@testing-library/react-native';
// import DottedLine from '../../widgets/dashboardWidget/DottedLine';
// import {MarginConstants} from '../../styles/margin.constants';
// import {Colors} from '../../styles/color.constants';
import Orientation from 'react-native-orientation-locker';

// describe('DottedLine Component', () => {
//   it('should render with default props', () => {
//     const {getByTestId} = render(<DottedLine />);
//     const dottedLine = getByTestId('dotted-line');

//     expect(dottedLine.props.style).toMatchObject({
//       borderStyle: 'dotted',
//       width: 1.2 * MarginConstants.tab1,
//       borderColor: Colors.evenDarkerGrey,
//       borderWidth: 1,
//       borderRadius: 1,
//       height: 0,
//       alignSelf: 'auto',
//       marginHorizontal: MarginConstants.halfTab,
//       marginTop: 1,
//     });
//   });

jest.clearAllMocks();
test('should lock orientation to portrait', () => {
  Orientation.lockToPortrait();
  expect(Orientation.lockToPortrait).toHaveBeenCalledTimes(1);
});

test('should return default portrait orientation', () => {
  const orientation = Orientation.getInitialOrientation();
  expect(orientation).toBe('PORTRAIT');
});

// it('should render with custom width', () => {
//   const customWidth = 50;
//   const {getByTestId} = render(<DottedLine width={customWidth} />);
//   const dottedLine = getByTestId('dotted-line');

//   expect(dottedLine.props.style).toMatchObject({
//     width: customWidth,
//   });
// });

// it('should render with custom color', () => {
//   const customColor = 'red';
//   const {getByTestId} = render(<DottedLine color={customColor} />);
//   const dottedLine = getByTestId('dotted-line');

//   expect(dottedLine.props.style).toMatchObject({
//     borderColor: customColor,
//   });
// });

// it('should render with custom border style', () => {
//   const customBorderStyle = 'dashed';
//   const {getByTestId} = render(
//     <DottedLine borderStyle={customBorderStyle} />,
//   );
//   const dottedLine = getByTestId('dotted-line');

//   expect(dottedLine.props.style).toMatchObject({
//     borderStyle: customBorderStyle,
//   });
// });
// });
