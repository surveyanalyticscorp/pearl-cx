import React from 'react';
import {renderHook} from '@testing-library/react-hooks';
import {useLoginError} from './useLoginError';
import {useDispatch} from 'react-redux';
import {clearUserInfo} from '../../../redux/actions';
import {showErrorFlashMessage} from '../../../Utils/Utility';
import {getApiValidationErrorMessage} from '../../../Utils/ErrorValidationUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {act} from '@testing-library/react-hooks';

// Mock useDispatch
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
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock getApiValidationErrorMessage
jest.mock('../../../Utils/ErrorValidationUtils', () => ({
  getApiValidationErrorMessage: jest.fn(),
}));

describe('useLoginError', () => {
  const mockDispatch = jest.fn();
  const mockClearUserInfo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    useDispatch.mockReturnValue(mockDispatch);
    clearUserInfo.mockReturnValue(mockClearUserInfo);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should not do anything when isError is false', () => {
    // Arrange
    const isError = false;
    const errorMessage = 'Some error';

    // Act
    renderHook(() => useLoginError(isError, errorMessage));

    // Assert
    expect(showErrorFlashMessage).not.toHaveBeenCalled();
    expect(AsyncStorage.clear).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(getApiValidationErrorMessage).not.toHaveBeenCalled();
  });

  it('should show custom error message when login error is detected', async () => {
    // Arrange
    const isError = true;
    const errorMessage = 'Some error';
    const loginError = 'Invalid email/password combination.';
    const customErrorMessage = 'Invalid credentials. Please try again';

    getApiValidationErrorMessage.mockReturnValue(loginError);

    // Act
    renderHook(() => useLoginError(isError, errorMessage));

    // Assert
    expect(getApiValidationErrorMessage).toHaveBeenCalledWith(errorMessage, 'login');
    expect(showErrorFlashMessage).toHaveBeenCalledWith(customErrorMessage);

    // Fast forward timer to trigger timeout
    await act(async () => {
      jest.advanceTimersByTime(1000);
      await Promise.resolve(); // Allow AsyncStorage.clear promise to resolve
    });

    expect(AsyncStorage.clear).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(mockClearUserInfo);
  });

  it('should show original error message when not login error', async () => {
    // Arrange
    const isError = true;
    const errorMessage = 'Network error';
    const validationMessage = 'Network connection failed';

    getApiValidationErrorMessage.mockReturnValue(validationMessage);

    // Act
    renderHook(() => useLoginError(isError, errorMessage));

    // Assert
    expect(getApiValidationErrorMessage).toHaveBeenCalledWith(errorMessage, 'login');
    expect(showErrorFlashMessage).toHaveBeenCalledWith(validationMessage);

    // Fast forward timer to trigger timeout
    await act(async () => {
      jest.advanceTimersByTime(1000);
      await Promise.resolve(); // Allow AsyncStorage.clear promise to resolve
    });

    expect(AsyncStorage.clear).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(mockClearUserInfo);
  });

  it('should handle AsyncStorage.clear rejection gracefully', async () => {
    // Arrange
    const isError = true;
    const errorMessage = 'Some error';
    const validationMessage = 'Error message';
    
    getApiValidationErrorMessage.mockReturnValue(validationMessage);
    AsyncStorage.clear.mockRejectedValue(new Error('AsyncStorage error'));

    // Act
    renderHook(() => useLoginError(isError, errorMessage));

    // Assert
    expect(showErrorFlashMessage).toHaveBeenCalledWith(validationMessage);

    // Fast forward timer to trigger timeout
    await act(async () => {
      jest.advanceTimersByTime(1000);
      await Promise.resolve();
    });

    expect(AsyncStorage.clear).toHaveBeenCalled();
    // clearUserInfo should still be called even if AsyncStorage.clear fails
    expect(mockDispatch).toHaveBeenCalledWith(mockClearUserInfo);
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
    expect(getApiValidationErrorMessage).toHaveBeenCalledWith('New error message', 'login');
    expect(showErrorFlashMessage).toHaveBeenCalledWith('New error');
  });

  it('should handle empty error message', () => {
    // Arrange
    const isError = true;
    const errorMessage = '';
    
    getApiValidationErrorMessage.mockReturnValue('');

    // Act
    renderHook(() => useLoginError(isError, errorMessage));

    // Assert
    expect(getApiValidationErrorMessage).toHaveBeenCalledWith('', 'login');
    expect(showErrorFlashMessage).toHaveBeenCalledWith('');
  });
});
