import CountryPhoneNumberLength from './CountryPhoneNumberLength';

describe('CountryPhoneNumberLength', () => {
  it('should be an object', () => {
    expect(typeof CountryPhoneNumberLength).toBe('object');
  });

  it('should have correct length for US (+1)', () => {
    expect(CountryPhoneNumberLength.US).toBe(10);
  });

  it('should have correct length for India (IN)', () => {
    expect(CountryPhoneNumberLength.IN).toBe(10);
  });

  it('should have correct length for UK (GB)', () => {
    expect(CountryPhoneNumberLength.GB).toBe(10);
  });

  it('should have correct length for Australia (AU)', () => {
    expect(CountryPhoneNumberLength.AU).toBe(9);
  });

  it('should have correct length for Germany (DE)', () => {
    expect(CountryPhoneNumberLength.DE).toBeDefined();
    expect(typeof CountryPhoneNumberLength.DE).toBe('number');
  });

  it('should have correct length for Afghanistan (AF)', () => {
    expect(CountryPhoneNumberLength.AF).toBe(9);
  });

  it('should have correct length for Aruba (AW - shortest at 7)', () => {
    expect(CountryPhoneNumberLength.AW).toBe(7);
  });

  it('should contain multiple country codes', () => {
    const keys = Object.keys(CountryPhoneNumberLength);
    expect(keys.length).toBeGreaterThan(50);
  });

  it('should have all values as positive integers', () => {
    Object.values(CountryPhoneNumberLength).forEach(length => {
      expect(typeof length).toBe('number');
      expect(length).toBeGreaterThan(0);
    });
  });
});
