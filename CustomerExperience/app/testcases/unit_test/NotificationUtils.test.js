import {
  requestNotificationPermission,
  checkNotificationPermission,
  addNotificationListeners,
} from '../../Utils/NotificationUtils';
import {Platform, PermissionsAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Notifications} from 'react-native-notifications';

jest.mock('@react-native-firebase/messaging');
jest.mock('@react-native-async-storage/async-storage');
jest.mock('react-native-notifications');

describe('NotificationUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('requestNotificationPermission', () => {
    it('should return true for non-Android platforms', async () => {
      Platform.OS = 'ios';
      const result = await requestNotificationPermission();
      expect(result).toBe(true);
    });

    it('should return true for Android version < 33', async () => {
      Platform.OS = 'android';
      Platform.Version = 32;
      const result = await requestNotificationPermission();
      expect(result).toBe(true);
    });

    it('should return true if POST_NOTIFICATIONS permission is not available', async () => {
      Platform.OS = 'android';
      Platform.Version = 33;
      PermissionsAndroid.PERMISSIONS = null;
      const result = await requestNotificationPermission();
      expect(result).toBe(true);
    });

    it('should request permission for Android 13+ and return granted', async () => {
      Platform.OS = 'android';
      Platform.Version = 33;
      PermissionsAndroid.PERMISSIONS = {POST_NOTIFICATIONS: 'android.permission.POST_NOTIFICATIONS'};
      PermissionsAndroid.RESULTS = {GRANTED: 'granted'};
      PermissionsAndroid.request = jest.fn().mockResolvedValue('granted');

      const result = await requestNotificationPermission();

      expect(PermissionsAndroid.request).toHaveBeenCalledWith('android.permission.POST_NOTIFICATIONS');
      expect(result).toBe(true);
    });

    it('should return false when permission is denied', async () => {
      Platform.OS = 'android';
      Platform.Version = 33;
      PermissionsAndroid.PERMISSIONS = {POST_NOTIFICATIONS: 'android.permission.POST_NOTIFICATIONS'};
      PermissionsAndroid.RESULTS = {DENIED: 'denied'};
      PermissionsAndroid.request = jest.fn().mockResolvedValue('denied');

      const result = await requestNotificationPermission();

      expect(result).toBe(false);
    });

    it('should catch and return false on permission request error', async () => {
      Platform.OS = 'android';
      Platform.Version = 33;
      PermissionsAndroid.PERMISSIONS = {POST_NOTIFICATIONS: 'android.permission.POST_NOTIFICATIONS'};
      PermissionsAndroid.request = jest.fn().mockRejectedValue(new Error('Permission error'));

      const result = await requestNotificationPermission();

      expect(result).toBe(false);
    });
  });

  describe('checkNotificationPermission', () => {
    it('should request messaging permission and get token if authorized', async () => {
      messaging().requestPermission = jest.fn().mockResolvedValue(messaging.AuthorizationStatus.AUTHORIZED);
      messaging().getToken = jest.fn().mockResolvedValue('test-fcm-token');
      AsyncStorage.setItem = jest.fn().mockResolvedValue(null);

      await checkNotificationPermission();

      expect(messaging().requestPermission).toHaveBeenCalled();
    });

    it('should request messaging permission and get token if provisional', async () => {
      messaging().requestPermission = jest.fn().mockResolvedValue(messaging.AuthorizationStatus.PROVISIONAL);
      messaging().getToken = jest.fn().mockResolvedValue('test-fcm-token');
      AsyncStorage.setItem = jest.fn().mockResolvedValue(null);

      await checkNotificationPermission();

      expect(messaging().requestPermission).toHaveBeenCalled();
    });

    it('should handle denied authorization status', async () => {
      messaging().requestPermission = jest.fn().mockResolvedValue(messaging.AuthorizationStatus.DENIED);

      await checkNotificationPermission();

      expect(messaging().requestPermission).toHaveBeenCalled();
    });

    it('should catch errors in checkNotificationPermission', async () => {
      messaging().requestPermission = jest.fn().mockRejectedValue(new Error('Check permission failed'));
      AsyncStorage.setItem = jest.fn().mockResolvedValue(null);

      await checkNotificationPermission();

      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('addNotificationListeners', () => {
    it('should set notification channel for Android', () => {
      Platform.OS = 'android';
      Notifications.setNotificationChannel = jest.fn();
      messaging().setBackgroundMessageHandler = jest.fn();
      messaging().onMessage = jest.fn();
      messaging().onNotificationOpenedApp = jest.fn();
      messaging().getInitialNotification = jest.fn().mockResolvedValue(null);

      addNotificationListeners();

      expect(Notifications.setNotificationChannel).toHaveBeenCalledWith(
        expect.objectContaining({
          channelId: 'high-priority',
          name: 'High Priority Notifications',
        }),
      );
    });

    it('should not set notification channel for iOS', () => {
      Platform.OS = 'ios';
      Notifications.setNotificationChannel = jest.fn();
      messaging().setBackgroundMessageHandler = jest.fn();
      messaging().onMessage = jest.fn();
      messaging().onNotificationOpenedApp = jest.fn();
      messaging().getInitialNotification = jest.fn().mockResolvedValue(null);

      addNotificationListeners();

      expect(Notifications.setNotificationChannel).not.toHaveBeenCalled();
    });

    it('should register background message handler', () => {
      Platform.OS = 'ios';
      messaging().setBackgroundMessageHandler = jest.fn();
      messaging().onMessage = jest.fn();
      messaging().onNotificationOpenedApp = jest.fn();
      messaging().getInitialNotification = jest.fn().mockResolvedValue(null);

      addNotificationListeners();

      expect(messaging().setBackgroundMessageHandler).toHaveBeenCalled();
    });

    it('should register foreground message handler', () => {
      Platform.OS = 'ios';
      messaging().setBackgroundMessageHandler = jest.fn();
      messaging().onMessage = jest.fn();
      messaging().onNotificationOpenedApp = jest.fn();
      messaging().getInitialNotification = jest.fn().mockResolvedValue(null);

      addNotificationListeners();

      expect(messaging().onMessage).toHaveBeenCalled();
    });

    it('should register notification opened app listener', () => {
      Platform.OS = 'ios';
      messaging().setBackgroundMessageHandler = jest.fn();
      messaging().onMessage = jest.fn();
      messaging().onNotificationOpenedApp = jest.fn();
      messaging().getInitialNotification = jest.fn().mockResolvedValue(null);

      addNotificationListeners();

      expect(messaging().onNotificationOpenedApp).toHaveBeenCalled();
    });

    it('should get initial notification on startup', () => {
      Platform.OS = 'ios';
      messaging().setBackgroundMessageHandler = jest.fn();
      messaging().onMessage = jest.fn();
      messaging().onNotificationOpenedApp = jest.fn();
      messaging().getInitialNotification = jest.fn().mockResolvedValue(null);

      addNotificationListeners();

      expect(messaging().getInitialNotification).toHaveBeenCalled();
    });

    it('should register notification received background listener', () => {
      Platform.OS = 'ios';
      Notifications.events = jest.fn().mockReturnValue({
        registerNotificationReceivedBackground: jest.fn(),
        registerNotificationReceivedForeground: jest.fn(),
        registerNotificationOpened: jest.fn(),
      });
      messaging().setBackgroundMessageHandler = jest.fn();
      messaging().onMessage = jest.fn();
      messaging().onNotificationOpenedApp = jest.fn();
      messaging().getInitialNotification = jest.fn().mockResolvedValue(null);

      addNotificationListeners();

      expect(Notifications.events().registerNotificationReceivedBackground).toHaveBeenCalled();
    });

    it('should register notification received foreground listener', () => {
      Platform.OS = 'ios';
      const mockEvents = {
        registerNotificationReceivedBackground: jest.fn(),
        registerNotificationReceivedForeground: jest.fn(),
        registerNotificationOpened: jest.fn(),
      };
      Notifications.events = jest.fn().mockReturnValue(mockEvents);
      messaging().setBackgroundMessageHandler = jest.fn();
      messaging().onMessage = jest.fn();
      messaging().onNotificationOpenedApp = jest.fn();
      messaging().getInitialNotification = jest.fn().mockResolvedValue(null);

      addNotificationListeners();

      expect(mockEvents.registerNotificationReceivedForeground).toHaveBeenCalled();
    });

    it('should register notification opened listener', () => {
      Platform.OS = 'ios';
      const mockEvents = {
        registerNotificationReceivedBackground: jest.fn(),
        registerNotificationReceivedForeground: jest.fn(),
        registerNotificationOpened: jest.fn(),
      };
      Notifications.events = jest.fn().mockReturnValue(mockEvents);
      messaging().setBackgroundMessageHandler = jest.fn();
      messaging().onMessage = jest.fn();
      messaging().onNotificationOpenedApp = jest.fn();
      messaging().getInitialNotification = jest.fn().mockResolvedValue(null);

      addNotificationListeners();

      expect(mockEvents.registerNotificationOpened).toHaveBeenCalled();
    });
  });
});
