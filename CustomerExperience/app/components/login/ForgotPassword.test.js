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
    const emailInput = getByTestId('emailTextField');
    const accessCodeInput = getByTestId('companyCodeTextField');

    expect(emailInput).toBeTruthy();
    expect(accessCodeInput).toBeTruthy();
  });

  it('shows loading spinner on reset password button when isLoading is true', () => {
    store = mockStore({global: {...initialState.global, isLoading: true}});
    const {getByTestId} = renderComponent();
    expect(getByTestId('QPSpinner')).toBeTruthy();
  });
});
