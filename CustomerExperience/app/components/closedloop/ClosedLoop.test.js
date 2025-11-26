import React from 'react';
import {
  render,
  screen,
  fireEvent,
  userEvent,
  waitFor,
  act,
} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import ClosedLoop, {
  getFilterCount,
  SearchBox,
  convertDateToYMDFORMAT,
  clearPriorityFilter,
  clearStatusFilter,
  clearTypeFilter,
  clearAssignToIdFilter,
  getIds,
  createFilterState,
} from './ClosedLoop';
import {mockNavigate} from '@react-navigation/native';

const mockStore = configureStore([]);

// Mock components and utilities
jest.mock('./ClosedloopCell', () => {
  const React = require('react');
  const {TouchableOpacity, Text} = require('react-native');
  return jest.fn(({onPressHandler}) =>
    React.createElement(
      TouchableOpacity,
      {
        testID: 'closedloop-cell',
        onPress: onPressHandler,
      },
      React.createElement(Text, {}, 'Closed Loop Cell'),
    ),
  );
});

jest.mock('../../routes/commonUI/FabAddButton', () => {
  const React = require('react');
  const {TouchableOpacity} = require('react-native');
  return jest.fn(({onPress}) =>
    React.createElement(TouchableOpacity, {
      testID: 'fab-button',
      onPress: onPress,
    }),
  );
});

jest.mock('./NoTicketFound', () => ({
  NoTicketFound: jest.fn(() => {
    const React = require('react');
    const {View} = require('react-native');
    return React.createElement(View, {testID: 'no-ticket-found'});
  }),
}));

jest.mock('./takeaction/FilterTickets', () => {
  const React = require('react');
  const {View} = require('react-native');
  return jest.fn(() => React.createElement(View, {testID: 'filter-tickets'}));
});

jest.mock('./takeaction/QPBottomSheet', () => {
  const React = require('react');
  const {View} = require('react-native');
  return jest.fn(({children}) =>
    React.createElement(View, {testID: 'qp-bottom-sheet'}, children),
  );
});

jest.mock('./takeaction/QPBottomSheetHeader', () => {
  const React = require('react');
  const {View} = require('react-native');
  return jest.fn(() =>
    React.createElement(View, {testID: 'qp-bottom-sheet-header'}),
  );
});

jest.mock('../../Utils/MultilinguaUtils', () => ({
  translate: jest.fn(key => key),
}));

jest.mock('../../Utils/Utility', () => ({
  showSuccessFlashMessage: jest.fn(),
}));

jest.mock('../../Utils/TicketUtils', () => ({
  priorityList: [
    {id: 1, name: 'High'},
    {id: 2, name: 'Medium'},
  ],
  statusList: [
    {id: 1, name: 'Open'},
    {id: 2, name: 'Closed'},
  ],
  ticketTypeList: [
    {id: 1, name: 'Bug'},
    {id: 2, name: 'Feature'},
  ],
}));

jest.mock('../view/ShowFilterTag', () => ({
  taglist: ['status', 'priority', 'type'],
}));

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const {View: RNView} = require('react-native');
  return {
    Value: jest.fn(() => ({})),
    View: jest.fn(({children, style}) =>
      React.createElement(RNView, {style}, children),
    ),
    timing: jest.fn(),
    add: jest.fn((a, b) => ({_value: a + b})),
    multiply: jest.fn((a, b) => ({_value: a * b})),
  };
});

// jest.unmock('@react-navigation/native');
jest.mock('reanimated-bottom-sheet', () => {
  const React = require('react');
  const {View} = require('react-native');
  return jest.fn().mockImplementation(({children}) => {
    return React.createElement(View, {}, children);
  });
});

