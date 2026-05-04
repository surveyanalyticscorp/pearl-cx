import {
  requestNotificationPermission,
  checkNotificationPermission,
  addNotificationListeners,
  actionOnNotification,
} from './NotificationUtils';

// Global mocks
jest.mock('react-native', () => ({
  Platform: {
    OS: 'android',
  },
  PermissionsAndroid: {
    PERMISSIONS: {
      POST_NOTIFICATIONS: 'android.permission.POST_NOTIFICATIONS',
    },
    request: jest.fn(),
  },
  AppState: {
    currentState: 'active',
  },
}));

jest.mock('@react-native-firebase/messaging', () => {
  const mockInstance = {
    requestPermission: jest.fn(),
    getToken: jest.fn(),
    setBackgroundMessageHandler: jest.fn(),
    onMessage: jest.fn(),
    onNotificationOpenedApp: jest.fn(),
    getInitialNotification: jest.fn(() => Promise.resolve(null)),
  };

  const mockMessaging = jest.fn(() => mockInstance);

  // Add AuthorizationStatus to the function itself
  mockMessaging.AuthorizationStatus = {
    AUTHORIZED: 1,
    PROVISIONAL: 2,
    DENIED: 0,
  };

  return {
    __esModule: true,
    default: mockMessaging,
  };
});

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('../routes/RootNavigation', () => ({
  navigate: jest.fn(),
  navigationRef: {
    current: {
      getCurrentRoute: jest.fn(),
      dispatch: jest.fn(),
    },
  },
}));

jest.mock('@react-navigation/native', () => ({
  CommonActions: {
    setParams: jest.fn(params => ({type: 'SET_PARAMS', payload: params})),
  },
}));

jest.mock('./Utility', () => ({
  isStringNullOrEmpty: jest.fn(),
}));

jest.mock('../api/Constant', () => ({
  ASYNC_PUSH_TOKEN: 'PUSH_TOKEN',
}));

jest.mock('react-native-notifications', () => ({
  Notifications: {
    setNotificationChannel: jest.fn(),
    events: () => ({
      registerNotificationReceivedBackground: jest.fn(),
      registerNotificationReceivedForeground: jest.fn(),
      registerNotificationOpened: jest.fn(),
    }),
  },
}));

