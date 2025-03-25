import React from 'react';
import {render, act, waitFor} from '@testing-library/react-native';
import SplashScreen from './SplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {
  ASYNC_AUTH_TOKEN,
  ASYNC_BEARER_TOKEN,
  ASYNC_USER_INFO,
  DASHBOARD_RANGE,
  ASYNC_LOGGED_IN_ALREADY,
  ASYNC_LOGIN_EXPIRE_DATE,
} from '../../api/Constant';
import moment from 'moment';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  multiGet: jest.fn(),
}));

// Mock Firebase Analytics
jest.mock('@react-native-firebase/analytics', () => {
  return () => ({
    logEvent: jest.fn(),
  });
});

// Mock react-native-device-info
jest.mock('react-native-device-info', () => ({
  getVersion: jest.fn(() => '1.0.0'),
  getBuildNumber: jest.fn(() => '1'),
  isTablet: jest.fn(() => false),
  getApplicationName: jest.fn(() => 'TestApp'),
  getDeviceId: jest.fn(() => 'test-device-id'),
  bundleId: 'com.test.app',
}));

// Mock NativeModules
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.NativeModules.RNDeviceInfo = {
    bundleId: 'com.test.app',
  };
  return RN;
});

// Mock navigation
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    createNavigatorFactory: jest.fn(() => jest.fn()),
  };
});

jest.mock('@react-navigation/drawer', () => ({
  createDrawerNavigator: jest.fn(() => ({
    Navigator: jest.fn(),
    Screen: jest.fn(),
  })),
}));

// Mock AppRouter component
jest.mock('../../routes/appRouter', () => {
  const MockAppRouter = ({testID}) => (
    <div data-testid={testID}>Mock App Router</div>
  );
  return MockAppRouter;
});

// Mock useLogoutProcess
jest.mock('../../routes/drawerContent/useLogoutProcess', () => ({
  __esModule: true,
  default: () => ({
    logoutAction: jest.fn(),
  }),
}));

const mockStore = configureStore([]);

describe('SplashScreen Component', () => {
  let store;
  const initialState = {
    auth: {},
    user: {},
    dashboard: {},
  };

  beforeEach(() => {
    store = mockStore(initialState);
    jest.clearAllMocks();
    jest.useFakeTimers();
    global.baseUrl = undefined;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders splash screen initially', async () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <SplashScreen />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByTestId('splash-background')).toBeTruthy();
    });
  }, 10000);

  test('navigates to AppRouter after timeout when user is logged in', async () => {
    const mockUserInfo = {id: 1, name: 'Test User'};
    const mockToken = 'test-token';
    const mockBearerToken = 'test-bearer-token';
    const mockDashboardRange = {start: '2024-01-01', end: '2024-12-31'};

    AsyncStorage.multiGet.mockResolvedValue([
      [ASYNC_AUTH_TOKEN, mockToken],
      [ASYNC_USER_INFO, JSON.stringify(mockUserInfo)],
      [DASHBOARD_RANGE, JSON.stringify(mockDashboardRange)],
      [ASYNC_LOGGED_IN_ALREADY, 'true'],
    ]);

    AsyncStorage.getItem.mockImplementation(key => {
      if (key === ASYNC_BEARER_TOKEN) return Promise.resolve(mockBearerToken);
      if (key === ASYNC_LOGIN_EXPIRE_DATE)
        return Promise.resolve(moment().add(1, 'day').format());
      return Promise.resolve(null);
    });

    const {getByTestId} = render(
      <Provider store={store}>
        <SplashScreen />
      </Provider>,
    );

    // Initially should show splash screen
    expect(getByTestId('splash-background')).toBeTruthy();

    // Fast forward the timer
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    // Wait for navigation
    await waitFor(() => {
      expect(getByTestId('app-router')).toBeTruthy();
    });
  }, 10000);

  test('handles token expiration correctly', async () => {
    const mockLogoutAction = jest.fn();
    jest
      .spyOn(require('../../routes/drawerContent/useLogoutProcess'), 'default')
      .mockImplementation(() => ({logoutAction: mockLogoutAction}));

    AsyncStorage.getItem.mockImplementation(key => {
      if (key === ASYNC_LOGIN_EXPIRE_DATE) {
        return Promise.resolve(moment().subtract(1, 'day').format());
      }
      return Promise.resolve(null);
    });

    render(
      <Provider store={store}>
        <SplashScreen />
      </Provider>,
    );

    await waitFor(() => {
      expect(mockLogoutAction).toHaveBeenCalled();
    });
  }, 10000);

  test('sets global base URL when user info is available', async () => {
    const mockUserInfo = {id: 1, name: 'Test User'};
    const mockBaseUrl = 'https://test-api.com';

    AsyncStorage.multiGet.mockResolvedValue([
      [ASYNC_AUTH_TOKEN, 'test-token'],
      [ASYNC_USER_INFO, JSON.stringify(mockUserInfo)],
      [DASHBOARD_RANGE, '{}'],
      [ASYNC_LOGGED_IN_ALREADY, 'true'],
    ]);

    AsyncStorage.getItem.mockImplementation(key => {
      if (key === 'BASE_URL') return Promise.resolve(mockBaseUrl);
      return Promise.resolve(null);
    });

    render(
      <Provider store={store}>
        <SplashScreen />
      </Provider>,
    );

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(global.baseUrl).toBe(mockBaseUrl);
    });
  }, 10000);
});
