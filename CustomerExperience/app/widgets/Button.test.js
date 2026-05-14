import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import QPButton from './Button';

jest.mock('../styles/color.constants', () => ({
  buttonColors: {backgroundColor: '#007AFF'},
  textColors: {primary: '#ffffff'},
  disabledButtonColors: {buttonColor: '#cccccc', textColor: '#888888'},
  Colors: {filterIconColor: '#000000'},
}));

jest.mock('../styles/margin.constants', () => ({
  MarginConstants: {tab3: 24, tab4: 16},
}));

jest.mock('../styles/textsize.constants', () => ({
  TextSizes: {primary: 16, secondary: 14},
}));

jest.mock('../styles/font.constants', () => ({
  FontFamily: {semiBold: 'System', regular: 'System'},
}));

describe('QPButton', () => {
  it('renders with buttonText', () => {
    const {getByText} = render(<QPButton buttonText="Submit" />);
    expect(getByText('Submit')).toBeTruthy();
  });

  it('uses default testID of QPButton', () => {
    const {getByTestId} = render(<QPButton buttonText="OK" />);
    expect(getByTestId('QPButton')).toBeTruthy();
  });

  it('uses custom testID when provided', () => {
    const {getByTestId} = render(<QPButton testID="my-button" buttonText="OK" />);
    expect(getByTestId('my-button')).toBeTruthy();
  });

  it('calls onPress when pressed and not disabled', () => {
    const mockOnPress = jest.fn();
    const {getByTestId} = render(
      <QPButton buttonText="Click" onPress={mockOnPress} />,
    );
    fireEvent.press(getByTestId('QPButton'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when isDisabled is true', () => {
    const mockOnPress = jest.fn();
    const {getByTestId} = render(
      <QPButton buttonText="Click" onPress={mockOnPress} isDisabled={true} />,
    );
    fireEvent.press(getByTestId('QPButton'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('renders with isDisabled false by default', () => {
    const {getByTestId} = render(<QPButton buttonText="OK" />);
    expect(getByTestId('QPButton').props.accessibilityState?.disabled).toBeFalsy();
  });

  it('accepts buttonColor prop without crashing', () => {
    const {getByTestId} = render(
      <QPButton buttonText="OK" buttonColor="#ff0000" />,
    );
    expect(getByTestId('QPButton')).toBeTruthy();
  });
});
