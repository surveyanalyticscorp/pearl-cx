import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import RefineDropDown from './RefineDropDown';

jest.mock('../takeaction/DropDownButton', () => ({label, onPress, isOpen}) => {
  const {Pressable, Text} = require('react-native');
  return (
    <Pressable onPress={onPress} testID="dropdown-button">
      <Text>{label}</Text>
      {isOpen ? <Text>open</Text> : null}
    </Pressable>
  );
});

describe('RefineDropDown', () => {
  it('renders with default Refine label when no selectedRefineOptions', () => {
    const {getByText} = render(
      <RefineDropDown onPress={jest.fn()} isOpen={false} />,
    );
    expect(getByText('Refine')).toBeTruthy();
  });

  it('renders with selectedRefineOptions.refine label', () => {
    const {getByText} = render(
      <RefineDropDown
        selectedRefineOptions={{refine: 'More Formal'}}
        onPress={jest.fn()}
        isOpen={false}
      />,
    );
    expect(getByText('More Formal')).toBeTruthy();
  });

  it('calls onPress when dropdown pressed', () => {
    const onPress = jest.fn();
    const {getByTestId} = render(
      <RefineDropDown onPress={onPress} isOpen={false} />,
    );
    fireEvent.press(getByTestId('dropdown-button'));
    expect(onPress).toHaveBeenCalled();
  });

  it('shows open state when isOpen is true', () => {
    const {getByText} = render(
      <RefineDropDown onPress={jest.fn()} isOpen={true} />,
    );
    expect(getByText('open')).toBeTruthy();
  });
});
