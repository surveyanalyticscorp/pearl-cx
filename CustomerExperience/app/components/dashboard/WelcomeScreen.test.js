import React from 'react';
import {render, waitFor, fireEvent} from '@testing-library/react-native';
import {WelcomeScreen, RenderCountItem, SkipButton} from './WelcomeScreen';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {SET_MOVE_NEXT} from '../../redux/actions/dashboard.actions';
jest.mock('../../widgets/Button', () => {
  const {Pressable, Text} = require('react-native');
  return ({buttonText, onPress}) => (
    <Pressable testID="qp-button" onPress={onPress}>
      <Text>{buttonText}</Text>
    </Pressable>
  );
});

jest.mock('../../routes/commonUI/CommonUI', () => {
  const {View} = require('react-native');
  return {
    RenderSpinner: jest.fn(() => <View testID="render-spinner" />),
  };
});

jest.mock('../../Utils/MultilinguaUtils', () => ({
  translate: jest.fn(key => key),
}));

jest.mock('../../routes/drawerContent/useLogoutProcess', () => () => ({
  logoutAction: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  clear: jest.fn(() => Promise.resolve()),
  multiGet: jest.fn(() => Promise.resolve([])),
}));

jest.mock('react-native-animatable', () => {
  const {View} = require('react-native');
  return {View};
});

jest.mock('../../Utils/AnalyticLogs', () => ({
  sendAnalyticsEvent: jest.fn(),
}));

jest.mock('../../Utils/AppInfo', () => ({}));

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

const skipButtonState = {
  ...initialState,
  dashboard: {
    ...initialState.dashboard,
    welcomeScreenData: null,
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

  it('displays provided title and data in RenderCountItem', () => {
    const {getByText} = render(
      <RenderCountItem style={{}} title="Total Tickets" data="42" />,
    );
    expect(getByText('42')).toBeTruthy();
    expect(getByText('Total Tickets')).toBeTruthy();
  });

  it('renders WelcomeScreen correctly', async () => {
    const {getByTestId} = renderWelcomeScreen();
    await waitFor(() => {
      expect(getByTestId('render-welcome-screen')).toBeTruthy();
      expect(getByTestId('welcome-text')).toBeTruthy();
      expect(getByTestId('render-count-data')).toBeTruthy();
      expect(getByTestId('skip-button-view')).toBeTruthy();
    });
  });

  it('renders spinner when welcome data is not available', () => {
    const loadingState = {
      ...initialState,
      dashboard: {
        welcomeScreenData: {cxData: null, clfData: null},
      },
    };
    const loadingStore = mockStore(loadingState);

    const {getByTestId} = render(
      <Provider store={loadingStore}>
        <SafeAreaProvider>
          <WelcomeScreen />
        </SafeAreaProvider>
      </Provider>,
    );

    expect(getByTestId('render-spinner')).toBeTruthy();
  });
});

describe('WelcomeScreen — authToken effect', () => {
  it('dispatches API calls when authToken, global.bearerToken and global.clfBaseUrl are all set', async () => {
    global.bearerToken = 'bearerTok';
    global.clfBaseUrl = 'https://clf.example.com';
    global.subscriberId = 'sub123';

    const store = mockStore(initialState);
    render(
      <Provider store={store}>
        <SafeAreaProvider>
          <WelcomeScreen />
        </SafeAreaProvider>
      </Provider>,
    );

    await waitFor(() => {
      const types = store.getActions().map(a => a.type);
      expect(types.some(t => t === 'GET_WELCOME_SCREEN_DATA')).toBe(true);
    });

    delete global.bearerToken;
    delete global.clfBaseUrl;
  });
});

describe('RenderCountData — jwt expired', () => {
  it('renders without crash when clfData string contains jwt expired', () => {
    const store = mockStore({
      ...initialState,
      dashboard: {
        welcomeScreenData: {
          cxData: {body: {newResponses: 0}},
          clfData: JSON.stringify({error: 'jwt expired'}),
        },
      },
    });

    const {getByTestId} = render(
      <Provider store={store}>
        <SafeAreaProvider>
          <WelcomeScreen />
        </SafeAreaProvider>
      </Provider>,
    );

    expect(getByTestId('render-welcome-screen')).toBeTruthy();
  });
});

describe('SkipButton', () => {
  let store;

  beforeEach(() => {
    store = mockStore(skipButtonState);
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

  it('dispatches setMoveNext when Skip button is pressed', () => {
    const {getByTestId} = renderSkipButton();

    fireEvent.press(getByTestId('qp-button'));

    const actions = store.getActions();
    expect(actions).toContainEqual({type: SET_MOVE_NEXT, doesMoveNext: true});
  });
});
