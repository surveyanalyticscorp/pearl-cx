// DimensionUtils.test.js
import {Dimensions} from 'react-native';
import {getHeightPercentage} from './DimentionUtils';

// Mock the Dimensions.get method
jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn().mockReturnValue({
      height: 800, // mock the height value
      width: 600, // mock the width value
    }),
  },
}));

describe('getHeightPercentage', () => {
  it('should correctly calculate the percentage of the view height', () => {
    const viewHeight = 400;
    const expectedPercentage = ((viewHeight / 800) * 100).toFixed(2);
    expect(getHeightPercentage(viewHeight)).toBe(expectedPercentage);
  });

  it('should return "0.00" for a viewHeight of 0', () => {
    const viewHeight = 0;
    expect(getHeightPercentage(viewHeight)).toBe('0.00');
  });

  it('should return "100.00" for a viewHeight equal to the screen height', () => {
    const viewHeight = 800;
    expect(getHeightPercentage(viewHeight)).toBe('100.00');
  });
});
