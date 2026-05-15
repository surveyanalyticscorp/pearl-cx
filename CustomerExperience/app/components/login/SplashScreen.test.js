import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import SplashScreen from './SplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ASYNC_AUTH_TOKEN,
  ASYNC_LOGGED_IN_ALREADY,
  ASYNC_USER_INFO,
  BASE_URL,
  ASYNC_CLF_BASE_URL,
  ASYNC_BEARER_TOKEN,
  ASYNC_LOGIN_EXPIRE_DATE,
} from '../../api/Constant';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {sendAnalyticsEvent} from '../../Utils/AnalyticLogs';
import useLogoutProcess from '../../routes/drawerContent/useLogoutProcess';
import moment from 'moment';
import {DASHBOARD_RANGE} from '../../redux/actions/dashboard.actions';

jest.mock('../../Utils/AnalyticLogs');
jest.mock('../../routes/drawerContent/useLogoutProcess');
jest.mock('../../config/images/background1.png', () => 'background1.png');
jest.mock('../../config/images/cx-logo.png', () => 'cx-logo.png');
jest.mock('../../routes/appRouter', () => () => null);

const mockStore = configureStore([]);

describe('SplashScreen', () => {
  let store;
  let dispatch;

  beforeEach(() => {
    store = mockStore({});
    dispatch = jest.spyOn(store, 'dispatch');
    AsyncStorage.getItem.mockClear();
    AsyncStorage.multiGet.mockClear();
    sendAnalyticsEvent.mockClear();
    useLogoutProcess.mockReturnValue({logoutAction: jest.fn()});
    // Reset global variables before each test
    global.baseUrl = undefined;
    global.clfBaseUrl = undefined;
    global.bearerToken = undefined;
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <SplashScreen />
      </Provider>,
    );

  it('renders the splash screen background and logo initially', () => {
    AsyncStorage.getItem.mockResolvedValue(null);
    AsyncStorage.multiGet.mockResolvedValue([]);
    const {getByTestId} = renderComponent();
    expect(getByTestId('splash-background')).toBeTruthy();
    expect(sendAnalyticsEvent).toHaveBeenCalledWith(
      'APP_OPEN',
      expect.objectContaining({screen: 'SPLASH_SCREEN'}),
    );
  });

  it('navigates to AppRouter after the timeout and AsyncStorage calls', async () => {
    const mockToken = 'mockToken';
    AsyncStorage.getItem.mockResolvedValue(null);
    AsyncStorage.multiGet.mockResolvedValue([
      [ASYNC_AUTH_TOKEN, mockToken],
      [ASYNC_USER_INFO, JSON.stringify({id: 1, language: 'en'})],
      [DASHBOARD_RANGE, JSON.stringify({startDate: '2023-01-01'})],
      [ASYNC_LOGGED_IN_ALREADY, 'true'],
    ]);

    renderComponent();

    await waitFor(
      () => {
        expect(dispatch).toHaveBeenCalledWith({
          payload: {authToken: mockToken},
          type: 'SET_AUTH_TOKEN',
        });
      },
      {timeout: 2000},
    );
  });

  it('calls logoutAction if the login expire date is invalid', async () => {
    const mockLogoutAction = jest.fn();
    useLogoutProcess.mockReturnValue({logoutAction: mockLogoutAction});

    AsyncStorage.getItem.mockImplementation(key => {
      if (key === ASYNC_LOGIN_EXPIRE_DATE) {
        return Promise.resolve(moment().subtract(1, 'day').toISOString());
      }
      return Promise.resolve(null);
    });
    AsyncStorage.multiGet.mockResolvedValue([]);

    renderComponent();

    await waitFor(() => {
      expect(mockLogoutAction).toHaveBeenCalled();
    });
  });

  it('sets the global base URL if it exists in AsyncStorage', async () => {
    const mockBaseUrl = 'https://api.example.com';
    AsyncStorage.getItem.mockImplementation(key => {
      if (key === ASYNC_LOGIN_EXPIRE_DATE) {
        return Promise.resolve(moment().add(1, 'day').toISOString());
      }
      if (key === BASE_URL) {
        return Promise.resolve(mockBaseUrl);
      }
      return Promise.resolve(null);
    });
    AsyncStorage.multiGet.mockResolvedValue([
      [ASYNC_AUTH_TOKEN, 'mockToken'],
      [ASYNC_USER_INFO, JSON.stringify({id: 1, language: 'en'})],
      [DASHBOARD_RANGE, JSON.stringify({startDate: '2023-01-01'})],
      [ASYNC_LOGGED_IN_ALREADY, 'true'],
    ]);

    renderComponent();

    await waitFor(
      () => {
        expect(global.baseUrl).toBe(mockBaseUrl);
      },
      {timeout: 2000},
    );
  });

  it('sets the global clf base URL if it exists in AsyncStorage', async () => {
    const mockClfBaseUrl = 'https://clf.example.com';
    AsyncStorage.getItem.mockImplementation(key => {
      if (key === ASYNC_LOGIN_EXPIRE_DATE) {
        return Promise.resolve(moment().add(1, 'day').toISOString());
      }
      if (key === ASYNC_CLF_BASE_URL) {
        return Promise.resolve(mockClfBaseUrl);
      }
      return Promise.resolve(null);
    });
    AsyncStorage.multiGet.mockResolvedValue([
      [ASYNC_AUTH_TOKEN, 'mockToken'],
      [ASYNC_USER_INFO, JSON.stringify({id: 1, language: 'en'})],
      [DASHBOARD_RANGE, JSON.stringify({startDate: '2023-01-01'})],
      [ASYNC_LOGGED_IN_ALREADY, 'true'],
    ]);

    renderComponent();

    await waitFor(
      () => {
        expect(global.clfBaseUrl).toBe(mockClfBaseUrl);
      },
      {timeout: 2000},
    );
  });

  it('sets the bearer token if it exists in AsyncStorage', async () => {
    const mockBearerToken = 'mockBearer';
    AsyncStorage.getItem.mockImplementation(key => {
      if (key === ASYNC_LOGIN_EXPIRE_DATE) {
        return Promise.resolve(moment().add(1, 'day').toISOString());
      }
      if (key === ASYNC_BEARER_TOKEN) {
        return Promise.resolve(mockBearerToken);
      }
      return Promise.resolve(null);
    });
    AsyncStorage.multiGet.mockResolvedValue([
      [ASYNC_AUTH_TOKEN, 'mockToken'],
      [ASYNC_USER_INFO, JSON.stringify({id: 1, language: 'en'})],
      [DASHBOARD_RANGE, JSON.stringify({startDate: '2023-01-01'})],
      [ASYNC_LOGGED_IN_ALREADY, 'true'],
    ]);

    renderComponent();

    await waitFor(
      () => {
        expect(global.bearerToken).toBe(mockBearerToken);
      },
      {timeout: 2000},
    );
  });

  it('sets isFirstTime to true if loggedInAlready is not "true"', async () => {
    AsyncStorage.getItem.mockImplementation(key => {
      if (key === ASYNC_LOGIN_EXPIRE_DATE) {
        return Promise.resolve(moment().add(1, 'day').toISOString());
      }
      return Promise.resolve(null);
    });
    AsyncStorage.multiGet.mockResolvedValue([
      [ASYNC_AUTH_TOKEN, 'mockToken'],
      [ASYNC_USER_INFO, JSON.stringify({id: 1, language: 'en'})],
      [DASHBOARD_RANGE, JSON.stringify({startDate: '2023-01-01'})],
      [ASYNC_LOGGED_IN_ALREADY, 'false'],
    ]);

    renderComponent();

    await waitFor(
      () => {
        const calls = dispatch.mock.calls;

        expect(calls).toContainEqual([
          {
            isFirstTime: true,
            type: 'SET_IS_FIRST_TIME',
          },
        ]);
      },
      {timeout: 2000},
    );
  });

  it('clears the timeout on unmount', () => {
    const {unmount} = renderComponent();
    unmount();
  });
});
