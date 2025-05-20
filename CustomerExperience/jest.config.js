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
  collectCoverage: false,
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
    '^react-native-gesture-handler$':
      '<rootDir>/__mocks__/react-native-gesture-handler.js',
    '^@react-native-firebase/messaging$':
      '<rootDir>/__mocks__/@react-native-firebase/messaging.js',
    '^@react-native-async-storage/async-storage$':
      '<rootDir>/__mocks__/async-storage.js',

    'react-native-device-info$':
      '<rootDir>/__mocks__/react-native-device-info.js',
  },
  coveragePathIgnorePatterns: [
    'app/components/Notification.js',
    'app/components/feedback/feedbackdetails/ResponseFeedback.js',
    'app/components/feedback/SearchFeedback.js',
    'app/index.js',
    '/node_modules/',
    '/android/',
    '/ios/',
    'app/widgets/qp-calendar',
    'app/widgets/QPCalendar',
    'app/widgets/RangeCalendar',
    'app/widgets/dashboardWidgets',
    'app/widgets/dialog',
    'app/widgets/drop-down',
    'app/Utils/NotificationUtils',
    'app/Utils/AppTimeTracker',
    'app/components/dashboard/highchart.html',
    'app/components/dashboard/highcharts.js',
    'app/components/dashboard/jquery.min.js',
    'app/components/dashboard/components',
    'app/components/dashboard/ticketManagement',
    'app/routes',
    'app/routes/SearchStack.js',
    'app/components/dashboard/RenderSegmentBottomSheet.js',
    'app/components/closedloop/takeaction/SendEmail.js',
    'app/components/login/SplashScreen.js',
    'app/components/notifications',
    'app/redux/sagas/notificationSaga.js',
    'app/components/dashboard/DashboardClosedLoopView.js',
    'app/components/closedloop/CentralizedRootCause',
    'app/redux/sagas/centralizedRootCauseSaga.js',
    'app/redux/sagas/loginInSaga.js',
    // 'app/components/closedloop/TicketOverview/components/actionBottomSheet.js',
  ],

  testTimeout: 30000,
};
