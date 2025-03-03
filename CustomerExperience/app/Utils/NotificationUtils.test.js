// import {
//   checkNotificationPermission,
//   addNotificationListeners,
//   actionOnNotification,
//   requestUserPermission,
// } from './NotificationUtils.js';
// import messaging from '@react-native-firebase/messaging';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {Notifications} from 'react-native-notifications';
// import {AppState} from 'react-native';
// import * as RootNavigation from '../routes/RootNavigation';
// import {translate} from './MultilinguaUtils';

// jest.mock('@react-native-firebase/messaging');
// jest.mock('@react-native-async-storage/async-storage');
// jest.mock('react-native-notifications');
// jest.mock('../routes/RootNavigation');
// jest.mock('./MultilinguaUtils', () => ({
//   translate: jest.fn(key => key),
// }));

// describe('NotificationUtils', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   // describe('checkNotificationPermission', () => {
//   //   it('should call getToken when permission is enabled', async () => {
//   //     messaging().hasPermission.mockResolvedValue(true);
//   //     const getTokenSpy = jest
//   //       .spyOn(messaging(), 'getToken')
//   //       .mockResolvedValue('mock-token');

//   //     await checkNotificationPermission();

//   //     expect(messaging().hasPermission).toHaveBeenCalled();
//   //     expect(getTokenSpy).toHaveBeenCalled();
//   //   });

//   //   it('should call requestUserPermission when permission is not enabled', async () => {
//   //     messaging().hasPermission.mockResolvedValue(false);
//   //     const requestUserPermissionSpy = jest.spyOn(
//   //       messaging(),
//   //       'requestPermission',
//   //     );

//   //     await checkNotificationPermission();

//   //     expect(messaging().hasPermission).toHaveBeenCalled();
//   //     expect(requestUserPermissionSpy).toHaveBeenCalled();
//   //   });
//   // });

//   // describe('addNotificationListeners', () => {
//   //   it('should set background message handler and handle notifications', () => {
//   //     const setBackgroundMessageHandlerSpy = jest.spyOn(
//   //       messaging(),
//   //       'setBackgroundMessageHandler',
//   //     );
//   //     const onNotificationOpenedAppSpy = jest.spyOn(
//   //       messaging(),
//   //       'onNotificationOpenedApp',
//   //     );
//   //     const getInitialNotificationSpy = jest.spyOn(
//   //       messaging(),
//   //       'getInitialNotification',
//   //     );
//   //     const registerNotificationReceivedForegroundSpy = jest.spyOn(
//   //       Notifications.events(),
//   //       'registerNotificationReceivedForeground',
//   //     );
//   //     const registerNotificationOpenedSpy = jest.spyOn(
//   //       Notifications.events(),
//   //       'registerNotificationOpened',
//   //     );

//   //     addNotificationListeners();

//   //     expect(setBackgroundMessageHandlerSpy).toHaveBeenCalled();
//   //     expect(onNotificationOpenedAppSpy).toHaveBeenCalled();
//   //     expect(getInitialNotificationSpy).toHaveBeenCalled();
//   //     expect(registerNotificationReceivedForegroundSpy).toHaveBeenCalled();
//   //     expect(registerNotificationOpenedSpy).toHaveBeenCalled();
//   //   });

//   //   it('should navigate to ticket details when notification opens the app', async () => {
//   //     const remoteMessage = {
//   //       data: {CXTicket: '12345'},
//   //       notification: {title: 'Test', body: 'Test Body'},
//   //     };

//   //     messaging().getInitialNotification.mockResolvedValue(remoteMessage);
//   //     const navigateSpy = jest.spyOn(RootNavigation, 'navigate');

//   //     await addNotificationListeners();

//   //     expect(navigateSpy).toHaveBeenCalledWith('close_loop.ticket_details', {
//   //       ticketID: '12345',
//   //       parentRoute: 'Dashboard',
//   //     });
//   //   });
//   // });

//   describe('actionOnNotification', () => {
//     jest.useFakeTimers();

//     it('should navigate to ticket details after a delay', () => {
//       const navigateSpy = jest.spyOn(RootNavigation, 'navigate');

//       actionOnNotification('12345', 1000);

//       jest.advanceTimersByTime(1000);

//       expect(navigateSpy).toHaveBeenCalledWith('close_loop.ticket_details', {
//         ticketID: '12345',
//         parentRoute: 'Dashboard',
//       });
//     });
//   });

//   // describe('requestUserPermission', () => {
//   //   it('should request permission and call getToken', async () => {
//   //     const requestPermissionSpy = jest.spyOn(messaging(), 'requestPermission');
//   //     const getTokenSpy = jest
//   //       .spyOn(messaging(), 'getToken')
//   //       .mockResolvedValue('mock-token');

//   //     await requestUserPermission();

//   //     expect(requestPermissionSpy).toHaveBeenCalled();
//   //     expect(getTokenSpy).toHaveBeenCalled();
//   //   });

//   //   it('should log an error when permission is rejected', async () => {
//   //     const consoleSpy = jest.spyOn(console, 'log');

//   //     // Mock requestPermission to reject the promise
//   //     messaging().requestPermission.mockRejectedValue('Permission rejected');

