import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import RefineButton from './RefineButton';

jest.mock('../../../assets/images/dropdown_icon.svg', () => 'DropDownIcon');

describe('RefineButton', () => {
  it('renders Refine label', () => {
    const {getByText} = render(
      <RefineButton
        selectedRefineOptions={{refine: null, intent: null}}
        onPress={jest.fn()}
        isOpen={false}
        isSmallScreen={false}
      />,
    );
    expect(getByText('Refine')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockPress = jest.fn();
    const {getByText} = render(
      <RefineButton
        selectedRefineOptions={{refine: null, intent: null}}
        onPress={mockPress}
        isOpen={false}
        isSmallScreen={false}
      />,
    );
    fireEvent.press(getByText('Refine'));
    expect(mockPress).toHaveBeenCalled();
  });
});
