module.exports = {
  preset: 'react-native',
  testEnvironment: 'jsdom',
  setupFiles: ['./setupTests.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],

  transformIgnorePatterns: [
    'node_modules/(?!react-native|@react-native|@react-navigation)',
  ],

  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  moduleDirectories: ['node_modules'],
  collectCoverage: false,
  collectCoverageFrom: ['app/**/*.{js,jsx}'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)$':
      '<rootDir>/__mocks__/fileMock.js',
  },
};
