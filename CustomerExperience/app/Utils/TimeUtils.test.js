import {convertDateTimeAgo, getDateTimeAgo, getExpireDate} from './TimeUtils';
import {TOKEN_VALIDATION_DURATION} from '../api/Constant';
import moment from 'moment';

// Mock the current date and time
const now = new Date();

describe('TimeUtils', () => {
  describe('convertDateTimeAgo', () => {
    it('should return "N/A" for null or empty date strings', () => {
      expect(convertDateTimeAgo(null)).toBe('N/A');
      expect(convertDateTimeAgo('')).toBe('N/A');
    });

    it('should return relative time for different date differences', () => {
      // Mocking the current date
      const oneMinuteAgo = moment(now).subtract(1, 'minute').toISOString();
      const oneHourAgo = moment(now).subtract(1, 'hour').toISOString();
      const oneDayAgo = moment(now).subtract(1, 'day').toISOString();
      const twoDaysAgo = moment(now).subtract(2, 'days').toISOString();

      expect(convertDateTimeAgo(oneMinuteAgo)).toBe('1 minute ago');
      expect(convertDateTimeAgo(oneHourAgo)).toBe('1 hour ago');
      // Adjusted for function behavior
      expect(convertDateTimeAgo(oneDayAgo)).toBe('yesterday');
      expect(convertDateTimeAgo(twoDaysAgo)).toMatch(
        moment(twoDaysAgo).local().format('MMM DD, YYYY'),
      );
    });
  });

  describe('getDateTimeAgo', () => {
    it('should return "just now" for current time', () => {
      expect(getDateTimeAgo(now)).toBe('just now');
    });

    it('should return relative time for different date differences', () => {
      const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

      expect(getDateTimeAgo(oneMinuteAgo)).toMatch(/^1 minute ago$/);
      expect(getDateTimeAgo(oneHourAgo)).toMatch(/^1 hour ago$/);
      // Adjusted for function behavior
      expect(getDateTimeAgo(oneDayAgo)).toMatch(/^yesterday$/);
      expect(getDateTimeAgo(twoDaysAgo)).toMatch(
        moment(twoDaysAgo).local().format('MMM DD, YYYY'),
      );
    });
  });

  describe('getExpireDate', () => {
    it('should return the correct expiration date', () => {
      const today = new Date();
      const expectedExpireDate = new Date(today);
      expectedExpireDate.setDate(
        expectedExpireDate.getDate() + TOKEN_VALIDATION_DURATION,
      );

      // Mock Date.now() to always return the current date
      jest.spyOn(Date, 'now').mockImplementation(() => now.getTime());

      // call the function and check if the result is as expected but igonre the time part
      expect(getExpireDate().split('T')[0]).toBe(
        expectedExpireDate.toISOString().split('T')[0],
      );

      // expect(getExpireDate()).toBe(expectedExpireDate.toISOString());

      // Restore original Date.now() implementation
      jest.spyOn(Date, 'now').mockRestore();
    });
  });
});
