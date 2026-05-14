import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import CustomTextField from './CustomTextField';

jest.mock('../Utils/StringUtils', () => ({
  isNotEmpty: jest.fn(value => value != null && value.length > 0),
}));

jest.mock('./../../assets/images/visibility.svg', () => 'PasswordVisibilitySVGIcon');
jest.mock('./../../assets/images/visibility_off.svg', () => 'PasswordVisibility_offSVGIcon');

describe('CustomTextField', () => {
  it('renders text-field-container without crashing', () => {
    const {getByTestId} = render(<CustomTextField />);
    expect(getByTestId('text-field-container')).toBeTruthy();
  });

  it('uses default testID of text-field for the input', () => {
    const {getByTestId} = render(<CustomTextField />);
    expect(getByTestId('text-field')).toBeTruthy();
  });

  it('uses custom testID when provided', () => {
    const {getByTestId} = render(<CustomTextField testID="custom-input" />);
    expect(getByTestId('custom-input')).toBeTruthy();
  });

  it('calls onChange when text changes', () => {
    const mockOnChange = jest.fn();
    const {getByTestId} = render(<CustomTextField onChange={mockOnChange} />);
    fireEvent.changeText(getByTestId('text-field'), 'hello');
    expect(mockOnChange).toHaveBeenCalledWith('hello');
  });

  it('calls onSubmit when submitting', () => {
    const mockOnSubmit = jest.fn();
    const {getByTestId} = render(<CustomTextField onSubmit={mockOnSubmit} />);
    fireEvent(getByTestId('text-field'), 'onSubmitEditing');
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('calls onEndEdit when editing ends', () => {
    const mockOnEndEdit = jest.fn();
    const {getByTestId} = render(<CustomTextField onEndEdit={mockOnEndEdit} />);
    fireEvent(getByTestId('text-field'), 'onEndEditing');
    expect(mockOnEndEdit).toHaveBeenCalled();
  });

  it('shows password visibility button when secureText=true and value present', () => {
    const {getByTestId} = render(
      <CustomTextField secureText={true} value="secret" />,
    );
    expect(getByTestId('password-visibility-button')).toBeTruthy();
  });

  it('does not show password visibility button when secureText=false', () => {
    const {queryByTestId} = render(
      <CustomTextField secureText={false} value="text" />,
    );
    expect(queryByTestId('password-visibility-button')).toBeNull();
  });

  it('toggles password visibility when button is pressed', () => {
    const {getByTestId} = render(
      <CustomTextField secureText={true} value="secret" />,
    );
    const textInput = getByTestId('text-field');
    expect(textInput.props.secureTextEntry).toBe(true);
    fireEvent.press(getByTestId('password-visibility-button'));
    expect(getByTestId('text-field').props.secureTextEntry).toBe(false);
  });

  it('renders label text when label prop is given', () => {
    const {getByText} = render(<CustomTextField label="Email" />);
    expect(getByText('Email')).toBeTruthy();
  });

  it('applies defaultValue in uncontrolled mode', () => {
    const {getByTestId} = render(
      <CustomTextField defaultValue="initial" />,
    );
    expect(getByTestId('text-field').props.value).toBe('initial');
  });

  it('reflects value prop in controlled mode', () => {
    const {getByTestId} = render(
      <CustomTextField value="controlled" />,
    );
    expect(getByTestId('text-field').props.value).toBe('controlled');
  });
});
