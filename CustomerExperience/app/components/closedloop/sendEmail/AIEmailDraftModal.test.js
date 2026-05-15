import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import AIEmailDraftModal from './AIEmailDraftModal';

const mockOnPressInsert = jest.fn();
const mockOnPressRegenerate = jest.fn();
const mockOnPressDropDown = jest.fn();
const mockOnCloseDropDown = jest.fn();
const mockOnSelectDropDownItem = jest.fn();

jest.mock('./hooks/useEmailDraft', () => ({onClose, setEmailBody}) => ({
  isLoading: false,
  currentDraft: {body: '<p>Draft text</p>'},
  selectedRefineOptions: null,
  isDropDownOpen: false,
  onPressInsert: mockOnPressInsert,
  onPressRegenerate: mockOnPressRegenerate,
  onPressDropDown: mockOnPressDropDown,
  onCloseDropDown: mockOnCloseDropDown,
  onSelectDropDownItem: mockOnSelectDropDownItem,
}));

jest.mock('./RenderLoadingSpinner', () => ({isLoading}) => {
  const {View} = require('react-native');
  return isLoading ? <View testID="loading-spinner" /> : null;
});
jest.mock('./RenderAILogo', () => () => {
  const {View} = require('react-native');
  return <View testID="ai-logo" />;
});
jest.mock('./AiEmailBodyTextView', () => ({
  EmailBodyTextView: ({text}) => {
    const {Text} = require('react-native');
    return <Text testID="email-body">{text}</Text>;
  },
}));
jest.mock('./EmailActionBar', () => ({onPressRegenerate, onPressDropDown}) => {
  const {Pressable, Text} = require('react-native');
  return (
    <>
      <Pressable testID="btn-regenerate" onPress={onPressRegenerate}>
        <Text>Regenerate</Text>
      </Pressable>
      <Pressable testID="btn-refine" onPress={onPressDropDown}>
        <Text>Refine</Text>
      </Pressable>
    </>
  );
});
jest.mock('./InsertButton', () => ({onPress}) => {
  const {Pressable, Text} = require('react-native');
  return (
    <Pressable testID="btn-insert" onPress={onPress}>
      <Text>Insert</Text>
    </Pressable>
  );
});
jest.mock('../../../widgets/SpaceBox', () => ({VerticalSpaceBox: () => null}));
jest.mock('../../../widgets/QPBottomSheet', () => ({
  QPBottomSheet: ({visible, children}) =>
    visible
      ? require('react').createElement('View', {testID: 'refine-sheet'}, children)
      : null,
}));
jest.mock('./RefineOptionsSheet', () => () => {
  const {View} = require('react-native');
  return <View testID="refine-options" />;
});
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({children}) => children,
}));

describe('AIEmailDraftModal', () => {
  beforeEach(() => {
    mockOnPressInsert.mockClear();
    mockOnPressRegenerate.mockClear();
    mockOnPressDropDown.mockClear();
  });

  it('renders without crashing', () => {
    const {toJSON} = render(
      <AIEmailDraftModal onClose={jest.fn()} setEmailBody={jest.fn()} />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders AI logo', () => {
    const {getByTestId} = render(
      <AIEmailDraftModal onClose={jest.fn()} setEmailBody={jest.fn()} />,
    );
    expect(getByTestId('ai-logo')).toBeTruthy();
  });

  it('renders email body draft text', () => {
    const {getByTestId} = render(
      <AIEmailDraftModal onClose={jest.fn()} setEmailBody={jest.fn()} />,
    );
    expect(getByTestId('email-body')).toBeTruthy();
  });

  it('calls onPressInsert when Insert pressed', () => {
    const {getByTestId} = render(
      <AIEmailDraftModal onClose={jest.fn()} setEmailBody={jest.fn()} />,
    );
    fireEvent.press(getByTestId('btn-insert'));
    expect(mockOnPressInsert).toHaveBeenCalled();
  });

  it('calls onPressRegenerate when Regenerate pressed', () => {
    const {getByTestId} = render(
      <AIEmailDraftModal onClose={jest.fn()} setEmailBody={jest.fn()} />,
    );
    fireEvent.press(getByTestId('btn-regenerate'));
    expect(mockOnPressRegenerate).toHaveBeenCalled();
  });

  it('calls onPressDropDown when Refine pressed', () => {
    const {getByTestId} = render(
      <AIEmailDraftModal onClose={jest.fn()} setEmailBody={jest.fn()} />,
    );
    fireEvent.press(getByTestId('btn-refine'));
    expect(mockOnPressDropDown).toHaveBeenCalled();
  });
});
