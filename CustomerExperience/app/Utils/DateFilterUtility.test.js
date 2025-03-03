// __tests__/DateFilterUtility.test.js
import moment from 'moment';
import {getSelectedRange} from './DateFilterUtility';

jest.mock('moment', () => {
  const originalMoment = jest.requireActual('moment');
  return (...args) => {
    const m = originalMoment(...args);
    return m;
  };
});

describe('getSelectedRange', () => {
  const DMYFORMAT = 'DD/MM/YYYY';

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2024, 7, 28)); // Mocking the current date to be 28th August 2024
  });

  afterEach(() => {
    jest.useRealTimers(); // Reset to real timers after each test
  });

  test('should return last 30 days range when type is 1', () => {
    const range = {type: 1};
    const result = getSelectedRange(range);

    const expectedEndDate = '28/8/2024';
    const expectedStartDate = moment(expectedEndDate, DMYFORMAT)
      .subtract(30, 'days')
      .format(DMYFORMAT);

    expect(result).toEqual({
      startDate: expectedStartDate,
      endDate: expectedEndDate,
    });
  });

  test('should return this month range when type is 2', () => {
    const range = {type: 2};
    const result = getSelectedRange(range);

    const expectedStartDate = '01/08/2024';
    const expectedEndDate = '28/8/2024';

    expect(result).toEqual({
      startDate: expectedStartDate,
      endDate: expectedEndDate,
    });
  });

  test('should return last month range when type is 3', () => {
    const range = {type: 3};
    const result = getSelectedRange(range);

    const expectedStartDate = '01/07/2024';
    const expectedEndDate = '31/07/2024';

    expect(result).toEqual({
      startDate: expectedStartDate,
      endDate: expectedEndDate,
    });
  });

  test('should return last 3 months range when type is 4', () => {
    const range = {type: 4};
    const result = getSelectedRange(range);

    const expectedEndDate = '28/8/2024';
    const expectedStartDate = moment(expectedEndDate, DMYFORMAT)
      .subtract(3, 'months')
      .format(DMYFORMAT);

    expect(result).toEqual({
      startDate: expectedStartDate,
      endDate: expectedEndDate,
    });
  });

  test('should return last 6 months range when type is 5', () => {
    const range = {type: 5};
    const result = getSelectedRange(range);

    const expectedEndDate = '28/8/2024';
    const expectedStartDate = moment(expectedEndDate, DMYFORMAT)
      .subtract(6, 'months')
      .format(DMYFORMAT);

    expect(result).toEqual({
      startDate: expectedStartDate,
      endDate: expectedEndDate,
    });
  });

  test('should return custom range when type is not 1-5', () => {
    const range = {type: 0, startDate: '01/01/2024', endDate: '28/08/2024'};
    const result = getSelectedRange(range);

    expect(result).toEqual({startDate: '01/01/2024', endDate: '28/08/2024'});
  });
});
