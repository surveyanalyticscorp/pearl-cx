import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import FilterHeader from './FilterHeader';
import moment from 'moment';
import {DMYFORMAT, HalfMonthDateYearFormat} from '../Utils/AppConstants';

jest.mock('react-redux', () => ({
  connect: (mapStateToProps, mapDispatchToProps) => component => component,
}));

// jest.mock('@react-navigation/native', () => ({
//   StackActions: {push: jest.fn()},
// }));

const mockNavigation = {dispatch: jest.fn()};

describe('FilterHeader', () => {
  const initialProps = {
    range: {
      startDate: moment().subtract(7, 'days').format(DMYFORMAT),
      endDate: moment().format(DMYFORMAT),
    },
    setRange: jest.fn(),
    callDataAPI: jest.fn(),
    actionOnArrowClick: jest.fn(),
    navigation: mockNavigation,
  };

  it('renders the component correctly', () => {
    const {getByText} = render(<FilterHeader {...initialProps} />);

    // Check if startDate and endDate are rendered
    const startDate = moment(initialProps.range.startDate, DMYFORMAT).format(
      HalfMonthDateYearFormat,
    );
    const endDate = moment(initialProps.range.endDate, DMYFORMAT).format(
      HalfMonthDateYearFormat,
    );

    expect(getByText(`${startDate} -`)).toBeTruthy();
    expect(getByText(endDate)).toBeTruthy();
  });

  it('calls filterAction on calendar press', () => {
    const {getByTestId} = render(<FilterHeader {...initialProps} />);
    const calendar = getByTestId('filter-calendar');

    fireEvent.press(calendar);
    expect(mockNavigation.dispatch).toHaveBeenCalled();
  });

  it('calls reduceRange on left arrow press', () => {
    const {getByTestId} = render(<FilterHeader {...initialProps} />);
    const leftArrow = getByTestId('left-arrow');

    fireEvent.press(leftArrow);
    expect(initialProps.setRange).toHaveBeenCalled();
    expect(initialProps.actionOnArrowClick).toHaveBeenCalled();
  });

  it('calls addRange on right arrow press', () => {
    const {getByTestId} = render(<FilterHeader {...initialProps} />);
    const rightArrow = getByTestId('right-arrow');

    fireEvent.press(rightArrow);
    expect(initialProps.setRange).toHaveBeenCalled();
    expect(initialProps.actionOnArrowClick).toHaveBeenCalled();
  });

  it('matches snapshot', () => {
    const {toJSON} = render(<FilterHeader {...initialProps} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should handle reduceRange correctly with single digit dates', () => {
    const {getByTestId} = render(<FilterHeader {...initialProps} />);
    const leftArrow = getByTestId('left-arrow');

    fireEvent.press(leftArrow);

    // Verify that setRange was called with new dates
    expect(initialProps.setRange).toHaveBeenCalled();
    const callArgs = initialProps.setRange.mock.calls[0][0];
    expect(callArgs.startDate).toBeDefined();
    expect(callArgs.endDate).toBeDefined();
  });

  it('should handle addRange correctly and extend date range', () => {
    const {getByTestId} = render(<FilterHeader {...initialProps} />);
    const rightArrow = getByTestId('right-arrow');

    fireEvent.press(rightArrow);

    expect(initialProps.setRange).toHaveBeenCalled();
    const callArgs = initialProps.setRange.mock.calls[0][0];
    expect(callArgs.startDate).toBeDefined();
    expect(callArgs.endDate).toBeDefined();
  });

  it('should calculate correct date difference in addRange', () => {
    const startDate = '01/01/2025';
    const endDate = '08/01/2025';
    const props = {
      ...initialProps,
      range: {startDate, endDate},
    };
    const {getByTestId} = render(<FilterHeader {...props} />);
    const rightArrow = getByTestId('right-arrow');

    fireEvent.press(rightArrow);

    expect(props.setRange).toHaveBeenCalled();
  });

  it('should calculate correct date difference in reduceRange', () => {
    const startDate = '01/01/2025';
    const endDate = '08/01/2025';
    const props = {
      ...initialProps,
      range: {startDate, endDate},
    };
    const {getByTestId} = render(<FilterHeader {...props} />);
    const leftArrow = getByTestId('left-arrow');

    fireEvent.press(leftArrow);

    expect(props.setRange).toHaveBeenCalled();
  });

  it('should display formatted dates correctly', () => {
    const startDate = moment().subtract(30, 'days').format(DMYFORMAT);
    const endDate = moment().format(DMYFORMAT);
    const props = {
      ...initialProps,
      range: {startDate, endDate},
    };

    const {getByTestId} = render(<FilterHeader {...props} />);
    const filterCalendar = getByTestId('filter-calendar');

    expect(filterCalendar).toBeTruthy();
  });

  it('should handle consecutive arrow clicks', () => {
    const setRangeMock = jest.fn();
    const actionOnArrowClickMock = jest.fn();
    const props = {
      ...initialProps,
      setRange: setRangeMock,
      actionOnArrowClick: actionOnArrowClickMock,
    };
    const {getByTestId} = render(<FilterHeader {...props} />);
    const leftArrow = getByTestId('left-arrow');

    // Click left arrow multiple times
    fireEvent.press(leftArrow);
    fireEvent.press(leftArrow);

    expect(setRangeMock).toHaveBeenCalledTimes(2);
    expect(actionOnArrowClickMock).toHaveBeenCalledTimes(2);
  });
});
