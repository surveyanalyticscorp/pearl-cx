module.exports = {
  preset: 'react-native',
  testEnvironment: 'jsdom',
  setupFiles: ['./setupTests.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native-orientation-locker)/)',
  ],
  moduleNameMapper: {
    // Mock CSS files
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Mock image files
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
};
