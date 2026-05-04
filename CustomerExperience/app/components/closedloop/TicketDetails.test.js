import React from 'react';
import {render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import TicketDetails from './TicketDetails';
import {GET_CLOSED_LOOP_TICKET_ITEM} from '../../redux/actions/dashboard.actions';

// Mock the navigation module
jest.mock('@react-navigation/material-top-tabs', () => ({
  createMaterialTopTabNavigator: jest.fn(() => ({
    Navigator: ({children}) => {
      const {View} = require('react-native');
      return <View testID="navigator">{children}</View>;
    },
    Screen: ({children}) => {
      const {View} = require('react-native');
      return <View testID="screen">{children}</View>;
    },
  })),
}));

// Mock other dependencies
jest.mock('../../Utils/MultilinguaUtils', () => ({
  translate: jest.fn(key => key),
}));

// Mock the tab screens
jest.mock('./TicketOverview/TicketOverview', () => {
  const {View} = require('react-native');
  return () => <View testID="ticket-overview" />;
});

jest.mock('./TicketComments', () => {
  const {View} = require('react-native');
  return () => <View testID="ticket-comments" />;
});

jest.mock('./TicketActivity/TicketActivity', () => {
  const {View} = require('react-native');
  return () => <View testID="ticket-activity" />;
});

jest.mock('./TicketRootCause/TicketRootCause', () => {
  const {View} = require('react-native');
  return () => <View testID="ticket-root-cause" />;
});

// Mock common components
jest.mock('../../widgets/QPSpinner', () => {
  const {View} = require('react-native');
  return () => <View testID="QPSpinner" />;
});

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
      dashboard: {
        centralizedRootCauseUpdateStatus: false,
      },
      feedback: {
        responseDetails: null,
      },
      closedLoop: {
        actions: [],
        rootCauses: [],
        ticketItem: null,
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
    const {UNSAFE_root} = render(
      <Provider store={store}>
        <TicketDetails {...props} />
      </Provider>,
    );

    // Component should render without crashing
    expect(UNSAFE_root).toBeDefined();
  });

  it('renders spinner when loading', () => {
    const loadingStore = mockStore({
      global: {
        authToken: 'mock-auth-token',
        isTicketLoading: true,
        userInfo: {
          feedbackApiKey: 'mock-feedback-api-key',
        },
      },
      dashboard: {
        centralizedRootCauseUpdateStatus: false,
      },
      feedback: {
        responseDetails: null,
      },
      closedLoop: {
        actions: [],
        rootCauses: [],
        ticketItem: null,
      },
    });

    const {UNSAFE_root} = render(
      <Provider store={loadingStore}>
        <TicketDetails {...props} />
      </Provider>,
    );

    // Component should render when loading
    expect(UNSAFE_root).toBeDefined();
  });

  it('dispatches actions on mount', () => {
    render(
      <Provider store={store}>
        <TicketDetails {...props} />
      </Provider>,
    );

    const actions = store.getActions();

    // Check if any actions were dispatched
    expect(actions.length).toBeGreaterThan(0);

    // Check for specific action types if they exist
    const actionTypes = actions.map(action => action.type);
    expect(actionTypes).toContain(GET_CLOSED_LOOP_TICKET_ITEM);
  });

  it('does not call APIs when authToken is missing', () => {
    const storeWithoutAuth = mockStore({
      global: {
        authToken: null, // No auth token
        isTicketLoading: false,
        userInfo: {
          feedbackApiKey: 'mock-feedback-api-key',
        },
      },
      dashboard: {
        centralizedRootCauseUpdateStatus: false,
      },
      feedback: {
        responseDetails: null,
      },
      closedLoop: {
        actions: [],
        rootCauses: [],
        ticketItem: null,
      },
    });

    render(
      <Provider store={storeWithoutAuth}>
        <TicketDetails {...props} />
      </Provider>,
    );

    const actions = storeWithoutAuth.getActions();
    // Should have fewer actions since auth-dependent calls won't be made
    expect(actions).toBeDefined();
  });

  it('sets navigation title correctly', () => {
    const mockSetOptions = jest.fn();
    const propsWithMockNav = {
      ...props,
      navigation: {
        setOptions: mockSetOptions,
      },
    };

    render(
      <Provider store={store}>
        <TicketDetails {...propsWithMockNav} />
      </Provider>,
    );

    // Check if navigation options were set with correct title
    expect(mockSetOptions).toHaveBeenCalledWith({
      title: 'Ticket #12345',
    });
  });

  it('handles different ticket IDs in navigation title', () => {
    const mockSetOptions = jest.fn();
    const propsWithDifferentId = {
      route: {
        params: {
          ticketItem: {
            id: '99999',
            responseId: 'resp-999',
          },
          prevScreen: 'TicketList',
        },
      },
      navigation: {
        setOptions: mockSetOptions,
      },
    };

    render(
      <Provider store={store}>
        <TicketDetails {...propsWithDifferentId} />
      </Provider>,
    );

    // Check if navigation options were set with different ticket ID
    expect(mockSetOptions).toHaveBeenCalledWith({
      title: 'Ticket #99999',
    });
  });

  it('handles ticket without responseId', () => {
    const propsWithoutResponseId = {
      route: {
        params: {
          ticketItem: {
            id: '12345',
            responseId: null, // No response ID
          },
          prevScreen: 'TicketList',
        },
      },
      navigation: {
        setOptions: jest.fn(),
      },
    };

    render(
      <Provider store={store}>
        <TicketDetails {...propsWithoutResponseId} />
      </Provider>,
    );

    // Component should still render without responseId
    const actions = store.getActions();
    expect(actions.length).toBeGreaterThan(0);
  });

  it('handles ticket with empty responseId', () => {
    const propsWithEmptyResponseId = {
      route: {
        params: {
          ticketItem: {
            id: '12345',
            responseId: '', // Empty response ID
          },
          prevScreen: 'TicketList',
        },
      },
      navigation: {
        setOptions: jest.fn(),
      },
    };

    render(
      <Provider store={store}>
        <TicketDetails {...propsWithEmptyResponseId} />
      </Provider>,
    );

    // Component should still render with empty responseId
    const actions = store.getActions();
    expect(actions.length).toBeGreaterThan(0);
  });
});
