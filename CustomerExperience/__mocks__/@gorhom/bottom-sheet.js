// __mocks__/@gorhom/bottom-sheet.js
import React from 'react';
import {View} from 'react-native';

export const BottomSheetView = ({children}) =>
  React.createElement(View, {}, children);

const BottomSheet = React.forwardRef(({children, snapPoints, index}, ref) => {
  React.useImperativeHandle(ref, () => ({
    snapToIndex: jest.fn(),
    close: jest.fn(),
  }));
  return React.createElement(View, {}, children);
});

export default BottomSheet;
