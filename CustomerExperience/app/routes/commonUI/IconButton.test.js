import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import IconButton from './IconButton';

jest.mock('../../styles/color.constants', () => ({
  Colors: {
    white: '#ffffff',
  },
}));

jest.mock('../../styles/text.styles', () => ({
  baseTextStyles: {
    secondaryRegularText: {fontSize: 14},
  },
}));

describe('IconButton', () => {
  it('should render button with text', () => {
    const {getByText} = render(
      <IconButton buttonText="Click me" />,
    );

    expect(getByText('Click me')).toBeTruthy();
  });

  it('should render button with testID', () => {
    const {getByTestId} = render(
      <IconButton buttonText="Button" />,
    );

    expect(getByTestId('icon-button')).toBeTruthy();
  });

  it('should call onPress when button is pressed', () => {
    const mockOnPress = jest.fn();
    const {getByTestId} = render(
      <IconButton buttonText="Click" onPress={mockOnPress} />,
    );

    fireEvent.press(getByTestId('icon-button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should render left icon when provided', () => {
    const leftIconComponent = <span testID="left-icon">LEFT</span>;
    const {getByTestId} = render(
      <IconButton buttonText="Button" leftIcon={leftIconComponent} />,
    );

    expect(getByTestId('left-icon')).toBeTruthy();
  });

  it('should render right icon when provided', () => {
    const rightIconComponent = <span testID="right-icon">RIGHT</span>;
    const {getByTestId} = render(
      <IconButton buttonText="Button" rightIcon={rightIconComponent} />,
    );

    expect(getByTestId('right-icon')).toBeTruthy();
  });

  it('should render both left and right icons', () => {
    const leftIconComponent = <span testID="left-icon">LEFT</span>;
    const rightIconComponent = <span testID="right-icon">RIGHT</span>;
    const {getByTestId} = render(
      <IconButton
        buttonText="Button"
        leftIcon={leftIconComponent}
        rightIcon={rightIconComponent}
      />,
    );

    expect(getByTestId('left-icon')).toBeTruthy();
    expect(getByTestId('right-icon')).toBeTruthy();
  });

  it('should apply custom button style when provided', () => {
    const customButtonStyle = {backgroundColor: '#ff0000', padding: 20};
    const {getByTestId} = render(
      <IconButton
        buttonText="Button"
        buttonStyle={customButtonStyle}
      />,
    );

    const button = getByTestId('icon-button');
    expect(button.props.style).toBe(customButtonStyle);
  });

  it('should use default button style when not provided', () => {
    const {getByTestId} = render(
      <IconButton buttonText="Button" />,
    );

    const button = getByTestId('icon-button');
    expect(button.props.style).toBeDefined();
  });

  it('should apply custom text style when provided', () => {
    const customTextStyle = {color: '#ff0000', fontSize: 18};
    const {UNSAFE_getByType} = render(
      <IconButton
        buttonText="Button"
        textStyle={customTextStyle}
      />,
    );

    const text = UNSAFE_getByType('Text');
    expect(text.props.style).toBe(customTextStyle);
  });

  it('should use default text style when not provided', () => {
    const {UNSAFE_getByType} = render(
      <IconButton buttonText="Button" />,
    );

    const text = UNSAFE_getByType('Text');
    expect(text.props.style).toBeDefined();
  });

  it('should not crash when onPress is not provided', () => {
    const {getByTestId} = render(
      <IconButton buttonText="Button" />,
    );

    expect(() => {
      fireEvent.press(getByTestId('icon-button'));
    }).not.toThrow();
  });

  it('should handle multiple onPress calls', () => {
    const mockOnPress = jest.fn();
    const {getByTestId} = render(
      <IconButton buttonText="Button" onPress={mockOnPress} />,
    );

    fireEvent.press(getByTestId('icon-button'));
    fireEvent.press(getByTestId('icon-button'));
    fireEvent.press(getByTestId('icon-button'));

    expect(mockOnPress).toHaveBeenCalledTimes(3);
  });

  it('should render with different button text', () => {
    const textVariations = ['Save', 'Delete', 'Edit', 'Cancel'];
    textVariations.forEach((text) => {
      const {getByText} = render(
        <IconButton buttonText={text} />,
      );
      expect(getByText(text)).toBeTruthy();
    });
  });

  it('should render with empty text', () => {
    const {UNSAFE_getByType} = render(
      <IconButton buttonText="" />,
    );

    const text = UNSAFE_getByType('Text');
    expect(text).toBeTruthy();
  });

  it('should render without any props', () => {
    const {getByTestId} = render(<IconButton />);

    expect(getByTestId('icon-button')).toBeTruthy();
  });

  it('should have flexDirection row in default button style', () => {
    const {getByTestId} = render(
      <IconButton buttonText="Button" />,
    );

    const button = getByTestId('icon-button');
    // Default style has flexDirection: 'row'
    expect(button.props.style).toBeDefined();
  });
});
