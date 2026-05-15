import React from 'react';
import {render} from '@testing-library/react-native';
import CommentText from './CommentText';

describe('CommentText', () => {
  it('renders comment text', () => {
    const {getByText} = render(<CommentText comment="This is a comment" />);
    expect(getByText('This is a comment')).toBeTruthy();
  });

  it('renders empty when no comment', () => {
    const {queryByText} = render(<CommentText comment="" />);
    expect(queryByText('This is a comment')).toBeNull();
  });
});
