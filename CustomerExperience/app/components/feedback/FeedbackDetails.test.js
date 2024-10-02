import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import FeedbackDetails from './FeedbackDetails';

jest.mock('../../redux/actions/feedback.actions', () => ({
  getPanelMemberDetails: jest.fn(() => ({
    type: 'MOCK_GET_PANEL_MEMBER_DETAILS',
  })),
  getResponseTickets: jest.fn(() => ({type: 'MOCK_GET_RESPONSE_TICKETS'})),
  setResponseReadList: jest.fn(() => ({type: 'MOCK_SET_RESPONSE_READ_LIST'})),
}));

jest.mock('../../redux/actions/closedloop.actions', () => ({
  getLatestComment: jest.fn(() => ({type: 'MOCK_GET_LATEST_COMMENT'})),
  getTicketStatusHistory: jest.fn(() => ({
    type: 'MOCK_GET_TICKET_STATUS_HISTORY',
  })),
}));

const mockStore = configureStore([]);

describe('FeedbackDetails', () => {
  let store;
  let props;

  const initialState = {
    global: {
      authToken: 'mock-token',
      userInfo: {
        feedbackApiKey: 'mock-api-key',
        feedbackID: 'mock-feedback-id',
      },
    },
    response: {
      responseTickets: {
        data: [],
      },
      panelMember: {
        totalSurveysResponded: 5,
        name: 'John Doe',
        phone: '1234567890',
        emailAddress: 'john@example.com',
      },
      surveyDetails: {
        // Add any necessary survey details here
      },
      ticketStatusHistory: [
        {title: 'Open'},
        {title: 'Closed'},

        {title: 'Escalated'},
        {title: 'Resolved'},
        {title: 'Overdue'},
      ],
      ticketLastComment: {
        commentBy: 'Admin',
        text: 'This is the last comment.',
        createdAt: '2024-09-25T08:50:48.853Z',
      },
    },
  };
  const initialStateWithPaneMemberMissing = {
    global: {
      authToken: 'mock-token',
      userInfo: {
        feedbackApiKey: 'mock-api-key',
        feedbackID: 'mock-feedback-id',
      },
    },
    response: {
      responseTickets: {
        data: [
          {
            id: '123',
            responseId: 'resp-789',
            // Add other necessary ticket properties
            surveyTakenDate: '2023-04-15',
            emailAddress: 'john@example.com',
            answerText: 'This is a test comment',
            sentiment: 'All',
            read: false,
            responseSetID: '1',
          },
        ],
      },
      panelMember: {
        totalSurveysResponded: 5,
        name: null,
        phone: null,
        emailAddress: null,
      },
      surveyDetails: {
        // Add any necessary survey details here
      },
      ticketStatusHistory: [
        {title: 'Open'},
        {title: 'Closed'},

        {title: 'Escalated'},
        {title: 'Resolved'},
        {title: 'Overdue'},
      ],
      ticketLastComment: {
        commentBy: 'Admin',
        text: 'This is the last comment.',
        createdAt: '2024-09-25T08:50:48.853Z',
      },
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);

    props = {
      route: {
        params: {
          data: {
            responseSetID: '123',
            panelMemberID: '456',
            responseDataURL: 'https://example.com',
            memberProfileURL: 'https://example.com/profile',
            activityURL: 'https://example.com/activity',
            surveyTakenDate: '2023-04-15',
          },
          isFromFeedback: true,
          token: 'mock-token',
        },
      },
      navigation: {
        setOptions: jest.fn(),

        // Mock navigate function to test onPressHandler
        navigate: jest.fn().mockImplementation((route, params) => {
          console.log('NAVIGATE', route, params);
          return {
            type: 'PUSH',
            route,
            params,
          };
        }),
      },
    };
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <FeedbackDetails {...props} />
      </Provider>,
    );

  it('renders correctly', () => {
    const {getByTestId} = renderComponent();
    expect(getByTestId('feedback-details')).toBeTruthy();
  });

  it('renders FeedbackDetailsTabStack', () => {
    const {getByTestId} = renderComponent();
    expect(getByTestId('tab-navigator')).toBeTruthy();
  });

  it('renders all three tab screens', () => {
    const {getByTestId} = renderComponent();
    expect(getByTestId('tab-screen-responses.feedback')).toBeTruthy();
    expect(getByTestId('tab-screen-responses.profile')).toBeTruthy();
    expect(getByTestId('tab-screen-responses.activity')).toBeTruthy();
  });

  // Add test cases for ResponseActivity
  it('renders ResponseActivity correctly', () => {
    const {getByTestId} = renderComponent();
    const ResponseActivity = getByTestId('tab-screen-responses.activity');
    expect(ResponseActivity).toBeTruthy();
  });

  it('displays the last comment in ResponseActivity', () => {
    const {getByText} = renderComponent();
    expect(getByText('Last comment: Sep 25, 2024 2:50:48 PM')).toBeTruthy();
    expect(getByText('This is the last comment.')).toBeTruthy();
  });

  it('renders ticket status history in ResponseActivity', () => {
    const {getByText} = renderComponent();
    expect(getByText('Status Changes')).toBeTruthy();
    expect(getByText('Open')).toBeTruthy();
    expect(getByText('Closed')).toBeTruthy();
    expect(getByText('Resolved')).toBeTruthy();
    expect(getByText('Escalated')).toBeTruthy();
    expect(getByText('Overdue')).toBeTruthy();
  });
  it('renders ResponseProfile', () => {
    const {getByText} = renderComponent();
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('1234567890')).toBeTruthy();
    expect(getByText('john@example.com')).toBeTruthy();
  });
  it('renders ResponseProfile with no name', () => {
    // test for responseProfile

    store = mockStore(initialStateWithPaneMemberMissing);

    const {getAllByText} = renderComponent();
    expect(getAllByText('N/A').length).toBe(3);
  });

  it('calls onPressHandler when ResponseTicketCell is pressed', () => {
    store = mockStore(initialStateWithPaneMemberMissing);
    // add mock for props.navigation.navigate to test onPressHandler
    const {getAllByTestId} = renderComponent();

    const ticketCells = getAllByTestId('TouchableWithoutFeedback');
    expect(ticketCells.length).toBe(3); // Ensure there is only one cell
    // Simulate pressing the ticket cell
    fireEvent.press(ticketCells[2]);
    expect(ticketCells[2]).toHaveBeenCalled();

    // Check if navigate was called with the correct parameters
    // expect(props.navigation.navigate).toHaveBeenCalledWith('TicketDetails', {
    //   ticketItem: expect.anything(),
    //   prevScreen: 'dashboard.responses',
    // });
  });

  // test onPressHandler and onPressViewTicket for FeedbackDetails
  // it('calls onPressHandler when ResponseTicketCell is pressed', () => {
  //   store = mockStore(initialStateWithPaneMemberMissing);
  //   const {getAllByTestId} = renderComponent();
  //   const cell = getAllByTestId('TouchableWithoutFeedback')[0];
  //   fireEvent.press(cell);
  //   expect(props.navigation.navigate).toHaveBeenCalled();
  //   // expect(props.navigation.navigate).toHaveBeenCalledWith('TicketDetails', {
  //   //   ticketItem: expect.anything(), // Adjust this based on your actual item structure
  //   //   prevScreen: 'dashboard.responses',
  //   // });
  // });
});
