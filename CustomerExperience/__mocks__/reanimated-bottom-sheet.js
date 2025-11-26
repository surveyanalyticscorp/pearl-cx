// __mocks__/reanimated-bottom-sheet.js
// create a mock for ReanimatedBottomSheet
// mock for snapTo function

import React from 'react';
import {View} from 'react-native';

export const snapTo = jest.fn();

const ReanimatedBottomSheet = React.forwardRef(
  ({renderContent, renderHeader, snapPoints}, ref) => {
    let snapPoints_ = snapPoints;

    // Add snapTo method to the ref
    React.useImperativeHandle(ref, () => ({
      snapTo: jest.fn(),
    }));

    snapPoints_.forEach(point => {
      if (point.value === snapPoints_[snapPoints_.length - 1].value) {
        snapPoints_.push({value: 0, endValue: 100});
      }
    });

    return (
      <View>
        {renderHeader?.()}
        {renderContent?.()}
      </View>
    );
  },
);

export default ReanimatedBottomSheet;
