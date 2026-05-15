import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import ActionHistoryItem from './ActionHistoryItem';

jest.mock('../../../Utils/TimeUtils', () => ({
  convertDateTimeAgo: jest.fn(() => '2 hours ago'),
}));

jest.mock('./NoActionView', () => {
  const {View} = require('react-native');
  return () => <View testID="no-action-view" />;
});

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({navigate: mockNavigate}),
}));

const mockStore = configureStore([]);

const makeStore = (summary = null, ticketId = 42) =>
  mockStore({
    dashboard: {
      ticketActionHistory: {summary},
      ticket: {id: ticketId},
    },
  });

const wrap = (summary, ticketId) => (
  <Provider store={makeStore(summary, ticketId)}>
    <ActionHistoryItem />
  </Provider>
);

describe('ActionHistoryItem', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders NoActionView when summary is null', () => {
    const {getByTestId} = render(wrap(null));
    expect(getByTestId('no-action-view')).toBeTruthy();
  });

  it('renders NoActionView when action is null', () => {
    const {getByTestId} = render(wrap({data: {action: null}}));
    expect(getByTestId('no-action-view')).toBeTruthy();
  });

  it('renders email subject when action exists', () => {
    const summary = {
      data: {action: {subject: 'Hello', emailSendBy: 'John', createdAt: '2024-01-01'}, totalAction: 5},
    };
    const {getByText} = render(wrap(summary));
    expect(getByText('Hello')).toBeTruthy();
  });

  it('renders sender name', () => {
    const summary = {
      data: {action: {subject: 'Test', emailSendBy: 'Alice', createdAt: '2024-01-01'}, totalAction: 2},
    };
    const {getByText} = render(wrap(summary));
    expect(getByText('Alice')).toBeTruthy();
  });

  it('navigates to actionEmailHistory on press', () => {
    const summary = {
      data: {action: {subject: 'Sub', emailSendBy: 'Bob', createdAt: '2024-01-01'}, totalAction: 1},
    };
    const {getByText} = render(wrap(summary, 99));
    fireEvent.press(getByText('Sub'));
    expect(mockNavigate).toHaveBeenCalledWith('actionEmailHistory', {ticketId: 99});
  });
});
