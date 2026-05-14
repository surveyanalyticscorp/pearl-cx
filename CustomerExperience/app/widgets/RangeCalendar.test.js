import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import RangeCalendar from './RangeCalendar';

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

const defaultProps = {
  showCalendar: true,
  closeCalendar: jest.fn(),
  onSubmit: jest.fn(),
  selectedType: 1,
  startDate: '01/01/2024',
  endDate: '31/01/2024',
};

beforeEach(() => {
  defaultProps.closeCalendar.mockClear();
  defaultProps.onSubmit.mockClear();
});

describe('RangeCalendar', () => {
  it('renders the modal when showCalendar is true', () => {
    const {getByText} = render(<RangeCalendar {...defaultProps} />);
    expect(getByText('Last 30 days')).toBeTruthy();
  });

  it('does not render modal content when showCalendar is false', () => {
    const {queryByText} = render(
      <RangeCalendar {...defaultProps} showCalendar={false} />,
    );
    expect(queryByText('Last 30 days')).toBeNull();
  });

  it('calls closeCalendar when close button is pressed', () => {
    const {UNSAFE_getAllByType} = render(<RangeCalendar {...defaultProps} />);
    const {Pressable} = require('react-native');
    const pressables = UNSAFE_getAllByType(Pressable);
    fireEvent.press(pressables[0]);
    expect(defaultProps.closeCalendar).toHaveBeenCalledWith(false);
  });

  it('calls onSubmit with type 1 when Last 30 days is pressed', () => {
    const {getByText} = render(<RangeCalendar {...defaultProps} />);
    fireEvent.press(getByText('Last 30 days'));
    expect(defaultProps.onSubmit).toHaveBeenCalledWith(1, '', '');
  });

  it('calls onSubmit with type 2 when Last 3 months is pressed', () => {
    const {getByText} = render(<RangeCalendar {...defaultProps} />);
    fireEvent.press(getByText('Last 3 months'));
    expect(defaultProps.onSubmit).toHaveBeenCalledWith(2, '', '');
  });

  it('calls onSubmit with type 3 when Last 6 months is pressed', () => {
    const {getByText} = render(<RangeCalendar {...defaultProps} />);
    fireEvent.press(getByText('Last 6 months'));
    expect(defaultProps.onSubmit).toHaveBeenCalledWith(3, '', '');
  });

  it('shows custom date inputs when Custom is pressed', () => {
    const {getByText} = render(<RangeCalendar {...defaultProps} />);
    fireEvent.press(getByText('Custom'));
    expect(getByText('From')).toBeTruthy();
    expect(getByText('Until')).toBeTruthy();
  });

  it('shows validation error when OK is pressed with invalid dates', () => {
    const {getByText} = render(
      <RangeCalendar
        {...defaultProps}
        selectedType={4}
        startDate="DD/MM/YYYY"
        endDate="DD/MM/YYYY"
      />,
    );
    fireEvent.press(getByText('OK'));
    expect(getByText('Please select a date')).toBeTruthy();
  });

  it('renders all predefined date options', () => {
    const {getByText} = render(<RangeCalendar {...defaultProps} />);
    expect(getByText('Last 30 days')).toBeTruthy();
    expect(getByText('Last 3 months')).toBeTruthy();
    expect(getByText('Last 6 months')).toBeTruthy();
    expect(getByText('Custom')).toBeTruthy();
  });
});
