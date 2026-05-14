import {I18nManager} from 'react-native';
import I18n from 'i18n-js';
import {translate, setI18nConfig} from './MultilinguaUtils';

jest.mock('react-native', () => ({
  I18nManager: {
    forceRTL: jest.fn(),
  },
}));

describe('MultilinguaUtils', () => {
  beforeEach(() => {
    translate.cache.clear();
    jest.clearAllMocks();
  });

  test('should fall back to English if unsupported language is passed', () => {
    setI18nConfig('unsupported_language');
    expect(I18n.locale).toBe('en');
    expect(I18n.translations.en).toBeDefined();
  });

  test('should load the correct translations based on language tag', () => {
    setI18nConfig('fr');
    expect(I18n.locale).toBe('fr');
    expect(I18n.translations.fr).toBeDefined();
  });

  test('should load the correct translations for German', () => {
    setI18nConfig('de');
    expect(I18n.locale).toBe('de');
    expect(I18n.translations.de).toBeDefined();
  });

  test('should load the correct translations for Spanish', () => {
    setI18nConfig('es');
    expect(I18n.locale).toBe('es');
    expect(I18n.translations.es).toBeDefined();
  });

  test('should load the correct translations for Portuguese', () => {
    setI18nConfig('pt');
    expect(I18n.locale).toBe('pt');
    expect(I18n.translations.pt).toBeDefined();
  });

  test('should set layout direction to RTL if isRTL is true', () => {
    setI18nConfig('ar', true);
    expect(I18nManager.forceRTL).toHaveBeenCalledWith(true);
  });

  test('should default isRTL to false when not provided', () => {
    setI18nConfig('en');
    expect(I18nManager.forceRTL).toHaveBeenCalledWith(false);
  });

  test('should clear translation cache when setI18nConfig is called', () => {
    translate.cache.set('test_key', 'test_value');
    expect(translate.cache.has('test_key')).toBe(true);

    setI18nConfig('en');
    expect(translate.cache.has('test_key')).toBe(false);
  });

  test('should memoize translate function calls', () => {
    setI18nConfig('en');
    const firstCall = translate('activity.latest');
    const secondCall = translate('activity.latest');
    expect(firstCall).toBe(secondCall);
  });

  test('should use key+config as cache key when config is provided', () => {
    setI18nConfig('en');
    const config = {defaultValue: 'latest'};
    const result = translate('activity.latest', config);
    expect(typeof result).toBe('string');
    const cachedKey = 'activity.latest' + JSON.stringify(config);
    expect(translate.cache.has(cachedKey)).toBe(true);
  });
});
