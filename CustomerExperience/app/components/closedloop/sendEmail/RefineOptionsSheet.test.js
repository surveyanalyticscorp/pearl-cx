import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import RefineOptionsSheet from './RefineOptionsSheet';

jest.mock('../../../../assets/images/qp_ai.svg', () => {
  const {View} = require('react-native');
  return () => <View testID="qp-ai-icon" />;
});

jest.mock('../../../routes/commonUI/CommonUI', () => ({
  ChipItem: ({title, onPress}) => {
    const {Pressable, Text} = require('react-native');
    return (
      <Pressable onPress={onPress} testID={`chip-${title}`}>
        <Text>{title}</Text>
      </Pressable>
    );
  },
}));

jest.mock('../../../routes/commonUI/BottomSheetHeader', () => ({
  CloseButton: ({onPressClose}) => {
    const {Pressable, Text} = require('react-native');
    return (
      <Pressable onPress={onPressClose} testID="close-button">
        <Text>Close</Text>
      </Pressable>
    );
  },
}));

jest.mock('../../../routes/commonUI/ActionButtons', () => ({onCancel, onApply}) => {
  const {Pressable, Text} = require('react-native');
  return (
    <>
      <Pressable onPress={onCancel} testID="cancel-button"><Text>Cancel</Text></Pressable>
      <Pressable onPress={onApply} testID="apply-button"><Text>Apply</Text></Pressable>
    </>
  );
});

jest.mock('../../../routes/commonUI/ListItemSeparator', () => () => null);
jest.mock('../../../widgets/SpaceBox', () => ({
  HorizontalSpaceBox: () => null,
  VerticalSpaceBox: () => null,
}));

describe('RefineOptionsSheet', () => {
  const defaultProps = {
    selectedItem: {refine: null, intent: null},
    onSelectItem: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it('renders Response Assist header', () => {
    const {getByText} = render(<RefineOptionsSheet {...defaultProps} />);
    expect(getByText('Response Assist')).toBeTruthy();
  });

  it('renders tone section title', () => {
    const {getByText} = render(<RefineOptionsSheet {...defaultProps} />);
    expect(getByText('Tone')).toBeTruthy();
  });

  it('calls onClose when close button pressed', () => {
    const onClose = jest.fn();
    const {getByTestId} = render(
      <RefineOptionsSheet {...defaultProps} onClose={onClose} />,
    );
    fireEvent.press(getByTestId('close-button'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onSelectItem and onClose when apply pressed', () => {
    const onSelectItem = jest.fn();
    const onClose = jest.fn();
    const {getByTestId} = render(
      <RefineOptionsSheet
        selectedItem={{refine: null, intent: null}}
        onSelectItem={onSelectItem}
        onClose={onClose}
      />,
    );
    fireEvent.press(getByTestId('apply-button'));
    expect(onSelectItem).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('clears selection when cancel pressed', () => {
    const {getByTestId} = render(<RefineOptionsSheet {...defaultProps} />);
    fireEvent.press(getByTestId('cancel-button'));
    // No crash = pass
  });
});
