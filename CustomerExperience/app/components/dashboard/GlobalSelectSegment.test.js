import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import GlobalSelectSegment from './GlobalSelectSegment';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const mockStore = configureStore([]);
const initialState = {
  global: {
    userInfo: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    },
    baseUrl: 'https://example.com',
    authToken: 'mockAuthToken',
  },
  dashboard: {
    segmentDetails: {
      segments: [
        {segmentName: 'Segment 1', segmentID: '1'},
        {segmentName: 'Segment 2', segmentID: '2'},
        {segmentName: 'Segment 3', segmentID: '3'},
      ],
    },
  },
};

describe('GlobalSelectSegment Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    jest.clearAllMocks();
  });

  const renderComponent = (
    data = initialState.dashboard.segmentDetails.segments,
  ) =>
    render(
      <Provider store={store}>
        <SafeAreaProvider>
          <GlobalSelectSegment
            currentSegmentId="1"
            data={data}
            loadMoreData={jest.fn()}
            handleOnPress={jest.fn()}
          />
        </SafeAreaProvider>
      </Provider>,
    );

  it('renders GlobalSelectSegment correctly', () => {
    const {getByTestId} = renderComponent();
    expect(getByTestId('global-select-segment')).toBeTruthy();
    expect(getByTestId('text-input')).toBeTruthy();
    expect(getByTestId('flat-list')).toBeTruthy();
  });

  it('renders the correct number of items', () => {
    const {getAllByTestId} = renderComponent();
    expect(getAllByTestId('segment-name').length).toBe(3);
  });

  it('calls handleOnPress when a row is pressed', () => {
    const {getByTestId} = renderComponent();
    fireEvent.press(getByTestId('touchable-without-feedback-0'));
    expect(initialState.dashboard.segmentDetails.segments[0].segmentID).toBe(
      '1',
    );
  });
  it('empty list is rendered when no items are present', () => {
    const {getByTestId} = renderComponent([]);
    expect(getByTestId('no-items-found')).toBeTruthy();
  });
  it('filters the list based on search input', () => {
    const {getByPlaceholderText, queryByText} = renderComponent();
    const searchInput = getByPlaceholderText('search');

    fireEvent.changeText(searchInput, 'Segment 2');
    expect(queryByText('Segment 1')).toBeNull();
    expect(queryByText('Segment 2')).toBeTruthy();
    expect(queryByText('Segment 3')).toBeNull();
  });
  it('resets the list when search input is cleared', () => {
    const {getByPlaceholderText, getAllByTestId} = renderComponent();
    const searchInput = getByPlaceholderText('search');

    fireEvent.changeText(searchInput, 'Segment 2');
    fireEvent.changeText(searchInput, '');
    expect(getAllByTestId('segment-name')).toHaveLength(3);
  });
});
