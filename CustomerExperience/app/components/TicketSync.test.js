import React from 'react';
import {render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import TicketSync from './TicketSync';

// Mock the useTicketSync hook to prevent it from running actual logic
jest.mock('../hooks/useTicketSync', () => jest.fn());

const mockStore = configureStore([]);
const initialState = {
  global: {
    authToken: 'mock-token',
    userInfo: {
      feedbackApiKey: 'mock-api-key',
      feedbackID: 'mock-feedback-id',
    },
  },
  dashboard: {
    ticketSync: true,
  },
};

describe('TicketSync', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    global.subscriberId = 'mock-subscriber-id';
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <TicketSync />
      </Provider>,
    );
  };

  test('renders without crashing', () => {
    const {getByTestId} = renderComponent();
    expect(getByTestId('ticket-sync-view')).toBeTruthy();
  });

  test('renders the correct component structure', () => {
    const {getByTestId} = renderComponent();
    const component = getByTestId('ticket-sync-view');
    expect(component).toBeTruthy();
    expect(component.type).toBe('View');
  });

  test('component renders with different store states', () => {
    store = mockStore({
      ...initialState,
      dashboard: {ticketSync: false},
    });

    const {getByTestId} = renderComponent();
    expect(getByTestId('ticket-sync-view')).toBeTruthy();
  });

  test('component renders with empty user info', () => {
    store = mockStore({
      ...initialState,
      global: {
        ...initialState.global,
        userInfo: {
          feedbackApiKey: '',
          feedbackID: '',
        },
      },
    });

    const {getByTestId} = renderComponent();
    expect(getByTestId('ticket-sync-view')).toBeTruthy();
  });

  test('component renders with missing auth token', () => {
    store = mockStore({
      ...initialState,
      global: {
        ...initialState.global,
        authToken: null,
      },
    });

    const {getByTestId} = renderComponent();
    expect(getByTestId('ticket-sync-view')).toBeTruthy();
  });
});
