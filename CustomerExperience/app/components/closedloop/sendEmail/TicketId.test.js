import React from 'react';
import {render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import RenderTicketId from './TicketId';

jest.mock('../../../Utils/MultilinguaUtils', () => ({translate: k => k}));
jest.mock('../../../widgets/TextLabel/TextLabel', () => ({text}) => {
  const {Text} = require('react-native');
  return <Text>{text}</Text>;
});

const mockStore = configureStore([]);

describe('RenderTicketId', () => {
  it('renders the ticket ID from Redux state', () => {
    const store = mockStore({dashboard: {ticket: {id: 42}}});
    const {getByText} = render(
      <Provider store={store}>
        <RenderTicketId />
      </Provider>,
    );
    expect(getByText('ticket_overview.ticket_id #42')).toBeTruthy();
  });

  it('renders with a different ticket ID', () => {
    const store = mockStore({dashboard: {ticket: {id: 999}}});
    const {getByText} = render(
      <Provider store={store}>
        <RenderTicketId />
      </Provider>,
    );
    expect(getByText('ticket_overview.ticket_id #999')).toBeTruthy();
  });
});
