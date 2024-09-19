const messaging = jest.fn(() => {
  return {
    hasPermission: jest.fn(() => Promise.resolve(true)),
    requestPermission: jest.fn(() => Promise.resolve(true)),
    getToken: jest.fn(() => Promise.resolve('mock-token')),
    onMessage: jest.fn(),
    setBackgroundMessageHandler: jest.fn(),
    onNotificationOpenedApp: jest.fn(callback =>
      callback({
        notification: {title: 'Test Notification', body: 'Test Body'},
        data: {CXTicket: '12345'},
      }),
    ),
    getInitialNotification: jest.fn(() =>
      Promise.resolve({
        notification: {title: 'Initial Notification', body: 'Initial Body'},
        data: {CXTicket: '12345'},
      }),
    ),
  };
});

export default messaging;
