module.exports = {
  dependencies: {
    '@questionpro/react-native-intercept-sdk': {
      platforms: {
        android: null, // temporarily disable to test fallback first
        ios: null, // disable iOS platform for now due to pod issues
      },
    },
    // Exclude react-native-flipper when NO_FLIPPER=1 is set
    ...(process.env.NO_FLIPPER ? { 'react-native-flipper': { platforms: { ios: null } } } : {}),
  },
};
