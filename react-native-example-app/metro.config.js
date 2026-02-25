const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  watchFolders: [
    path.resolve(__dirname, '../react-native-intercept-sdk'),
  ],
  resolver: {
    alias: {
      '@questionpro/react-native-intercept-sdk': path.resolve(__dirname, '../react-native-intercept-sdk'),
    },
    nodeModulesPaths: [
      path.resolve(__dirname, '../node_modules'),
      path.resolve(__dirname, './node_modules'),
    ],
    blacklistRE: /react-native-intercept-sdk\/example\/.*/,
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
