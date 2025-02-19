import React from 'react';
import {render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import TicketSync from './TicketSync';
import StringUtils from '../Utils/StringUtils';
import {syncTickets} from '../redux/actions/closedloop.actions';

jest.mock('../redux/actions/closedloop.actions', () => ({
  syncTickets: jest.fn(() => ({
    type: 'GET_TICKET_LIST_SYNC',
  })),
}));
jest.mock('../Utils/StringUtils', () => ({
  isEmptyOrNull: jest.fn(),
}));

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
    global.subscriberId = 'mock-subscriber-id'; // Mock global variable
    syncTickets.mockClear();
  });

  const renderComponent = () => {
    console.log('STORE', store.getState());

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
  test('calls callTicketSync when ticketSync is true and required fields are present', () => {
    StringUtils.isEmptyOrNull.mockReturnValue(false); // Simulate non-empty fields

    renderComponent();

    expect(syncTickets).toHaveBeenCalledWith({
      authToken: 'mock-token',
      param: {
        feedbackApiKey: 'mock-api-key',
        subscriberId: 'mock-subscriber-id',
      },
      feedbackID: 'mock-feedback-id',
    });
  });
  test('does not call callTicketSync when ticketSync is false', () => {
    store = mockStore({
      ...store.getState(),
      dashboard: {ticketSync: false},
    });
    renderComponent();
    expect(syncTickets).not.toHaveBeenCalled();
  });
  test('does not call callTicketSync when subscriberId is empty', () => {
    global.subscriberId = ''; // Simulate empty subscriberId
    StringUtils.isEmptyOrNull.mockReturnValueOnce(true); // Simulate StringUtils returning true for empty

    renderComponent();

    expect(syncTickets).not.toHaveBeenCalled();
  });

  test('does not call callTicketSync when feedbackApiKey or feedbackID is empty', () => {
    // Test when feedbackApiKey is empty
    store = mockStore({
      ...initialState,
      global: {
        ...initialState.global,
        userInfo: {
          feedbackApiKey: '',
          feedbackID: 'mock-feedback-id',
        },
      },
    });
  });
});
