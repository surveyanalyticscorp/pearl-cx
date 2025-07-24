import React from 'react';
import {render, fireEvent, act} from '@testing-library/react-native';
import {QPBottomSheet} from './QPBottomSheet';
import {Text} from 'react-native';

describe('QPBottomSheet', () => {
  it('should render', () => {
    const {getByTestId} = render(
      <QPBottomSheet
        visible={true}
        onClose={() => {}}
        isLoading={false}
        loadingComponent={<Text>Loading</Text>}>
        <Text>Content</Text>
      </QPBottomSheet>,
    );
    expect(getByTestId('bottomSheet')).toBeTruthy();
  });
});
