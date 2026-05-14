import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import QPCalendar from './QPCalendar';

jest.mock('react-native-vector-icons/SimpleLineIcons', () => 'Icon');

jest.mock('./qp-calendar/calendar', () => {
  const {View} = require('react-native');
  return ({renderHeader, onDayPress}) => (
    <View testID="calendar">
      {renderHeader && renderHeader()}
    </View>
  );
});

jest.mock('./drop-down/ModalDropdown', () => {
  const {View, Text, Pressable} = require('react-native');
  return ({defaultValue, options, onSelect}) => (
    <View testID="modal-dropdown">
      <Text>{defaultValue}</Text>
      {options &&
        options.map((opt, i) => (
          <Pressable key={i} testID={`dropdown-option-${i}`} onPress={() => onSelect(i)}>
            <Text>{opt}</Text>
          </Pressable>
        ))}
    </View>
  );
});

jest.mock('../Utils/StringUtils', () => ({
  getStringFromNumber: jest.fn(n => String(n)),
}));

const defaultProps = {
  selectedDate: '2024-06-15',
  minYear: 2022,
  maxYear: 2025,
  minimumDate: '2022-01-01',
  maximumDate: '2025-12-31',
  selectDate: jest.fn(),
};

beforeEach(() => {
  defaultProps.selectDate.mockClear();
});

describe('QPCalendar', () => {
  it('renders without crashing', () => {
    const {toJSON} = render(<QPCalendar {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders the calendar component', () => {
    const {getByTestId} = render(<QPCalendar {...defaultProps} />);
    expect(getByTestId('calendar')).toBeTruthy();
  });

  it('renders the year dropdown', () => {
    const {getByTestId} = render(<QPCalendar {...defaultProps} />);
    expect(getByTestId('modal-dropdown')).toBeTruthy();
  });

  it('renders month name in header', () => {
    const {getByText} = render(<QPCalendar {...defaultProps} />);
    expect(getByText('June')).toBeTruthy();
  });

  it('renders left and right arrow Pressables in header', () => {
    const {UNSAFE_getAllByType} = render(<QPCalendar {...defaultProps} />);
    const {Pressable} = require('react-native');
    const pressables = UNSAFE_getAllByType(Pressable);
    expect(pressables.length).toBeGreaterThanOrEqual(2);
  });

  it('calls selectDate when year dropdown option is selected', () => {
    const {getByTestId} = render(<QPCalendar {...defaultProps} />);
    fireEvent.press(getByTestId('dropdown-option-0'));
    expect(defaultProps.selectDate).toHaveBeenCalled();
  });

  it('accepts all required props without crashing', () => {
    const {toJSON} = render(<QPCalendar {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });
});