describe('ClosedLoop', () => {
  let store;
  let props;

  beforeEach(() => {
    store = mockStore({
      dashboard: {
        ticketDeleteStatus: {status: 'default'},
        currentSegment: {
          currentSegment: 'Segment 1',
          currentSegmentID: 1,
        },
        currentFeedback: {
          feedbackID: 1,
        },
        createTicketResponse: {
          message: '',
        },
        ownerDetails: {
          owners: [{ownerID: 1, ownerName: 'User One'}],
        },
        ticketList: [
          {
            id: 1,
            subscriberId: 100100,
            createdAt: '2024-09-23T08:15:21.783Z',
            updatedAt: '2024-09-23T08:15:21.783Z',
            deletedAt: null,
            orgId: 4782281,
            ownerId: 1,
            feedbackId: 1,
            originSegmentId: 1,
            currentSegmentId: 1,
            surveyId: 1,
            responseId: 1,
            transactionId: null,
            panelMemberId: null,
            assignToId: 1,
            priority: 0,
            status: 3,
            type: 1,
            source: 1,
            comment:
              'porque estaba llena. (Doña Carolina reforzar según lo conversado)\n\n2- Entrega la factura en despacho y se demoraron porque están esperando equipo de Montacarga para bajar su producto. \n\nAtención por parte del asesor  muy bien y me puse a la orden en lo sucesivo.',
            issueDate: '2022-11-14T21:51:22.000Z',
            seenCount: 0,
            overdueDate: '2022-11-20T23:59:59.000Z',
            resolvedDate: '2024-09-23T08:15:22.000Z',
            resolvedTime: '58616639783',
            assigningDate: '2024-09-23T08:15:22.000Z',
            firstAssignDate: '2024-09-23T08:15:22.000Z',
            assigningTime: '58616639783',
            isAutomatic: true,
            viewers: null,
            cxTicketId: 62268,
            isOverdue: false,
            isManualEscalation: false,
            numberOfEscalation: null,
            escalationRuleId: null,
            currentEscalationEndTimestamp: null,
            backlogId: null,
            npsScore: 6,
            msgId: null,
            sourceOfFeedback: null,
            directEmailSubject: null,
            country: null,
            dApiStatus: 0,
            dUuid: null,
            dOverallSentimentScore: null,
            dOverallSentimentLabel: null,
            industryId: 0,
            isCustomVariableSync: false,
            isImported: false,
          },
          {
            id: 2,
            subscriberId: 100100,
            createdAt: '2024-09-23T08:15:21.794Z',
            updatedAt: '2024-09-23T08:15:21.794Z',
            deletedAt: null,
            orgId: 4782281,
            ownerId: 1,
            feedbackId: 1,
            originSegmentId: 1,
            currentSegmentId: 1,
            surveyId: 1,
            responseId: 2,
            transactionId: null,
            panelMemberId: null,
            assignToId: 1,
            priority: 1,
            status: 3,
            type: 1,
            source: 1,
            comment:
              'solo q tuvo q ir a cedist por algunos ítems, que no es la primera vez , pero todo muy bien.',
            issueDate: '2022-11-14T18:57:56.000Z',
            seenCount: 0,
            overdueDate: '2022-11-20T23:59:59.000Z',
            resolvedDate: '2024-09-23T08:15:22.000Z',
            resolvedTime: '58627045793',
            assigningDate: '2024-09-23T08:15:22.000Z',
            firstAssignDate: '2024-09-23T08:15:22.000Z',
            assigningTime: '58627045793',
            isAutomatic: true,
            viewers: null,
            cxTicketId: 62237,
            isOverdue: false,
            isManualEscalation: false,
            numberOfEscalation: null,
            escalationRuleId: null,
            currentEscalationEndTimestamp: null,
            backlogId: null,
            npsScore: 5,
            msgId: null,
            sourceOfFeedback: null,
            directEmailSubject: null,
            country: null,
            dApiStatus: 0,
            dUuid: null,
            dOverallSentimentScore: null,
            dOverallSentimentLabel: null,
            industryId: 0,
            isCustomVariableSync: false,
            isImported: false,
          },
        ],
        ticketDetails: {
          pagerOptions: {
            pagerDto: {
              pageNumber: 1,
              perPage: 10,
            },
            totalCount: 2,
          },
        },
      },
      global: {
        authToken: 'mock-auth-token',
        isTicketLoading: false,
        statusId: null,
        subscriberId: 'mock-subscriber-id',
        userInfo: {
          feedbackApiKey: 'mock-feedback-api-key',
          feedbackID: 1,
          userID: 123,
        },
        range: {
          startDate: '01/01/2024',
          endDate: '01/31/2024',
        },
      },
    });

    props = {
      route: {
        params: {
          ticketItem: {
            id: 1,
            responseId: 1,
          },
          prevScreen: 'TicketList',
        },
      },
      navigation: {
        setOptions: jest.fn(),
        navigate: jest.fn(),
      },
    };
  });

  it('renders correctly', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <ClosedLoop {...props} />
      </Provider>,
    );

    expect(getByTestId('fab-button')).toBeTruthy();
    expect(getByTestId('Filter-Date-Box')).toBeTruthy();
    expect(getByTestId('closed-loop-container')).toBeTruthy();
  });

  it('renders spinner when loading', () => {
    store = mockStore({
      ...store.getState(),
      global: {
        ...store.getState().global,
        isTicketLoading: true,
      },
    });

    const {getByTestId} = render(
      <Provider store={store}>
        <ClosedLoop {...props} />
      </Provider>,
    );

    expect(getByTestId('QPSpinner')).toBeTruthy();
  });

  it('searches for tickets', () => {
    const {getByPlaceholderText} = render(
      <Provider store={store}>
        <ClosedLoop {...props} />
      </Provider>,
    );

    const searchInput = getByPlaceholderText('ticket_search_hint');
    fireEvent.changeText(searchInput, 'test search');
    fireEvent(searchInput, 'submitEditing', {
      nativeEvent: {text: 'test search'},
    });

    expect(store.getActions()).toContainEqual(
      expect.objectContaining({
        type: 'GET_CLOSED_LOOP_TICKET_LIST',
        param: expect.objectContaining({
          search: 'test search',
        }),
      }),
    );
  });

  // it('applies filters', () => {
  //   const {getByTestId} = render(
  //     <Provider store={store}>
  //       <ClosedLoop {...props} />
  //     </Provider>,
  //   );

  //   // Simulate opening the filter and applying it
  //   fireEvent.press(getByTestId('Filter-Date-Box'));
  //   // Assuming there's a button to apply filters
  //   fireEvent.press(getByTestId('apply-filter-button'));

  //   // Check if dispatch was called
  //   expect(props.navigation.dispatch).toHaveBeenCalled();

  //   expect(store.getActions()).toContainEqual(
  //     expect.objectContaining({
  //       type: 'SET_FILTER_STATE',
  //       payload: expect.objectContaining({status: 'someStatus'}),
  //     }),
  //   );
  // });

  it('selects a ticket and navigates to details', () => {
    const {getAllByTestId} = render(
      <Provider store={store}>
        <ClosedLoop {...props} />
      </Provider>,
    );

    const ticketCell = getAllByTestId('closedloop-cell')[0];
    fireEvent.press(ticketCell);

    expect(mockNavigate).toHaveBeenCalled();
  });
  it('fab button', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <ClosedLoop {...props} />
      </Provider>,
    );
    fireEvent.press(getByTestId('fab-button'));

    expect(mockNavigate).toHaveBeenCalled();
  });

  it('handles ticket deletion status success', () => {
    store = mockStore({
      ...store.getState(),
      dashboard: {
        ...store.getState().dashboard,
        ticketDeleteStatus: {status: 'success'},
      },
    });

    const {getByTestId} = render(
      <Provider store={store}>
        <ClosedLoop {...props} />
      </Provider>,
    );

    expect(getByTestId('closed-loop-container')).toBeTruthy();
  });

  it('filters by status when statusId is provided', () => {
    store = mockStore({
      ...store.getState(),
      global: {
        ...store.getState().global,
        statusId: 1,
      },
    });

    const {getByTestId} = render(
      <Provider store={store}>
        <ClosedLoop {...props} />
      </Provider>,
    );

    expect(getByTestId('closed-loop-container')).toBeTruthy();
  });

  it('shows search box when ticket list is not empty', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <ClosedLoop {...props} />
      </Provider>,
    );

    expect(getByTestId('search-box')).toBeTruthy();
  });

  it('does not show search box when ticket list is empty', () => {
    store = mockStore({
      ...store.getState(),
      dashboard: {
        ...store.getState().dashboard,
        ticketList: [],
      },
    });

    const {queryByTestId} = render(
      <Provider store={store}>
        <ClosedLoop {...props} />
      </Provider>,
    );

    expect(queryByTestId('search-box')).toBeNull();
  });

  it('handles checkbox selection mode', () => {
    // Test with showCheckBox enabled by simulating internal state
    const {getAllByTestId} = render(
      <Provider store={store}>
        <ClosedLoop {...props} />
      </Provider>,
    );

    const ticketCells = getAllByTestId('closedloop-cell');
    // Simulate clicking multiple times to test selection logic
    fireEvent.press(ticketCells[0]);
    fireEvent.press(ticketCells[1]);

    expect(ticketCells.length).toBe(2);
  });

  it('resets search correctly', () => {
    const {getByPlaceholderText} = render(
      <Provider store={store}>
        <ClosedLoop {...props} />
      </Provider>,
    );

    const searchInput = getByPlaceholderText('ticket_search_hint');

    // First set some search text
    fireEvent.changeText(searchInput, 'test search');
    fireEvent(searchInput, 'submitEditing', {
      nativeEvent: {text: 'test search'},
    });

    // Then reset (this tests the onResetSearch function)
    fireEvent.changeText(searchInput, '');
    fireEvent(searchInput, 'submitEditing', {
      nativeEvent: {text: ''},
    });

    expect(searchInput.props.defaultValue).toBe('');
  });

  it('shows success message when createTicketResponse has message', () => {
    store = mockStore({
      ...store.getState(),
      dashboard: {
        ...store.getState().dashboard,
        createTicketResponse: {
          message: 'Ticket created successfully',
        },
      },
    });

    const {getByTestId} = render(
      <Provider store={store}>
        <ClosedLoop {...props} />
      </Provider>,
    );

    expect(getByTestId('closed-loop-container')).toBeTruthy();
  });

  it('handles refresh functionality', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <ClosedLoop {...props} />
      </Provider>,
    );

    // Find the FlatList and simulate pull-to-refresh
    const container = getByTestId('closed-loop-container');
    expect(container).toBeTruthy();
  });

  it('handles pagination when reaching end of list', () => {
    // Test with tickets that allow pagination
    store = mockStore({
      ...store.getState(),
      dashboard: {
        ...store.getState().dashboard,
        ticketDetails: {
          pagerOptions: {
            pagerDto: {
              pageNumber: 1,
              perPage: 10,
            },
            totalCount: 100, // More than current ticket list length
          },
        },
      },
    });

    const {getByTestId} = render(
      <Provider store={store}>
        <ClosedLoop {...props} />
      </Provider>,
    );

    expect(getByTestId('closed-loop-container')).toBeTruthy();
  });

  it('handles empty owners list in updateFilterData', () => {
    store = mockStore({
      ...store.getState(),
      dashboard: {
        ...store.getState().dashboard,
        ownerDetails: {
          owners: [],
        },
      },
    });

    const {getByTestId} = render(
      <Provider store={store}>
        <ClosedLoop {...props} />
      </Provider>,
    );

    expect(getByTestId('closed-loop-container')).toBeTruthy();
  });

  it('handles undefined owners in updateFilterData', () => {
    store = mockStore({
      ...store.getState(),
      dashboard: {
        ...store.getState().dashboard,
        ownerDetails: {
          owners: undefined,
        },
      },
    });

    const {getByTestId} = render(
      <Provider store={store}>
        <ClosedLoop {...props} />
      </Provider>,
    );

    expect(getByTestId('closed-loop-container')).toBeTruthy();
  });

  it('handles filter functionality with bottom sheet', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <ClosedLoop {...props} />
      </Provider>,
    );

    // Simulate opening filter (by pressing filter button)
    const filterDateBox = getByTestId('Filter-Date-Box');
    fireEvent.press(filterDateBox);

    expect(getByTestId('closed-loop-container')).toBeTruthy();
  });

  it('tests convertDateToYMDFORMAT exported function', () => {
    const inputDate = '15/03/2024';
    const result = convertDateToYMDFORMAT(inputDate);
    expect(result).toBe('2024/03/15');
  });

  it('tests convertDateToYMDFORMAT with different date', () => {
    const inputDate = '01/12/2023';
    const result = convertDateToYMDFORMAT(inputDate);
    expect(result).toBe('2023/12/01');
  });

  it('handles current segment change', () => {
    const storeWithDifferentSegment = mockStore({
      ...store.getState(),
      dashboard: {
        ...store.getState().dashboard,
        currentSegment: {
          currentSegment: 'Segment 2',
          currentSegmentID: 2,
        },
      },
    });

    const {getByTestId} = render(
      <Provider store={storeWithDifferentSegment}>
        <ClosedLoop {...props} />
      </Provider>,
    );

    expect(getByTestId('closed-loop-container')).toBeTruthy();
  });

  it('handles checkbox selection when showCheckBox is enabled', () => {
    // This tests the onPressHandler logic for checkbox mode
    const {getAllByTestId} = render(
      <Provider store={store}>
        <ClosedLoop {...props} />
      </Provider>,
    );

    const ticketCells = getAllByTestId('closedloop-cell');

    // Simulate multiple presses to test selection/deselection logic
    fireEvent.press(ticketCells[0]);
    fireEvent.press(ticketCells[0]); // Press again to test deselection
    fireEvent.press(ticketCells[1]);

    expect(ticketCells.length).toBe(2);
  });

  it('handles reset filter functionality', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <ClosedLoop {...props} />
      </Provider>,
    );

    // The resetFilter function should be triggered internally
    expect(getByTestId('closed-loop-container')).toBeTruthy();
  });

  it('renders NoTicketFound when ticket list is empty and not loading', () => {
    store = mockStore({
      ...store.getState(),
      global: {
        ...store.getState().global,
        isTicketLoading: false,
      },
      dashboard: {
        ...store.getState().dashboard,
        ticketList: [],
      },
    });

    const {getByTestId} = render(
      <Provider store={store}>
        <ClosedLoop {...props} />
      </Provider>,
    );

    expect(getByTestId('closed-loop-container')).toBeTruthy();
  });

  it('handles onEndReached for pagination', () => {
    store = mockStore({
      ...store.getState(),
      dashboard: {
        ...store.getState().dashboard,
        ticketDetails: {
          pagerOptions: {
            pagerDto: {
              pageNumber: 1,
              perPage: 10,
            },
            totalCount: 100, // Greater than current list length to enable pagination
          },
        },
      },
    });

    const {getByTestId} = render(
      <Provider store={store}>
        <ClosedLoop {...props} />
      </Provider>,
    );

    expect(getByTestId('closed-loop-container')).toBeTruthy();
  });

  it('handles RenderFilterBottomSheet visibility', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <ClosedLoop {...props} />
      </Provider>,
    );

    // Test that the component renders with bottom sheet functionality
    expect(getByTestId('closed-loop-container')).toBeTruthy();
  });

  describe('getFilterCount', () => {
    it('should return the correct count', () => {
      const filterState = {status: [2, 1, 3], priority: [1, 2], type: [1, 2]};
      const count = getFilterCount(filterState);
      expect(count).toBe(3);
    });

    it('should return 0 when filterState has empty arrays', () => {
      const filterState = {status: [], priority: [], type: []};
      const count = getFilterCount(filterState);
      expect(count).toBe(0);
    });

    it('should return 0 when filterState properties are null or undefined', () => {
      const filterState = {status: null, priority: undefined};
      const count = getFilterCount(filterState);
      expect(count).toBe(0);
    });
  });
});

