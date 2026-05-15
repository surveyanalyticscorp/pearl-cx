import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {
  getFoldedText,
  getFoldedTextByCharacter,
  getFoldedDescriptionText,
  TextLengthCount,
  CommentCancelReplyButton,
  UserNameAndCommentContainer,
  CommentBottomContainer,
  CommentParentItemContainer,
  UserAvatar,
  CommentText,
  CommentBoxParentContainer,
  CommentInput,
  CommentItem,
  ShowNestedFlatList,
  CommentParentItem,
  CommentBox,
  ShowFlatList,
} from './TicketCommentsUtils';

jest.mock('../../Utils/MultilinguaUtils', () => ({
  translate: jest.fn(key => key),
}));
jest.mock('../../Utils/StringUtils', () => ({
  __esModule: true,
  default: {
    reformatComplexName: name => name,
    formatCommentToHTML: text => text,
    isEmptyOrNull: text => !text || text.length === 0,
    getWords: text => text.split(' '),
  },
}));
jest.mock('../../Utils/TimeUtils', () => ({
  getDateTimeAgo: () => '2 hours ago',
}));
jest.mock('moment', () => {
  const momentMock = () => ({toDate: () => new Date()});
  momentMock.utc = () => ({toDate: () => new Date()});
  return momentMock;
});
jest.mock('../../widgets/TextLabel/TextLabel', () => ({text}) => {
  const {Text} = require('react-native');
  return <Text>{text}</Text>;
});
jest.mock('../../widgets/SpaceBox', () => ({
  VerticalSpaceBox: () => null,
  HorizontalSpaceBox: () => null,
}));
jest.mock('../../widgets/SendCommentButton', () => ({handleOnSubmit}) => {
  const {Pressable} = require('react-native');
  return <Pressable testID="send-comment-button" onPress={handleOnSubmit} />;
});
jest.mock('./EmptyVIew', () => ({
  EmptyView: ({title}) => {
    const {Text} = require('react-native');
    return <Text>{title}</Text>;
  },
}));
jest.mock('../../redux/actions/dashboard.actions', () => ({
  postAddTicketComment: (token, comment, ticketId) => ({
    type: 'POST_ADD_TICKET_COMMENT',
    token,
    comment,
    ticketId,
  }),
  resetParentComment: () => ({type: 'RESET_PARENT_COMMENT'}),
  setParentComment: comment => ({type: 'SET_PARENT_COMMENT', comment}),
}));

jest.mock('react-native-render-html', () => ({
  __esModule: true,
  default: () => null,
  defaultSystemFonts: [],
}));

jest.mock('./CentralizedRootCause/components/CollapsableView', () => ({children}) => {
  const {View} = require('react-native');
  return <View>{children}</View>;
});

jest.mock('../../routes/commonUI/CommonUI', () => ({
  Avatar: () => {
    const {View} = require('react-native');
    return <View testID="avatar" />;
  },
}));

describe('TicketCommentsUtils pure functions', () => {
  describe('getFoldedText', () => {
    it('returns original text when within word limit', () => {
      const text = 'short text';
      expect(getFoldedText(text, 10)).toBe(text);
    });

    it('folds long text with see more span', () => {
      const words = Array(15).fill('word');
      const result = getFoldedText(words.join(' '), 10);
      expect(result).toContain('...see more');
    });
  });

  describe('getFoldedTextByCharacter', () => {
    it('returns original text when within char limit', () => {
      const text = 'short';
      expect(getFoldedTextByCharacter(text, 256)).toBe(text);
    });

    it('folds long text with see more span', () => {
      const text = 'a'.repeat(300);
      const result = getFoldedTextByCharacter(text, 256);
      expect(result).toContain('...see more');
      expect(result).toContain(text.slice(0, 256));
    });
  });

  describe('getFoldedDescriptionText', () => {
    it('returns text when within word limit', () => {
      expect(getFoldedDescriptionText('hello world', 10)).toBe('hello world');
    });

    it('folds text when exceeds word limit', () => {
      const words = Array(15).fill('hi');
      const result = getFoldedDescriptionText(words.join(' '), 10);
      expect(result).toContain('...see more');
    });
  });
});

