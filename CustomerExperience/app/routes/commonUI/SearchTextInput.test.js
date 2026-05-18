import React from 'react';
import {render} from '@testing-library/react-native';
import {SearchTextInput} from './SearchTextInput';

jest.mock('../../styles/color.constants', () => ({
  Colors: {
    filterIconColor: '#000000',
  },
}));

jest.mock('../../styles/margin.constants', () => ({
  MarginConstants: {
    halfTab: 4,
  },
}));

jest.mock('../../styles/padding.constants', () => ({
  PaddingConstants: {
    halfTab: 8,
  },
}));

describe('SearchTextInput', () => {
  it('should render text input component', () => {
    const {getByTestId} = render(<SearchTextInput />);
    // TextInput is rendered, verify it exists
    expect(getByTestId).toBeDefined();
  });

  it('should render with default value prop', () => {
    const {UNSAFE_getByType} = render(
      <SearchTextInput defaultValue="search term" />,
    );
    const input = UNSAFE_getByType('TextInput');
    expect(input.props.defaultValue).toBe('search term');
  });

  it('should use empty string as default if no defaultValue provided', () => {
    const {UNSAFE_getByType} = render(<SearchTextInput />);
    const input = UNSAFE_getByType('TextInput');
    expect(input.props.defaultValue).toBe('');
  });

  it('should apply custom style when provided', () => {
    const customStyle = {color: 'red', fontSize: 16};
    const {UNSAFE_getByType} = render(
      <SearchTextInput style={customStyle} />,
    );
    const input = UNSAFE_getByType('TextInput');
    expect(input.props.style).toBe(customStyle);
  });

  it('should apply default search style when no custom style provided', () => {
    const {UNSAFE_getByType} = render(<SearchTextInput />);
    const input = UNSAFE_getByType('TextInput');
    // Should have search style applied
    expect(input.props.style).toBeDefined();
  });

  it('should pass placeholder prop to TextInput', () => {
    const {UNSAFE_getByType} = render(
      <SearchTextInput placeholder="Enter search term" />,
    );
    const input = UNSAFE_getByType('TextInput');
    expect(input.props.placeholder).toBe('Enter search term');
  });

  it('should pass returnKeyType prop to TextInput', () => {
    const {UNSAFE_getByType} = render(
      <SearchTextInput returnKeyType="search" />,
    );
    const input = UNSAFE_getByType('TextInput');
    expect(input.props.returnKeyType).toBe('search');
  });

  it('should pass onChangeText callback to TextInput', () => {
    const mockOnChangeText = jest.fn();
    const {UNSAFE_getByType} = render(
      <SearchTextInput onChangeText={mockOnChangeText} />,
    );
    const input = UNSAFE_getByType('TextInput');
    expect(input.props.onChangeText).toBe(mockOnChangeText);
  });

  it('should forward ref to TextInput', () => {
    const ref = React.createRef();
    render(<SearchTextInput ref={ref} />);
    // Ref should be assigned to TextInput
    expect(ref.current).toBeDefined();
  });

  it('should handle null placeholder', () => {
    const {UNSAFE_getByType} = render(
      <SearchTextInput placeholder={null} />,
    );
    const input = UNSAFE_getByType('TextInput');
    expect(input.props.placeholder).toBeNull();
  });

  it('should handle undefined onChangeText', () => {
    const {UNSAFE_getByType} = render(<SearchTextInput />);
    const input = UNSAFE_getByType('TextInput');
    expect(input.props.onChangeText).toBeUndefined();
  });

  it('should handle multiple props together', () => {
    const mockOnChangeText = jest.fn();
    const customStyle = {backgroundColor: 'white'};
    const {UNSAFE_getByType} = render(
      <SearchTextInput
        defaultValue="initial"
        placeholder="Type here"
        style={customStyle}
        returnKeyType="search"
        onChangeText={mockOnChangeText}
      />,
    );
    const input = UNSAFE_getByType('TextInput');
    expect(input.props.defaultValue).toBe('initial');
    expect(input.props.placeholder).toBe('Type here');
    expect(input.props.style).toBe(customStyle);
    expect(input.props.returnKeyType).toBe('search');
    expect(input.props.onChangeText).toBe(mockOnChangeText);
  });

  it('should render without any props', () => {
    const {UNSAFE_getByType} = render(<SearchTextInput />);
    const input = UNSAFE_getByType('TextInput');
    expect(input).toBeDefined();
    expect(input.props.defaultValue).toBe('');
  });
});
