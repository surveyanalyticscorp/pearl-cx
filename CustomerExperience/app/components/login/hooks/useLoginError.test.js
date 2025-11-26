import {renderHook} from '@testing-library/react-hooks';
import {useLoginError} from './useLoginError';
import {useDispatch} from 'react-redux';
import {clearUserInfo} from '../../../redux/actions';
import {showErrorFlashMessage} from '../../../Utils/Utility';
import {getApiValidationErrorMessage} from '../../../Utils/ErrorValidationUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock all dependencies
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('../../../redux/actions', () => ({
  clearUserInfo: jest.fn(),
}));

jest.mock('../../../Utils/Utility', () => ({
  showErrorFlashMessage: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  clear: jest.fn(),
}));

jest.mock('../../../Utils/ErrorValidationUtils', () => ({
  getApiValidationErrorMessage: jest.fn(),
}));

describe('useLoginError', () => {
  let mockDispatch;
  let mockClearUserInfo;
  let mockTimeoutFn;
  let mockClearTimeoutFn;
  let mockConsoleError;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup basic mocks
    mockDispatch = jest.fn();
    mockClearUserInfo = jest.fn();
    mockTimeoutFn = jest.fn();
    mockClearTimeoutFn = jest.fn();

    useDispatch.mockReturnValue(mockDispatch);
    clearUserInfo.mockReturnValue(mockClearUserInfo);
    AsyncStorage.clear.mockResolvedValue();

    // Mock console.error to avoid noise in tests
    mockConsoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    mockConsoleError.mockRestore();
  });

  // Helper function to execute timeout callback
  const executeTimeoutCallback = timeoutFn => {
    const callback = timeoutFn.mock.calls[0][0];
    return callback();
  };

  it('should not do anything when isError is false', () => {
    // Arrange
    const isError = false;
    const errorMessage = 'Some error';
    mockTimeoutFn = jest.fn();
    mockClearTimeoutFn = jest.fn();

    // Act
    renderHook(() =>
      useLoginError(isError, errorMessage, {
        timeoutFn: mockTimeoutFn,
        clearTimeoutFn: mockClearTimeoutFn,
      }),
    );

    // Assert
    expect(showErrorFlashMessage).not.toHaveBeenCalled();
    expect(getApiValidationErrorMessage).not.toHaveBeenCalled();
    expect(mockTimeoutFn).not.toHaveBeenCalled();
  });

  it('should show custom error message for login errors and execute timeout', async () => {
    // Arrange
    const isError = true;
    const errorMessage = 'Some error';
    const loginError = 'Invalid email/password combination.';
    const customErrorMessage = 'Invalid credentials. Please try again';

    mockTimeoutFn = jest.fn(callback => {
      // Execute callback asynchronously to simulate real setTimeout
      setImmediate(callback);
      return 123;
    });
    mockClearTimeoutFn = jest.fn();

    getApiValidationErrorMessage.mockReturnValue(loginError);
    AsyncStorage.clear.mockResolvedValue();

    // Act
    renderHook(() =>
      useLoginError(isError, errorMessage, {
        timeoutFn: mockTimeoutFn,
        clearTimeoutFn: mockClearTimeoutFn,
        delay: 1000,
      }),
    );

    // Assert immediate effects
    expect(getApiValidationErrorMessage).toHaveBeenCalledWith(
      errorMessage,
      'login',
    );
    expect(showErrorFlashMessage).toHaveBeenCalledWith(customErrorMessage);
    expect(mockTimeoutFn).toHaveBeenCalledWith(expect.any(Function), 1000);

    // Wait for timeout callback to execute
    await new Promise(resolve => setImmediate(resolve));

    expect(AsyncStorage.clear).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(mockClearUserInfo);
  });

  it('should show original error message for non-login errors', async () => {
    // Arrange
    const isError = true;
    const errorMessage = 'Network error';
    const validationMessage = 'Network connection failed';

    mockTimeoutFn = jest.fn(callback => {
      setImmediate(callback);
      return 456;
    });

    getApiValidationErrorMessage.mockReturnValue(validationMessage);
    AsyncStorage.clear.mockResolvedValue();

    // Act
    renderHook(() =>
      useLoginError(isError, errorMessage, {
        timeoutFn: mockTimeoutFn,
        delay: 500,
      }),
    );

    // Assert immediate effects
    expect(getApiValidationErrorMessage).toHaveBeenCalledWith(
      errorMessage,
      'login',
    );
    expect(showErrorFlashMessage).toHaveBeenCalledWith(validationMessage);
    expect(mockTimeoutFn).toHaveBeenCalledWith(expect.any(Function), 500);

    // Wait for timeout callback
    await new Promise(resolve => setImmediate(resolve));

    expect(AsyncStorage.clear).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(mockClearUserInfo);
  });

  it('should handle empty error messages', () => {
    // Arrange
    const isError = true;
    const errorMessage = '';

    getApiValidationErrorMessage.mockReturnValue('Default error');

    // Act
    renderHook(() => useLoginError(isError, errorMessage));

    // Assert
    expect(getApiValidationErrorMessage).toHaveBeenCalledWith('', 'login');
    expect(showErrorFlashMessage).toHaveBeenCalledWith('Default error');
  });

  it('should react to changes in isError and errorMessage', () => {
    // Arrange & Act
    const {rerender} = renderHook(
      ({isError, errorMessage}) => useLoginError(isError, errorMessage),
      {
        initialProps: {isError: false, errorMessage: ''},
      },
    );

    // Assert initial state
    expect(showErrorFlashMessage).not.toHaveBeenCalled();

    // Act - rerender with error
    getApiValidationErrorMessage.mockReturnValue('New error');
    rerender({isError: true, errorMessage: 'New error message'});

    // Assert
    expect(getApiValidationErrorMessage).toHaveBeenCalledWith(
      'New error message',
      'login',
    );
    expect(showErrorFlashMessage).toHaveBeenCalledWith('New error');
  });

  it('should handle undefined error messages', () => {
    // Arrange
    const isError = true;
    const errorMessage = undefined;

    getApiValidationErrorMessage.mockReturnValue('Error');

    // Act
    renderHook(() => useLoginError(isError, errorMessage));

    // Assert
    expect(getApiValidationErrorMessage).toHaveBeenCalledWith(
      undefined,
      'login',
    );
    expect(showErrorFlashMessage).toHaveBeenCalledWith('Error');
  });

  it('should handle null error messages', () => {
    // Arrange
    const isError = true;
    const errorMessage = null;

    getApiValidationErrorMessage.mockReturnValue('Error');

    // Act
    renderHook(() => useLoginError(isError, errorMessage));

    // Assert
    expect(getApiValidationErrorMessage).toHaveBeenCalledWith(null, 'login');
    expect(showErrorFlashMessage).toHaveBeenCalledWith('Error');
  });

  it('should handle AsyncStorage error and still dispatch clearUserInfo', async () => {
    // Arrange
    const isError = true;
    const errorMessage = 'Some error';

    mockTimeoutFn = jest.fn(callback => {
      setImmediate(callback);
      return 789;
    });

    getApiValidationErrorMessage.mockReturnValue('Some error');
    AsyncStorage.clear.mockRejectedValue(new Error('AsyncStorage error'));

    // Act
    renderHook(() =>
      useLoginError(isError, errorMessage, {
        timeoutFn: mockTimeoutFn,
      }),
    );

    // Wait for timeout callback to execute
    await new Promise(resolve => setImmediate(resolve));

    // Assert
    expect(AsyncStorage.clear).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(mockClearUserInfo);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'AsyncStorage clear failed:',
      expect.any(Error),
    );
  });

  it('should cleanup timeout on unmount', () => {
    // Arrange
    const isError = true;
    const errorMessage = 'Some error';
    const timeoutId = 999;

    mockTimeoutFn = jest.fn(() => timeoutId);
    mockClearTimeoutFn = jest.fn();

    getApiValidationErrorMessage.mockReturnValue('Some error');

    // Act
    const {unmount} = renderHook(() =>
      useLoginError(isError, errorMessage, {
        timeoutFn: mockTimeoutFn,
        clearTimeoutFn: mockClearTimeoutFn,
      }),
    );

    expect(mockTimeoutFn).toHaveBeenCalled();
    expect(mockClearTimeoutFn).not.toHaveBeenCalled();

    // Unmount the hook
    unmount();

    // Assert cleanup was called
    expect(mockClearTimeoutFn).toHaveBeenCalledWith(timeoutId);
  });

  it('should cleanup timeout when dependencies change', () => {
    // Arrange
    let timeoutId = 111;
    mockTimeoutFn = jest.fn(() => ++timeoutId);
    mockClearTimeoutFn = jest.fn();

    getApiValidationErrorMessage.mockReturnValue('Error message');

    // Act - initial render
    const {rerender} = renderHook(
      ({errorMessage}) =>
        useLoginError(true, errorMessage, {
          timeoutFn: mockTimeoutFn,
          clearTimeoutFn: mockClearTimeoutFn,
        }),
      {initialProps: {errorMessage: 'First error'}},
    );

    expect(mockTimeoutFn).toHaveBeenCalledTimes(1);
    expect(mockClearTimeoutFn).not.toHaveBeenCalled();

    // Act - rerender with different error message
    rerender({errorMessage: 'Second error'});

    // Assert - previous timeout was cleared and new one was set
    expect(mockClearTimeoutFn).toHaveBeenCalledWith(112); // First timeout ID
    expect(mockTimeoutFn).toHaveBeenCalledTimes(2);
  });

  it('should handle null timeout ID in cleanup', () => {
    // Arrange
    const isError = true;
    const errorMessage = 'Some error';

    mockTimeoutFn = jest.fn(() => null); // Return null timeout ID
    mockClearTimeoutFn = jest.fn();

    getApiValidationErrorMessage.mockReturnValue('Some error');

    // Act
    const {unmount} = renderHook(() =>
      useLoginError(isError, errorMessage, {
        timeoutFn: mockTimeoutFn,
        clearTimeoutFn: mockClearTimeoutFn,
      }),
    );

    expect(mockTimeoutFn).toHaveBeenCalled();

    // Unmount the hook
    unmount();

    // Assert cleanup was not called for null timeout ID
    expect(mockClearTimeoutFn).not.toHaveBeenCalled();
  });
});
