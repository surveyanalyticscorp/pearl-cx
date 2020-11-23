import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import {ASYNC_PUSH_TOKEN} from '../api/Constant';
import {isStringNullOrEmpty} from './Utility';
import {Notifications} from 'react-native-notifications';
import {AppState} from 'react-native';

async function requestUserPermission() {
    try {
        await messaging().requestPermission();
        getToken();
    } catch (error) {
        console.log('permission rejected');
    }
}

let getToken = () => {
    AsyncStorage.getItem(ASYNC_PUSH_TOKEN).then((value) => {
        console.log(value)
        if(isStringNullOrEmpty(value)) {
            messaging()
                .getToken()
                .then(token => {
                    console.log(token)
                    AsyncStorage.setItem(ASYNC_PUSH_TOKEN, token)
                });
        }
    });
};

export async function checkNotificationPermission() {
    const enabled = await messaging().hasPermission();
    if(enabled) {
        getToken()
    } else {
        requestUserPermission().then({})
    }
}

export function addNotificationListeners() {

    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in the background!', remoteMessage);
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('Notification caused app to open from background state:', remoteMessage.notification);
        // Call action type
    });

    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log('Notification caused app to open from quit state:', remoteMessage.notification,);
                // Call action type
            }
        });

    Notifications.events().registerNotificationReceivedForeground((notification: Notification, completion) => {
        console.log(`Notification received in foreground: ${notification.title} : ${notification.body}`);
        completion({alert: true, sound: true, badge: false});
    });

    Notifications.events().registerNotificationOpened((notification: Notification, completion) => {
        console.log(`Notification opened here: ${notification.payload}`);
        if(AppState.currentState === "active") {
            // Call action type
        }
        completion();
    });
}
