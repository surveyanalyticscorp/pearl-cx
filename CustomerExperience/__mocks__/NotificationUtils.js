// Mock for NotificationUtils
export const checkNotificationPermission = jest.fn(() => Promise.resolve(true));

export const requestNotificationPermission = jest.fn(() =>
  Promise.resolve('granted'),
);

export const scheduleLocalNotification = jest.fn();

export const cancelLocalNotification = jest.fn();
