import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {clearError, clearUserInfo} from '../../redux/actions';
import {doLogout} from '../../redux/actions/login.actions';
import {
  ASYNC_LOGGED_IN_ALREADY,
  ASYNC_PUSH_TOKEN,
  ASYNC_USER_CREDENTIALS,
} from '../../api/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Notifications} from 'react-native-notifications';
import {
  clearDashboard,
  setTokenExpired,
} from '../../redux/actions/dashboard.actions';
import DeviceInfo from 'react-native-device-info';
import {isStringNullOrEmpty} from '../../Utils/Utility';
import messaging from '@react-native-firebase/messaging';

const useLogoutProcess = () => {
  const dispatch = useDispatch();
  const authToken = useSelector(state => state.global.authToken);
  const logoutResponse = useSelector(state => state.global.logoutResponse);

  const removeGlobalData = () => {
    global.baseUrl = '';
    global.clfBaseUrl = '';
    global.subscriberId = '';
    global.bearerToken = '';
    global.authToken = '';
  };

  const removeCashedData = () => {
    console.log('USE_LOGOUT', 'removeCashedData');

    AsyncStorage.clear().then(() => {
      console.log('USE_LOGOUT', 'AsyncStorage.clear() success');

      AsyncStorage.setItem(ASYNC_LOGGED_IN_ALREADY, 'true').then();

      console.log('USE_LOGOUT', 'Global dara removed ');
      dispatch(clearDashboard());
      console.log('USE_LOGOUT', 'clearDashboard');

      dispatch(clearUserInfo());
      console.log('USE_LOGOUT', 'clearUserInfo');
      dispatch(clearError(false));

      dispatch(setTokenExpired(false));
    });
  };
  useEffect(() => {
    console.log('USE_LOGOUT', 'useEffect [logoutResponse]');

    if (logoutResponse && logoutResponse?.statusCode === 200) {
      console.log('USE_LOGOUT', 'logoutResponse.statusCode === 200');
      Notifications.removeAllDeliveredNotifications();
      removeCashedData();
      removeGlobalData();
      dispatch(clearError(false));
      console.log(
        'LOGOUT_RESPONSE',
        logoutResponse?.statusCode,
        logoutResponse,
      );
    }
  }, [logoutResponse]);

  const logoutAction = () => {
    AsyncStorage.multiGet([ASYNC_PUSH_TOKEN, ASYNC_USER_CREDENTIALS]).then(
      response => {
        let pushToken = response[0][1];
        let user = JSON.parse(response[1][1]);

        if (!isStringNullOrEmpty(pushToken)) {
          callLogoutAPI(
            user?.email ?? '',
            user?.accessCode ?? '',
            pushToken ?? '',
          );
        } else {
          messaging()
            .getToken()
            .then(token => {
              callLogoutAPI(user.email, user.accessCode, token);
            });
        }
      },
    );
  };

  const callLogoutAPI = (emailAddress, accessCode, token) => {
    let params = {
      accessCode: accessCode,
      emailAddress: emailAddress,
      pushToken: token,
      udId: DeviceInfo.getDeviceId(),
    };

    dispatch(doLogout(authToken, params));

    console.log('logoutAction');
  };

  return {logoutAction};
};

export default useLogoutProcess;
