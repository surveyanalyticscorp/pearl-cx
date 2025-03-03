// import React from 'react';
// import {render, fireEvent} from '@testing-library/react-native';

// import {Provider} from 'react-redux';
// import configureStore from 'redux-mock-store';
// import {SafeAreaProvider} from 'react-native-safe-area-context';
// import Login from './Login';

// const mockStore = configureStore([]);
// const mockNavigate = jest.fn();

// // Mock react-navigation navigation prop
// const createTestProps = props => ({
//   navigation: {
//     navigate: mockNavigate,
//   },
//   ...props,
// });

// describe('Login Component', () => {
//   let store;
//   let props;

//   beforeEach(() => {
//     store = mockStore({
//       global: {
//         isLoading: false,
//         isError: false,
//         errorMessage: '',
//         dynamicLink: '',
//         validatePasswordLinkResponse: {},
//         dataCenter: 'US',
//         baseUrl: 'https://cxlabs.questionpro.com/a/nativehtml',
//         clfBaseUrl: 'https://clfqa-backend.questionpro.com/api/',
//         subscriberId: 1,
//         userInfo: {
//           firstName: 'John',
//           lastName: 'Doe',
//           email: 'john@example.com',
//           phone: '1234567890',
//           organizationName: 'OpenAI',
//         },
//         accessCode: 'test',
//       },
//       login: {
//         accessCode: '',
//         userInfo: {},
//         subscriberId: '',
//         isTokenExpired: false,
//         expirationDate: '',
//         isCsatViewTopBox: true,
//         skipWelcome: false,
//       },
//       dashboard: {
//         currentSegment: {},
//         currentFeedback: {},
//         ticketFilter: {},
//         ticket: {},
//         ticketComments: [],
//         ticketActivity: [],
//         ticketSync: true,
//         apiCallStatus: {},
//         welcomeScreenData: {},
//         emailData: {emailSentResponse: {}},
//         mediaFileList: [],
//         ticketDeleteStatus: {status: 'default'},
//         ticketActionHistory: {summary: {}, details: {}},
//         parentComment: {id: 0, isFocused: false},
//         currentStatusIndexForFilter: 0,
//         isTokenExpired: false,
//         expirationDate: '',
//         isCsatViewTopBox: true,
//         skipWelcome: false,
//       },
//     });
//     props = createTestProps({});
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });
//   const renderComponent = () =>
//     render(
//       <SafeAreaProvider>
//         <Provider store={store}>
//           <Login {...props} />
//         </Provider>
//       </SafeAreaProvider>,
//     );
//   it('renders the Login component correctly', () => {
//     const {getByTestId} = renderComponent();
//     expect(getByTestId('login-container')).toBeTruthy();
//   });
//   it('updates email input correctly', () => {
//     const {getByTestId} = renderComponent();
//     const emailInput = getByTestId('emailTextField');
//     fireEvent.changeText(emailInput, 'newemail@example.com');
//     expect(emailInput.props.value).toBe('newemail@example.com');
//   });

//   it('shows loading spinner when isLoading is true', () => {
//     store = mockStore({global: {...store.getState().global, isLoading: true}});
//     const {getByTestId} = renderComponent();
//     expect(getByTestId('QPSpinner')).toBeTruthy();
//   });

//   // create mock navigation object

//   it('navigates to forgot password screen when Forgot password? is pressed', () => {
//     const {getByText} = renderComponent();
//     fireEvent.press(getByText('Forgot password?'));
//     expect(mockNavigate).toHaveBeenCalledWith('ForgotPassword', {
//       email: '',
//       accessCode: '',
//     });
//   });
//   // it('triggers forgot password navigation', () => {
//   //   const {getByText} = renderComponent();
//   //   fireEvent.press(getByText('Forgot password?'));
//   //   expect(store.dispatch).toHaveBeenCalledWith(
//   //     navigate('ForgotPassword', {email: '', accessCode: ''}),
//   //   );
//   // });
// });

import React from 'react';
import {render, fireEvent, act} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import Login from './Login';
import {authenticatePanel, doLogin} from '../../redux/actions/login.actions';

// Create a mock Redux store
const mockStore = configureStore([]);

describe('Login Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      global: {
        isLoading: false,
        isError: false,
        errorMessage: null,
        baseUrl: '',
        accessCode: '',
      },
    });

    store.dispatch = jest.fn(); // Mock dispatch function
  });

  it('renders Login component correctly', () => {
    const {getByPlaceholderText, getByTestId} = render(
      <Provider store={store}>
        <Login />
      </Provider>,
    );

    expect(getByPlaceholderText('Enter email')).toBeTruthy();
    expect(getByPlaceholderText('Enter password')).toBeTruthy();
    expect(getByPlaceholderText('Enter access code')).toBeTruthy();
    expect(getByTestId('SignInButton')).toBeTruthy();
  });

  it('updates email, password, and access code input fields', () => {
    const {getByPlaceholderText} = render(
      <Provider store={store}>
        <Login />
      </Provider>,
    );

    const emailInput = getByPlaceholderText('Enter email');
    const passwordInput = getByPlaceholderText('Enter password');
    const accessCodeInput = getByPlaceholderText('Enter access code');

    act(() => {
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.changeText(accessCodeInput, 'ABC123');
    });

    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
    expect(accessCodeInput.props.value).toBe('ABC123');
  });

  it('calls onPress function when SignIn button is pressed', () => {
    const {getByTestId, getByPlaceholderText} = render(
      <Provider store={store}>
        <Login />
      </Provider>,
    );

    const emailInput = getByPlaceholderText('Enter email');
    const passwordInput = getByPlaceholderText('Enter password');
    const accessCodeInput = getByPlaceholderText('Enter access code');
    const signInButton = getByTestId('SignInButton');

    act(() => {
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.changeText(accessCodeInput, 'ABC123');
      fireEvent.press(signInButton);
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      authenticatePanel({accessCode: 'ABC123'}),
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      doLogin({
        accessCode: 'ABC123',
        emailAddress: 'test@example.com',
        password: 'password123',
        platform: 'ios',
        sourceMode: 'email',
        udId: expect.any(String),
        pushToken: expect.any(String),
        dataCenter: undefined,
      }),
    );
  });

  it('renders Forgot Password button and navigates on press', () => {
    const mockNavigation = jest.fn();
    jest.mock('@react-navigation/native', () => ({
      useNavigation: () => ({
        navigate: mockNavigation,
      }),
    }));

    const {getByText} = render(
      <Provider store={store}>
        <Login />
      </Provider>,
    );

    const forgotPasswordButton = getByText('Forgot Password');
    fireEvent.press(forgotPasswordButton);

    expect(mockNavigation).toHaveBeenCalledWith('ForgotPassword');
  });
});