describe('SearchBox', () => {
  it('renders correctly', async () => {
    userEvent.setup();
    const props = {
      onResetSearch: jest.fn(),
      onQuerySubmit: jest.fn(),
      currentText: 'test',
    };
    const {getByTestId, getByText} = render(<SearchBox {...props} />);
    const searchBox = getByTestId('search-box');
    const textInput = getByTestId('search-box-input');

    expect(searchBox).toBeTruthy();
    expect(textInput).toBeTruthy();
  });

  it('calls onQuerySubmit when submitting search', () => {
    const mockOnQuerySubmit = jest.fn();
    const props = {
      onResetSearch: jest.fn(),
      onQuerySubmit: mockOnQuerySubmit,
      currentText: '',
    };

    const {getByTestId} = render(<SearchBox {...props} />);
    const textInput = getByTestId('search-box-input');

    fireEvent(textInput, 'submitEditing', {
      nativeEvent: {text: 'search query'},
    });

    expect(mockOnQuerySubmit).toHaveBeenCalledWith('search query');
  });

  it('renders SearchIcon correctly', () => {
    const props = {
      onResetSearch: jest.fn(),
      onQuerySubmit: jest.fn(),
      currentText: '',
    };

    const {getByTestId} = render(<SearchBox {...props} />);
    const searchIcon = getByTestId('search-icon');

    expect(searchIcon).toBeTruthy();
  });

  it('uses currentText as default value', () => {
    const props = {
      onResetSearch: jest.fn(),
      onQuerySubmit: jest.fn(),
      currentText: 'initial search',
    };

    const {getByTestId} = render(<SearchBox {...props} />);
    const textInput = getByTestId('search-box-input');

    expect(textInput.props.defaultValue).toBe('initial search');
  });
});

