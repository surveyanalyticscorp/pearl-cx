import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import ShowFilterTag, {taglist} from './ShowFilterTag';
import {
  getStatusById,
  getPriorityById,
  getTicketTypeById,
} from '../../Utils/TicketUtils';

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

// Mocking utility functions
jest.mock('../../Utils/TicketUtils', () => ({
  getStatusById: jest.fn(id => `Status ${id}`),
  getPriorityById: jest.fn(id => `Priority ${id}`),
  getTicketTypeById: jest.fn(id => `Type ${id}`),
}));

describe('ShowFilterTag', () => {
  const mockHandleFilterTag = jest.fn();

  const renderComponent = filterData =>
    render(
      <ShowFilterTag
        filterData={filterData}
        handleFilterTag={mockHandleFilterTag}
      />,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders ShowFilterTag component correctly', () => {
    const {getByTestId} = renderComponent({});
    expect(getByTestId('show-filter-tag-container')).toBeTruthy();
  });

  it('populates the list based on filterData prop', () => {
    const filterData = {
      status: '1',
      priority: '2',
      type: '3',
      assignToId: '1',
    };
    const {getByText} = renderComponent(filterData);

    expect(getByText('Status- Status 1')).toBeTruthy();
    expect(getByText('Priority- Priority 2')).toBeTruthy();
    expect(getByText('Type- Type 3')).toBeTruthy();
    expect(getByText('My tickets')).toBeTruthy();
  });

  it('calls handleFilterTag when a tag is pressed', () => {
    const filterData = {status: '1'};
    const {getByText} = renderComponent(filterData);

    const statusTag = getByText('Status- Status 1');
    fireEvent.press(statusTag);

    expect(mockHandleFilterTag).toHaveBeenCalledWith('status');
  });

  it('handles empty filterData correctly', () => {
    const filterData = {};
    const {queryByText} = renderComponent(filterData);

    expect(queryByText(/-/)).toBeNull();
  });
});
