import React from 'react';
import {render} from '@testing-library/react-native';
import TicketComments from './TicketComments';
import {
  getFoldedText,
  CommentCancelReplyButton,
  CommentText,
  CommentParentItemContainer,
} from './TicketCommentsUtils';
import configureStore from 'redux-mock-store';
import {Provider} from 'react-redux';

// Mock dependencies
jest.mock('../../Utils/MultilinguaUtils', () => ({
  translate: jest.fn(key => key),
}));

jest.mock('../../Utils/StringUtils', () => ({
  isEmptyOrNull: jest.fn(text => !text || text.trim().length === 0),
  reformatComplexName: jest.fn(name => name),
  getWords: jest.fn(text => text.split(' ')),
  formatCommentToHTML: jest.fn(text => text),
}));

jest.mock('../../Utils/TimeUtils', () => ({
  getDateTimeAgo: jest.fn(() => '2 hours ago'),
  toLocalTime: jest.fn(date => date),
}));

jest.mock('../../widgets/SendButton', () => {
  const {View} = require('react-native');
  return ({handleOnSubmit}) => <View testID="send-button" />;
});

jest.mock('../../routes/commonUI/EmptyList', () => {
  const {View, Text} = require('react-native');
  return ({children}) => (
    <View testID="empty-list">
      <Text>{children}</Text>
    </View>
  );
});

jest.mock('../../routes/commonUI/CommonUI', () => ({
  Avatar: ({title}) => {
    const {View, Text} = require('react-native');
    return (
      <View testID="avatar">
        <Text>{title}</Text>
      </View>
    );
  },
}));

jest.mock('react-native-render-html', () => {
  const {View, Text} = require('react-native');
  return {
    __esModule: true,
    default: ({source}) => (
      <View testID="render-html">
        <Text>{source.html}</Text>
      </View>
    ),
    defaultSystemFonts: ['System'],
  };
});

// Mock native modules
jest.mock('react-native/Libraries/Settings/NativeSettingsManager', () => ({
  getEnforcing: jest.fn(() => ({})),
}));

// Mock React Native useWindowDimensions
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.useWindowDimensions = jest.fn(() => ({
    width: 375,
    height: 812,
  }));
  return RN;
});

jest.mock('../../styles/font.constants', () => ({
  FontFamily: {
    light: 'System',
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
  FontWeight: {
    bold: '700',
    semiBold: '600',
    medium: '500',
    normal: '400',
    light: '300',
  },
}));

jest.mock('moment', () => {
  const moment = jest.requireActual('moment');
  return {
    ...moment,
    utc: jest.fn(() => ({
      toDate: jest.fn(() => new Date()),
    })),
  };
});

const mockStore = configureStore([]);

describe('TicketComments', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      global: {
        authToken: 'mock-auth-token',
        userInfo: {
          emailAddress: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          userID: '12345',
        },
      },
      dashboard: {
        parentComment: {
          id: 0,
          isFocused: false,
        },
        ticketComments: [], // Added missing ticketComments array
        ticket: {
          id: 6999,
        },
      },
    });
  });

  it('renders correctly', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <TicketComments />
      </Provider>,
    );

    // Add any additional assertions or interactions here
    expect(getByTestId('ticket-comments')).toBeTruthy(); // Adjust this to your actual testId
  });
});

describe('getFoldedText', () => {
  it('should return the folded text', () => {
    const foldedText = getFoldedText(
      'This is a long text that needs to be folded',
    );
    expect(foldedText).toBe('This is a long text that needs to be folded');
  });
  it('should return the folded text with a maximum word length', () => {
    const foldedText = getFoldedText(
      'This is a long text that needs to be folded',
      5,
    );
    expect(foldedText).toBe(`This is a long text
      <span style="color:#1b87e6;"> ...see more</span>`);
  });
});

describe('CommentCancelReplyButton', () => {
  it('should render the CancelReplyButton', () => {
    const {getByTestId} = render(
      <CommentCancelReplyButton isSelected={false} toggle={() => {}} />,
    );
    expect(getByTestId('cancel-reply-button')).toBeTruthy();
  });
});

describe('CommentText', () => {
  // test CommentText component
  it('should render the CancelReplyButton', () => {
    const {getByTestId} = render(<CommentText text={'Test comment'} />);
    expect(getByTestId('comment-text-container')).toBeTruthy();
  });
});

describe('CommentParentItemContainer', () => {
  it('should render the CommentParentItemContainer', () => {
    const {getByTestId} = render(
      <CommentParentItemContainer isSelected={false} />,
    );

    expect(getByTestId('comment-parent-item-container')).toBeTruthy();
  });
  it('should render the CommentParentItemContainer when selected', () => {
    const {getByTestId} = render(
      <CommentParentItemContainer isSelected={true} />,
    );

    expect(getByTestId('comment-parent-item-container')).toBeTruthy();
  });
});
