import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import TicketTakeAction from './TicketTakeAction';
import useActionHandler from '../../closedloop/TicketOverview/components/useActionHandler';

jest.mock(
  '../../closedloop/TicketOverview/components/useActionHandler',
  () => ({
    __esModule: true,
    default: jest.fn(),
  }),
);

describe('TicketTakeAction Component', () => {
  const mockData = [
    {id: 'approve', icon: 'check-circle', title: 'Approve'},
    {id: 'reject', icon: 'cancel', title: 'Reject'},
    {id: 'info', icon: 'info', title: 'More Info'},
  ];
  const mockOnPress = jest.fn();
  const mockedUseActionHandler = useActionHandler;

  beforeEach(() => {
    mockOnPress.mockClear();
    mockedUseActionHandler.mockReturnValue({actionDataList: mockData});
  });

  it('renders rows and basic structure correctly', () => {
    const {getByTestId, getByText} = render(
      <TicketTakeAction onPress={mockOnPress} />,
    );

    expect(getByTestId('take-action-container')).toBeTruthy();
    expect(getByTestId('take-action-list')).toBeTruthy();

    expect(getByTestId('row-touchable-0')).toBeTruthy();
    expect(getByTestId('row-icon-0')).toBeTruthy();
    expect(getByText('Approve')).toBeTruthy();
    expect(getByText('Reject')).toBeTruthy();
    expect(getByText('More Info')).toBeTruthy();
  });

  it('calls onPress with the correct item when a row is pressed', () => {
    const {getByTestId} = render(<TicketTakeAction onPress={mockOnPress} />);

    fireEvent.press(getByTestId('row-touchable-1'));
    expect(mockOnPress).toHaveBeenCalledWith(mockData[1]);

    fireEvent.press(getByTestId('row-touchable-2'));
    expect(mockOnPress).toHaveBeenCalledWith(mockData[2]);
  });

  it('renders the same number of rows as the action data list', () => {
    const {getByTestId} = render(<TicketTakeAction onPress={mockOnPress} />);

    const rows = mockData.map((_, index) =>
      getByTestId(`row-touchable-${index}`),
    );
    expect(rows).toHaveLength(mockData.length);
  });
});
