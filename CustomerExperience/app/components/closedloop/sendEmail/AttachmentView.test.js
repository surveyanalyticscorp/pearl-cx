import React from 'react';
import {render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import AttachmentView from './AttachmentView';

jest.mock('./AttachmentItem', () => {
  const {View, Text} = require('react-native');
  return ({item}) => <View testID="attachment-item"><Text>{item.name}</Text></View>;
});

const mockStore = configureStore([]);

const wrap = mediaFileList =>
  <Provider store={mockStore({dashboard: {mediaFileList}})}><AttachmentView /></Provider>;

describe('AttachmentView', () => {
  it('renders empty view when no attachments', () => {
    const {queryByText} = render(wrap([]));
    expect(queryByText('Attachments')).toBeNull();
  });

  it('renders attachment header and items when attachments exist', () => {
    const files = [{name: 'file1.pdf'}, {name: 'file2.png'}];
    const {getByText, getAllByTestId} = render(wrap(files));
    expect(getByText('Attachments')).toBeTruthy();
    expect(getAllByTestId('attachment-item').length).toBe(2);
  });

  it('renders empty view when mediaFileList is null', () => {
    const {queryByText} = render(wrap(null));
    expect(queryByText('Attachments')).toBeNull();
  });
});
