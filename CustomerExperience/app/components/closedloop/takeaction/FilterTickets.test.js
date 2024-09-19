import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import FilterTicket from './FilterTickets';

const mockData = {
  status: [
    {title: 'Open', isChecked: false},
    {title: 'Closed', isChecked: false},
  ],
  priority: [
    {title: 'High', isChecked: false},
    {title: 'Low', isChecked: false},
  ],
  type: [
    {title: 'Bug', isChecked: false},
    {title: 'Feature', isChecked: false},
  ],
  assignToId: '',
  userId: 'user123',
  selectedManager: [],
};

const mockOnPressHandler = jest.fn();

describe('FilterTicket Component', () => {
  it('renders correctly', () => {
    const {getByTestId} = render(
      <FilterTicket data={mockData} onPressHandler={mockOnPressHandler} />,
    );

    // Check for the presence of status, priority, and type filters
    expect(getByTestId('render-status')).toBeTruthy();
    expect(getByTestId('render-priority')).toBeTruthy();
    expect(getByTestId('render-ticket-type')).toBeTruthy();
    expect(getByTestId('render-show-tickets')).toBeTruthy();
  });

  it('toggles status checkbox correctly', () => {
    const {getByText} = render(
      <FilterTicket data={mockData} onPressHandler={mockOnPressHandler} />,
    );

    // Simulate a press on the first status checkbox
    const openStatus = getByText('Open');
    fireEvent.press(openStatus);

    expect(mockOnPressHandler).not.toHaveBeenCalled(); // This action shouldn't trigger onPressHandler
  });

  it('toggles priority checkbox correctly', () => {
    const {getByText} = render(
      <FilterTicket data={mockData} onPressHandler={mockOnPressHandler} />,
    );

    // Simulate a press on the first priority checkbox
    const highPriority = getByText('High');
    fireEvent.press(highPriority);

    expect(mockOnPressHandler).not.toHaveBeenCalled(); // No handler triggered yet
  });

  it('selects a type correctly', () => {
    const {getByText} = render(
      <FilterTicket data={mockData} onPressHandler={mockOnPressHandler} />,
    );

    // Simulate a press on the "Bug" radio button
    const bugType = getByText('Bug');
    fireEvent.press(bugType);

    expect(mockOnPressHandler).not.toHaveBeenCalled(); // No handler triggered yet
  });

  it('toggles Show My Tickets checkbox', () => {
    const {getByText} = render(
      <FilterTicket data={mockData} onPressHandler={mockOnPressHandler} />,
    );

    // Simulate a press on the 'Show My Tickets' checkbox
    const showMyTickets = getByText('only_my_tickets');
    fireEvent.press(showMyTickets);

    expect(mockOnPressHandler).not.toHaveBeenCalled();
  });

  it('calls onPressHandler with correct data when Apply is pressed', () => {
    const {getByText} = render(
      <FilterTicket data={mockData} onPressHandler={mockOnPressHandler} />,
    );

    // Simulate pressing the 'Apply' button
    const applyButton = getByText('Apply');
    fireEvent.press(applyButton);

    expect(mockOnPressHandler).toHaveBeenCalledWith(
      expect.any(Object),
      'apply',
    );
  });
});
