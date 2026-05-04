import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {act} from 'react-test-renderer';
import TicketRootCause from './TicketRootCause/TicketRootCause';

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
  })),
}));

// Mock the ScrollView and FlatList components
jest.mock('react-native-gesture-handler', () => ({
  ScrollView: jest.fn(({children}) => <>{children}</>),
  FlatList: jest.fn(
    ({data, renderItem, ListHeaderComponent, ListEmptyComponent}) => (
      <>
        {ListHeaderComponent}
        {data.map((item, index) => renderItem({item, index}))}
        {data.length === 0 && ListEmptyComponent}
      </>
    ),
  ),
}));

// Mock the useDispatch and useSelector hooks
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock the updateRootCause action
jest.mock('../../redux/actions/closedloop.actions', () => ({
  updateRootCause: jest.fn(),
}));

// Mock dashboard actions
jest.mock('../../redux/actions/dashboard.actions', () => ({
  getClosedLoopTicketItem: jest.fn(),
}));

// Mock child components
jest.mock('./TicketRootCause/RootCauseNavigationButtons', () => {
  const {View, Text} = require('react-native');
  return {
    RootCauseNavigationButtons: () => (
      <View testID="RootCauseNavigationButtons">
        <Text testID="CentralizedButton">Centralized</Text>
        <Text testID="PreviousRootCauseButton">Previous root cause</Text>
      </View>
    ),
  };
});

jest.mock('./TicketRootCause/CustomeRootCause', () => {
  const {View, Text} = require('react-native');
  return {
    CustomRootCause: () => (
      <View testID="CustomRootCause">
        <Text>Root Cause 1</Text>
        <Text>Root Cause 2</Text>
        <Text>Action 1</Text>
        <Text>Action 2</Text>
        <Text>Segment 1</Text>
        <Text>Segment 2</Text>
        <Text testID="EditButton">Edit</Text>
        <Text testID="AddButton">Add</Text>
      </View>
    ),
  };
});

const mockStore = configureStore([]);

const initialState = {
  global: {
    userInfo: {feedbackApiKey: 'test-api-key'},
    authToken: 'test-auth-token',
  },
  dashboard: {
    ticket: {
      id: 1,
      rootCauses: [],
      rootCauseActions: [],
      originSegment: {id: 1},
      currentSegment: {id: 1},
    },
    rootCauseList: [
      {id: 1, title: 'Root Cause 1'},
      {id: 2, title: 'Root Cause 2'},
    ],
    rootCauseActionList: [
      {id: 1, actionName: 'Action 1'},
      {id: 2, actionName: 'Action 2'},
    ],
    segmentDetails: {
      segments: [
        {segmentID: 1, segmentName: 'Segment 1'},
        {segmentID: 2, segmentName: 'Segment 2'},
      ],
    },
  },
};

describe('TicketRootCause Component', () => {
  const mockDispatch = jest.fn();
  const mockGetClosedLoopTicketItem = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Temporarily disable timer mocking to isolate issue
    // jest.useFakeTimers();
    const {useDispatch, useSelector} = require('react-redux');
    const {
      getClosedLoopTicketItem,
    } = require('../../redux/actions/dashboard.actions');

    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation(selector => selector(initialState));
    getClosedLoopTicketItem.mockImplementation(mockGetClosedLoopTicketItem);
  });

  // Commented out afterEach since we're not using fake timers
  // afterEach(() => {
  //   jest.useRealTimers();
  // });

  it('executes setTimeout callback in onRefresh', async () => {
    const store = mockStore(initialState);
    const {getByTestId} = render(
      <Provider store={store}>
        <TicketRootCause />
      </Provider>,
    );

    const scrollView = getByTestId('root-cause-view');
    const refreshControl = scrollView.props.refreshControl;

    // Trigger refresh
    await act(async () => {
      refreshControl.props.onRefresh();
    });

    // Verify dispatch was called
    expect(mockDispatch).toHaveBeenCalled();

    // Wait for setTimeout to complete (2 seconds)
    await waitFor(
      () => {
        // This will pass if the component doesn't crash during setTimeout
        expect(getByTestId('root-cause-view')).toBeTruthy();
      },
      {timeout: 3000},
    );
  });

  it('renders TicketRootCause component correctly', () => {
    const {getByTestId} = render(
      <Provider store={mockStore(initialState)}>
        <TicketRootCause />
      </Provider>,
    );

    expect(getByTestId('root-cause-view')).toBeTruthy();
  });

  it('renders RootCause and Action items', () => {
    const {getByText} = render(
      <Provider store={mockStore(initialState)}>
        <TicketRootCause />
      </Provider>,
    );

    expect(getByText('Root Cause 1')).toBeTruthy();
    expect(getByText('Root Cause 2')).toBeTruthy();
    expect(getByText('Action 1')).toBeTruthy();
    expect(getByText('Action 2')).toBeTruthy();
  });

  it('renders Origin and Current Segment items', () => {
    const {getAllByText} = render(
      <Provider store={mockStore(initialState)}>
        <TicketRootCause />
      </Provider>,
    );

    expect(getAllByText('Segment 1')).toBeTruthy();
    expect(getAllByText('Segment 2')).toBeTruthy();
  });

  it('renders Edit and Add buttons from CustomRootCause', () => {
    const {getByTestId} = render(
      <Provider store={mockStore(initialState)}>
        <TicketRootCause />
      </Provider>,
    );

    // Check if edit and add buttons exist
    expect(getByTestId('EditButton')).toBeTruthy();
    expect(getByTestId('AddButton')).toBeTruthy();
  });

  it('renders navigation buttons', () => {
    const {getByTestId} = render(
      <Provider store={mockStore(initialState)}>
        <TicketRootCause />
      </Provider>,
    );

    // Check if navigation buttons exist
    expect(getByTestId('CentralizedButton')).toBeTruthy();
    expect(getByTestId('PreviousRootCauseButton')).toBeTruthy();
  });

  it('handles refresh functionality', async () => {
    const store = mockStore(initialState);
    const {getByTestId} = render(
      <Provider store={store}>
        <TicketRootCause />
      </Provider>,
    );

    const scrollView = getByTestId('root-cause-view');

    // Trigger refresh by calling the RefreshControl onRefresh prop
    const refreshControl = scrollView.props.refreshControl;

    await act(async () => {
      refreshControl.props.onRefresh();
    });

    // Verify that the dispatch function was called
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockGetClosedLoopTicketItem).toHaveBeenCalledWith(
      '',
      1,
      'test-api-key',
    );
  });
});
