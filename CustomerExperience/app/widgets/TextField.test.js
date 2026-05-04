import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import QPTextField from './TextField';

// Mock StringUtils
jest.mock('../Utils/StringUtils', () => ({
  isNotEmpty: jest.fn(value => value && value.length > 0),
}));

// Mock SVG icons
jest.mock(
  './../../assets/images/visibility.svg',
  () => 'PasswordVisibilitySVGIcon',
);
jest.mock(
  './../../assets/images/visibility_off.svg',
  () => 'PasswordVisibility_offSVGIcon',
);

// Mock style constants
jest.mock('../styles/color.constants', () => ({
  Colors: {
    filterIconColor: '#000000',
    accentLight: '#007AFF',
    primary: '#000000',
    borderColor: '#CCCCCC',
  },
}));

jest.mock('../styles/textsize.constants', () => ({
  TextSizes: {
    primary: 16,
    secondary: 14,
  },
}));

jest.mock('../styles/font.constants', () => ({
  FontFamily: {
    regular: 'System',
  },
}));

jest.mock('../styles/margin.constants', () => ({
  MarginConstants: {
    tab4: 16,
    tab1: 4,
  },
}));

jest.mock('../styles/padding.constants', () => ({
  PaddingConstants: {
    halfTab: 2,
  },
}));

describe('TextField Component', () => {
  it('renders the TextField with default size', () => {
    const {getByTestId} = render(<QPTextField />);
    const textField = getByTestId('text-field');
    expect(textField).toBeTruthy();
  });

  it('renders the TextField with custom testID', () => {
    const {getByTestId} = render(<QPTextField testID="custom-id" />);
    const textField = getByTestId('custom-id');
    expect(textField).toBeTruthy();
  });

  it('renders the TextField with the correct placeholder', () => {
    const {getByTestId} = render(
      <QPTextField placeholder="test-placeholder" />,
    );
    const textField = getByTestId('text-field');
    expect(textField.props.placeholder).toBe('test-placeholder');
  });

  it('renders the TextField with the correct label', () => {
    const {getByText} = render(<QPTextField label="test-label" />);
    const label = getByText('test-label');
    expect(label).toBeTruthy();
  });

  it('renders the TextField with the correct accessibilityLabel', () => {
    const {getByTestId} = render(
      <QPTextField accessibilityLabel="test-accessibilityLabel" />,
    );
    const textField = getByTestId('text-field');
    expect(textField.props.accessibilityLabel).toBe('test-accessibilityLabel');
  });

  // Test onChangeText event
  it('calls onChange when the text field value changes', () => {
    const mockOnChange = jest.fn();
    const {getByTestId} = render(<QPTextField onChange={mockOnChange} />);
    const textField = getByTestId('text-field');
    fireEvent.changeText(textField, 'test-text');
    expect(mockOnChange).toHaveBeenCalledWith('test-text');
  });

  // Test onSubmitEditing event
  it('calls onSubmit when submitting the text field', () => {
    const mockOnSubmit = jest.fn();
    const {getByTestId} = render(<QPTextField onSubmit={mockOnSubmit} />);
    const textField = getByTestId('text-field');

    fireEvent(textField, 'onSubmitEditing');
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  // Test onEndEditing event
  it('calls onEndEdit when editing ends in the text field', () => {
    const mockOnEndEdit = jest.fn();
    const {getByTestId} = render(<QPTextField onEndEdit={mockOnEndEdit} />);
    const textField = getByTestId('text-field');

    fireEvent(textField, 'onEndEditing');
    expect(mockOnEndEdit).toHaveBeenCalled();
  });

  // Test renderVisibility component
  it('renders the renderVisibility component when secureText is true', () => {
    const {getByTestId} = render(
      <QPTextField secureText={true} value="test" />,
    );
    const visibilityIcon = getByTestId('password-visibility-button');
    expect(visibilityIcon).toBeTruthy();
  });

  // Test password visibility toggle
  it('toggles password visibility when visibility icon is pressed', () => {
    const {getByTestId} = render(
      <QPTextField secureText={true} value="test" />,
    );
    const visibilityIcon = getByTestId('password-visibility-button');
    fireEvent.press(visibilityIcon);
    const textField = getByTestId('text-field');
    expect(textField.props.secureTextEntry).toBe(false);
  });

  it('applies default values for unspecified props', () => {
    const {getByTestId} = render(<QPTextField />);
    const textField = getByTestId('text-field');

    // Check for keyboardType and returnKeyType
    expect(textField.props.keyboardType).toBe('default');
    expect(textField.props.returnKeyType).toBe('next');

    // Check if placeholder is empty by default
    expect(textField.props.placeholder).toBeUndefined();
  });

  it('applies custom style', () => {
    const customStyle = {backgroundColor: 'red'};
    const {getByTestId} = render(<QPTextField style={customStyle} />);
    const container = getByTestId('text-field-container');
    expect(container.props.style).toContainEqual(customStyle);
  });
});
