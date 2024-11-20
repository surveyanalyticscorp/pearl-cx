import React from 'react';
import {render} from '@testing-library/react-native';
import TicketComments, {
  getFoldedText,
  CommentCancelReplyButton,
  CommentText,
  CommentParentItemContainer,
} from './TicketComments';
import configureStore from 'redux-mock-store';
import {Provider} from 'react-redux';

const mockStore = configureStore([]);

describe('TicketComments', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      global: {
        userInfo: {
          emailAddress: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          userID: '12345',
        },
      },
      dashboard: {
        parentComment: 'This is a parent comment',
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
      <span><b> ...see more</b></span>`);
  });
});

describe('CommentCancelReplyButton', () => {
  it('should render the CancelReplyButton', () => {
    const {getByTestId} = render(
      <CommentCancelReplyButton
        onPress={() => {}}
        testID={'cancel-reply-button'}
      />,
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
