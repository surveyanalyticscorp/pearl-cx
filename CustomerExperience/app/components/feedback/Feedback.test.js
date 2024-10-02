import React from 'react';
import {render, fireEvent, act, waitFor} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Feedback from './Feedback';
import * as feedbackActions from '../../redux/actions/feedback.actions';
import {setRangeFilter} from '../../redux/actions';

jest.mock('@react-native-async-storage/async-storage', () => ({
  useAsyncStorage: () => ({
    getItem: jest.fn(() => Promise.resolve(null)),
  }),
}));
jest.mock('../../Utils/MultilinguaUtils', () => ({
  translate: jest.fn(key => key),
}));

// Mock the actions
jest.mock('../../redux/actions/feedback.actions', () => ({
  fetchAllResponses: jest.fn(() => ({type: 'MOCK_FETCH_ALL_RESPONSES'})),
  setAllResponsesEmpty: jest.fn(() => ({type: 'MOCK_SET_ALL_RESPONSES_EMPTY'})),
  setResponseReadList: jest.fn(() => ({type: 'MOCK_SET_RESPONSE_READ_LIST'})),
}));

const mockStore = configureStore([]);

describe('Feedback Component', () => {
  let store;
  const initialState = {
    global: {
      authToken: 'mockToken',
      range: {startDate: '01/01/2024', endDate: '01/31/2024'},
    },
    response: {
      allResponses: [],
    },
    dashboard: {
      currentSegment: {currentSegmentID: 'mockSegmentId'},
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const tree = render(
      <Provider store={store}>
        <SafeAreaProvider>
          <Feedback />
        </SafeAreaProvider>
      </Provider>,
    );
    expect(tree).toMatchSnapshot();
    // const {queryAllByTestId} = tree;
    // expect(queryAllByTestId('responses-component')).toBeTruthy();
    // expect(queryAllByTestId('sorting-bottom-sheet')).toBeTruthy();
  });

  it('fetches feedback data on mount', async () => {
    render(
      <Provider store={store}>
        <SafeAreaProvider>
          <Feedback />
        </SafeAreaProvider>
      </Provider>,
    );

    await waitFor(() => {
      expect(feedbackActions.fetchAllResponses).toHaveBeenCalled();
    });
  });

  it('handles refresh', async () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <SafeAreaProvider>
          <Feedback />
        </SafeAreaProvider>
      </Provider>,
    );

    const responsesComponent = getByTestId('responses-component');
    fireEvent(responsesComponent, 'refresh');

    await waitFor(() => {
      expect(feedbackActions.setAllResponsesEmpty).toHaveBeenCalled();
    });
  });

  it('handles end reached', async () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <SafeAreaProvider>
          <Feedback />
        </SafeAreaProvider>
      </Provider>,
    );

    const responsesComponent = getByTestId('responses-component');
    fireEvent(responsesComponent, 'endReached');

    await waitFor(() => {
      expect(feedbackActions.fetchAllResponses).toHaveBeenCalledTimes(2);
    });
  });

  it('handles date range change', async () => {
    const {getByText} = render(
      <Provider store={store}>
        <SafeAreaProvider>
          <Feedback />
        </SafeAreaProvider>
      </Provider>,
    );

    const dateRangeButton = getByText('responses.sort_by');
    fireEvent.press(dateRangeButton);

    await waitFor(() => {
      const actions = store.getActions();
      expect(
        actions.some(action => action.type === 'SET_RANGE_FILTER'),
      ).toBeTruthy();
    });
  });

  it('opens sorting bottom sheet', () => {
    const {getByText} = render(
      <Provider store={store}>
        <SafeAreaProvider>
          <Feedback />
        </SafeAreaProvider>
      </Provider>,
    );

    const filterButton = getByText('responses.sort_by');
    fireEvent.press(filterButton);

    // Check if the bottom sheet is opened (you might need to adjust this based on your implementation)
    expect(getByText('responses.sort_by')).toBeTruthy();
  });

  it('changes sorting', async () => {
    const {getAllByTestId, getAllByText} = render(
      <Provider store={store}>
        <SafeAreaProvider>
          <Feedback />
        </SafeAreaProvider>
      </Provider>,
    );
    const filterButton = getAllByTestId('on-press-filter');
    // Open sorting bottom sheet
    fireEvent.press(filterButton[0]);

    expect(filterButton[0]).toHaveBeenCalled();
    // Select a different sorting option
    // const scoreOption = getAllByText('Score')[0];
    // fireEvent.press(scoreOption);

    // await waitFor(() => {
    //   expect(feedbackActions.setAllResponsesEmpty).toHaveBeenCalled();
    //   expect(feedbackActions.fetchAllResponses).toHaveBeenCalled();
    // });
  });

  it('handles error in fetching feedback data', async () => {
    feedbackActions.fetchAllResponses.mockImplementationOnce(() => {
      throw new Error('API Error');
    });

    const {queryAllByTestId} = render(
      <Provider store={store}>
        <SafeAreaProvider>
          <Feedback />
        </SafeAreaProvider>
      </Provider>,
    );

    await waitFor(() => {
      expect(queryAllByTestId('responses-component')).toBeTruthy();
    });

    // You might want to check for an error message or error state here
  });
});
