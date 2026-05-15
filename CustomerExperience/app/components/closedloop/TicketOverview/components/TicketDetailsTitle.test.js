import React from 'react';
import {render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import TicketDetailsTitle from './TicketDetailsTitle';

const mockStore = configureStore([]);

const wrap = ticketId =>
  <Provider store={mockStore({dashboard: {ticket: {id: ticketId}}})}><TicketDetailsTitle /></Provider>;

describe('TicketDetailsTitle', () => {
  it('renders Ticket #ID when ticketId is set', () => {
    const {getByText} = render(wrap('T42'));
    expect(getByText('Ticket #T42')).toBeTruthy();
  });

  it('renders "Ticket details" when ticketId is null', () => {
    const {getByText} = render(wrap(null));
    expect(getByText('Ticket details')).toBeTruthy();
  });

  it('renders copy-ticket-id-title-button testID when ticketId is set', () => {
    const {getByTestId} = render(wrap('T99'));
    expect(getByTestId('copy-ticket-id-title-button')).toBeTruthy();
  });
});
