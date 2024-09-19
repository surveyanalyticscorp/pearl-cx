import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import TicketActivity from './TicketActivity';
import * as TimeUtils from '../../Utils/TimeUtils';
import * as DashboardActions from '../../redux/actions/dashboard.actions';
import {Colors} from '../../styles/color.constants';
import BottomSheet from 'reanimated-bottom-sheet';
import {FilterIcon} from '../../routes/commonUI/CommonUI';
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('../../routes/commonUI/CommonUI', () => ({
  FilterIcon: 'FilterIcon',
  NoItemsFound: 'NoItemsFound',
}));

// Mock BottomSheet correctly
jest.mock('reanimated-bottom-sheet', () => {
  return jest.fn().mockImplementation(({children}) => {
    return <div>{children}</div>;
  });
});

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

  it('calls the API to fetch activity when refreshed', async () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <TicketActivity />
      </Provider>,
    );

    const flatList = getByTestId('flatlist-activity');
    fireEvent(flatList, 'refresh');

    await waitFor(() => {
      expect(getClosedLoopTicketItemActivitySpy).toHaveBeenCalledWith(
        'mockToken',
        '"123"',
      );
    });
  });

  it('opens and closes the sorting bottom sheet', async () => {
    const {getByText, queryByText} = render(
      <Provider store={store}>
        <TicketActivity />
      </Provider>,
    );

    // Open bottom sheet
    fireEvent.press(getByText('activity.sorted_by activity.latest'));

    // Check if sorting options are visible
    await waitFor(() => {
      expect(getByText('activity.latest')).toBeTruthy();
      expect(getByText('activity.oldest')).toBeTruthy();
    });

    // Close bottom sheet
    fireEvent.press(getByText('activity.sorted_by'));

    // Check if sorting options are no longer visible
    await waitFor(() => {
      expect(queryByText('activity.latest')).toBeNull();
      expect(queryByText('activity.oldest')).toBeNull();
    });
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

  it('handles sorting the activity list', () => {
    const {getByText} = render(
      <Provider store={store}>
        <TicketActivity />
      </Provider>,
    );

    fireEvent.press(getByText('latest'));
    expect(getByText('latest')).toBeTruthy();
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

    expect(getByText('ticket_list.anonymous')).toBeTruthy();
  });

  it('changes sorting order when selecting a different option', async () => {
    const {getByText} = render(
      <Provider store={store}>
        <TicketActivity />
      </Provider>,
    );

    fireEvent.press(getByText('activity.sorted_by activity.latest'));
    fireEvent.press(getByText('activity.oldest'));

    await waitFor(() => {
      expect(getByText('oldest')).toBeTruthy();
    });
  });

  it('applies opacity to non-current segments', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <TicketActivity />
      </Provider>,
    );

    const animatedView = getByTestId('animated-view');
    expect(animatedView.props.style[1].opacity).toBe(1);
  });

  it('disables refresh control while refreshing', async () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <TicketActivity />
      </Provider>,
    );

    const flatList = getByTestId('flatlist-activity');
    fireEvent(flatList, 'refresh');

    // Wait for the refreshing state to be set to true
    await waitFor(
      () => {
        const refreshControl = flatList.props.refreshControl;
        expect(refreshControl.props.refreshing).toBe(true);
      },
      {timeout: 1000}, // Increase timeout if needed
    );

    // Wait for the refreshing state to be set back to false
    await waitFor(
      () => {
        const refreshControl = flatList.props.refreshControl;
        expect(refreshControl.props.refreshing).toBe(false);
      },
      {timeout: 2000}, // Adjust timeout based on your component's behavior
    );
  });

  it('renders activity text correctly', () => {
    const {getAllByTestId} = render(
      <Provider store={store}>
        <TicketActivity />
      </Provider>,
    );

    const activityTexts = getAllByTestId('span');
    expect(activityTexts[0].props.children).toBe('Activity 1');
    expect(activityTexts[1].props.children).toBe('Activity 2');
  });
});
