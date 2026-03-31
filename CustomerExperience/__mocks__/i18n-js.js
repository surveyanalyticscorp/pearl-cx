const I18n = {
  translations: {
    en: {
      hello: 'Hello, World!',
    },
    fr: {
      hello: 'Bonjour, le monde!',
    },
  },
  locale: 'en',
  t: (key, config) => {
    return I18n.translations[I18n.locale][key] || key;
  },
};

export default I18n;
