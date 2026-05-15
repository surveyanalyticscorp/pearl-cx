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
jest.mock('moment', () => {
  const originalMoment = jest.requireActual('moment');
  return {
    __esModule: true,
    default: jest.fn((date, format) => {
      if (format === 'DD/MM/YYYY') {
        return originalMoment('2024-01-01');
      }
      return originalMoment(date);
    }),
  };
});

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
    expect(tree).toBeTruthy();
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
      expect(feedbackActions.fetchAllResponses).toHaveBeenCalledTimes(3);
    });
  });

  it('pressing filter button does not crash', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <SafeAreaProvider>
          <Feedback />
        </SafeAreaProvider>
      </Provider>,
    );

    expect(getByTestId('safe-area-view')).toBeTruthy();
    expect(getByTestId('responses-component')).toBeTruthy();
    expect(() => fireEvent.press(getByTestId('on-press-filter'))).not.toThrow();
  });

  it('handles error in fetching feedback data', async () => {
    // Mock the fetchAllResponses to simulate an error without throwing
    feedbackActions.fetchAllResponses.mockImplementationOnce(
      (token, data, onSuccess, onError) => {
        // Simulate async error by calling onError callback
        setTimeout(() => onError(new Error('API Error')), 0);
        return {type: 'MOCK_FETCH_ALL_RESPONSES_ERROR'};
      },
    );

    const {getByTestId} = render(
      <Provider store={store}>
        <SafeAreaProvider>
          <Feedback />
        </SafeAreaProvider>
      </Provider>,
    );

    await waitFor(() => {
      expect(getByTestId('responses-component')).toBeTruthy();
    });

    // Verify the component still renders despite the error
    expect(getByTestId('safe-area-view')).toBeTruthy();
  });
});
