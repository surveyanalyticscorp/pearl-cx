import {
  MonthYearFormat,
  DMYFORMAT,
  YMDFORMAT,
  MDYFORMAT,
  FullMonthYearFormat,
  HalfMonthDateYearFormat,
  FullMonthDateYearFormat,
  PPP,
  DMY_AT_TIME_FORMAT,
  DMY_AT_TIME__SHORT_FORMAT,
} from './AppConstants';

describe('Date Format Constants', () => {
  it('should have the correct value for MonthYearFormat', () => {
    expect(MonthYearFormat).toBe('MM/YYYY');
  });

  it('should have the correct value for DMYFORMAT', () => {
    expect(DMYFORMAT).toBe('DD/MM/YYYY');
  });

  it('should have the correct value for YMDFORMAT', () => {
    expect(YMDFORMAT).toBe('YYYY/MM/DD');
  });

  it('should have the correct value for MDYFORMAT', () => {
    expect(MDYFORMAT).toBe('MM/DD/YYYY');
  });

  it('should have the correct value for FullMonthYearFormat', () => {
    expect(FullMonthYearFormat).toBe('MMMM yyyy');
  });

  it('should have the correct value for HalfMonthDateYearFormat', () => {
    expect(HalfMonthDateYearFormat).toBe('MMM DD, yyyy');
  });

  it('should have the correct value for FullMonthDateYearFormat', () => {
    expect(FullMonthDateYearFormat).toBe('MMMM DD, yyyy');
  });

  it('should have the correct value for PPP', () => {
    expect(PPP).toBe('PPP');
  });

  it('should have the correct value for DMY_AT_TIME_FORMAT', () => {
    expect(DMY_AT_TIME_FORMAT).toBe('MMM DD, YYYY h:mm:ss A');
  });

  it('should have the correct value for DMY_AT_TIME__SHORT_FORMAT', () => {
    expect(DMY_AT_TIME__SHORT_FORMAT).toBe('MMM DD, YYYY h:mm A');
  });
});
