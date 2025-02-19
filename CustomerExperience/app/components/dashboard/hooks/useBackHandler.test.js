// write test for useBackHandler hook
import {renderHook, act} from '@testing-library/react-hooks';
import useBackHandler from './useBackHandler';
import {BackHandler, Alert} from 'react-native';

// Mocks
jest.mock('react-native', () => ({
  BackHandler: {
    addEventListener: jest.fn(() => ({
      remove: jest.fn(),
    })),
    removeEventListener: jest.fn(),
    exitApp: jest.fn(),
  },
  Alert: {
    alert: jest.fn(),
  },
}));

jest.mock('../../../Utils/MultilinguaUtils', () => ({
  translate: jest.fn(key => key), // Mock translate to return the key itself
}));

describe('useBackHandler', () => {
  let navigationMock;

  beforeEach(() => {
    navigationMock = {
      canGoBack: jest.fn(),
      goBack: jest.fn(),
    };
    BackHandler.addEventListener.mockClear();
    BackHandler.removeEventListener.mockClear();
    Alert.alert.mockClear();
    BackHandler.exitApp.mockClear();
  });

  it('should handle back press when navigation can go back', () => {
    navigationMock.canGoBack.mockReturnValue(true);
    renderHook(() => useBackHandler(navigationMock));

    const backPressEvent = BackHandler.addEventListener.mock.calls[0][1];
    act(() => {
      const result = backPressEvent();
      expect(result).toBe(true);
    });
    expect(navigationMock.goBack).toHaveBeenCalled();
  });

  it('should set exit alert when navigation cannot go back', () => {
    navigationMock.canGoBack.mockReturnValue(false);
    const {result} = renderHook(() => useBackHandler(navigationMock));

    const backPressEvent = BackHandler.addEventListener.mock.calls[0][1];
    act(() => {
      const result = backPressEvent();
      expect(result).toBe(true);
    });
    expect(result.current.exitAlert).toBe(true);
  });

  it('should display exit alert and handle button presses', () => {
    navigationMock.canGoBack.mockReturnValue(false);

    const {result} = renderHook(() => useBackHandler(navigationMock));
    const backPressEvent = BackHandler.addEventListener.mock.calls[0][1];
    act(() => {
      backPressEvent();
    });

    // Now, exitAlert should be true, manually call renderExitAlert
    act(() => {
      result.current.renderExitAlert();
    });

    // Check if Alert.alert was called
    expect(Alert.alert).toHaveBeenCalledWith(
      'exit_app',
      'exit_message',
      expect.any(Array),
      {cancelable: false},
    );

    // Simulate pressing 'yes'
    const yesButton = Alert.alert.mock.calls[0][2][0];
    act(() => {
      yesButton.onPress();
    });
    expect(BackHandler.exitApp).toHaveBeenCalled();

    // Simulate pressing 'no'
    const noButton = Alert.alert.mock.calls[0][2][1];
    act(() => {
      noButton.onPress();
    });
    expect(result.current.exitAlert).toBe(false);
  });

  it('should clean up on unmount', () => {
    const {unmount} = renderHook(() => useBackHandler(navigationMock));

    // Call unmount to trigger the cleanup function
    unmount();

    // Check if the remove method was called correctly
    const removeMethod =
      BackHandler.addEventListener.mock.results[0].value.remove;
    expect(removeMethod).toHaveBeenCalled();
  });
});