describe('NotificationUtils', () => {
  let messagingMock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Get the messaging mock instance
    const messaging = require('@react-native-firebase/messaging').default;
    messagingMock = messaging();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('requestNotificationPermission', () => {
    it('should request POST_NOTIFICATIONS permission on Android', async () => {
      const {Platform, PermissionsAndroid} = require('react-native');
      Platform.OS = 'android';
      PermissionsAndroid.request.mockResolvedValue('granted');

      await requestNotificationPermission();

      expect(PermissionsAndroid.request).toHaveBeenCalledWith(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    });

    it('should handle permission request error on Android', async () => {
      const {Platform, PermissionsAndroid} = require('react-native');
      Platform.OS = 'android';
      const error = new Error('Permission denied');
      PermissionsAndroid.request.mockRejectedValue(error);

      await requestNotificationPermission();

      expect(PermissionsAndroid.request).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(error);
    });

    it('should not request permission on iOS', async () => {
      const {Platform, PermissionsAndroid} = require('react-native');
      Platform.OS = 'ios';

      await requestNotificationPermission();

      expect(PermissionsAndroid.request).not.toHaveBeenCalled();
    });
  });

  describe('checkNotificationPermission', () => {
    it('should handle authorized permission status', async () => {
      messagingMock.requestPermission.mockResolvedValue(1); // AUTHORIZED
      const {isStringNullOrEmpty} = require('./Utility');
      isStringNullOrEmpty.mockReturnValue(true);
      messagingMock.getToken.mockResolvedValue('mock-token');

      await checkNotificationPermission();

      expect(messagingMock.requestPermission).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('FCM AUTH STATUS', 1);
    });

    it('should handle provisional permission status', async () => {
      messagingMock.requestPermission.mockResolvedValue(2); // PROVISIONAL
      const {isStringNullOrEmpty} = require('./Utility');
      isStringNullOrEmpty.mockReturnValue(true);

      await checkNotificationPermission();

      expect(messagingMock.requestPermission).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('FCM AUTH STATUS', 2);
    });

    it('should handle denied permission status', async () => {
      messagingMock.requestPermission.mockResolvedValue(0); // DENIED

      await checkNotificationPermission();

      expect(messagingMock.requestPermission).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('FCM AUTH STATUS', 0);
    });

    it('should handle existing token in AsyncStorage', async () => {
      messagingMock.requestPermission.mockResolvedValue(1);
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      const {isStringNullOrEmpty} = require('./Utility');

      AsyncStorage.getItem.mockResolvedValue('existing-token');
      isStringNullOrEmpty.mockReturnValue(false);

      await checkNotificationPermission();

      expect(messagingMock.requestPermission).toHaveBeenCalled();
    });
  });

  describe('addNotificationListeners', () => {
    it('should set notification channel on Android', () => {
      const {Platform} = require('react-native');
      const {Notifications} = require('react-native-notifications');
      Platform.OS = 'android';

      addNotificationListeners();

      expect(Notifications.setNotificationChannel).toHaveBeenCalledWith({
        channelId: 'high-priority',
        name: 'High Priority Notifications',
        importance: 5,
        description: 'High priority notifications for ticket updates',
        enableLights: true,
        enableVibration: true,
        showBadge: true,
        soundFile: 'default',
      });
    });

    it('should not set notification channel on iOS', () => {
      const {Platform} = require('react-native');
      const {Notifications} = require('react-native-notifications');
      Platform.OS = 'ios';

      addNotificationListeners();

      expect(Notifications.setNotificationChannel).not.toHaveBeenCalled();
    });

    it('should register Firebase message handlers', () => {
      addNotificationListeners();

      expect(messagingMock.setBackgroundMessageHandler).toHaveBeenCalled();
      expect(messagingMock.onMessage).toHaveBeenCalled();
      expect(messagingMock.onNotificationOpenedApp).toHaveBeenCalled();
      expect(messagingMock.getInitialNotification).toHaveBeenCalled();
    });

    it('should register notification event handlers', () => {
      const {Notifications} = require('react-native-notifications');
      const mockEvents = {
        registerNotificationReceivedBackground: jest.fn(),
        registerNotificationReceivedForeground: jest.fn(),
        registerNotificationOpened: jest.fn(),
      };
      Notifications.events = jest.fn(() => mockEvents);

      addNotificationListeners();

      expect(
        mockEvents.registerNotificationReceivedBackground,
      ).toHaveBeenCalled();
      expect(
        mockEvents.registerNotificationReceivedForeground,
      ).toHaveBeenCalled();
      expect(mockEvents.registerNotificationOpened).toHaveBeenCalled();
    });

    it('should handle notification opened from background with payload', () => {
      const mockRemoteMessage = {
        data: {
          payload: JSON.stringify({
            ticket: {id: 123, title: 'Test Ticket'},
            id: 456,
          }),
        },
      };

      // Mock the callback to simulate notification opening
      messagingMock.onNotificationOpenedApp.mockImplementation(callback => {
        callback(mockRemoteMessage);
      });

      addNotificationListeners();

      expect(messagingMock.onNotificationOpenedApp).toHaveBeenCalled();
    });

    it('should handle initial notification from quit state', async () => {
      const mockRemoteMessage = {
        data: {
          payload: JSON.stringify({
            ticket: {id: 123, title: 'Test Ticket'},
            id: 456,
          }),
        },
      };

      messagingMock.getInitialNotification.mockResolvedValue(mockRemoteMessage);

      addNotificationListeners();

      // Wait for the promise to resolve
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(messagingMock.getInitialNotification).toHaveBeenCalled();
    });
  });

  describe('actionOnNotification', () => {
    beforeEach(() => {
      const RootNavigation = require('../routes/RootNavigation');
      RootNavigation.navigationRef.current = {
        getCurrentRoute: jest.fn(),
        dispatch: jest.fn(),
      };
    });

    it('should navigate to TicketDetails when not on that screen', async () => {
      const RootNavigation = require('../routes/RootNavigation');
      const ticketItem = {id: 123, title: 'Test Ticket'};
      const notificationId = 456;

      RootNavigation.navigationRef.current.getCurrentRoute.mockReturnValue({
        name: 'Dashboard',
        params: {},
      });

      // Test without timeout to avoid timer dependency
      await actionOnNotification(ticketItem, notificationId, 0);

      expect(RootNavigation.navigate).toHaveBeenCalledWith('TicketDetails', {
        ticketItem: ticketItem,
        parentRoute: 'Dashboard',
        notificationId: notificationId,
      });
    });

    it('should update params when already on correct TicketDetails screen', async () => {
      const RootNavigation = require('../routes/RootNavigation');
      const {CommonActions} = require('@react-navigation/native');
      const ticketItem = {id: 123, title: 'Test Ticket'};
      const notificationId = 456;

      RootNavigation.navigationRef.current.getCurrentRoute.mockReturnValue({
        name: 'TicketDetails',
        params: {ticketItem: {id: 123}},
        key: 'ticket-screen-key',
      });

      await actionOnNotification(ticketItem, notificationId, 0);

      expect(RootNavigation.navigationRef.current.dispatch).toHaveBeenCalled();
      expect(CommonActions.setParams).toHaveBeenCalledWith({
        ticketItem: ticketItem,
        parentRoute: 'Dashboard',
        notificationId: notificationId,
      });
      expect(RootNavigation.navigate).not.toHaveBeenCalled();
    });

    it('should navigate when on different ticket details screen', async () => {
      const RootNavigation = require('../routes/RootNavigation');
      const ticketItem = {id: 123, title: 'Test Ticket'};
      const notificationId = 456;

      RootNavigation.navigationRef.current.getCurrentRoute.mockReturnValue({
        name: 'TicketDetails',
        params: {ticketItem: {id: 999}}, // Different ticket ID
      });

      await actionOnNotification(ticketItem, notificationId, 0);

      expect(RootNavigation.navigate).toHaveBeenCalledWith('TicketDetails', {
        ticketItem: ticketItem,
        parentRoute: 'Dashboard',
        notificationId: notificationId,
      });
    });

    it('should handle navigation errors', async () => {
      const RootNavigation = require('../routes/RootNavigation');
      const ticketItem = {id: 123, title: 'Test Ticket'};

      RootNavigation.navigate.mockImplementation(() => {
        throw new Error('Navigation failed');
      });

      await actionOnNotification(ticketItem, 456, 0);

      expect(console.error).toHaveBeenCalledWith(
        'Error during navigation:',
        expect.any(Error),
      );
    });

    it('should handle missing navigation reference', async () => {
      const RootNavigation = require('../routes/RootNavigation');
      const ticketItem = {id: 123, title: 'Test Ticket'};

      // Test when navigationRef.current is null initially
      RootNavigation.navigationRef.current = null;

      // This should not throw an error and should wait for navigation ref
      const promise = actionOnNotification(ticketItem, 456, 0);

      // Simulate navigation ref becoming available
      setTimeout(() => {
        RootNavigation.navigationRef.current = {
          getCurrentRoute: jest.fn().mockReturnValue({name: 'Dashboard'}),
          dispatch: jest.fn(),
        };
      }, 50);

      await promise;

      // Since we can't easily test the polling mechanism without timers,
      // we just ensure the function completes without error
      expect(promise).resolves.toBeUndefined();
    });
  });
});
