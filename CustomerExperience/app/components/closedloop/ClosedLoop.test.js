import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import ClosedLoop from './ClosedLoop';

const mockStore = configureStore([]);

jest.mock('reanimated-bottom-sheet', () => {
  return jest.fn().mockImplementation(({children}) => {
    return <div>{children}</div>;
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
        userInfo: {
          feedbackApiKey: 'mock-feedback-api-key',
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
    expect(props.navigation.navigate).toHaveBeenCalledWith('TicketDetails', {
      prevScreen: 'TicketList',
      ticketItem: expect.anything(),
    });
    expect(props.navigation.navigate).toHaveBeenCalled();
  });

  // it('refreshes ticket list', () => {
  //   const {getByTestId} = render(
  //     <Provider store={store}>
  //       <ClosedLoop {...props} />
  //     </Provider>,
  //   );

  //   fireEvent.refresh(getByTestId('closed-loop-container'));
  //   expect(store.getActions()).toContainEqual(
  //     expect.objectContaining({
  //       type: 'SET_FILTER_STATE',
  //       payload: expect.objectContaining({pageNumber: 1}),
  //     }),
  //   );
  // });

  // it('loads more data', () => {
  //   const {getByTestId} = render(
  //     <Provider store={store}>
  //       <ClosedLoop {...props} />
  //     </Provider>,
  //   );

  //   fireEvent.scroll(getByTestId('closed-loop-container'), {
  //     nativeEvent: {
  //       contentOffset: {y: 100},
  //       layoutMeasurement: {height: 100},
  //       contentSize: {height: 200},
  //     },
  //   });

  //   expect(store.getActions()).toContainEqual(
  //     expect.objectContaining({
  //       type: 'SET_FILTER_STATE',
  //       payload: expect.objectContaining({pageNumber: 2}),
  //     }),
  //   );
  // });
});
