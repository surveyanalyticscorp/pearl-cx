// write test for Notification reducer
import NotificationReducer from './NotificationReducer';
import {
  CLEAR_NOTIFICATION,
  NOTIFICATION_RECEIVED,
} from '../actions/notification.actions';

// write test for Notification reducer
describe('Notification reducer', () => {
  it('should return the initial state', () => {
    expect(NotificationReducer(undefined, {})).toEqual({
      notificationLogs: [],
    });
  });

  it('should handle NOTIFICATION_RECEIVED', () => {
    expect(
      NotificationReducer(
        {
          notificationLogs: [],
        },
        {
          type: NOTIFICATION_RECEIVED,
          response: {
            body: {
              notificationLogs: [
                {
                  id: 1,
                  title: 'title',
                  message: 'message',
                  createdAt: '2020-01-01',
                },
              ],
            },
          },
        },
      ),
    ).toEqual({
      notificationLogs: [
        {
          id: 1,
          title: 'title',
          message: 'message',
          createdAt: '2020-01-01',
        },
      ],
    });
  });

  it('should handle CLEAR_NOTIFICATION', () => {
    expect(
      NotificationReducer(
        {
          notificationLogs: [
            {
              id: 1,
              title: 'title',
              message: 'message',
              createdAt: '2020-01-01',
            },
          ],
        },
        {
          type: CLEAR_NOTIFICATION,
          payload: {
            id: 1,
          },
        },
      ),
    ).toEqual({
      notificationLogs: [],
    });
  });
});
