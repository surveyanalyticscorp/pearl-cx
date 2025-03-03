/*
 * Datta Kunde created on 20/04/21
 */

import RNLocalize from 'react-native-localize';
import {I18nManager} from 'react-native';
// import * as i18n from 'i18n-js';
import I18n from 'react-native-i18n';
import memoize from 'lodash.memoize';

const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  en: () => require('../config/translations/en.json'),
  fr: () => require('../config/translations/fr.json'),
  de: () => require('../config/translations/de.json'),
  es: () => require('../config/translations/es.json'),
  pt: () => require('../config/translations/pt.json'),
};

export const translate = memoize(
  (key, config) => I18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

export const setI18nConfig = (languageTag, isRTL = false) => {
  // fallback if no available language fits
  //const fallback = { languageTag: "en", isRTL: false };
  //const { languageTag, isRTL } = RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) || fallback;
  if (!Object.keys(translationGetters).includes(languageTag)) {
    languageTag = 'en';
  }

  // console.log(`LANG TAG: ${languageTag}`);
  // console.log(`LANG TAG: ${JSON.stringify(translationGetters[languageTag]())}`);

  // clear translation cache
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);
  // set i18n-js config
  I18n.translations = {[languageTag]: translationGetters[languageTag]()};
  I18n.locale = languageTag;
};
