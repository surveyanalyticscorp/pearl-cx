// write test cases for Login.js
// wrap the component in Provider to test the connected component
import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';

import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Login from './Login';

const mockStore = configureStore([]);
const mockNavigate = jest.fn();

// Mock react-navigation navigation prop
const createTestProps = props => ({
  navigation: {
    navigate: mockNavigate,
  },
  ...props,
});

describe('Login Component', () => {
  let store;
  let props;

  beforeEach(() => {
    store = mockStore({
      global: {
        isLoading: false,
        isError: false,
        errorMessage: '',
        dynamicLink: '',
        validatePasswordLinkResponse: {},
        dataCenter: 'US',
        baseUrl: 'https://cxlabs.questionpro.com/a/nativehtml',
        clfBaseUrl: 'https://clfqa-backend.questionpro.com/api/',
        subscriberId: 1,
        userInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          organizationName: 'OpenAI',
        },
        accessCode: 'test',
      },
      login: {
        accessCode: '',
        userInfo: {},
        subscriberId: '',
        isTokenExpired: false,
        expirationDate: '',
        isCsatViewTopBox: true,
        skipWelcome: false,
      },
      dashboard: {
        currentSegment: {},
        currentFeedback: {},
        ticketFilter: {},
        ticket: {},
        ticketComments: [],
        ticketActivity: [],
        ticketSync: true,
        apiCallStatus: {},
        welcomeScreenData: {},
        emailData: {emailSentResponse: {}},
        mediaFileList: [],
        ticketDeleteStatus: {status: 'default'},
        ticketActionHistory: {summary: {}, details: {}},
        parentComment: {id: 0, isFocused: false},
        currentStatusIndexForFilter: 0,
        isTokenExpired: false,
        expirationDate: '',
        isCsatViewTopBox: true,
        skipWelcome: false,
      },
    });
    props = createTestProps({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  const renderComponent = () =>
    render(
      <SafeAreaProvider>
        <Provider store={store}>
          <Login {...props} />
        </Provider>
      </SafeAreaProvider>,
    );
  it('renders the Login component correctly', () => {
    const {getByTestId} = renderComponent();
    expect(getByTestId('login-container')).toBeTruthy();
  });
  it('updates email input correctly', () => {
    const {getByTestId} = renderComponent();
    const emailInput = getByTestId('emailTextField');
    fireEvent.changeText(emailInput, 'newemail@example.com');
    expect(emailInput.props.value).toBe('newemail@example.com');
  });

  it('shows loading spinner when isLoading is true', () => {
    store = mockStore({global: {...store.getState().global, isLoading: true}});
    const {getByTestId} = renderComponent();
    expect(getByTestId('QPSpinner')).toBeTruthy();
  });

  // create mock navigation object

  it('navigates to forgot password screen when Forgot password? is pressed', () => {
    const {getByText} = renderComponent();
    fireEvent.press(getByText('Forgot password?'));
    expect(mockNavigate).toHaveBeenCalledWith('ForgotPassword', {
      email: '',
      accessCode: '',
    });
  });
  // it('triggers forgot password navigation', () => {
  //   const {getByText} = renderComponent();
  //   fireEvent.press(getByText('Forgot password?'));
  //   expect(store.dispatch).toHaveBeenCalledWith(
  //     navigate('ForgotPassword', {email: '', accessCode: ''}),
  //   );
  // });
});
