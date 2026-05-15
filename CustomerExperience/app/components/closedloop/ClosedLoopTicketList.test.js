import React from 'react';
import {render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import ClosedLoopTicketList from './ClosedLoopTicketList';

jest.mock('../../Utils/MultilinguaUtils', () => ({translate: jest.fn(k => k)}));

jest.mock('./TicketCard', () => {
  const {View, Text} = require('react-native');
  return ({data}) => (
    <View testID="ticket-card">
      <Text>{data.id}</Text>
    </View>
  );
});

jest.mock('./NoTicketFound', () => ({
  NoTicketFound: () => {
    const {Text} = require('react-native');
    return <Text testID="no-ticket-found">No tickets</Text>;
  },
}));

jest.mock('../../widgets/QPSpinner', () => {
  const {View} = require('react-native');
  return () => <View testID="spinner" />;
});

jest.mock('../../../assets/images/empty_state.svg', () => 'EmptyState');

const mockStore = configureStore([]);
const store = mockStore({dashboard: {ownerDetails: {owners: []}}});
const wrap = ui => <Provider store={store}>{ui}</Provider>;

const baseProps = {
  onPressReset: jest.fn(),
  onRefresh: jest.fn(),
  refreshing: false,
  ticketList: [],
  isPagination: false,
  isTicketLoading: false,
  onPressHandler: jest.fn(),
  selectedTickets: [],
  showCheckBox: false,
  loadMoreData: jest.fn(),
};

describe('ClosedLoopTicketList', () => {
  it('renders NoTicketFound when list is empty and not loading', () => {
    const {getByTestId} = render(wrap(<ClosedLoopTicketList {...baseProps} />));
    expect(getByTestId('no-ticket-found')).toBeTruthy();
  });

  it('renders ticket cards when ticketList has items', () => {
    const props = {
      ...baseProps,
      ticketList: [{id: 'T1'}, {id: 'T2'}],
    };
    const {getAllByTestId} = render(wrap(<ClosedLoopTicketList {...props} />));
    expect(getAllByTestId('ticket-card').length).toBe(2);
  });

  it('shows spinner when isPagination is true', () => {
    const props = {...baseProps, isPagination: true};
    const {getByTestId} = render(wrap(<ClosedLoopTicketList {...props} />));
    expect(getByTestId('spinner')).toBeTruthy();
  });

  it('does not show NoTicketFound when isTicketLoading is true', () => {
    const props = {...baseProps, isTicketLoading: true};
    const {queryByTestId} = render(wrap(<ClosedLoopTicketList {...props} />));
    expect(queryByTestId('no-ticket-found')).toBeNull();
  });
});
