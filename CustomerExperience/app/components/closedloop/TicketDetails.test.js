import React from 'react';
import {render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import TicketDetails from './TicketDetails';
import {translate} from '../../Utils/MultilinguaUtils';
import {
  GET_ACTIONS,
  GET_ROOT_CASUES,
} from '../../redux/actions/closedloop.actions';
import {GET_CLOSED_LOOP_TICKET_ITEM} from '../../redux/actions/dashboard.actions';
import {GET_RESPONSE_DETAILS_BY_RESPONSEID} from '../../redux/actions/feedback.actions';

// Mock the navigation module
jest.mock('@react-navigation/material-top-tabs', () => ({
  createMaterialTopTabNavigator: jest.fn(() => ({
    Navigator: 'MockNavigator',
    Screen: 'MockScreen',
  })),
}));

const mockStore = configureStore([]);

describe('TicketDetails', () => {
  let store;
  let props;

  beforeEach(() => {
    // Mock Redux store
    store = mockStore({
      global: {
        authToken: 'mock-auth-token',
        isTicketLoading: false,
        userInfo: {
          feedbackApiKey: 'mock-feedback-api-key',
        },
      },
    });

    // Mock navigation props
    props = {
      route: {
        params: {
          ticketItem: {
            id: '12345',
            responseId: 'resp-789',
            // Add other necessary ticket properties
          },
          prevScreen: 'TicketList',
        },
      },
      navigation: {
        setOptions: jest.fn(),
      },
    };

    // Mock global variable
    global.subscriberId = 'mock-subscriber-id';
  });

  it('renders correctly when not loading', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <TicketDetails {...props} />
      </Provider>,
    );

    // Check if the tabs are rendered
    expect(getByTestId('ticket-overview')).toBeTruthy();
    expect(getByTestId('ticket-comments')).toBeTruthy();
    expect(getByTestId('ticket-activity')).toBeTruthy();
    expect(getByTestId('ticket-root-cause')).toBeTruthy();
  });

  it('renders spinner when loading', () => {
    store = mockStore({
      ...store.getState(),
      global: {
        ...store.getState().global,
        isTicketLoading: true,
      },
    });

    const {getByTestId} = render(
      <Provider store={store}>
        <TicketDetails {...props} />
      </Provider>,
    );

    expect(getByTestId('QPSpinner')).toBeTruthy();
  });

  it('dispatches actions on mount', () => {
    render(
      <Provider store={store}>
        <TicketDetails {...props} />
      </Provider>,
    );

    const actions = store.getActions();
    expect(actions).toContainEqual(
      expect.objectContaining({
        type: GET_CLOSED_LOOP_TICKET_ITEM,
      }),
    );
    expect(actions).toContainEqual(
      expect.objectContaining({
        type: GET_ROOT_CASUES,
      }),
    );
    expect(actions).toContainEqual(
      expect.objectContaining({
        type: GET_ACTIONS,
      }),
    );
    expect(actions).toContainEqual(
      expect.objectContaining({
        type: GET_RESPONSE_DETAILS_BY_RESPONSEID,
      }),
    );
  });
});
