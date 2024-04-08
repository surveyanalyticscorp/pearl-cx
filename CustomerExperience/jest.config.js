module.exports = {
  preset: 'react-native',
  testEnvironment: 'jsdom',
  setupFiles: ['./setupTests.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
};
