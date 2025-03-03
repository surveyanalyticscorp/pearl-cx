import {
  generateAxisRangeHelperObject,
  generatedAxisRanges,
} from './NPSChartUtils';

describe('NPSChartUtils', () => {
  describe('generateAxisRangeHelperObject', () => {
    test('should return an object with correct value, fillColor, and angle', () => {
      const percent = 50;
      const fillColor = 'blue';
      const expected = {
        value: percent,
        fillColor: fillColor,
        angle: percent * (180 / 100),
      };

      const result = generateAxisRangeHelperObject(percent, fillColor);

      expect(result).toEqual(expected);
    });
  });

  describe('generatedAxisRanges', () => {
    test('should return a single axis range when data length is 1', () => {
      const data = [{value: 50, fillColor: 'green'}];
      const expected = [
        {
          value: -100,
          endValue: 100,
          axisFill: {
            fillOpacity: 1,
            fill: 'green',
            zIndex: 1,
          },
        },
      ];

      const result = generatedAxisRanges(data);

      expect(result).toEqual(expected);
    });

    test('should handle multiple data elements correctly', () => {
      const data = [
        {value: 50, fillColor: 'red'},
        {value: 30, fillColor: 'blue'},
        {value: 20, fillColor: 'yellow'},
      ];

      // Calculate the expected values
      const expected = [];
      let startingAxis = -100;

      data.forEach(element => {
        if (element.value > 0) {
          const angle = element.value * (180 / 100);
          const endAxis = startingAxis + (angle / 180) * 200;

          expected.push({
            value: startingAxis,
            endValue: endAxis,
            axisFill: {
              fillOpacity: 1,
              fill: element.fillColor,
              zIndex: 1,
            },
          });

          startingAxis = endAxis;
        }
      });

      const result = generatedAxisRanges(data);

      expect(result).toEqual(expected);
    });

    test('should return an empty array if no data is provided', () => {
      const data = [];
      const expected = [];

      const result = generatedAxisRanges(data);

      expect(result).toEqual(expected);
    });

    test('should handle data with non-positive values correctly', () => {
      const data = [
        {value: 0, fillColor: 'black'},
        {value: -50, fillColor: 'white'},
      ];

      const expected = [];

      const result = generatedAxisRanges(data);

      expect(result).toEqual(expected);
    });
  });
});
