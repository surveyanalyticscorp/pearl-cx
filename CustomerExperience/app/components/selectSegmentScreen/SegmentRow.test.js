import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {SegmentRow} from './SegmentRow';

jest.mock('../../routes/commonUI/CheckmarkIcon', () => ({index}) => {
  const {View} = require('react-native');
  return <View testID={`checkmark-icon-${index}`} />;
});

describe('SegmentRow', () => {
  const mockItem = {segmentName: 'Segment A', segmentID: '42'};
  const mockOnPress = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('renders segment name', () => {
    const {getByText} = render(
      <SegmentRow
        item={mockItem}
        index={0}
        currentSegmentId="99"
        onPress={mockOnPress}
      />,
    );
    expect(getByText('Segment A')).toBeTruthy();
  });

  it('shows checkmark when currentSegmentId matches item segmentID', () => {
    const {getByTestId} = render(
      <SegmentRow
        item={mockItem}
        index={0}
        currentSegmentId="42"
        onPress={mockOnPress}
      />,
    );
    expect(getByTestId('checkmark-icon-0')).toBeTruthy();
  });

  it('hides checkmark when currentSegmentId does not match', () => {
    const {queryByTestId} = render(
      <SegmentRow
        item={mockItem}
        index={0}
        currentSegmentId="99"
        onPress={mockOnPress}
      />,
    );
    expect(queryByTestId('checkmark-icon-0')).toBeNull();
  });

  it('calls onPress with item when pressed', () => {
    const {getByText} = render(
      <SegmentRow
        item={mockItem}
        index={0}
        currentSegmentId="99"
        onPress={mockOnPress}
      />,
    );
    fireEvent.press(getByText('Segment A'));
    expect(mockOnPress).toHaveBeenCalledWith(mockItem);
  });
});
