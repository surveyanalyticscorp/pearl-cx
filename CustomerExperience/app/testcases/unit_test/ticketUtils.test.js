import StringUtils from '../../Utils/StringUtils';
describe('getTrimmedNoOfResponses function test', () => {
  // Test case for when responseCount is undefined or 0
  it('getTrimmedNoOfResponses with undefined or 0 responseCount', () => {
    expect(StringUtils.getTrimmedNoOfResponses()).toBe('0');
    expect(StringUtils.getTrimmedNoOfResponses(0)).toBe('0');
  });

  // Test case for responseCount less than 1000
  it('getTrimmedNoOfResponses with responseCount less than 1000', () => {
    expect(StringUtils.getTrimmedNoOfResponses(500)).toBe('500');
    expect(StringUtils.getTrimmedNoOfResponses(999)).toBe('999');
  });

  // // Test case for responseCount equal to 1000
  it('getTrimmedNoOfResponses with responseCount equal to 1000', () => {
    expect(StringUtils.getTrimmedNoOfResponses(1000)).toBe('1K');
  });

  // // Test case for responseCount between 1000 and 10000 (exclusive)
  it('getTrimmedNoOfResponses with responseCount between 1000 and 10000', () => {
    expect(StringUtils.getTrimmedNoOfResponses(2500)).toBe('2.5K');
    expect(StringUtils.getTrimmedNoOfResponses(9999)).toBe('10K');
  });

  // // Test case for responseCount equal to 10000
  it('getTrimmedNoOfResponses with responseCount equal to 10000', () => {
    expect(StringUtils.getTrimmedNoOfResponses(10000)).toBe('10K');
  });

  // // Test case for responseCount greater than 10000
  it('getTrimmedNoOfResponses with responseCount greater than 10000', () => {
    expect(StringUtils.getTrimmedNoOfResponses(12000)).toBe('12K');
    expect(StringUtils.getTrimmedNoOfResponses(15000)).toBe('15K');
  });

  it('getTrimmedNoOfResponses with responseCount greater than 1000000', () => {
    expect(StringUtils.getTrimmedNoOfResponses(151000)).toBe('151K');
    expect(StringUtils.getTrimmedNoOfResponses(211500)).toBe('211.5K');
    expect(StringUtils.getTrimmedNoOfResponses(150200)).toBe('150.2K');
    expect(StringUtils.getTrimmedNoOfResponses(140031)).toBe('140K');
    expect(StringUtils.getTrimmedNoOfResponses(99945000)).toBe('99.9M');
    expect(StringUtils.getTrimmedNoOfResponses(99995000)).toBe('100M');
  });

  // // Test case for responseCount greater than 10000
  it('getTrimmedNoOfResponses with responseCount non round numbers', () => {
    expect(StringUtils.getTrimmedNoOfResponses(3041)).toBe('3K');
    expect(StringUtils.getTrimmedNoOfResponses(21110)).toBe('21.1K');
  });
});
