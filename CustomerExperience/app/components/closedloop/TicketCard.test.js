import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import TicketCard from './TicketCard';

jest.mock('../../Utils/MultilinguaUtils', () => ({
  translate: jest.fn(key => key),
}));

jest.mock('./ticketCard/TopRow', () => {
  const {View, Text} = require('react-native');
  return ({email}) => (
    <View>
      <Text testID="top-row-email">{email}</Text>
    </View>
  );
});

jest.mock('./ticketCard/CommentText', () => {
  const {Text} = require('react-native');
  return ({comment}) => <Text testID="comment-text">{comment}</Text>;
});

jest.mock('./ticketCard/BottomRow', () => {
  const {View, Text} = require('react-native');
  return ({name}) => (
    <View>
      <Text testID="bottom-row-name">{name}</Text>
    </View>
  );
});

const mockStore = configureStore([]);
const makeStore = (owners = []) =>
  mockStore({dashboard: {ownerDetails: {owners}}});

const wrap = (ui, owners) => (
  <Provider store={makeStore(owners)}>{ui}</Provider>
);

const mockData = {
  id: 'T1',
  panelMember: {email: 'user@test.com', name: 'User'},
  comment: 'Some comment',
  assignToId: 'owner1',
  issueDate: '2025-01-01',
  isOverdue: false,
  priority: 1,
  status: 0,
};

describe('TicketCard', () => {
  it('renders the email from panelMember', () => {
    const {getByTestId} = render(wrap(<TicketCard data={mockData} index={0} onPressHandler={jest.fn()} />));
    expect(getByTestId('top-row-email').props.children).toBe('user@test.com');
  });

  it('shows anonymous when no panel member', () => {
    const data = {...mockData, panelMember: null};
    const {getByTestId} = render(wrap(<TicketCard data={data} index={0} onPressHandler={jest.fn()} />));
    expect(getByTestId('top-row-email').props.children).toBe('ticket_list.anonymous');
  });

  it('shows assignee name when owner is found', () => {
    const owners = [{ownerID: 'owner1', ownerName: 'Alice'}];
    const {getByTestId} = render(
      wrap(<TicketCard data={mockData} index={0} onPressHandler={jest.fn()} />, owners),
    );
    expect(getByTestId('bottom-row-name').props.children).toBe('Alice');
  });

  it('shows Not Available when owner not found', () => {
    const {getByTestId} = render(wrap(<TicketCard data={mockData} index={0} onPressHandler={jest.fn()} />));
    expect(getByTestId('bottom-row-name').props.children).toBe('Not Available');
  });

  it('calls onPressHandler when pressed', () => {
    const mockOnPress = jest.fn();
    const {getByTestId} = render(wrap(<TicketCard data={mockData} index={0} onPressHandler={mockOnPress} />));
    fireEvent.press(getByTestId('ticket-card'));
    expect(mockOnPress).toHaveBeenCalledWith(mockData, 0);
  });
});
