import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {WelcomeScreen, RenderCountItem, SkipButton} from './WelcomeScreen';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  setIsFirstTime,
  getFirstTimeClosedLoopSegmentDetails,
  getWelcomeScreenDataCount,
  setMoveNext,
} from '../../redux/actions/dashboard.actions';

const mockStore = configureStore([]);
const initialState = {
  global: {
    userInfo: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    },
    baseUrl: 'https://example.com',
    authToken: 'mockAuthToken',
  },
  dashboard: {
    welcomeScreenData: {
      cxData: {body: {newResponses: 10}},
      clfData: {data: [{value: 5}, {value: 3}]},
    },
  },
};

describe('WelcomeScreen and Child Components', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    jest.clearAllMocks();
  });

  const renderWelcomeScreen = () =>
    render(
      <Provider store={store}>
        <SafeAreaProvider>
          <WelcomeScreen />
        </SafeAreaProvider>
      </Provider>,
    );

  it('renders RenderCountItem component directly', () => {
    const {getByTestId} = render(
      <RenderCountItem style={{}} title="Test Title" data="Test Data" />,
    );
    expect(getByTestId('render-count-item')).toBeTruthy();
  });

  it('renders WelcomeScreen correctly', () => {
    const {getByTestId} = renderWelcomeScreen();
    expect(getByTestId('render-welcome-screen')).toBeTruthy();
    expect(getByTestId('welcome-text')).toBeTruthy();
    expect(getByTestId('render-count-data')).toBeTruthy();
    expect(getByTestId('skip-button-view')).toBeTruthy();
  });
});

describe('SkipButton', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    jest.clearAllMocks();
  });

  const renderSkipButton = () =>
    render(
      <Provider store={store}>
        <SafeAreaProvider>
          <SkipButton />
        </SafeAreaProvider>
      </Provider>,
    );

  it('renders SkipButton correctly', () => {
    const {getByTestId} = renderSkipButton();
    expect(getByTestId('skip-button-view')).toBeTruthy();
  });
});
