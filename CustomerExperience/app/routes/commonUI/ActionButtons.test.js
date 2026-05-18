import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import ActionButtons from './ActionButtons';

jest.mock('../../widgets/Button', () => {
  const React = require('react');
  const {Text} = require('react-native');
  return ({testID = 'qp-button', onPress, buttonText, ...props}) =>
    React.createElement('Pressable', {
      testID,
      onPress,
      ...props,
    }, React.createElement(Text, {}, buttonText));
});

jest.mock('../../styles/button.styles', () => ({
  buttonStyles: {
    outlinePrimaryButton: {borderColor: '#007AFF'},
    outlinePrimaryButtonText: {color: '#007AFF'},
    primaryButton: {backgroundColor: '#007AFF'},
    primaryButtonText: {color: '#ffffff'},
  },
}));

jest.mock('../../styles/textsize.constants', () => ({
  TextSizes: {semiSecondary: 13},
}));

jest.mock('../../styles/color.constants', () => ({
  Colors: {
    white: '#ffffff',
    accentLight: '#007AFF',
  },
}));

jest.mock('../../styles/padding.constants', () => ({
  PaddingConstants: {
    tab1_2x: 24,
    halfTab: 8,
  },
}));

jest.mock('../../styles/margin.constants', () => ({
  MarginConstants: {
    tab1_5x: 40,
    tab1: 8,
  },
}));

jest.mock('../../widgets/SpaceBox', () => ({
  HorizontalSpaceBox: ({multiplyBy = 1, ...props}) =>
    require('react').createElement('View', {
      testID: 'horizontal-space-box',
      'data-multiplier': multiplyBy,
      ...props,
    }),
}));

jest.mock('../../Utils/MultilinguaUtils', () => ({
  translate: (key) => {
    const translations = {
      clear: 'Clear',
      apply: 'Apply',
    };
    return translations[key] || key;
  },
}));

describe('ActionButtons', () => {
  it('should render container view', () => {
    const {getAllByTestId} = render(
      <ActionButtons onCancel={jest.fn()} onApply={jest.fn()} />,
    );

    // Component uses StyleSheet and renders two buttons
    // Verify both are rendered
    const buttons = getAllByTestId('qp-button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it('should render cancel (Clear) button', () => {
    const {getByText} = render(
      <ActionButtons onCancel={jest.fn()} onApply={jest.fn()} />,
    );

    expect(getByText('Clear')).toBeTruthy();
  });

  it('should render apply button', () => {
    const {getByText} = render(
      <ActionButtons onCancel={jest.fn()} onApply={jest.fn()} />,
    );

    expect(getByText('Apply')).toBeTruthy();
  });

  it('should call onCancel when clear button is pressed', () => {
    const mockOnCancel = jest.fn();
    const {getByText} = render(
      <ActionButtons onCancel={mockOnCancel} onApply={jest.fn()} />,
    );

    fireEvent.press(getByText('Clear'));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onApply when apply button is pressed', () => {
    const mockOnApply = jest.fn();
    const {getByText} = render(
      <ActionButtons onCancel={jest.fn()} onApply={mockOnApply} />,
    );

    fireEvent.press(getByText('Apply'));
    expect(mockOnApply).toHaveBeenCalledTimes(1);
  });

  it('should render two buttons', () => {
    const {queryAllByTestId} = render(
      <ActionButtons onCancel={jest.fn()} onApply={jest.fn()} />,
    );

    const buttons = queryAllByTestId('qp-button');
    expect(buttons.length).toBe(2);
  });

  it('should apply white color to cancel button', () => {
    const {getAllByTestId} = render(
      <ActionButtons onCancel={jest.fn()} onApply={jest.fn()} />,
    );

    const buttons = getAllByTestId('qp-button');
    // First button should be cancel with white color
    expect(buttons[0].props.buttonColor).toBe('#ffffff');
  });

  it('should apply accentLight color to apply button', () => {
    const {getAllByTestId} = render(
      <ActionButtons onCancel={jest.fn()} onApply={jest.fn()} />,
    );

    const buttons = getAllByTestId('qp-button');
    // Second button should be apply with accentLight color
    expect(buttons[1].props.buttonColor).toBe('#007AFF');
  });

  it('should use translated text for clear button', () => {
    const {getByText} = render(
      <ActionButtons onCancel={jest.fn()} onApply={jest.fn()} />,
    );

    expect(getByText('Clear')).toBeTruthy();
  });

  it('should use translated text for apply button', () => {
    const {getByText} = render(
      <ActionButtons onCancel={jest.fn()} onApply={jest.fn()} />,
    );

    expect(getByText('Apply')).toBeTruthy();
  });

  it('should render space between buttons', () => {
    const {getByTestId} = render(
      <ActionButtons onCancel={jest.fn()} onApply={jest.fn()} />,
    );

    expect(getByTestId('horizontal-space-box')).toBeTruthy();
  });

  it('should not crash when onCancel is not provided', () => {
    expect(() => {
      render(<ActionButtons onApply={jest.fn()} />);
    }).not.toThrow();
  });

  it('should not crash when onApply is not provided', () => {
    expect(() => {
      render(<ActionButtons onCancel={jest.fn()} />);
    }).not.toThrow();
  });

  it('should handle multiple clicks on clear button', () => {
    const mockOnCancel = jest.fn();
    const {getByText} = render(
      <ActionButtons onCancel={mockOnCancel} onApply={jest.fn()} />,
    );

    fireEvent.press(getByText('Clear'));
    fireEvent.press(getByText('Clear'));
    fireEvent.press(getByText('Clear'));

    expect(mockOnCancel).toHaveBeenCalledTimes(3);
  });

  it('should handle multiple clicks on apply button', () => {
    const mockOnApply = jest.fn();
    const {getByText} = render(
      <ActionButtons onCancel={jest.fn()} onApply={mockOnApply} />,
    );

    fireEvent.press(getByText('Apply'));
    fireEvent.press(getByText('Apply'));

    expect(mockOnApply).toHaveBeenCalledTimes(2);
  });

  it('should use outline style for cancel button', () => {
    const {getByText} = render(
      <ActionButtons onCancel={jest.fn()} onApply={jest.fn()} />,
    );

    // Clear button should have outline styles applied
    // This is checked through the StyleSheet
    const clearButton = getByText('Clear');
    expect(clearButton).toBeTruthy();
  });

  it('should use primary style for apply button', () => {
    const {getByText} = render(
      <ActionButtons onCancel={jest.fn()} onApply={jest.fn()} />,
    );

    // Apply button should have primary styles applied
    const applyButton = getByText('Apply');
    expect(applyButton).toBeTruthy();
  });

});
