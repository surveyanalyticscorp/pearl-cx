import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import TicketActivity, {
  getTicketActivityList,
} from './TicketActivity/TicketActivity';

import * as TimeUtils from '../../Utils/TimeUtils';
import * as DashboardActions from '../../redux/actions/dashboard.actions';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// mock @gorhom/bottom-sheet
jest.mock('@gorhom/bottom-sheet', () => ({
  __esModule: true,
  default: 'mockBottomSheet',
  BottomSheetView: 'mockBottomSheetView',
}));

const mockStore = configureStore([]);
const initialState = {
  global: {
    authToken: 'mockToken',
  },
  dashboard: {
    ticket: {id: '123'},
    ticketActivity: [
      {
        id: 1,
        userName: 'User1',
        createdAt: '2023-09-12T12:00:00Z',
        activityText: 'Activity 1',
      },
      {
        id: 2,
        userName: 'User2',
        createdAt: '2023-09-11T12:00:00Z',
        activityText: 'Activity 2',
      },
    ],
  },
};

describe('TicketActivity Component', () => {
  let store;
  let getClosedLoopTicketItemActivitySpy;

  beforeEach(() => {
    store = mockStore(initialState);
    getClosedLoopTicketItemActivitySpy = jest
      .spyOn(DashboardActions, 'getClosedLoopTicketItemActivity')
      .mockImplementation(() => {});
    jest.spyOn(TimeUtils, 'convertDateTimeAgo').mockReturnValue('1 day ago');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and displays ticket activity', () => {
    const {getAllByText, getByText} = render(
      <Provider store={store}>
        <TicketActivity />
      </Provider>,
    );

    expect(getByText('User1')).toBeTruthy();
    const dayAgoElements = getAllByText('1 day ago');
    expect(dayAgoElements.length).toBe(2); // Assuming there are two activities
    expect(getByText('Activity 1')).toBeTruthy();
  });

  it('displays No Activity message when the list is empty', () => {
    const emptyState = {
      ...initialState,
      dashboard: {
        ...initialState.dashboard,
        ticketActivity: [],
      },
    };
    const emptyStore = mockStore(emptyState);

    const {getByText} = render(
      <Provider store={emptyStore}>
        <TicketActivity />
      </Provider>,
    );

    expect(getByText('No Activity...')).toBeTruthy();
  });

  it('renders anonymous when userName is null', () => {
    const stateWithNullUser = {
      ...initialState,
      dashboard: {
        ...initialState.dashboard,
        ticketActivity: [
          {
            id: 3,
            userName: null,
            createdAt: '2023-09-13T12:00:00Z',
            activityText: 'Anonymous Activity',
          },
        ],
      },
    };
    const storeWithNullUser = mockStore(stateWithNullUser);

    const {getByText} = render(
      <Provider store={storeWithNullUser}>
        <TicketActivity />
      </Provider>,
    );

    expect(getByText('Anonymous Activity')).toBeTruthy();
  });

  it('displays TicketActivity correctly', () => {
    const {getAllByText, getByText} = render(
      <Provider store={store}>
        <TicketActivity />
      </Provider>,
    );

    expect(getByText('User1')).toBeTruthy();
    const dayAgoElements = getAllByText('1 day ago');
    expect(dayAgoElements.length).toBe(2); // Assuming there are two activities
    expect(getByText('Activity 1')).toBeTruthy();
  });

  describe('getTicketActivityList', () => {
    it('should return the list in reverse order', () => {
      const list = [
        {id: 1, title: 'Activity 1'},
        {id: 2, title: 'Activity 2'},
      ];
      const item = {id: 1};
      const result = getTicketActivityList(list, item);
      expect(result).toEqual([
        {id: 2, title: 'Activity 2'},
        {id: 1, title: 'Activity 1'},
      ]);
    });
  });
});
