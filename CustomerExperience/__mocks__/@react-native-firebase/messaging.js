const mockMessaging = jest.fn(() => {
  return {
    hasPermission: jest.fn(() => Promise.resolve(true)),
    requestPermission: jest.fn(() => Promise.resolve(1)), // 1 = AUTHORIZED
    getToken: jest.fn(() => Promise.resolve('mock-token')),
    onMessage: jest.fn(callback => {
      // Return unsubscribe function
      return () => {};
    }),
    setBackgroundMessageHandler: jest.fn(),
    onNotificationOpenedApp: jest.fn(callback => {
      // Return unsubscribe function
      return () => {};
    }),
    getInitialNotification: jest.fn(() =>
      Promise.resolve({
        notification: {title: 'Initial Notification', body: 'Initial Body'},
        data: {CXTicket: '12345'},
      }),
    ),
  };
});

// Add AuthorizationStatus constants to the messaging function
mockMessaging.AuthorizationStatus = {
  NOT_DETERMINED: -1,
  DENIED: 0,
  AUTHORIZED: 1,
  PROVISIONAL: 2,
};

export default mockMessaging;
