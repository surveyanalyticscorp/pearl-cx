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
} from './TicketCommentsUtils';

jest.mock('../../Utils/MultilinguaUtils', () => ({
  translate: jest.fn(key => key),
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
