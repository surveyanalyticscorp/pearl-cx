import StringUtils from '../../Utils/StringUtils';

describe('formattedCount function', () => {
  it('should handle notion correctly', () => {
    expect(StringUtils.formattedCount(20, 5, '')).toBe('4');
    expect(StringUtils.formattedCount(20, 5, ' apples')).toBe('4 apples');
    expect(StringUtils.formattedCount(30, 5, ' kg')).toBe('6 kg');
    expect(StringUtils.formattedCount(20, 4, ' apples')).toBe('5 apples');
  });
});
