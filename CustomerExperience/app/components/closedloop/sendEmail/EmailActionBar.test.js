import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import EmailActionBar from './EmailActionBar';

jest.mock('./EmailActionContainer', () => ({children}) => children);
jest.mock('./RefineButton', () => ({onPress}) => {
  const {Pressable, Text} = require('react-native');
  return (
    <Pressable onPress={onPress} testID="refine-button">
      <Text>Refine</Text>
    </Pressable>
  );
});
jest.mock('./RegenerateButton', () => ({onPress}) => {
  const {Pressable, Text} = require('react-native');
  return (
    <Pressable onPress={onPress} testID="regenerate-button">
      <Text>Regenerate</Text>
    </Pressable>
  );
});
jest.mock('../../../widgets/SpaceBox', () => ({HorizontalSpaceBox: () => null}));
jest.mock('../../../routes/commonUI/EndAlignedView', () => ({children}) => children);
jest.mock('../../../routes/commonUI/StartAlignedView', () => ({children}) => children);

describe('EmailActionBar', () => {
  it('renders Refine and Regenerate buttons', () => {
    const {getByText} = render(
      <EmailActionBar
        selectedRefineOptions={[]}
        onPressDropDown={jest.fn()}
        isDropDownOpen={false}
        onPressRegenerate={jest.fn()}
      />,
    );
    expect(getByText('Refine')).toBeTruthy();
    expect(getByText('Regenerate')).toBeTruthy();
  });

  it('calls onPressDropDown when Refine pressed', () => {
    const onPressDropDown = jest.fn();
    const {getByTestId} = render(
      <EmailActionBar
        selectedRefineOptions={[]}
        onPressDropDown={onPressDropDown}
        isDropDownOpen={false}
        onPressRegenerate={jest.fn()}
      />,
    );
    fireEvent.press(getByTestId('refine-button'));
    expect(onPressDropDown).toHaveBeenCalled();
  });

  it('calls onPressRegenerate when Regenerate pressed', () => {
    const onPressRegenerate = jest.fn();
    const {getByTestId} = render(
      <EmailActionBar
        selectedRefineOptions={[]}
        onPressDropDown={jest.fn()}
        isDropDownOpen={false}
        onPressRegenerate={onPressRegenerate}
      />,
    );
    fireEvent.press(getByTestId('regenerate-button'));
    expect(onPressRegenerate).toHaveBeenCalled();
  });
});
