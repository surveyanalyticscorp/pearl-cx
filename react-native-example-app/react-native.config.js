module.exports = {
  dependencies: {
    // Exclude react-native-flipper when NO_FLIPPER=1 is set
    ...(process.env.NO_FLIPPER ? { 'react-native-flipper': { platforms: { ios: null } } } : {}),
  },
};
