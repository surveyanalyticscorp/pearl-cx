import React from 'react';
import {DashboardClosedLoopView} from './DashboardClosedLoopView';
import {render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';

// mock ClosedLoopDashboard
jest.mock('./ClosedLoopDashboard', () => ({
  ClosedLoopDashboard: 'ClosedLoopDashboard',
}));

describe('DashboardClosedLoopView', () => {
  // mock the props object
  let store;
  const props = {
    ticketCount: {
      totalTickets: 10,
      low: 2,
      medium: 3,
      high: 3,
      critical: 2,
    },
    route: {
      params: {
        index: 1,
      },
    },
  };

  // mock store for DashboardClosedLoopView
  const mockStore = configureStore([]);
  const initialState = {
    global: {
      authToken: 'mockToken',
    },
    dashboard: {
      currentNPSData: {
        NPSScore: {
          promoterPercent: 0.5,
          passivePercent: 0.3,
          detractorPercent: 0.2,
        },
      },
      dashBoardTicketCount: {
        totalTickets: 10,
        low: 2,
        medium: 3,
        high: 3,
        critical: 2,
      },
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
    mockStore.dispatch = jest.fn();
  });
  it('renders the DashboardClosedLoopView component', () => {
    const component = render(
      <Provider store={store}>
        <DashboardClosedLoopView props={props} />
      </Provider>,
    );
    expect(component).toBeTruthy();
  });
});
