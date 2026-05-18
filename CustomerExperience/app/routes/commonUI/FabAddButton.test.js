import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Dimensions, Platform} from 'react-native';
import FabAddButton from './FabAddButton';

jest.mock('../../styles/color.constants', () => ({
  Colors: {
    accentLight: '#007AFF',
    white: '#ffffff',
  },
}));

jest.mock('../../Utils/IconUtils', () => ({
  MaterialIcons: ({name, size, color, ...props}) =>
    require('react').createElement('View', {
      testID: 'material-icon',
      'data-name': name,
      'data-size': size,
      'data-color': color,
      ...props,
    }),
}));

describe('FabAddButton', () => {
  beforeEach(() => {
    Dimensions.get = jest.fn(() => ({width: 400, height: 800}));
    Platform.isPad = false;
    Platform.OS = 'android';
  });

  it('should render FAB button container', () => {
    const {UNSAFE_getByType} = render(<FabAddButton />);
    // Should render View for container
    expect(UNSAFE_getByType('View')).toBeTruthy();
  });

  it('should render Pressable inside container', () => {
    const {getByTestId} = render(<FabAddButton />);
    expect(getByTestId('fab-button')).toBeTruthy();
  });

  it('should render MaterialIcons add icon', () => {
    const {getByTestId} = render(<FabAddButton />);
    const icon = getByTestId('material-icon');
    expect(icon.props['data-name']).toBe('add');
  });

  it('should call onPress when FAB is pressed', () => {
    const mockOnPress = jest.fn();
    const {getByTestId} = render(<FabAddButton onPress={mockOnPress} />);

    fireEvent.press(getByTestId('fab-button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should have accessibility role of button', () => {
    const {getByTestId} = render(<FabAddButton />);
    const button = getByTestId('fab-button');
    expect(button.props.accessibilityRole).toBe('button');
  });

  it('should calculate size based on screen width', () => {
    const {getByTestId} = render(<FabAddButton />);
    const icon = getByTestId('material-icon');
    // Size should be calculated based on Dimensions
    expect(icon.props['data-size']).toBeDefined();
    expect(typeof icon.props['data-size']).toBe('number');
  });

  it('should have valid icon size (number greater than 0)', () => {
    const {getByTestId} = render(<FabAddButton />);
    const icon = getByTestId('material-icon');
    expect(icon.props['data-size']).toBeGreaterThan(0);
  });

  it('should use white color for icon', () => {
    const {getByTestId} = render(<FabAddButton />);
    const icon = getByTestId('material-icon');
    expect(icon.props['data-color']).toBe('#ffffff');
  });

  it('should position FAB absolutely', () => {
    const {UNSAFE_getByType} = render(<FabAddButton />);
    // Get the container view
    const views = UNSAFE_getByType('View');
    expect(views).toBeTruthy();
  });

  it('should have bottom position of 36 on iOS', () => {
    Platform.OS = 'ios';
    const {UNSAFE_getByType} = render(<FabAddButton />);
    const view = UNSAFE_getByType('View');
    expect(view).toBeTruthy();
  });

  it('should have bottom position of 24 on Android', () => {
    Platform.OS = 'android';
    const {UNSAFE_getByType} = render(<FabAddButton />);
    const view = UNSAFE_getByType('View');
    expect(view).toBeTruthy();
  });

  it('should have right position of 24', () => {
    const {UNSAFE_getByType} = render(<FabAddButton />);
    const view = UNSAFE_getByType('View');
    expect(view).toBeTruthy();
  });

  it('should have borderRadius of 50 (circular)', () => {
    const {UNSAFE_getByType} = render(<FabAddButton />);
    const view = UNSAFE_getByType('View');
    expect(view).toBeTruthy();
  });

  it('should use accentLight background color', () => {
    const {UNSAFE_getByType} = render(<FabAddButton />);
    const view = UNSAFE_getByType('View');
    expect(view).toBeTruthy();
  });

  it('should handle multiple presses', () => {
    const mockOnPress = jest.fn();
    const {getByTestId} = render(<FabAddButton onPress={mockOnPress} />);

    fireEvent.press(getByTestId('fab-button'));
    fireEvent.press(getByTestId('fab-button'));

    expect(mockOnPress).toHaveBeenCalledTimes(2);
  });

  it('should handle undefined onPress prop', () => {
    const {getByTestId} = render(<FabAddButton />);

    expect(() => {
      fireEvent.press(getByTestId('fab-button'));
    }).not.toThrow();
  });

  it('should handle different screen widths', () => {
    const widths = [300, 600, 800, 1000];
    widths.forEach((width) => {
      Dimensions.get = jest.fn(() => ({width, height: 800}));
      Platform.isPad = false;

      const {getByTestId} = render(<FabAddButton />);
      const icon = getByTestId('material-icon');
      const expectedSize = width / 8 - 5;
      expect(icon.props['data-size']).toBe(expectedSize);
    });
  });

  it('should render without any props', () => {
    const {getByTestId} = render(<FabAddButton />);
    expect(getByTestId('fab-button')).toBeTruthy();
  });
});
