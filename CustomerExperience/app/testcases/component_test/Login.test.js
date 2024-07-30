import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import createSagaMiddleware from 'redux-saga';
import {runSaga} from 'redux-saga';
import {expectSaga} from 'redux-saga-test-plan';
import Login from './Login'; // Adjust the path as necessary
import * as actions from '../../redux/actions/login.actions';
import rootSaga from '../../redux/sagas'; // Import your root saga

// Initialize the mock store with saga middleware
const sagaMiddleware = createSagaMiddleware();
const mockStore = configureStore([sagaMiddleware]);

const initialState = {
  global: {
    isLoading: false,
    isError: false,
    errorMessage: {},
    dynamicLink: '',
    dataCenter: '',
    baseUrl: '',
    clfBaseUrl: '',
    subscriberId: '',
    userInfo: {
      emailAddress: 'test@example.com',
      userID: 'user123',
      feedbackID: 'feedback123',
      feedbackApiKey: 'key123',
    },
    accessCode: '',
  },
};

describe('Login Component with Redux-Saga', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    sagaMiddleware.run(rootSaga); // Run the root saga
  });

  it('should render the login screen', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <Login />
      </Provider>,
    );
    expect(getByTestId('emailTextField')).toBeTruthy();
    expect(getByTestId('passwordTextField')).toBeTruthy();
    expect(getByTestId('companyCodeTextField')).toBeTruthy();
    expect(getByTestId('SignInButton')).toBeTruthy();
  });

  it('should allow the user to input email, password, and access code', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <Login />
      </Provider>,
    );

    fireEvent.changeText(getByTestId('emailTextField'), 'user@example.com');
    fireEvent.changeText(getByTestId('passwordTextField'), 'password123');
    fireEvent.changeText(getByTestId('companyCodeTextField'), 'company123');

    expect(getByTestId('emailTextField').props.value).toBe('user@example.com');
    expect(getByTestId('passwordTextField').props.value).toBe('password123');
    expect(getByTestId('companyCodeTextField').props.value).toBe('company123');
  });

  it('should dispatch authenticatePanel action on Sign In button press', async () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <Login />
      </Provider>,
    );

    fireEvent.changeText(getByTestId('emailTextField'), 'user@example.com');
    fireEvent.changeText(getByTestId('passwordTextField'), 'password123');
    fireEvent.changeText(getByTestId('companyCodeTextField'), 'company123');

    fireEvent.press(getByTestId('SignInButton'));

    await waitFor(() => {
      const actionsDispatched = store.getActions();
      expect(actionsDispatched).toContainEqual(
        actions.authenticatePanel({accessCode: 'company123'}),
      );
    });
  });

  it('should show validation messages if email, password or access code are invalid', async () => {
    const {getByTestId, getByText} = render(
      <Provider store={store}>
        <Login />
      </Provider>,
    );

    fireEvent.changeText(getByTestId('emailTextField'), 'invalid-email');
    fireEvent.press(getByTestId('SignInButton'));

    await waitFor(() => {
      expect(getByText('Invalid email')).toBeTruthy();
    });
  });

  it('should navigate to Forgot Password screen on Forgot Password button press', () => {
    const mockNavigate = jest.fn();
    const {getByTestId} = render(
      <Provider store={store}>
        <Login navigation={{navigate: mockNavigate}} />
      </Provider>,
    );

    fireEvent.press(getByTestId('forgotPasswordButton'));

    expect(mockNavigate).toHaveBeenCalledWith('ForgotPassword', {
      email: '',
      accessCode: '',
    });
  });

  it('should handle saga effects on authenticatePanel action', async () => {
    const action = actions.authenticatePanel({accessCode: 'company123'});

    return expectSaga(rootSaga)
      .withReducer((state = initialState, action) => state)
      .put(actions.clearError())
      .dispatch(action)
      .run();
  });
});
