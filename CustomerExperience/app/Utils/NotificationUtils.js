import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import {ASYNC_PUSH_TOKEN} from '../api/Constant';
import {isStringNullOrEmpty} from './Utility';

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
        if(isStringNullOrEmpty(value)) {
            messaging()
                .getToken()
                .then(token => {
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