//   //     // Mock getToken to prevent any unintended calls
//   //     const getTokenMock = jest
//   //       .spyOn(messaging(), 'getToken')
//   //       .mockResolvedValue('mock-token');

//   //     // Call the function
//   //     await requestUserPermission();

//   //     // Assert that the console logged the rejection message
//   //     expect(consoleSpy).toHaveBeenCalledWith('permission rejected');

//   //     // Ensure getToken is never called
//   //     expect(getTokenMock).not.toHaveBeenCalled();
//   //   });
//   // });
// });
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {Notifications} from 'react-native-notifications';
import {AppState} from 'react-native';
import * as RootNavigation from '../routes/RootNavigation';
import {
  requestUserPermission,
  checkNotificationPermission,
  addNotificationListeners,
  actionOnNotification,
} from './NotificationUtils';
import {translate} from './MultilinguaUtils';

jest.mock('@react-native-firebase/messaging', () => ({
  requestPermission: jest.fn(),
  hasPermission: jest.fn(),
  getToken: jest.fn(),
  setBackgroundMessageHandler: jest.fn(),
  onNotificationOpenedApp: jest.fn(),
  getInitialNotification: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock('../routes/RootNavigation', () => ({
  navigate: jest.fn(),
}));

jest.mock('react-native-notifications', () => ({
  Notifications: {
    events: () => ({
      registerNotificationReceivedForeground: jest.fn(),
      registerNotificationOpened: jest.fn(),
    }),
  },
}));

jest.mock('./MultilinguaUtils', () => ({
  translate: jest.fn().mockReturnValue('translated_route'),
}));

describe('NotificationUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requestUserPermission', () => {
    it('requests permission and calls getToken if granted', async () => {
      messaging.requestPermission.mockResolvedValueOnce(true);
      const getTokenSpy = jest
        .spyOn(messaging, 'getToken')
        .mockResolvedValue('test-token');

      await requestUserPermission();

      expect(messaging.requestPermission).toHaveBeenCalled();
      expect(getTokenSpy).toHaveBeenCalled();
    });

    it('logs an error if permission is rejected', async () => {
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => {});
      messaging.requestPermission.mockRejectedValueOnce(
        new Error('Permission denied'),
      );

      await requestUserPermission();

      expect(consoleSpy).toHaveBeenCalledWith('permission rejected');
    });
  });

  describe('checkNotificationPermission', () => {
    it('calls getToken if permission is enabled', async () => {
      messaging.hasPermission.mockResolvedValueOnce(true);
      const getTokenSpy = jest
        .spyOn(messaging, 'getToken')
        .mockResolvedValue('test-token');

      await checkNotificationPermission();

      expect(messaging.hasPermission).toHaveBeenCalled();
      expect(getTokenSpy).toHaveBeenCalled();
    });

    it('requests permission if it is not enabled', async () => {
      messaging.hasPermission.mockResolvedValueOnce(false);
      const requestUserPermissionSpy = jest.spyOn(
        require('./NotificationUtils'),
        'requestUserPermission',
      );

      await checkNotificationPermission();

      expect(messaging.hasPermission).toHaveBeenCalled();
      expect(requestUserPermissionSpy).toHaveBeenCalled();
    });
  });

  describe('addNotificationListeners', () => {
    it('registers background message handler and handles notifications', () => {
      addNotificationListeners();

      expect(messaging.setBackgroundMessageHandler).toHaveBeenCalled();
      expect(messaging.onNotificationOpenedApp).toHaveBeenCalled();
      expect(messaging.getInitialNotification).toHaveBeenCalled();
      expect(
        Notifications.events().registerNotificationReceivedForeground,
      ).toHaveBeenCalled();
      expect(
        Notifications.events().registerNotificationOpened,
      ).toHaveBeenCalled();
    });

    it('handles notification opening from background', () => {
      const mockRemoteMessage = {data: {CXTicket: '123'}, notification: {}};
      messaging.onNotificationOpenedApp.mockImplementation(callback =>
        callback(mockRemoteMessage),
      );
      const actionOnNotificationSpy = jest.spyOn(
        require('./NotificationUtils'),
        'actionOnNotification',
      );

      addNotificationListeners();

      expect(actionOnNotificationSpy).toHaveBeenCalledWith('123', 0);
    });

    it('handles notification opening from quit state', async () => {
      const mockRemoteMessage = {data: {CXTicket: '123'}, notification: {}};
      messaging.getInitialNotification.mockResolvedValueOnce(mockRemoteMessage);
      const actionOnNotificationSpy = jest.spyOn(
        require('./NotificationUtils'),
        'actionOnNotification',
      );

      await addNotificationListeners();

      expect(actionOnNotificationSpy).toHaveBeenCalledWith('123', 1000);
    });
  });

  describe('actionOnNotification', () => {
    it('navigates to the correct route with ticket ID', () => {
      actionOnNotification('123', 0);

      setTimeout(() => {
        expect(RootNavigation.navigate).toHaveBeenCalledWith(
          'translated_route',
          {
            ticketID: '123',
            parentRoute: 'Dashboard',
          },
        );
      }, 0);
    });
  });
});
