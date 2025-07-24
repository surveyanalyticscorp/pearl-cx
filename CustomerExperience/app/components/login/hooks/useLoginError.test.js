import React from 'react';
import {renderHook} from '@testing-library/react-hooks';
import {useLoginError} from './useLoginError';
import {useDispatch} from 'react-redux';
import {clearUserInfo} from '../../../redux/actions';
import {showErrorFlashMessage} from '../../../Utils/Utility';
import {getApiValidationErrorMessage} from '../../../Utils/ErrorValidationUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
jest.mock('../Login', () => ({
  getApiValidationErrorMessage: jest.fn(message => message),
}));

describe('useLoginError', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
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
  });

  it('should call showErrorFlashMessage and AsyncStorage.clear when isError is true and errorMessage is not empty', async () => {
    // Arrange
    const isError = true;
    const errorMessage = 'Some error';

    // Act
    renderHook(() => useLoginError(isError, errorMessage));

    // Wait for AsyncStorage.clear() Promise to resolve
    await Promise.resolve();

    // Assert
    expect(showErrorFlashMessage).toHaveBeenCalledWith(errorMessage);
    expect(AsyncStorage.clear).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(clearUserInfo());
  });
});
