import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import TicketOverview from './TicketOverview';
import BottomSheet from 'reanimated-bottom-sheet';

// Mock the necessary dependencies
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  StackActions: {
    push: jest.fn(),
  },
}));

jest.mock('reanimated-bottom-sheet', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      snapTo: jest.fn(),
    })),
  };
});

const mockStore = configureStore([]);

describe('TicketOverview', () => {
  let store;
  let props;

  beforeEach(() => {
    store = mockStore({
      global: {
        isTicketLoading: false,
        userInfo: {
          emailAddress: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          userID: '123',
          feedbackApiKey: 'api-key',
        },
        authToken: 'test-token',
      },
      dashboard: {
        ticketDeleteStatus: {status: 'default'},
        ticket: {
          id: '1',
          status: 1,
          priority: 2,
          assignToId: 456,
          panelMember: {
            name: 'Test User',
            email: 'testuser@example.com',
            phone: '1234567890',
          },
          comment: 'Test comment',
          currentSegment: {
            name: 'Test Segment',
          },
        },
        ownerDetails: {
          owners: [{ownerID: 456, name: 'Test Owner'}],
        },
      },
    });

    props = {
      route: {
        params: {
          prevScreen: 'dashboard.closed_loop',
        },
      },
      navigation: {
        goBack: jest.fn(),
      },
    };
  });

  it('renders correctly', async () => {
    const {getAllByTestId} = render(
      <Provider store={store}>
        <TicketOverview {...props} />
      </Provider>,
    );

    await waitFor(() => {
      expect(getAllByTestId('description-header')[0]).toBeTruthy();
    });
  });

  it('displays ticket information correctly', async () => {
    const {getByText} = render(
      <Provider store={store}>
        <TicketOverview {...props} />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByText('Test Segment')).toBeTruthy();
      expect(getByText('Test User')).toBeTruthy();
      expect(getByText('testuser@example.com')).toBeTruthy();
      expect(getByText('1234567890')).toBeTruthy();
      expect(getByText('Test comment')).toBeTruthy();
    });
  });

  // it('handles take action button press', async () => {
  //   const {getByTestId} = render(
  //     <Provider store={store}>
  //       <TicketOverview {...props} />
  //     </Provider>,
  //   );

  //   await waitFor(() => {
  //     const takeActionButton = getByTestId('TakeActionButton');
  //     fireEvent.press(takeActionButton);
  //   });

  //   // Add assertions for the expected behavior after pressing the button
  //   // For example, check if the bottom sheet is opened
  // });

  // it('handles delete button press', async () => {
  //   const {getByTestId, getByText} = render(
  //     <Provider store={store}>
  //       <TicketOverview {...props} />
  //     </Provider>,
  //   );

  //   await waitFor(() => {
  //     const deleteButton = getByTestId('DeleteButtonAction');
  //     fireEvent.press(deleteButton);
  //   });

  //   await waitFor(() => {
  //     expect(getByText('Would you like to delete this ticket?')).toBeTruthy();
  //   });

  //   // You can add more assertions here to test the delete confirmation dialog
  // });

  // it('updates ticket status', async () => {
  //   const {getByText} = render(
  //     <Provider store={store}>
  //       <TicketOverview {...props} />
  //     </Provider>,
  //   );

  //   await waitFor(() => {
  //     const statusDropdown = getByText('Open');
  //     fireEvent.press(statusDropdown);
  //   });

  //   // Add assertions for the status selection bottom sheet
  //   // and test the status update functionality
  // });

  // it('updates ticket priority', async () => {
  //   const {getByText} = render(
  //     <Provider store={store}>
  //       <TicketOverview {...props} />
  //     </Provider>,
  //   );

  //   await waitFor(() => {
  //     const priorityDropdown = getByText('Medium');
  //     fireEvent.press(priorityDropdown);
  //   });

  //   // Add assertions for the priority selection bottom sheet
  //   // and test the priority update functionality
  // });

  // it('updates ticket owner', async () => {
  //   const {getByTestId} = render(
  //     <Provider store={store}>
  //       <TicketOverview {...props} />
  //     </Provider>,
  //   );

  //   await waitFor(() => {
  //     const ownerDropdown = getByTestId('High-dropdown');
  //     fireEvent.press(ownerDropdown);
  //     expect(ownerDropdown).toHaveBeenCalled();
  //   });

  //   // Add assertions for the owner selection bottom sheet
  //   // and test the owner update functionality
  // });
});
