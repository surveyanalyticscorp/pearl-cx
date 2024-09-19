import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import TicketRootCause from './TicketRootCause';
import {updateRootCause} from '../../redux/actions/closedloop.actions';
import RenderRootCauseItem from './RenderRootCauseItem';
import RenderSegmentItem from './RenderSegmentItem';
import {FlatList} from 'react-native-gesture-handler';

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

const mockStore = configureStore([]);

describe('TicketRootCause Component', () => {
  const mockDispatch = jest.fn();
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

  beforeEach(() => {
    jest.clearAllMocks();
    const {useDispatch, useSelector} = require('react-redux');
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation(selector => selector(initialState));
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

  it('calls updateRootCause action when update button is pressed', () => {
    const {getByTestId} = render(
      <Provider store={mockStore(initialState)}>
        <TicketRootCause />
      </Provider>,
    );

    const updateButton = getByTestId('RootCauseUpdateButton');
    fireEvent.press(updateButton);

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('resets selections when reset button is pressed', () => {
    const {getByTestId} = render(
      <Provider store={mockStore(initialState)}>
        <TicketRootCause />
      </Provider>,
    );

    const resetButton = getByTestId('RootCasueResetButton');
    fireEvent.press(resetButton);

    // You may need to add more specific assertions here to check if the state is reset
  });

  // Add more tests as needed for specific functionality
});
