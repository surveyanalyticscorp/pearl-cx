import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import ResetPassword from './ResetPassword';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  showErrorFlashMessage,
  showSuccessFlashMessage,
} from '../../Utils/Utility';

jest.mock('../../Utils/Utility', () => ({
  ...jest.requireActual('../../Utils/Utility'),
  showErrorFlashMessage: jest.fn(),
  showSuccessFlashMessage: jest.fn(),
}));

jest.mock('../../Utils/MultilinguaUtils', () => ({
  translate: jest.fn().mockImplementation(key => key),
}));

const mockStore = configureStore([]);

describe('ResetPassword Component', () => {
  let store;
  let initialState;
  let props;

  beforeEach(() => {
    initialState = {
      global: {
        isLoading: false,
        isError: false,
        errorMessage: '',
        updatePasswordResponse: {},
      },
    };
    store = mockStore(initialState);
    props = {
      route: {
        params: {
          email: 'test@example.com',
          accessCode: '12345',
        },
      },
      navigation: {navigate: jest.fn()},
    };
  });

  const renderComponent = () =>
    render(
      <SafeAreaProvider>
        <Provider store={store}>
          <ResetPassword {...props} />
        </Provider>
      </SafeAreaProvider>,
    );

  it('renders password and confirm password fields with default values', () => {
    const {getByTestId} = renderComponent();
    expect(getByTestId('password-input').props.value).toBe('');
    expect(getByTestId('confirm-password-input').props.value).toBe('');
  });

  it('shows loading spinner on update password button when isLoading is true', () => {
    store = mockStore({global: {...initialState.global, isLoading: true}});
    const {getByTestId} = renderComponent();
    expect(getByTestId('QPSpinner')).toBeTruthy();
  });

  it('calls showErrorFlashMessage when validation error occurs on empty password', () => {
    const {getByTestId} = renderComponent();
    fireEvent.press(getByTestId('SignInButton'));

    expect(showErrorFlashMessage).toHaveBeenCalledWith(
      'onBoarding.invalidPassword',
    );
  });

  it('calls showErrorFlashMessage when passwords do not match', () => {
    const {getByTestId} = renderComponent();
    fireEvent.changeText(getByTestId('password-input'), 'Password123');
    fireEvent.changeText(getByTestId('confirm-password-input'), 'Mismatch123');
    fireEvent.press(getByTestId('SignInButton'));

    expect(showErrorFlashMessage).toHaveBeenCalledWith(
      'onBoarding.passwordNotMatching',
    );
  });

  it('calls updatePassword action with correct data on valid input', async () => {
    const {getByTestId} = renderComponent();

    fireEvent.changeText(getByTestId('password-input'), 'Password123');
    fireEvent.changeText(getByTestId('confirm-password-input'), 'Password123');
    fireEvent.press(getByTestId('SignInButton'));

    await waitFor(() => {
      expect(store.getActions()).toContainEqual(
        expect.objectContaining({
          type: 'UPDATE_PASSWORD',
          param: {
            emailAddress: 'test@example.com',
            accessCode: '12345',
            password: 'Password123',
          },
        }),
      );
    });
  });

  it('displays success message and navigates to login on successful password update', async () => {
    store = mockStore({
      global: {
        ...initialState.global,
        updatePasswordResponse: {
          body: {message: 'Password updated successfully'},
        },
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(showSuccessFlashMessage).toHaveBeenCalledWith(
        'Password updated successfully',
      );
      expect(props.navigation.navigate).toHaveBeenCalledWith('Login');
    });
  });

  it('updates password and confirm password state on input change', () => {
    const {getByTestId} = renderComponent();

    fireEvent.changeText(getByTestId('password-input'), 'Password123');
    fireEvent.changeText(getByTestId('confirm-password-input'), 'Password123');

    expect(getByTestId('password-input').props.value).toBe('Password123');
    expect(getByTestId('confirm-password-input').props.value).toBe(
      'Password123',
    );
  });
});
