import {
  checkNotificationPermission,
  addNotificationListeners,
  actionOnNotification,
  requestUserPermission,
} from './NotificationUtils.js';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Notifications} from 'react-native-notifications';
import {AppState} from 'react-native';
import * as RootNavigation from '../routes/RootNavigation';
import {translate} from './MultilinguaUtils';

jest.mock('@react-native-firebase/messaging');
jest.mock('@react-native-async-storage/async-storage');
jest.mock('react-native-notifications');
jest.mock('../routes/RootNavigation');
jest.mock('./MultilinguaUtils', () => ({
  translate: jest.fn(key => key),
}));

describe('NotificationUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // describe('checkNotificationPermission', () => {
  //   it('should call getToken when permission is enabled', async () => {
  //     messaging().hasPermission.mockResolvedValue(true);
  //     const getTokenSpy = jest
  //       .spyOn(messaging(), 'getToken')
  //       .mockResolvedValue('mock-token');

  //     await checkNotificationPermission();

  //     expect(messaging().hasPermission).toHaveBeenCalled();
  //     expect(getTokenSpy).toHaveBeenCalled();
  //   });

  //   it('should call requestUserPermission when permission is not enabled', async () => {
  //     messaging().hasPermission.mockResolvedValue(false);
  //     const requestUserPermissionSpy = jest.spyOn(
  //       messaging(),
  //       'requestPermission',
  //     );

  //     await checkNotificationPermission();

  //     expect(messaging().hasPermission).toHaveBeenCalled();
  //     expect(requestUserPermissionSpy).toHaveBeenCalled();
  //   });
  // });

  // describe('addNotificationListeners', () => {
  //   it('should set background message handler and handle notifications', () => {
  //     const setBackgroundMessageHandlerSpy = jest.spyOn(
  //       messaging(),
  //       'setBackgroundMessageHandler',
  //     );
  //     const onNotificationOpenedAppSpy = jest.spyOn(
  //       messaging(),
  //       'onNotificationOpenedApp',
  //     );
  //     const getInitialNotificationSpy = jest.spyOn(
  //       messaging(),
  //       'getInitialNotification',
  //     );
  //     const registerNotificationReceivedForegroundSpy = jest.spyOn(
  //       Notifications.events(),
  //       'registerNotificationReceivedForeground',
  //     );
  //     const registerNotificationOpenedSpy = jest.spyOn(
  //       Notifications.events(),
  //       'registerNotificationOpened',
  //     );

  //     addNotificationListeners();

  //     expect(setBackgroundMessageHandlerSpy).toHaveBeenCalled();
  //     expect(onNotificationOpenedAppSpy).toHaveBeenCalled();
  //     expect(getInitialNotificationSpy).toHaveBeenCalled();
  //     expect(registerNotificationReceivedForegroundSpy).toHaveBeenCalled();
  //     expect(registerNotificationOpenedSpy).toHaveBeenCalled();
  //   });

  //   it('should navigate to ticket details when notification opens the app', async () => {
  //     const remoteMessage = {
  //       data: {CXTicket: '12345'},
  //       notification: {title: 'Test', body: 'Test Body'},
  //     };

  //     messaging().getInitialNotification.mockResolvedValue(remoteMessage);
  //     const navigateSpy = jest.spyOn(RootNavigation, 'navigate');

  //     await addNotificationListeners();

  //     expect(navigateSpy).toHaveBeenCalledWith('close_loop.ticket_details', {
  //       ticketID: '12345',
  //       parentRoute: 'Dashboard',
  //     });
  //   });
  // });

  describe('actionOnNotification', () => {
    jest.useFakeTimers();

    it('should navigate to ticket details after a delay', () => {
      const navigateSpy = jest.spyOn(RootNavigation, 'navigate');

      actionOnNotification('12345', 1000);

      jest.advanceTimersByTime(1000);

      expect(navigateSpy).toHaveBeenCalledWith('close_loop.ticket_details', {
        ticketID: '12345',
        parentRoute: 'Dashboard',
      });
    });
  });

  // describe('requestUserPermission', () => {
  //   it('should request permission and call getToken', async () => {
  //     const requestPermissionSpy = jest.spyOn(messaging(), 'requestPermission');
  //     const getTokenSpy = jest
  //       .spyOn(messaging(), 'getToken')
  //       .mockResolvedValue('mock-token');

  //     await requestUserPermission();

  //     expect(requestPermissionSpy).toHaveBeenCalled();
  //     expect(getTokenSpy).toHaveBeenCalled();
  //   });

  //   it('should log an error when permission is rejected', async () => {
  //     const consoleSpy = jest.spyOn(console, 'log');

  //     // Mock requestPermission to reject the promise
  //     messaging().requestPermission.mockRejectedValue('Permission rejected');

  //     // Mock getToken to prevent any unintended calls
  //     const getTokenMock = jest
  //       .spyOn(messaging(), 'getToken')
  //       .mockResolvedValue('mock-token');

  //     // Call the function
  //     await requestUserPermission();

  //     // Assert that the console logged the rejection message
  //     expect(consoleSpy).toHaveBeenCalledWith('permission rejected');

  //     // Ensure getToken is never called
  //     expect(getTokenMock).not.toHaveBeenCalled();
  //   });
  // });
});
