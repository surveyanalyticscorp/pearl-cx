import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import SelectSegmentScreen, {SearchTextInput} from './SelectSegmentScreen';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';

const initialState = {
  global: {
    authToken: 'mock-auth-token',
    userInfo: {
      userID: 'mock-user-id',
      userName: 'mock-user-name',
      email: 'mock-email',
      phone: 'mock-phone',
    },
  },
  dashboard: {
    segmentList: [
      {
        segmentID: '1',
        segmentName: 'Segment 1',
      },
      {
        segmentID: '2',
        segmentName: 'Segment 2',
      },
    ],
    currentSegment: {currentSegmentID: '1'},
  },
};

const mockStore = configureStore([]);

let store;
let mockProps;
beforeEach(() => {
  store = mockStore(initialState);
  jest.clearAllMocks();
});

// generate a mock props obejct for SelectSegmentScreen
const generateMockProps = () => {
  return {
    route: {
      params: {
        currentSegmentId: '1',
        setSegmentSelection: jest.fn(),
      },
    },
  };
};

describe('SelectSegmentScreen', () => {
  it('renders correctly', () => {
    const {getByText} = render(
      <Provider store={store}>
        <SelectSegmentScreen {...generateMockProps()} />
      </Provider>,
    );
    expect(getByText('select_segment.select_segment')).toBeTruthy();
  });

  it('renders correctly with no segments', () => {
    const mockProps = generateMockProps();
    mockProps.route.params.currentSegmentId = '1';
    mockProps.route.params.setSegmentSelection = jest.fn();
    store = mockStore({
      ...initialState,
      dashboard: {
        segmentList: [],
        currentSegment: {currentSegmentID: '1'},
      },
    });

    const {getByText} = render(
      <Provider store={store}>
        <SelectSegmentScreen {...mockProps} />
      </Provider>,
    );
    expect(getByText('No Segment found')).toBeTruthy();
  });

  it('renders correctly with segments', () => {
    const mockProps = generateMockProps();
    mockProps.route.params.currentSegmentId = '1';
    mockProps.route.params.setSegmentSelection = jest.fn();

    const {getByText} = render(
      <Provider store={store}>
        <SelectSegmentScreen {...mockProps} />
      </Provider>,
    );
    expect(getByText('Segment 1')).toBeTruthy();
    expect(getByText('Segment 2')).toBeTruthy();
  });

  it('calls setSegmentSelection when segment is selected', async () => {
    const mockProps = generateMockProps();
    mockProps.route.params.currentSegmentId = '1';
    mockProps.route.params.setSegmentSelection = jest.fn();

    const {getByText} = render(
      <Provider store={store}>
        <SelectSegmentScreen {...mockProps} />
      </Provider>,
    );

    fireEvent.press(getByText('Segment 1'));
    await waitFor(() => {
      expect(mockProps.route.params.setSegmentSelection).toHaveBeenCalled();
    });
  });

  // test onSearchHandler
  // it('should call onSearchHandler when search button is pressed', async () => {
  //   const mockProps = {
  //     ...generateMockProps(),
  //     onSearchHandler: jest.fn(text => {
  //       console.log('SEARCH_HANDLER', text);
  //     }),
  //   };
  //   const {getByTestId} = render(
  //     <Provider store={store}>
  //       <SelectSegmentScreen {...mockProps} />
  //     </Provider>,
  //   );
  //   const testText = 'test';
  //   const input = getByTestId('search-input');
  //   fireEvent.changeText(input, testText);
  //   fireEvent(input, 'onSubmitEditing', {nativeEvent: {text: testText}});

  //   expect(mockProps.onSearchHandler).toHaveBeenCalledWith(testText);
  // });
});

// describe('SearchTextInput', () => {
//   it('renders corrctly', () => {
//     const props = {
//       ref: jest.fn(),
//       onSearchHandler: jest.fn(),
//       searchText: 'test',
//     };

//     const searchInput = render(<SearchTextInput {...props} />);
//     expect(searchInput).toBeTruthy();
//   });
// });