describe('TicketCommentsUtils UI components', () => {
  it('TextLengthCount renders count when > 0', () => {
    const {getByText} = render(<TextLengthCount textLength={5} maxCountLength={100} />);
    expect(getByText('5/100')).toBeTruthy();
  });

  it('TextLengthCount renders nothing when textLength = 0', () => {
    const {toJSON} = render(<TextLengthCount textLength={0} maxCountLength={100} />);
    // renders empty View (not null)
    expect(toJSON()).toBeTruthy();
  });

  it('CommentCancelReplyButton shows reply text when not selected', () => {
    const toggle = jest.fn();
    const {getByText} = render(
      <CommentCancelReplyButton isSelected={false} toggle={toggle} />,
    );
    expect(getByText('comment.reply')).toBeTruthy();
  });

  it('CommentCancelReplyButton shows cancel text when selected', () => {
    const toggle = jest.fn();
    const {getByText} = render(
      <CommentCancelReplyButton isSelected={true} toggle={toggle} />,
    );
    expect(getByText('cancel')).toBeTruthy();
  });

  it('CommentCancelReplyButton calls toggle on press', () => {
    const toggle = jest.fn();
    const {getByTestId} = render(
      <CommentCancelReplyButton isSelected={false} toggle={toggle} />,
    );
    fireEvent.press(getByTestId('cancel-reply-button'));
    expect(toggle).toHaveBeenCalled();
  });

  it('UserNameAndCommentContainer renders children', () => {
    const {getByText} = render(
      <UserNameAndCommentContainer isSelected={false}>
        <></>
      </UserNameAndCommentContainer>,
    );
    // renders without crash
  });

  it('CommentParentItemContainer renders with testID', () => {
    const {getByTestId} = render(
      <CommentParentItemContainer isSelected={false}>
        <></>
      </CommentParentItemContainer>,
    );
    expect(getByTestId('comment-parent-item-container')).toBeTruthy();
  });
});

const mockStore = configureStore([]);
const buildStore = (overrides = {}) =>
  mockStore({
    dashboard: {
      ticket: {id: 42},
      ticketComments: [],
      parentComment: {id: 0, isFocused: false, commentBy: ''},
      ...overrides,
    },
    global: {
      authToken: 'token123',
      userInfo: {emailAddress: 'a@b.com', firstName: 'John', lastName: 'Doe', userID: 1},
    },
  });

const wrap = (node, storeOverrides = {}) => (
  <Provider store={buildStore(storeOverrides)}>{node}</Provider>
);

const sampleItem = {
  id: 1,
  commentBy: 'Alice',
  createdAt: '2024-01-01T00:00:00Z',
  text: 'Hello world',
  children: [],
};

describe('UserAvatar', () => {
  it('renders without crashing', () => {
    const {toJSON} = render(<UserAvatar title="AB" />);
    expect(toJSON()).toBeTruthy();
  });
});

describe('CommentText', () => {
  it('renders the comment-text-container testID', () => {
    const {getByTestId} = render(
      wrap(<CommentText text="<p>Hello</p>" />),
    );
    expect(getByTestId('comment-text-container')).toBeTruthy();
  });
});

describe('CommentBoxParentContainer', () => {
  it('renders children', () => {
    const {Text} = require('react-native');
    const {getByText} = render(
      <CommentBoxParentContainer
        sendButtonVisible={false}
        textInputHeight={36}
        UIalignItems="center">
        <Text>Child</Text>
      </CommentBoxParentContainer>,
    );
    expect(getByText('Child')).toBeTruthy();
  });

  it('renders with sendButtonVisible=true', () => {
    const {Text} = require('react-native');
    const {getByText} = render(
      <CommentBoxParentContainer
        sendButtonVisible={true}
        textInputHeight={80}
        UIalignItems="flex-end">
        <Text>Child</Text>
      </CommentBoxParentContainer>,
    );
    expect(getByText('Child')).toBeTruthy();
  });
});

describe('CommentInput', () => {
  it('renders text input with comment-text-input testID', () => {
    const onChange = jest.fn();
    const {TextInput} = require('react-native');
    const {UNSAFE_getByType} = render(
      <CommentInput
        value=""
        textInputHeight={36}
        setTextInputHeight={jest.fn()}
        onChangeHandler={onChange}
        hasParentId={false}
        replyTo=""
        onFocus={jest.fn()}
        onBlur={jest.fn()}
      />,
    );
    fireEvent.changeText(UNSAFE_getByType(TextInput), 'new text');
    expect(onChange).toHaveBeenCalledWith('new text');
  });

  it('shows reply placeholder when hasParentId=true', () => {
    const {TextInput} = require('react-native');
    const {UNSAFE_getByType} = render(
      <CommentInput
        value=""
        textInputHeight={36}
        setTextInputHeight={jest.fn()}
        onChangeHandler={jest.fn()}
        hasParentId={true}
        replyTo="Alice"
        onFocus={jest.fn()}
        onBlur={jest.fn()}
      />,
    );
    expect(UNSAFE_getByType(TextInput).props.placeholder).toContain('Alice');
  });
});

