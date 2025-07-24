export const GET_NOTIFICATION = 'GET_NOTIFICATION';
export const NOTIFICATION_RECEIVED = 'NOTIFICATION_RECEIVED';
export const CLEAR_NOTIFICATION = 'CLEAR_NOTIFICATION';
export const READ_NOTIFICATION = 'READ_NOTIFICATION';
export const READ_NOTIFICATION_RECIEVED = 'READ_NOTIFICATION_RECIEVED';

export const getNotification = userId => ({
  type: GET_NOTIFICATION,
  userId: userId,
});

export const readNotification = (notificationId, userId) => ({
  type: READ_NOTIFICATION,
  notificationId: notificationId,
  userId: userId,
});

export const clearNotification = notification => {
  return {
    type: CLEAR_NOTIFICATION,
    payload: notification,
  };
};
