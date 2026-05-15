import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import TicketIdCopy from './TicketIdCopy';

jest.mock('../../../../Utils/MultilinguaUtils', () => ({translate: jest.fn(k => k)}));
jest.mock('../../../../Utils/Utility', () => ({showInfoFlashMessage: jest.fn()}));
jest.mock('../../../../routes/commonUI/CommonUI', () => ({
  CopyIcon: () => {
    const {View} = require('react-native');
    return <View testID="copy-icon" />;
  },
}));
jest.mock('../../ui/ShowTitleAndText', () => ({
  Title: ({text}) => {
    const {Text} = require('react-native');
    return <Text>{text}</Text>;
  },
  SubText: ({text}) => {
    const {Text} = require('react-native');
    return <Text>{text}</Text>;
  },
}));

const mockStore = configureStore([]);
const wrap = ticketId =>
  <Provider store={mockStore({dashboard: {ticket: {id: ticketId}}})}><TicketIdCopy /></Provider>;

describe('TicketIdCopy', () => {
  it('renders Ticket #ID with copy button when ticketId is set', () => {
    const {getByText, getByTestId} = render(wrap('T55'));
    expect(getByText('Ticket #T55')).toBeTruthy();
    expect(getByTestId('copy-ticket-id-title-button')).toBeTruthy();
  });

  it('renders "Ticket details" when ticketId is null', () => {
    const {getByText} = render(wrap(null));
    expect(getByText('Ticket details')).toBeTruthy();
  });

  it('copies ticket ID to clipboard on press', () => {
    const {showInfoFlashMessage} = require('../../../../Utils/Utility');
    const {getByTestId} = render(wrap('T99'));
    fireEvent.press(getByTestId('copy-ticket-id-title-button'));
    expect(showInfoFlashMessage).toHaveBeenCalled();
  });
});
