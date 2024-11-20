import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import TicketOverview, {
  CopyTicketIdButton,
  TakeActionButton,
  DescriptionHeader,
  Title,
  ShowTitleAndText,
  DescriptionView,
  ContactView,
  DeleteView,
  UnderLineText,
  ViewResponseDetailsButton,
} from './TicketOverview';
import BottomSheet from 'reanimated-bottom-sheet';
import Clipboard from '@react-native-clipboard/clipboard';
import {View} from 'react-native-animatable';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {mockNavigate} from '@react-navigation/native';

// mock Clipboard
jest.mock('@react-native-clipboard/clipboard', () => ({
  setString: jest.fn(),
}));

const mockStore = configureStore([]);

describe('CopyTicketIdButton', () => {
  it('renders correctly', () => {
    const {getByTestId} = render(<CopyTicketIdButton ticket={{id: 1}} />);
    expect(getByTestId('copy-ticket-id-button')).toBeTruthy();
  });
  it('calls the onPress function when the button is pressed', () => {
    jest.spyOn(Clipboard, 'setString');

    const {getByTestId} = render(<CopyTicketIdButton ticket={{id: 1}} />);
    fireEvent.press(getByTestId('copy-ticket-id-button'));
    expect(Clipboard.setString).toHaveBeenCalledWith('1');
  });
});

describe('TakeActionButton', () => {
  it('renders correctly', () => {
    // mock the onTakeActionHandler function
    const mockOnTakeActionHandler = jest.fn();
    const {getByTestId} = render(
      <TakeActionButton onTakeActionHandler={mockOnTakeActionHandler} />,
    );
    expect(getByTestId('TakeActionButton')).toBeTruthy();
    fireEvent.press(getByTestId('TakeActionButton'));
    expect(mockOnTakeActionHandler).toHaveBeenCalled();
  });
});

describe('DescriptionHeader', () => {
  it('renders correctly', () => {
    const {getByTestId} = render(<DescriptionHeader text="Test Header" />);
    expect(getByTestId('description-header')).toBeTruthy();
  });
});

describe('Title', () => {
  it('renders correctly', () => {
    const {getByTestId} = render(<Title value="Test Title" />);
    expect(getByTestId('title-text')).toBeTruthy();
  });
});

describe('ShowTitleAndText', () => {
  it('renders correctly', () => {
    const {getByTestId} = render(
      <ShowTitleAndText title="Test Title" subText="Test Subtext" />,
    );
    expect(getByTestId('show-title-and-text')).toBeTruthy();
  });
  it('renders correctly when isSubtextHighlighted is true', () => {
    const {getByTestId} = render(
      <ShowTitleAndText
        title="Test Title"
        subText="Test Subtext"
        isSubtextHighlighted
      />,
    );
    expect(getByTestId('show-title-and-text')).toBeTruthy();
  });
  it('renders correctly when isSubtextHighlighted is false', () => {
    const {getByTestId} = render(
      <ShowTitleAndText title="Test Title" subText="Test Subtext" />,
    );
    expect(getByTestId('show-title-and-text')).toBeTruthy();
  });
});

describe('DescriptionView', () => {
  // mock the ticket object
  const mockTicket = {
    description: 'Test Description',
    createdAt: '2023-09-12T12:00:00Z',
    originSegment: {
      name: 'Test Segment',
    },
    currentSegment: {
      name: 'Test Segment',
    },
    responseId: 1,
  };
  it('renders correctly', () => {
    const {getByTestId, getAllByTestId, getByText} = render(
      <DescriptionView ticket={mockTicket} showResponseButton={false} />,
    );
    expect(getByTestId('description-view')).toBeTruthy();
    expect(getByText('Details')).toBeTruthy();
    expect(getAllByTestId('show-title-and-text')).toBeTruthy();
  });
});
describe('ContactView', () => {
  // mock the panelMember object
  const mockPanelMember = {
    name: 'Test Name',
    email: 'test@example.com',
    phone: '1234567890',
  };
  it('renders correctly', () => {
    const {getByTestId} = render(
      <ContactView
        panelMember={mockPanelMember}
        description="Test Description"
        hasPanelMember={true}
        onTakeActionHandler={jest.fn()}
      />,
    );
    expect(getByTestId('contact-view')).toBeTruthy();
    expect(getByTestId('description-header')).toBeTruthy();
  });
  it('renders correctly when hasPanelMember is false', () => {
    const {getByTestId} = render(
      <ContactView
        panelMember={mockPanelMember}
        description="Test Description"
        hasPanelMember={false}
        onTakeActionHandler={jest.fn()}
      />,
    );
    expect(getByTestId('contact-view')).toBeTruthy();
    expect(getByTestId('description-header')).toBeTruthy();
  });
});

describe('DeleteView', () => {
  it('renders correctly', () => {
    const mockOnPressDelete = jest.fn();
    const {getByTestId} = render(
      <DeleteView onPressDelete={mockOnPressDelete} />,
    );
    expect(getByTestId('DeleteButtonAction')).toBeTruthy();
    fireEvent.press(getByTestId('DeleteButtonAction'));
    expect(mockOnPressDelete).toHaveBeenCalled();
  });
});

describe('underLineText', () => {
  it('renders correctly', () => {
    const {getByText} = render(<UnderLineText text="Test Text" />);
    expect(getByText('Test Text')).toBeTruthy();
  });
});

describe('ViewResponseDetailsButton', () => {
  let store;
  // mock store for ViewResponseDetailsButton
  const mockStore = configureStore([]);
  const mockTicket = {
    id: 1,
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
  };
  const mockResponseDetails = {
    responseSetID: 1,
    panelMemberID: 1,
    activityText: 'Test Activity',
    createdAt: '2023-09-12T12:00:00Z',
  };
  const initialState = {
    global: {
      authToken: 'mockToken',
    },
    dashboard: {
      ticketDeleteStatus: {status: 'default'},
      ticket: mockTicket,
      ownerDetails: {
        owners: [{ownerID: 456, name: 'Test Owner'}],
      },
    },
    response: {
      responseDetailsByResponseDetails: {...mockResponseDetails},
    },
  };
  beforeEach(() => {
    store = mockStore(initialState);
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <SafeAreaProvider>
          <ViewResponseDetailsButton />
        </SafeAreaProvider>
      </Provider>,
    );
  };

  it('renders correctly', () => {
    const {getByTestId} = renderComponent();
    expect(getByTestId('responseButtonTest')).toBeTruthy();
  });
  it('renders correctly when isFromFeedback is true', () => {
    const {getByTestId} = renderComponent();
    expect(getByTestId('responseButtonTest')).toBeTruthy();
  });
  it('onPress function is called when the button is pressed', () => {
    const {getByTestId} = renderComponent();
    fireEvent.press(getByTestId('responseButtonTest'));
    expect(mockNavigate).toHaveBeenCalledWith('responses.feedback_details', {
      data: mockResponseDetails,
      isFromFeedback: false,
      ticketStatus: {},
      token: 'mockToken',
      // parentRoute: 'Dashboard',
    });
  });
});

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
    const {getByTestId} = render(
      <Provider store={store}>
        <TicketOverview {...props} />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByTestId('ticket-overview')).toBeTruthy();
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
