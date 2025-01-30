import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
  configure,
} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import TicketOverview from './TicketOverview/TicketOverview';
import Clipboard from '@react-native-clipboard/clipboard';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {mockNavigate} from '@react-navigation/native';
import CopyTicketIdButton from './TicketOverview/components/CopyTicketIdButton';
import TakeActionButton from './TicketOverview/components/TakeActionButton';
import DescriptionHeader from './TicketOverview/components/DescriptionHeader';
import ShowTitleAndText, {Title} from './ui/ShowTitleAndText';
import DescriptionView from './TicketOverview/components/DescriptionView';
import ContactView from './TicketOverview/components/ContactView';
import DeleteView from './TicketOverview/components/DeleteView';
import ViewResponseDetailsButton from './TicketOverview/components/ViewResponseDetailsButton';

// mock Clipboard
jest.mock('@react-native-clipboard/clipboard', () => ({
  setString: jest.fn(),
}));

let mockStore = configureStore([]);
let store;
let initialState = {
  dashboard: {
    ticketDeleteStatus: {status: 'default'},
    ticket: {
      id: 1,
      panelMember: {
        name: 'Test Name',
        email: 'test@example.com',
        phone: '1234567890',
      },
      comment: [
        {
          id: 1,
          text: 'Test Comment',
        },
      ],
      description: 'Test Description',
      createdAt: '2023-09-12T12:00:00Z',
      issueDate: '2023-09-12T12:00:00Z',
      originSegment: {
        name: 'Test Segment',
      },
      currentSegment: {
        name: 'Test Segment',
      },
      responseId: 1,
    },
  },
  global: {
    authToken: 'mockToken',
    globalSettings: {
      managerDeletePermission: true,
    },
  },
};
const renderComponent = (component, store_ = configureStore([])) =>
  render(<Provider store={store_}>{component}</Provider>);

describe('CopyTicketIdButton', () => {
  it('renders correctly', () => {
    const {getByTestId} = renderComponent(
      <CopyTicketIdButton />,
      mockStore(initialState),
    );
    expect(getByTestId('copy-ticket-id-button')).toBeTruthy();
  });
  it('calls the onPress function when the button is pressed', () => {
    jest.spyOn(Clipboard, 'setString');
    const {getByTestId} = renderComponent(
      <CopyTicketIdButton />,
      mockStore(initialState),
    );
    fireEvent.press(getByTestId('copy-ticket-id-button'));
    expect(Clipboard.setString).toHaveBeenCalledWith('1');
  });
});

describe('TakeActionButton', () => {
  beforeEach(() => {
    // dashboard.ticket.panelMember
    store = mockStore({
      dashboard: {
        ticket: {
          id: 1,
          panelMember: {
            name: 'Test User',
          },
        },
      },
      global: {
        authToken: 'mockToken',
      },
    });
    jest.clearAllMocks();
  });
  it('renders correctly', () => {
    // mock the onTakeActionHandler function
    const mockOnTakeActionHandler = jest.fn();
    const {getByTestId} = renderComponent(
      <TakeActionButton onTakeActionHandler={mockOnTakeActionHandler} />,
      store,
    );
    expect(getByTestId('TakeActionButton')).toBeTruthy();
    fireEvent.press(getByTestId('TakeActionButton'));
    expect(mockOnTakeActionHandler).toHaveBeenCalled();
  });
});

describe('DescriptionHeader', () => {
  beforeEach(() => {
    // dashboard.ticket.panelMember
    store = mockStore({
      dashboard: {
        ticket: {
          id: 1,
          panelMember: {
            name: 'Test User',
          },
        },
      },
      global: {
        authToken: 'mockToken',
      },
    });
    jest.clearAllMocks();
  });
  it('renders correctly', () => {
    const {getByTestId} = renderComponent(
      <DescriptionHeader text="Test Header" />,
      store,
    );
    expect(getByTestId('description-header')).toBeTruthy();
  });
});

describe('Title', () => {
  it('renders correctly', () => {
    const {getByTestId} = render(<Title value="Test Title" />);
    expect(getByTestId('text-label')).toBeTruthy();
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

  it('renders correctly', () => {
    const {getByTestId, getAllByTestId, getByText} = renderComponent(
      <DescriptionView />,
      mockStore(initialState),
    );
    expect(getByTestId('description-view')).toBeTruthy();
    expect(getByText('Details')).toBeTruthy();
    expect(getAllByTestId('show-title-and-text')).toBeTruthy();
  });
});
// describe('ContactView', () => {
//   // mock the panelMember object

//   it('renders correctly', () => {
//     const {getByTestId} = renderComponent(
//       <ContactView onTakeActionHandler={() => jest.fn()} />,
//       mockStore(initialState),
//     );
//     expect(getByTestId('contact-view')).toBeTruthy();
//     expect(getByTestId('description-header')).toBeTruthy();
//   });
//   it('renders correctly when hasPanelMember is false', () => {
//     const {getByTestId} = renderComponent(
//       <ContactView onTakeActionHandler={() => jest.fn()} />,
//       mockStore(initialState),
//     );
//     expect(getByTestId('contact-view')).toBeTruthy();
//     expect(getByTestId('description-header')).toBeTruthy();
//   });
// });

describe('DeleteView', () => {
  it('renders correctly', () => {
    const mockOnPressDelete = jest.fn();
    // {status: 'default'}
    const {getByTestId} = renderComponent(
      <DeleteView onPressDelete={mockOnPressDelete} />,
      mockStore(initialState),
    );
    expect(getByTestId('DeleteButtonAction')).toBeTruthy();
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
        authToken: 'test-token',

        isTicketLoading: false,
        userInfo: {
          emailAddress: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          userID: '123',
          feedbackApiKey: 'api-key',
        },
        globalSettings: {
          managerDeletePermission: true,
        },
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
    const {getByTestId} = renderComponent(<TicketOverview {...props} />, store);

    await waitFor(() => {
      expect(getByTestId('ticket-overview')).toBeTruthy();
    });
  });

  it('displays ticket information correctly', async () => {
    const {getByText} = renderComponent(<TicketOverview {...props} />, store);

    await waitFor(() => {
      expect(getByText('Test Segment')).toBeTruthy();
      expect(getByText('Test User')).toBeTruthy();
      expect(getByText('testuser@example.com')).toBeTruthy();
      expect(getByText('1234567890')).toBeTruthy();
      expect(getByText('Test comment')).toBeTruthy();
    });
  });
});
