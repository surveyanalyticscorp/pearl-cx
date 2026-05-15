import * as actions from './notification.actions';
import {
  GET_NOTIFICATION,
  READ_NOTIFICATION,
  CLEAR_NOTIFICATION,
} from './notification.actions';

describe('Notification Actions', () => {
  it('should create an action to get notifications', () => {
    const userId = 'user123';
    const expectedAction = {
      type: GET_NOTIFICATION,
      userId,
    };
    expect(actions.getNotification(userId)).toEqual(expectedAction);
  });

  it('should create an action to read a notification', () => {
    const notificationId = 'notif456';
    const userId = 'user123';
    const expectedAction = {
      type: READ_NOTIFICATION,
      notificationId,
      userId,
    };
    expect(actions.readNotification(notificationId, userId)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to clear a notification', () => {
    const notification = {id: 1, title: 'Test'};
    const expectedAction = {
      type: CLEAR_NOTIFICATION,
      payload: notification,
    };
    expect(actions.clearNotification(notification)).toEqual(expectedAction);
  });
});
