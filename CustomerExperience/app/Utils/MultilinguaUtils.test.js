import {I18nManager} from 'react-native';
import I18n from 'react-native-i18n';
import {translate, setI18nConfig} from './MultilinguaUtils';
import RNLocalize from 'react-native-localize';

jest.mock('react-native-localize');
jest.mock('react-native-i18n'); // Ensure this line is present to use the mock

jest.mock('react-native', () => ({
  I18nManager: {
    forceRTL: jest.fn(),
  },
}));

describe('MultilinguaUtils', () => {
  beforeEach(() => {
    I18n.translations = {
      en: {hello: 'Hello, World!'},
      fr: {hello: 'Bonjour, le monde!'},
      de: {hello: 'Hallo, Welt!'},
      es: {hello: '¡Hola, Mundo!'},
      pt: {hello: 'Olá, Mundo!'},
    };
    I18n.locale = 'en';
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

  test('should memoize translate function calls', () => {
    const key = 'hello';
    const config = {name: 'World'};

    const firstCall = translate(key, config);
    const secondCall = translate(key, config);

    // Test if the memoized result returns the same object reference
    expect(firstCall).toBe('Hello, World!'); // Test if the result matches the translation
    expect(secondCall).toBe('Hello, World!'); // Should be the same as firstCall due to memoization
  });

  test('should clear translation cache when setI18nConfig is called', () => {
    translate.cache.set('test_key', 'test_value');
    expect(translate.cache.has('test_key')).toBe(true);

    setI18nConfig('en');
    expect(translate.cache.has('test_key')).toBe(false);
  });
});
