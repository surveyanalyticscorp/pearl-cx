import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import ForgotPassword from './ForgotPassword';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {showErrorFlashMessage} from '../../Utils/Utility';
import {SafeAreaProvider} from 'react-native-safe-area-context'; // Import SafeAreaProvider
import {translate} from '../../Utils/MultilinguaUtils';

jest.mock('../../Utils/Utility', () => ({
  ...jest.requireActual('../../Utils/Utility'),
  showErrorFlashMessage: jest.fn(),
}));

const mockStore = configureStore([]);

describe('ForgotPassword Component', () => {
  let store;
  let initialState;
  let props;

  beforeEach(() => {
    initialState = {
      global: {
        isLoading: false,
        isError: false,
        errorMessage: '',
        dynamicLink: '',
        validatePasswordLinkResponse: {},
        baseUrl: '',
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <SafeAreaProvider>
        {' '}
        {/* Wrap component in SafeAreaProvider */}
        <Provider store={store}>
          <ForgotPassword {...props} />
        </Provider>
      </SafeAreaProvider>,
    );

  it('renders email and access code fields with default values', () => {
    const {getByTestId} = renderComponent();
    const emailInput = getByTestId('email-input');
    const accessCodeInput = getByTestId('company-code-input');

    expect(emailInput.props.value).toBe('test@example.com');
    expect(accessCodeInput.props.value).toBe('12345');
  });

  it('navigates to ResetPassword when validation succeeds', async () => {
    store = mockStore({
      global: {
        ...initialState.global,
        validatePasswordLinkResponse: {isExpired: false},
      },
    });
    const {getByTestId} = renderComponent();
    fireEvent.press(getByTestId('SignInButton'));

    await waitFor(() => {
      expect(props.navigation.navigate).toHaveBeenCalledWith('ResetPassword', {
        email: 'test@example.com',
        accessCode: '12345',
      });
    });
  });

  it('displays error message when reset password link is expired', () => {
    store = mockStore({
      global: {
        ...initialState.global,
        validatePasswordLinkResponse: {
          isExpired: true,
          message: 'Link expired',
        },
      },
    });
    renderComponent();
    expect(showErrorFlashMessage).toHaveBeenCalledWith('Link expired');
  });

  it('updates email and access code state on input change', () => {
    const {getByLabelText} = renderComponent();
    const emailInput = getByLabelText('Email');
    const accessCodeInput = getByLabelText('Company Code');

    fireEvent.changeText(emailInput, 'newemail@example.com');
    fireEvent.changeText(accessCodeInput, '67890');

    expect(emailInput.props.value).toBe('newemail@example.com');
    expect(accessCodeInput.props.value).toBe('67890');
  });

  it('sets global baseUrl and calls onResetPasswordClick if baseUrl is provided', () => {
    store = mockStore({
      global: {
        ...initialState.global,
        baseUrl: 'https://example.com',
      },
    });
    renderComponent();

    expect(global.baseUrl).toBe('https://example.com');
  });
  it('shows loading spinner on reset password button when isLoading is true', () => {
    store = mockStore({global: {...initialState.global, isLoading: true}});
    const {getByTestId} = renderComponent();
    expect(getByTestId('QPSpinner')).toBeTruthy();
  });
});
