// write test for Notification reducer
import NotificationReducer from './NotificationReducer';
import {
  CLEAR_NOTIFICATION,
  NOTIFICATION_RECEIVED,
  READ_NOTIFICATION_RECIEVED,
} from '../actions/notification.actions';

// write test for Notification reducer
describe('Notification reducer', () => {
  const initialState = {
    notificationLogs: [],
    readNotification: {},
  };

  it('should return the initial state', () => {
    expect(NotificationReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle NOTIFICATION_RECEIVED', () => {
    const mockNotifications = [
      {
        id: 1,
        title: 'title',
        message: 'message',
        createdAt: '2020-01-01',
      },
    ];

    expect(
      NotificationReducer(initialState, {
        type: NOTIFICATION_RECEIVED,
        response: mockNotifications,
      }),
    ).toEqual({
      notificationLogs: mockNotifications,
      readNotification: {},
    });
  });

  it('should handle CLEAR_NOTIFICATION with valid payload', () => {
    const stateWithNotifications = {
      notificationLogs: [
        {
          id: 1,
          title: 'title',
          message: 'message',
          createdAt: '2020-01-01',
        },
        {
          id: 2,
          title: 'title2',
          message: 'message2',
          createdAt: '2020-01-02',
        },
      ],
      readNotification: {},
    };

    expect(
      NotificationReducer(stateWithNotifications, {
        type: CLEAR_NOTIFICATION,
        payload: {
          id: 1,
        },
      }),
    ).toEqual({
      notificationLogs: [
        {
          id: 2,
          title: 'title2',
          message: 'message2',
          createdAt: '2020-01-02',
        },
      ],
      readNotification: {},
    });
  });

  it('should handle CLEAR_NOTIFICATION without payload', () => {
    const stateWithNotifications = {
      notificationLogs: [
        {
          id: 1,
          title: 'title',
          message: 'message',
          createdAt: '2020-01-01',
        },
      ],
      readNotification: {},
    };

    expect(
      NotificationReducer(stateWithNotifications, {
        type: CLEAR_NOTIFICATION,
      }),
    ).toEqual({
      notificationLogs: [],
      readNotification: {},
    });
  });

  it('should handle READ_NOTIFICATION_RECIEVED', () => {
    const readNotificationData = {
      id: 1,
      isRead: true,
      readAt: '2020-01-01T10:00:00Z',
    };

    expect(
      NotificationReducer(initialState, {
        type: READ_NOTIFICATION_RECIEVED,
        payload: readNotificationData,
      }),
    ).toEqual({
      notificationLogs: [],
      readNotification: readNotificationData,
    });
  });

  it('should return current state for unknown action type', () => {
    const currentState = {
      notificationLogs: [{id: 1, title: 'test'}],
      readNotification: {id: 1, isRead: true},
    };

    expect(
      NotificationReducer(currentState, {
        type: 'UNKNOWN_ACTION',
      }),
    ).toEqual(currentState);
  });
});
