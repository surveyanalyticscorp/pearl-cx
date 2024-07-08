module.exports = {
  preset: 'react-native',
  testEnvironment: 'jsdom',
  setupFiles: ['./setupTests.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    './setupTests.js',
  ],

  transformIgnorePatterns: [
    'node_modules/(?!react-native|@react-native|@react-navigation|react-native-orientation-locker)',
  ],
  // testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  // moduleNameMapper: {
  //   'react-native-orientation-locker':
  //     './__mocks__/react-native-orientation-locker.js',
  // },

  // moduleNameMapper: {
  //   'react-native-orientation-locker':
  //     '/__mocks__/react-native-orientation-locker.js',
  // },
};
