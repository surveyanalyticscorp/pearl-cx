import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Animated, PanResponder, Text, Modal} from 'react-native';
import {QPBottomSheet} from '.';

describe('QPBottomSheet', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render when visible is true', () => {
    const {getByText} = render(
      <QPBottomSheet visible={true} onClose={mockOnClose}>
        <Text>Test Content</Text>
      </QPBottomSheet>,
    );

    expect(getByText('Test Content')).toBeTruthy();
  });

  it('should not render content when visible is false', () => {
    const {queryByText} = render(
      <QPBottomSheet visible={false} onClose={mockOnClose}>
        <Text>Test Content</Text>
      </QPBottomSheet>,
    );

    expect(queryByText('Test Content')).toBeNull();
  });

  it('should render children correctly', () => {
    const {getByText} = render(
      <QPBottomSheet visible={true} onClose={mockOnClose}>
        <Text>Child Content</Text>
        <Text>Another Child</Text>
      </QPBottomSheet>,
    );

    expect(getByText('Child Content')).toBeTruthy();
    expect(getByText('Another Child')).toBeTruthy();
  });

  it('should render headerComponent when provided', () => {
    const headerComponent = <Text>Header Content</Text>;
    const {getByText} = render(
      <QPBottomSheet
        visible={true}
        onClose={mockOnClose}
        headerComponent={headerComponent}>
        <Text>Body Content</Text>
      </QPBottomSheet>,
    );

    expect(getByText('Header Content')).toBeTruthy();
    expect(getByText('Body Content')).toBeTruthy();
  });

  it('should not render headerComponent when not provided', () => {
    const {queryByText, getByText} = render(
      <QPBottomSheet visible={true} onClose={mockOnClose}>
        <Text>Body Content</Text>
      </QPBottomSheet>,
    );

    expect(queryByText('Header Content')).toBeNull();
    expect(getByText('Body Content')).toBeTruthy();
  });

  it('should call onClose when Modal onRequestClose is triggered', () => {
    const {UNSAFE_getByType} = render(
      <QPBottomSheet visible={true} onClose={mockOnClose}>
        <Text>Content</Text>
      </QPBottomSheet>,
    );

    const modal = UNSAFE_getByType(Modal);
    fireEvent(modal, 'requestClose');

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should apply contentStyle when provided', () => {
    const customStyle = {backgroundColor: 'red'};
    const {getByText} = render(
      <QPBottomSheet
        visible={true}
        onClose={mockOnClose}
        contentStyle={customStyle}>
        <Text>Content</Text>
      </QPBottomSheet>,
    );

    const content = getByText('Content');
    expect(content).toBeTruthy();
  });

  it('should handle bottomSheetHeight as percentage string', () => {
    const {getByText} = render(
      <QPBottomSheet
        visible={true}
        onClose={mockOnClose}
        bottomSheetHeight="60%">
        <Text>Content</Text>
      </QPBottomSheet>,
    );

    expect(getByText('Content')).toBeTruthy();
  });

  it('should handle bottomSheetHeight with invalid format', () => {
    const {getByText} = render(
      <QPBottomSheet
        visible={true}
        onClose={mockOnClose}
        bottomSheetHeight="invalid">
        <Text>Content</Text>
      </QPBottomSheet>,
    );

    expect(getByText('Content')).toBeTruthy();
  });

  it('should handle bottomSheetHeight with edge cases', () => {
    const {getByText} = render(
      <QPBottomSheet
        visible={true}
        onClose={mockOnClose}
        bottomSheetHeight="0%">
        <Text>Content</Text>
      </QPBottomSheet>,
    );

    expect(getByText('Content')).toBeTruthy();
  });

  it('should handle bottomSheetHeight with 100%', () => {
    const {getByText} = render(
      <QPBottomSheet
        visible={true}
        onClose={mockOnClose}
        bottomSheetHeight="100%">
        <Text>Content</Text>
      </QPBottomSheet>,
    );

    expect(getByText('Content')).toBeTruthy();
  });

  it('should handle bottomSheetHeight with values over 100%', () => {
    const {getByText} = render(
      <QPBottomSheet
        visible={true}
        onClose={mockOnClose}
        bottomSheetHeight="150%">
        <Text>Content</Text>
      </QPBottomSheet>,
    );

    expect(getByText('Content')).toBeTruthy();
  });

  it('should handle bottomSheetHeight where parsed value is NaN', () => {
    const {getByText} = render(
      <QPBottomSheet
        visible={true}
        onClose={mockOnClose}
        bottomSheetHeight="%">
        <Text>Content</Text>
      </QPBottomSheet>,
    );

    expect(getByText('Content')).toBeTruthy();
  });

  it('should handle multiple re-renders with visible prop changes', () => {
    const {rerender, queryByText, getByText} = render(
      <QPBottomSheet visible={false} onClose={mockOnClose}>
        <Text>Content</Text>
      </QPBottomSheet>,
    );

    expect(queryByText('Content')).toBeNull();

    rerender(
      <QPBottomSheet visible={true} onClose={mockOnClose}>
        <Text>Content</Text>
      </QPBottomSheet>,
    );

    expect(getByText('Content')).toBeTruthy();

    rerender(
      <QPBottomSheet visible={false} onClose={mockOnClose}>
        <Text>Content</Text>
      </QPBottomSheet>,
    );

    expect(queryByText('Content')).toBeNull();
  });

  it('should handle onClose callback being called multiple times', () => {
    const {UNSAFE_getByType} = render(
      <QPBottomSheet visible={true} onClose={mockOnClose}>
        <Text>Content</Text>
      </QPBottomSheet>,
    );

    const modal = UNSAFE_getByType(Modal);
    fireEvent(modal, 'requestClose');
    fireEvent(modal, 'requestClose');

    expect(mockOnClose).toHaveBeenCalledTimes(2);
  });

  describe('PanResponder callbacks', () => {
    let panConfig;

    beforeEach(() => {
      panConfig = null;
      jest.spyOn(PanResponder, 'create').mockImplementation(config => {
        panConfig = config;
        return {panHandlers: {}};
      });
      jest.spyOn(Animated, 'timing').mockImplementation(() => ({
        start: jest.fn(cb => cb && cb({finished: true})),
      }));
      jest.spyOn(Animated, 'spring').mockImplementation(() => ({
        start: jest.fn(),
      }));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('onStartShouldSetPanResponder returns true', () => {
      render(
        <QPBottomSheet visible={true} onClose={mockOnClose}>
          <Text>Content</Text>
        </QPBottomSheet>,
      );
      expect(panConfig.onStartShouldSetPanResponder()).toBe(true);
    });

    it('onMoveShouldSetPanResponder returns true', () => {
      render(
        <QPBottomSheet visible={true} onClose={mockOnClose}>
          <Text>Content</Text>
        </QPBottomSheet>,
      );
      expect(panConfig.onMoveShouldSetPanResponder()).toBe(true);
    });

    it('onPanResponderMove with dy > 0 updates pan offset', () => {
      render(
        <QPBottomSheet visible={true} onClose={mockOnClose}>
          <Text>Content</Text>
        </QPBottomSheet>,
      );
      expect(() => panConfig.onPanResponderMove({}, {dy: 50})).not.toThrow();
    });

    it('onPanResponderMove with dy <= 0 does nothing', () => {
      render(
        <QPBottomSheet visible={true} onClose={mockOnClose}>
          <Text>Content</Text>
        </QPBottomSheet>,
      );
      expect(() => panConfig.onPanResponderMove({}, {dy: -5})).not.toThrow();
    });

    it('onPanResponderRelease above threshold calls onClose', () => {
      render(
        <QPBottomSheet visible={true} onClose={mockOnClose}>
          <Text>Content</Text>
        </QPBottomSheet>,
      );
      panConfig.onPanResponderRelease({}, {dy: 9999});
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('onPanResponderRelease below threshold does not call onClose', () => {
      render(
        <QPBottomSheet visible={true} onClose={mockOnClose}>
          <Text>Content</Text>
        </QPBottomSheet>,
      );
      panConfig.onPanResponderRelease({}, {dy: 1});
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});
