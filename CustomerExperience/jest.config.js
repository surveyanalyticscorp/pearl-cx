module.exports = {
  preset: 'react-native',
  testEnvironment: 'jsdom',
  setupFiles: [
    './setupTests.js',
    '<rootDir>/__mocks__/react-native-localize.js',
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],

  transformIgnorePatterns: [
    'node_modules/(?!victory-native|react-native|@react-native|@react-navigation|rn-fetch-blob|cheerio)',
  ],

  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  moduleDirectories: ['node_modules'],
  collectCoverage: true,
  coverageProvider: 'v8',
  collectCoverageFrom: ['app/**/*.{js,jsx}'],

  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)$':
      '<rootDir>/__mocks__/fileMock.js',
    '^react-native-flash-message$':
      '<rootDir>/__mocks__/react-native-flash-message.js',
    '^@react-navigation/material-top-tabs$':
      '<rootDir>/__mocks__/@react-navigation/material-top-tabs.js',
    '^@react-navigation/native$':
      '<rootDir>/__mocks__/@react-navigation/native.js',
    '^@react-navigation/stack$':
      '<rootDir>/__mocks__/@react-navigation/stack.js',
    '\\.svg': '<rootDir>/__mocks__/svgMock.js',
    '^react-native-reanimated$':
      '<rootDir>/__mocks__/react-native-reanimated.js',
    '^react-native-reanimated/mock$':
      '<rootDir>/__mocks__/react-native-reanimated.js',
    '^react-native-gesture-handler$':
      '<rootDir>/__mocks__/react-native-gesture-handler.js',
    '^@react-native-firebase/messaging$':
      '<rootDir>/__mocks__/@react-native-firebase/messaging.js',
    '^@react-native-async-storage/async-storage$':
      '<rootDir>/__mocks__/async-storage.js',

    'react-native-device-info$':
      '<rootDir>/__mocks__/react-native-device-info.js',
    '^@react-native-clipboard/clipboard$':
      '<rootDir>/__mocks__/@react-native-clipboard/clipboard.js',
  },
  coveragePathIgnorePatterns: [
    // Standard ignores
    'app/index.js',
    '/node_modules/',
    '/android/',
    '/ios/',
    // Vendor / non-JS assets
    'app/components/dashboard/highchart.html',
    'app/components/dashboard/highcharts.js',
    'app/components/dashboard/jquery.min.js',
    // Navigation stacks (wiring only, no business logic)
    'app/routes/appRouter.js',
    'app/routes/signInStack.js',
    'app/routes/SettingsStack.js',
    'app/routes/ClosedLoopStack.js',
    'app/routes/DashboardStack.js',
    'app/routes/DashboardModalStack.js',
    'app/routes/ResponsesStack.js',
    'app/routes/RenderDrawer.js',
    'app/routes/DrawerContent.js',
    'app/routes/RootNavigation.js',
    'app/routes/drawerContent',
    // Legacy/unadopted screens (under audit for deletion)
    'app/components/dashboard/components',
    'app/components/dashboard/ticketManagement',
    'app/components/dashboard/RenderSegmentBottomSheet.js',
    // Widget libraries (under audit for deletion)
    'app/widgets/qp-calendar',
    'app/widgets/drop-down',
    // Notification subsystem (complex, deferred)
    'app/components/notifications',
    'app/redux/sagas/notificationSaga.js',
    // Feedback screens (intentionally deferred)
    'app/components/feedback/SearchFeedback.js',
    // Non-source test variants (must not count as 0%-covered source)
    'app/components/login/hooks/useLoginError.test.backup.js',
    'app/components/login/hooks/useLoginError.test.fixed.js',
    'app/testcases/login.saga._test_.js',
  ],

  testTimeout: 30000,
};
