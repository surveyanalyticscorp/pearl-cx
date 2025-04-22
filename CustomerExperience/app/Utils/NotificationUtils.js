import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_PUSH_TOKEN} from '../api/Constant';
import {isStringNullOrEmpty} from './Utility';
import {Notifications} from 'react-native-notifications';
import {AppState, PermissionsAndroid, Platform} from 'react-native';
import * as RootNagation from '../routes/RootNavigation';
import {translate} from './MultilinguaUtils';

// export const requestNotificationPermission = async () => {
//   if (Platform.OS === 'android' && Platform.Version >= 31) {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
//     );

//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//       console.log('Notification permission granted');
//     } else {
//       console.log('Notification permission denied');
//     }
//   }
// };

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
  const enabled = await messaging().hasPermission();
  if (enabled) {
    getToken();
  } else {
    requestUserPermission().then(() => {
      getToken();
    });
  }
}

export function addNotificationListeners() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannel({
      channelId: 'default',
      name: 'Default Channel',
      importance: 5, // Max importance
      description: 'Default channel for notifications',
      enableLights: true,
      enableVibration: true,
    });
  }

  // Handle background messages
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background message received:', remoteMessage);
    try {
      const body = JSON.parse(remoteMessage.notification.body);
      Notifications.postLocalNotification(
        {
          body: body.notificationText,
          title: remoteMessage.notification.title,
          data: body,
          sound: 'default',
          priority: 'high',
          importance: 'high',
          channelId: 'default',
        },
        parseInt(remoteMessage.messageId),
      );
    } catch (error) {
      console.error('Error handling background message:', error);
    }
  });

  /** When the user presses a notification displayed via FCM, this listener will be called if the app has opened from a background state */
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage,
    );
    try {
      const notificationBody = remoteMessage.notification?.body;
      if (!notificationBody) {
        console.error('No notification body found');
        return;
      }

      const parsedBody = JSON.parse(notificationBody);
      if (!parsedBody.ticket) {
        console.error('No ticket data found in notification body');
        return;
      }

      const ticketItem = parsedBody.ticket;
      console.log('Processing ticket item from background:', ticketItem);

      // Ensure navigation is ready before proceeding
      if (RootNagation.navigationRef.current) {
        actionOnNotification(ticketItem, 0);
      } else {
        console.log('Navigation not ready, retrying in 1 second...');
        setTimeout(() => {
          if (RootNagation.navigationRef.current) {
            actionOnNotification(ticketItem, 0);
          } else {
            console.error('Navigation still not ready after retry');
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error processing notification:', error);
    }
  });

  /** When a notification from FCM has triggered the application to open from a quit state */
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage,
        );
        try {
          const ticketItem = JSON.parse(remoteMessage.notification.body).ticket;
          actionOnNotification(ticketItem, 2000);
        } catch (error) {
          console.error('Error processing initial notification:', error);
        }
      }
    });

  Notifications.events().registerNotificationReceivedForeground(
    (notification, completion) => {
      console.log(
        `Notification received in foreground: ${notification.title} : ${notification.body}`,
      );
      completion({alert: true, sound: true, badge: false});
    },
  );

  Notifications.events().registerNotificationOpened(
    (notification, completion) => {
      console.log(`Notification opened here: ${JSON.stringify(notification)}`);
      const ticketItem = notification.payload.data.ticket;
      if (AppState.currentState === 'active') {
        console.log('notification opened', JSON.stringify(notification));

        /*
{
  "payload":{
    "title":"Ticket priority notification",
    "data":{
      "notificationText":"Ticket #164001 priority changed to MEDIUM by Mehedi Hasan.",
      "hasRead":false,
      "createdAt":"2025-04-11T09:11:00.524Z",
      "media":null,
      "type":2,
      "id":26148,
      "ticket":{
        "assignToId":81504,
        "feedbackId":27233,
        "id":164001
        }
      },
    "body":"Ticket #164001 priority changed to MEDIUM by Mehedi Hasan."
  }
}
*/

        actionOnNotification(ticketItem, 0);
      } else {
        actionOnNotification(ticketItem, 3000);
      }

      completion();
    },
  );
}

export function actionOnNotification(ticketItem, timeOut) {
  console.log('Attempting to navigate to TicketDetails with:', ticketItem);
  setTimeout(() => {
    try {
      if (!RootNagation.navigationRef.current) {
        console.error('Navigation reference is not available');
        return;
      }

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
  }, timeOut);
}
