import React from 'react';
import {render} from '@testing-library/react-native';
import BottomRow from './BottomRow';

jest.mock('react-native-vector-icons/Ionicons', () => 'IonIcons');
jest.mock('../../../routes/commonUI/CommonUI', () => ({
  Avatar: ({title}) => {
    const {View, Text} = require('react-native');
    return <View><Text testID="avatar-title">{title}</Text></View>;
  },
  CalendarIcon: () => {
    const {View} = require('react-native');
    return <View testID="calendar-icon" />;
  },
}));
jest.mock('../../../routes/commonUI/toast/InfoIcon', () => () => {
  const {View} = require('react-native');
  return <View testID="info-icon" />;
});
jest.mock('../../../Utils/TicketUtils', () => ({
  getStatusById: jest.fn(id => ({0: 'New', 1: 'Open', 2: 'Closed'}[id] ?? 'New')),
  getPriorityById: jest.fn(id => ({0: 'Low', 1: 'Medium', 2: 'High'}[id] ?? 'Low')),
}));
jest.mock('moment', () => jest.fn(() => ({format: jest.fn(() => 'Jan 01')})));

describe('BottomRow', () => {
  const baseProps = {
    name: 'Alice',
    issueDate: '2025-01-01',
    isOverdue: false,
    priority: 1,
    status: 1,
  };

  it('renders assignee avatar name', () => {
    const {getByTestId} = render(<BottomRow {...baseProps} />);
    expect(getByTestId('avatar-title').props.children).toBe('Alice');
  });

  it('renders priority text', () => {
    const {getByText} = render(<BottomRow {...baseProps} />);
    expect(getByText('Medium')).toBeTruthy();
  });

  it('shows calendar icon when not overdue', () => {
    const {getByTestId} = render(<BottomRow {...baseProps} />);
    expect(getByTestId('calendar-icon')).toBeTruthy();
  });

  it('shows info icon when overdue', () => {
    const {getByTestId} = render(<BottomRow {...baseProps} isOverdue={true} />);
    expect(getByTestId('info-icon')).toBeTruthy();
  });
});
