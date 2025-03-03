import {Dimensions} from 'react-native';
import {msp, isPortrait, isLandscape, isTablet, isPhone} from './DeviceUtil';

// Mocking Dimensions.get
jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn(),
  },
}));

describe('DeviceUtils', () => {
  beforeEach(() => {
    // Reset the mock before each test
    Dimensions.get.mockReset();
  });

  describe('msp', () => {
    it('should return true if scaled width is greater than or equal to limit', () => {
      const dim = {scale: 2, width: 500, height: 600};
      expect(msp(dim, 1000)).toBe(true);
    });

    it('should return true if scaled height is greater than or equal to limit', () => {
      const dim = {scale: 1.5, width: 600, height: 800};
      expect(msp(dim, 1000)).toBe(true);
    });

    it('should return false if neither dimension meets the limit', () => {
      const dim = {scale: 1, width: 400, height: 500};
      expect(msp(dim, 1000)).toBe(false);
    });
  });

  describe('isPortrait', () => {
    it('should return true if screen height is greater than or equal to width', () => {
      Dimensions.get.mockReturnValue({width: 400, height: 800});
      expect(isPortrait()).toBe(true);
    });

    it('should return false if screen height is less than width', () => {
      Dimensions.get.mockReturnValue({width: 800, height: 400});
      expect(isPortrait()).toBe(false);
    });
  });

  describe('isLandscape', () => {
    it('should return true if screen width is greater than or equal to height', () => {
      Dimensions.get.mockReturnValue({width: 800, height: 400});
      expect(isLandscape()).toBe(true);
    });

    it('should return false if screen width is less than height', () => {
      Dimensions.get.mockReturnValue({width: 400, height: 800});
      expect(isLandscape()).toBe(false);
    });
  });

  describe('isTablet', () => {
    it('should return true if the device is a tablet with scale < 2 and msp(dim, 1000) is true', () => {
      Dimensions.get.mockReturnValue({scale: 1.5, width: 800, height: 1000});
      expect(isTablet()).toBe(true);
    });

    it('should return true if the device is a tablet with scale >= 2 and msp(dim, 1900) is true', () => {
      Dimensions.get.mockReturnValue({scale: 2, width: 1000, height: 1200});
      expect(isTablet()).toBe(true);
    });

    it('should return false if the device does not meet tablet criteria', () => {
      Dimensions.get.mockReturnValue({scale: 1, width: 500, height: 700});
      expect(isTablet()).toBe(false);
    });
  });

  describe('isPhone', () => {
    it('should return true if the device is not a tablet', () => {
      Dimensions.get.mockReturnValue({scale: 1, width: 400, height: 600});
      expect(isPhone()).toBe(true);
    });

    it('should return false if the device is a tablet', () => {
      Dimensions.get.mockReturnValue({scale: 2, width: 1000, height: 1200});
      expect(isPhone()).toBe(false);
    });
  });
});
