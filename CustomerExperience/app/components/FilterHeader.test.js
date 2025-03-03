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
});
