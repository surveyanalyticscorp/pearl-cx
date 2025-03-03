import React from 'react';
import {render, waitFor, act} from '@testing-library/react-native';
import SplashScreen from './SplashScreen';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setTokenExpired,
  setIsFirstTime,
} from '../../redux/actions/dashboard.actions';
import {
  setBearerToken,
  fillUserInfo,
  setAuthToken,
  setRangeFilter,
} from '../../redux/actions';
import {setBaseUrl} from '../../redux/actions/login.actions';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  multiGet: jest.fn(),
}));

jest.mock('../../redux/actions/dashboard.actions', () => ({
  setTokenExpired: jest.fn(),
  setIsFirstTime: jest.fn(),
}));

jest.mock('../../redux/actions', () => ({
  setBearerToken: jest.fn(),
  fillUserInfo: jest.fn(),
  setAuthToken: jest.fn(),
  setRangeFilter: jest.fn(),
}));

jest.mock('../../redux/actions/login.actions', () => ({
  setBaseUrl: jest.fn(),
}));

jest.mock('../../routes/appRouter', () => {
  return jest.fn(() => <mock-AppRouter testID="app-router" />);
});

// Mock `require` calls for images
jest.mock('../../config/images/background1.png', () => 1);
jest.mock('../../config/images/cx-logo.png', () => 1);

const mockStore = configureStore([]);
const mockBaseUrl = 'https://example.com';

describe('SplashScreen Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <SafeAreaProvider>
        <Provider store={store}>
          <SplashScreen />
        </Provider>
      </SafeAreaProvider>,
    );

  it('renders the initial splash screen view', () => {
    const {getByTestId} = renderComponent();
    expect(getByTestId('splash-background')).toBeTruthy();
  });

  it('renders splash screen if moveNext is false', () => {
    const {getByTestId} = renderComponent();
    expect(getByTestId('splash-background')).toBeTruthy();
  });
});
