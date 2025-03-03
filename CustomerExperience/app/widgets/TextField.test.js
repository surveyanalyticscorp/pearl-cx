// import React from 'react';
// import {render, fireEvent} from '@testing-library/react-native';
// import TextField from './TextField';

// describe('TextField Component', () => {
//   it('renders the TextField with default size', () => {
//     const {getByTestId} = render(<TextField />);
//     const image = getByTestId('text-field');

//     // Check if the image is rendered
//     expect(image).toBeTruthy();
//   });

//   it('renders the TextField with custom size', () => {
//     const {getByTestId} = render(<TextField testID="test-id" />);
//     const image = getByTestId('test-id');

//     // Check if the image is rendered
//     expect(image).toBeTruthy();
//   });
//   it('renders the TextField with the correct placeholder', () => {
//     const {getByTestId} = render(<TextField placeholder="test-placeholder" />);
//     const image = getByTestId('text-field');

//     // Check if the image is rendered
//     expect(image).toBeTruthy();
//   });
//   it('renders the TextField with the correct label', () => {
//     const {getByTestId} = render(<TextField label="test-label" />);
//     const image = getByTestId('text-field');

//     // Check if the image is rendered
//     expect(image).toBeTruthy();
//   });
//   it('renders the TextField with the correct accessibilityLabel', () => {
//     const {getByTestId} = render(
//       <TextField accessibilityLabel="test-accessibilityLabel" />,
//     );
//     const image = getByTestId('text-field');

//     // Check if the image is rendered
//     expect(image).toBeTruthy();
//   });

//   // test onChangeText event
//   it('calls onChangeText when the text field is changed', () => {
//     const mockOnChangeText = jest.fn();
//     const {getByTestId} = render(<TextField onChange={mockOnChangeText} />);
//     const textField = getByTestId('text-field');
//     fireEvent.changeText(textField, 'test-text');
//     expect(mockOnChangeText).toHaveBeenCalledWith('test-text');
//   });

//   // test renderVisibility component
//   it('renders the renderVisibility component', () => {
//     const {getByTestId} = render(<TextField secureText={true} value="test" />);
//     const renderVisibility = getByTestId('render-visibility-icon');
//     expect(renderVisibility).toBeTruthy();
//   });
// });

import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import QPTextField from './TextField';

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
    const {getAllByAccessibilityValue} = render(
      <QPTextField accessibilityLabel="test-accessibilityLabel" />,
    );
    const textField = getAllByAccessibilityValue('test-accessibilityLabel');
    expect(textField).toBeTruthy();
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
    const visibilityIcon = getByTestId('render-visibility-icon');
    expect(visibilityIcon).toBeTruthy();
  });

  // Test password visibility toggle
  it('toggles password visibility when visibility icon is pressed', () => {
    const {getByTestId} = render(
      <QPTextField secureText={true} value="test" />,
    );
    const visibilityIcon = getByTestId('render-visibility-icon');
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
    expect(textField.props.placeholder).toBeUndefined(); // or adjust if placeholder exists
  });

  it('applies custom style', () => {
    const customStyle = {backgroundColor: 'red'};
    const {getByTestId} = render(<QPTextField style={customStyle} />);
    const container = getByTestId('text-field-container');
    expect(container.props.style).toContainEqual(customStyle);
  });
});
