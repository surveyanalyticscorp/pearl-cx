/*
 * Datta Kunde created on 20/04/21
 */

import RNLocalize from 'react-native-localize';
import {I18nManager} from 'react-native';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';

const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  en: () => require('../config/translations/en.json'),
  fr: () => require('../config/translations/fr.json'),
  de: () => require('../config/translations/de.json'),
  es: () => require('../config/translations/es.json'),
};

export const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

export const setI18nConfig = (languageTag, isRTL = false) => {
  // fallback if no available language fits
  //const fallback = { languageTag: "en", isRTL: false };
  //const { languageTag, isRTL } = RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) || fallback;
  if (!Object.keys(translationGetters).includes(languageTag)) {
    languageTag = 'en';
  }

  // clear translation cache
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);
  // set i18n-js config
  i18n.translations = {[languageTag]: translationGetters[languageTag]()};
  i18n.locale = languageTag;
};
