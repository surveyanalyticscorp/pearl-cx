import React from 'react';
import {renderHook, act} from '@testing-library/react-hooks';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import useForgotPasswordProcess from './useForgotPasswordProcess';
import {showErrorFlashMessage} from '../../../../Utils/Utility';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {requestPasswordLink} from '../../../../redux/actions/login.actions';
import {setUserDetailsForResetPassword} from '../../../../redux/actions';

jest.mock('../../../../Utils/Utility', () => ({
  showErrorFlashMessage: jest.fn(),
  isStringNullOrEmpty: jest.fn(val => !val),
  validateEmail: jest.fn(email => email.includes('@')),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../../../redux/actions/login.actions', () => ({
  requestPasswordLink: jest.fn(),
}));

jest.mock('../../../../redux/actions', () => ({
  setUserDetailsForResetPassword: jest.fn(body => body),
}));

describe('useForgotPasswordProcess', () => {
  const mockStore = configureStore([]);
  let store;

  beforeEach(() => {
    store = mockStore({
      global: {
        isError: false,
        errorMessage: null,
      },
    });
    jest.clearAllMocks();
  });

  it('should dispatch actions when input is valid', () => {
    const validData = {email: 'test@example.com', accessCode: '1234'};

    const wrapper = ({children}) => (
      <Provider store={store}>{children}</Provider>
    );
    const {result} = renderHook(() => useForgotPasswordProcess(validData), {
      wrapper,
    });

    act(() => {
      result.current.onResetPasswordClick();
    });

    // Expect no error message
    expect(showErrorFlashMessage).not.toHaveBeenCalled();

    // Expect Redux actions
    expect(setUserDetailsForResetPassword).toHaveBeenCalledWith({
      emailAddress: 'test@example.com',
      accessCode: '1234',
    });
    expect(requestPasswordLink).toHaveBeenCalledWith({
      emailAddress: 'test@example.com',
      accessCode: '1234',
    });

    // Expect AsyncStorage was updated
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'ASYNC_RESET_CREDENTIALS',
      JSON.stringify({
        emailAddress: 'test@example.com',
        accessCode: '1234',
      }),
    );
  });

  it('should show error message and not dispatch when input is invalid', () => {
    const invalidData = {email: 'invalid-email', accessCode: ''};

    const wrapper = ({children}) => (
      <Provider store={store}>{children}</Provider>
    );
    const {result} = renderHook(() => useForgotPasswordProcess(invalidData), {
      wrapper,
    });

    act(() => {
      result.current.onResetPasswordClick();
    });

    // Expect error flash message for invalid data
    expect(showErrorFlashMessage).toHaveBeenCalledTimes(1);

    // Redux actions should not be dispatched
    expect(setUserDetailsForResetPassword).not.toHaveBeenCalled();
    expect(requestPasswordLink).not.toHaveBeenCalled();

    // AsyncStorage should not be called
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('should show error flash message if isError is true', () => {
    // Setup store so that isError is true
    store = mockStore({
      global: {
        isError: true,
        errorMessage: {message: 'Test error'},
      },
    });

    const validData = {email: 'test@example.com', accessCode: '1234'};
    const wrapper = ({children}) => (
      <Provider store={store}>{children}</Provider>
    );

    renderHook(() => useForgotPasswordProcess(validData), {wrapper});

    // Check that the error flash message was called on mount
    expect(showErrorFlashMessage).toHaveBeenCalledWith('Test error');
  });
});
