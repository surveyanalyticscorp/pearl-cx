import {FontFamily, FontWeight} from './font.constants';

describe('Font constants', () => {
  it('should have correct font family values', () => {
    expect(FontFamily.light).toBe('FiraSans-Light');
    expect(FontFamily.regular).toBe('FiraSans-Regular');
    expect(FontFamily.medium).toBe('FiraSans-Medium');
    expect(FontFamily.semiBold).toBe('FiraSans-SemiBold');
    expect(FontFamily.bold).toBe('FiraSans-Bold');
  });

  it('should have correct font weight values', () => {
    expect(FontWeight._100).toBe('100');
    expect(FontWeight.thin).toBe('100');
    expect(FontWeight._200).toBe('200');
    expect(FontWeight.extraLight).toBe('200');
    expect(FontWeight._300).toBe('300');
    expect(FontWeight.light).toBe('300');
    expect(FontWeight._400).toBe('400');
    expect(FontWeight.normal).toBe('400');
    expect(FontWeight._500).toBe('500');
    expect(FontWeight.medium).toBe('500');
    expect(FontWeight._600).toBe('600');
    expect(FontWeight.semiBold).toBe('600');
    expect(FontWeight._700).toBe('700');
    expect(FontWeight.bold).toBe('700');
    expect(FontWeight._800).toBe('800');
    expect(FontWeight.extraBold).toBe('800');
    expect(FontWeight._900).toBe('900');
    expect(FontWeight.heavyBlack).toBe('900');
  });
});