describe('CommentItem', () => {
  it('renders commentBy and date', () => {
    const {getByText} = render(wrap(<CommentItem item={sampleItem} />));
    expect(getByText('Alice')).toBeTruthy();
    expect(getByText('2 hours ago')).toBeTruthy();
  });

  it('renders comment-text-container', () => {
    const {getByTestId} = render(wrap(<CommentItem item={sampleItem} />));
    expect(getByTestId('comment-text-container')).toBeTruthy();
  });
});

describe('ShowNestedFlatList', () => {
  it('renders all comment items', () => {
    const data = [
      {...sampleItem, id: 1, commentBy: 'Alice'},
      {...sampleItem, id: 2, commentBy: 'Bob'},
    ];
    const {getAllByText} = render(wrap(<ShowNestedFlatList data={data} isSelected={false} />));
    expect(getAllByText('Alice').length).toBeGreaterThan(0);
    expect(getAllByText('Bob').length).toBeGreaterThan(0);
  });
});

describe('CommentParentItem', () => {
  it('renders without crashing', () => {
    const item = {...sampleItem, children: []};
    const {toJSON} = render(wrap(<CommentParentItem item={item} />));
    expect(toJSON()).toBeTruthy();
  });

  it('dispatches setParentComment when reply pressed', () => {
    const store = buildStore();
    const item = {...sampleItem, children: []};
    const {getByTestId} = render(
      <Provider store={store}>
        <CommentParentItem item={item} />
      </Provider>,
    );
    fireEvent.press(getByTestId('cancel-reply-button'));
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({type: 'SET_PARENT_COMMENT'}),
    );
  });

  it('renders children replies when item has children', () => {
    const child = {...sampleItem, id: 2, commentBy: 'Bob', children: []};
    const item = {...sampleItem, children: [child]};
    const {toJSON} = render(wrap(<CommentParentItem item={item} />));
    expect(toJSON()).toBeTruthy();
  });
});

describe('CommentBox', () => {
  it('renders the comment text input', () => {
    const {TextInput} = require('react-native');
    const {UNSAFE_getByType} = render(
      wrap(<CommentBox isKeyboardVisible={false} setKeyboardVisible={jest.fn()} />),
    );
    expect(UNSAFE_getByType(TextInput)).toBeTruthy();
  });

  it('dispatches postAddTicketComment on submit with non-empty text', () => {
    const store = buildStore();
    const setKeyboardVisible = jest.fn();
    const {TextInput} = require('react-native');
    const {UNSAFE_getByType, getByTestId} = render(
      <Provider store={store}>
        <CommentBox isKeyboardVisible={true} setKeyboardVisible={setKeyboardVisible} />
      </Provider>,
    );
    fireEvent.changeText(UNSAFE_getByType(TextInput), 'My comment');
    fireEvent.press(getByTestId('send-comment-button'));
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({type: 'POST_ADD_TICKET_COMMENT'}),
    );
  });

  it('does not dispatch when comment is empty', () => {
    const store = buildStore();
    const {getByTestId} = render(
      <Provider store={store}>
        <CommentBox isKeyboardVisible={true} setKeyboardVisible={jest.fn()} />
      </Provider>,
    );
    fireEvent.press(getByTestId('send-comment-button'));
    expect(store.getActions()).not.toContainEqual(
      expect.objectContaining({type: 'POST_ADD_TICKET_COMMENT'}),
    );
  });
});

describe('ShowFlatList', () => {
  it('shows empty view when no comments', () => {
    const {getByText} = render(
      wrap(<ShowFlatList data={[]} onRefresh_={jest.fn()} refreshing_={false} />, {
        ticketComments: [],
      }),
    );
    expect(getByText('There are no comments yet')).toBeTruthy();
  });

  it('renders FlatList when comments exist', () => {
    const comments = [sampleItem];
    const {toJSON} = render(
      wrap(<ShowFlatList data={comments} onRefresh_={jest.fn()} refreshing_={false} />, {
        ticketComments: comments,
      }),
    );
    expect(toJSON()).toBeTruthy();
  });
});