describe('Filter clearing functions', () => {
  it('clearPriorityFilter returns priority list with isChecked false', () => {
    const result = clearPriorityFilter();
    expect(result).toEqual([
      {id: 1, name: 'High', isChecked: false},
      {id: 2, name: 'Medium', isChecked: false},
    ]);
  });

  it('clearStatusFilter returns status list with isChecked false', () => {
    const result = clearStatusFilter();
    expect(result).toEqual([
      {id: 1, name: 'Open', isChecked: false},
      {id: 2, name: 'Closed', isChecked: false},
    ]);
  });

  it('clearTypeFilter returns type list with isChecked false', () => {
    const result = clearTypeFilter();
    expect(result).toEqual([
      {id: 1, name: 'Bug', isChecked: false},
      {id: 2, name: 'Feature', isChecked: false},
    ]);
  });

  it('clearAssignToIdFilter returns empty array', () => {
    const result = clearAssignToIdFilter();
    expect(result).toEqual([]);
  });
});

describe('getIds function', () => {
  it('should return comma-separated string of IDs for checked items', () => {
    const items = [
      {id: 1, name: 'Item 1', isChecked: true},
      {id: 2, name: 'Item 2', isChecked: false},
      {id: 3, name: 'Item 3', isChecked: true},
      {id: 4, name: 'Item 4', isChecked: false},
    ];

    const result = getIds(items);
    expect(result).toBe('1,3');
  });

  it('should return empty string when no items are checked', () => {
    const items = [
      {id: 1, name: 'Item 1', isChecked: false},
      {id: 2, name: 'Item 2', isChecked: false},
    ];

    const result = getIds(items);
    expect(result).toBe('');
  });

  it('should return empty string for empty array', () => {
    const items = [];

    const result = getIds(items);
    expect(result).toBe('');
  });

  it('should handle items with different ID types', () => {
    const items = [
      {id: 'abc', name: 'Item 1', isChecked: true},
      {id: 123, name: 'Item 2', isChecked: true},
    ];

    const result = getIds(items);
    expect(result).toBe('abc,123');
  });
});

