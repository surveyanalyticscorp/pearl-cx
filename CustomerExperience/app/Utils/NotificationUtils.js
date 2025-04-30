import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_PUSH_TOKEN} from '../api/Constant';
import {isStringNullOrEmpty} from './Utility';
import {Notifications} from 'react-native-notifications';
import {AppState, PermissionsAndroid, Platform} from 'react-native';
import * as RootNagation from '../routes/RootNavigation';

export const requestNotificationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    } catch (err) {
      console.log(err);
    }
  }
};

async function requestUserPermission() {
  try {
    await messaging().requestPermission();
    getToken();
  } catch (error) {
    console.log('permission rejected');
  }
}

let getToken = () => {
  AsyncStorage.getItem(ASYNC_PUSH_TOKEN).then(value => {
    console.log(value);
    if (isStringNullOrEmpty(value)) {
      messaging()
        .getToken()
        .then(token => {
          console.log('FCM TOKEN', token);
          AsyncStorage.setItem(ASYNC_PUSH_TOKEN, token);
        });
    }
  });
};

export async function checkNotificationPermission() {
  const authStatus = await messaging().requestPermission();
  console.log('FCM AUTH STATUS', authStatus);
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (enabled) {
    getToken();
  } else {
    requestUserPermission().then(() => {
      getToken();
    });
  }
}

// export const postLocalNotification = (
//   title,
//   bodyText,
//   data,
//   notificationId,
// ) => {
//   Notifications.postLocalNotification(
//     {
//       body: bodyText,
//       title: title,
//       data: data,
//       extra: data,
//       sound: 'default',
//       priority: 'high',
//       importance: 'high',
//       channelId: 'high-priority',
//     },
//     notificationId,
//   );
// };

export function addNotificationListeners() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannel({
      channelId: 'high-priority',
      name: 'High Priority Notifications',
      importance: 5,
      description: 'High priority notifications for ticket updates',
      enableLights: true,
      enableVibration: true,
      showBadge: true,
      soundFile: 'default',
    });
  }
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log(
      'Notification Message handled in the background!',
      remoteMessage,
    );
  });

  // Add a new handler for onMessage to handle foreground notifications
  messaging().onMessage(async remoteMessage => {
    console.log(
      'Notification Message handled in the foreground!',
      remoteMessage,
    );
  });

  // Handle notification clicks
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Notification opened from background state:', remoteMessage);
    const payload = JSON.parse(remoteMessage.data.payload);
    if (payload.ticket) {
      actionOnNotification(payload.ticket, 0);
    }
  });

  /** When the user presses a notification displayed via FCM, this listener will be called if the app has opened from a background state */
  //  messaging().onNotificationOpenedApp(remoteMessage => {
  // console.log(
  //   'Notification caused app to open from background state:',
  //   remoteMessage.notification,
  // );
  // const ticketItem = JSON.parse(remoteMessage.notification.body).ticket;
  // actionOnNotification(ticketItem, 2000);
  // });

  /** When a notification from FCM has triggered the application to open from a quit state */

  // Handle initial notification when app is opened from quit state
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage,
        );
        const payload = JSON.parse(remoteMessage.data.payload);
        if (payload.ticket) {
          actionOnNotification(payload.ticket, 10000);
        }
      }
    });

  Notifications.events().registerNotificationReceivedBackground(
    (
      notification: Notification,
      completion: (response: NotificationCompletion) => void,
    ) => {
      console.log('Notification Received - Background', notification.payload);
      // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
      completion({alert: true, sound: true, badge: false});
    },
  );
  Notifications.events().registerNotificationReceivedForeground(
    (notification: Notification, completion) => {
      console.log(
        `Notification received in foreground: ${notification.title} : ${notification.body}`,
      );
      completion({alert: true, sound: true, badge: false});
    },
  );
  Notifications.events().registerNotificationOpened(
    (notification: Notification, completion) => {
      console.log(`Notification opened here: ${JSON.stringify(notification)}`);

      // {"payload":
      //   {"title":"Ticket priority notification",
      //     "data":{
      //       "notificationText":"Ticket #165947 priority changed to LOW by Mehedi Hasan.","hasRead":false,"createdAt":"2025-04-23T09:51:46.742Z","media":null,"type":2,"id":26242,
      //       "ticket":{"assignToId":81504,"feedbackId":27233,"id":165947}
      //   },
      //   "body":"Ticket #165947 priority changed to LOW by Mehedi Hasan."}}
      // if (AppState.currentState === 'active') {
      // actionOnNotification(notification.payload.ticket, 0);
      const payload = JSON.parse(notification.payload.payload);
      console.log('NOTIFICATION PAYLOAD', payload);
      actionOnNotification(payload.ticket, 0);

      // }
      completion();
    },
  );
}

export async function actionOnNotification(ticketItem, timeOut) {
  console.log('Attempting to navigate to TicketDetails with:', ticketItem);

  // Wait for navigation reference to be available
  const waitForNavigation = () => {
    return new Promise(resolve => {
      const checkNavigation = () => {
        if (RootNagation.navigationRef.current) {
          resolve();
        } else {
          setTimeout(checkNavigation, 100); // Check every 100ms
        }
      };
      checkNavigation();
    });
  };

  try {
    // Wait for the specified timeout
    await new Promise(resolve => setTimeout(resolve, timeOut));

    // Wait for navigation reference to be available
    await waitForNavigation();

    // Ensure we're not already on the TicketDetails screen
    const currentRoute = RootNagation.navigationRef.current.getCurrentRoute();
    if (
      currentRoute?.name === 'TicketDetails' &&
      currentRoute?.params?.ticketItem?.id === ticketItem.id
    ) {
      console.log('Already on the correct ticket details screen');
      return;
    }

    console.log('Navigating to TicketDetails...');
    RootNagation.navigate('TicketDetails', {
      ticketItem: ticketItem,
      parentRoute: 'Dashboard',
    });
    console.log('Navigation to TicketDetails completed');
  } catch (error) {
    console.error('Error during navigation:', error);
  }
}
