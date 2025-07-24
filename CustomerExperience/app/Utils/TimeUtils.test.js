import {
  convertToDateTime,
  convertDateTimeAgo,
  getDateTimeAgo,
  getExpireDate,
  constantTimeOffset,
  msToHMS,
} from './TimeUtils';
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
    it('should return "just now" for current time', () => {
      expect(convertDateTimeAgo(now.toISOString())).toBe('just now');
    });
  });

  describe('getDateTimeAgo', () => {
    it('should return "just now" for current time', () => {
      expect(getDateTimeAgo(now)).toBe('just now');
    });

    it('should return relative time for different date differences', () => {
      const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
      const threeMinuteAgo = new Date(now.getTime() - 60 * 3 * 1000);

      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const fourHourAgo = new Date(now.getTime() - 60 * 60 * 4 * 1000);

      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

      expect(getDateTimeAgo(oneMinuteAgo)).toMatch('1 minute ago');
      expect(getDateTimeAgo(threeMinuteAgo)).toMatch('3 minutes ago');
      expect(getDateTimeAgo(oneHourAgo)).toMatch('1 hour ago');
      expect(getDateTimeAgo(fourHourAgo)).toMatch('4 hours ago');
      expect(getDateTimeAgo(oneDayAgo)).toMatch('yesterday');
      expect(getDateTimeAgo(twoDaysAgo)).toMatch(convertToDateTime(twoDaysAgo));
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
  describe('convertToDateTime', () => {
    it('should convert date to date time', () => {
      const date = new Date('2021-01-01T00:00:00.000Z');
      const expectedDateTime = 'Jan 01, 2021';
      expect(convertToDateTime(date)).toBe(expectedDateTime);
    });
  });

  describe('constantTimeOffSet', () => {
    it('should return the time difference between two dates', () => {
      const expectedTimeDifference = new Date().getTimezoneOffset() * 60 * 1000;
      expect(constantTimeOffset()).toBe(expectedTimeDifference);
    });
  });

  describe('msToHMS', () => {
    it('should convert milliseconds to hours, minutes, and seconds', () => {
      const expectedTimeDifference = new Date().getTimezoneOffset() * 60 * 1000;
      expect(msToHMS(expectedTimeDifference)).toBe('-6:0:0');
    });
  });
});