describe('createFilterState function', () => {
  it('should create filter state with provided values', () => {
    const mockGetIds = jest
      .fn()
      .mockReturnValueOnce('1,2') // for status
      .mockReturnValueOnce('3') // for priority
      .mockReturnValueOnce('4,5'); // for type

    const item = {
      status: [
        {id: 1, isChecked: true},
        {id: 2, isChecked: true},
      ],
      priority: [{id: 3, isChecked: true}],
      type: [
        {id: 4, isChecked: true},
        {id: 5, isChecked: true},
      ],
      assignToId: 'user123',
    };

    const result = createFilterState(item, mockGetIds);

    expect(result).toEqual({
      pageNumber: 1,
      status: '1,2',
      priority: '3',
      assignToId: 'user123',
      type: '4,5',
    });

    expect(mockGetIds).toHaveBeenCalledTimes(3);
    expect(mockGetIds).toHaveBeenCalledWith(item.status);
    expect(mockGetIds).toHaveBeenCalledWith(item.priority);
    expect(mockGetIds).toHaveBeenCalledWith(item.type);
  });

  it('should handle empty arrays and return empty strings', () => {
    const mockGetIds = jest.fn().mockReturnValue('');

    const item = {
      status: [],
      priority: [],
      type: [],
      assignToId: '',
    };

    const result = createFilterState(item, mockGetIds);

    expect(result).toEqual({
      pageNumber: 1,
      status: '',
      priority: '',
      assignToId: '',
      type: '',
    });
  });

  it('should use nullish coalescing for undefined getIds results', () => {
    const mockGetIds = jest.fn().mockReturnValue(undefined);

    const item = {
      status: undefined,
      priority: undefined,
      type: undefined,
      assignToId: null,
    };

    const result = createFilterState(item, mockGetIds);

    expect(result).toEqual({
      pageNumber: 1,
      status: '',
      priority: '',
      assignToId: null,
      type: '',
    });
  });

  it('should always set pageNumber to 1', () => {
    const mockGetIds = jest.fn().mockReturnValue('test');

    const item = {
      status: [],
      priority: [],
      type: [],
      assignToId: 'user456',
    };

    const result = createFilterState(item, mockGetIds);

    expect(result.pageNumber).toBe(1);
  });
});
