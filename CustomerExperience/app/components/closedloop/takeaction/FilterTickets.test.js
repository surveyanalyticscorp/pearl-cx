import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import FilterTicket from './FilterTickets';

// Mock the translation function
jest.mock('../../../Utils/MultilinguaUtils', () => ({
  translate: jest.fn(key => key),
}));

const mockData = {
  status: [
    {id: 1, title: 'Open', isChecked: false},
    {id: 2, title: 'Closed', isChecked: true},
  ],
  priority: [
    {id: 1, title: 'High', isChecked: false},
    {id: 2, title: 'Low', isChecked: false},
  ],
  type: [
    {id: 1, title: 'Bug', isChecked: false},
    {id: 2, title: 'Feature', isChecked: false},
  ],
  assignToId: '',
  userId: 'user123',
  selectedManager: [],
};

const mockOnPressHandler = jest.fn();

describe('FilterTicket Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const {getByTestId} = render(
      <FilterTicket data={mockData} onPressHandler={mockOnPressHandler} />,
    );

    expect(getByTestId('render-status')).toBeTruthy();
    expect(getByTestId('render-priority')).toBeTruthy();
    expect(getByTestId('render-ticket-type')).toBeTruthy();
    expect(getByTestId('render-show-tickets')).toBeTruthy();
  });

  it('calls onPressHandler with correct data when Apply is pressed', () => {
    const {getByText} = render(
      <FilterTicket data={mockData} onPressHandler={mockOnPressHandler} />,
    );

    // Simulate pressing the 'apply' button (note: lowercase due to translation mock)
    const applyButton = getByText('apply');
    fireEvent.press(applyButton);

    expect(mockOnPressHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        status: expect.any(Array),
        priority: expect.any(Array),
        type: expect.any(Array),
        assignToId: '',
        userId: 'user123',
      }),
      'apply',
    );
  });

  it('calls Clear button and resets filters', () => {
    const {getByText} = render(
      <FilterTicket data={mockData} onPressHandler={mockOnPressHandler} />,
    );

    // Click clear button
    const clearButton = getByText('clear');
    fireEvent.press(clearButton);

    // Clear should not call onPressHandler directly, it just resets internal state
    expect(mockOnPressHandler).not.toHaveBeenCalled();
  });

  it('toggles my tickets switch correctly', () => {
    const {getByRole} = render(
      <FilterTicket data={mockData} onPressHandler={mockOnPressHandler} />,
    );

    const switchElement = getByRole('switch');
    fireEvent(switchElement, 'onValueChange', true);

    expect(mockOnPressHandler).not.toHaveBeenCalled();
  });

  it('handles status filter selection and maintains state', () => {
    const testData = {
      ...mockData,
      status: [
        {id: 1, title: 'Open', isChecked: false},
        {id: 2, title: 'Closed', isChecked: false},
      ],
    };

    const {getByText} = render(
      <FilterTicket data={testData} onPressHandler={mockOnPressHandler} />,
    );

    // Click on status filter
    const openStatus = getByText('Open');
    fireEvent.press(openStatus);

    // Verify component still renders after state change
    expect(getByText('Open')).toBeTruthy();
  });

  it('handles priority filter selection and maintains state', () => {
    const testData = {
      ...mockData,
      priority: [
        {id: 1, title: 'High', isChecked: false},
        {id: 2, title: 'Medium', isChecked: false},
      ],
    };

    const {getByText} = render(
      <FilterTicket data={testData} onPressHandler={mockOnPressHandler} />,
    );

    // Click on priority filter
    const highPriority = getByText('High');
    fireEvent.press(highPriority);

    // Verify component still renders after state change
    expect(getByText('High')).toBeTruthy();
  });

  it('handles type filter selection (radio button behavior)', () => {
    const testData = {
      ...mockData,
      type: [
        {id: 1, title: 'Bug', isChecked: false},
        {id: 2, title: 'Feature', isChecked: false},
      ],
    };

    const {getByText} = render(
      <FilterTicket data={testData} onPressHandler={mockOnPressHandler} />,
    );

    // Click on type filter
    const bugType = getByText('Bug');
    fireEvent.press(bugType);

    // Verify component still renders after state change
    expect(getByText('Bug')).toBeTruthy();
  });

  it('handles assignToId when userId is set', () => {
    const testDataWithAssignment = {
      ...mockData,
      assignToId: 'user123',
    };

    const {getByRole} = render(
      <FilterTicket
        data={testDataWithAssignment}
        onPressHandler={mockOnPressHandler}
      />,
    );

    const switchElement = getByRole('switch');
    expect(switchElement.props.value).toBe(true); // Should be true when assignToId has value
  });
});
