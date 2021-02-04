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

export function addNotificationListeners(navigation) {

    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in the background!', remoteMessage);
    });


    /** When the user presses a notification displayed via FCM, this listener will be called if the app has opened from a background state */
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('Notification caused app to open from background state:', remoteMessage.notification);
        actionOnNotification(remoteMessage.data.CXTicket)
    });

    /** When a notification from FCM has triggered the application to open from a quit state */
    messaging().getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log('Notification caused app to open from quit state:', remoteMessage.notification,);
                actionOnNotification(remoteMessage.data.CXTicket, navigation)
            }
        });

    Notifications.events().registerNotificationReceivedForeground((notification: Notification, completion) => {
        console.log(`Notification received in foreground: ${notification.title} : ${notification.body}`);
        completion({alert: true, sound: true, badge: false});
    });

    Notifications.events().registerNotificationOpened((notification: Notification, completion) => {
        console.log(`Notification opened here: ${JSON.stringify(notification.payload)}`);
        if(AppState.currentState === "active") {
            actionOnNotification(notification.payload.data.CXTicket, navigation)
        }
        completion();
    });
}

function actionOnNotification(ticketId, navigation){
    navigation.current?.navigate('Ticket Details', {
        ticketID: ticketId,
        parentRoute: 'Dashboard'
    });
}


