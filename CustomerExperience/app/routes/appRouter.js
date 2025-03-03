import * as React from 'react';
import {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Colors} from '../styles/color.constants';
import SignInStack from './signInStack';
import {isStringNullOrEmpty} from '../Utils/Utility';
import {
  ASYNC_AUTH_TOKEN,
  ASYNC_LAST_LOGIN,
  ASYNC_USER_INFO,
  BASE_URL,
  SUBSCRIBER_ID,
} from '../api/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector, useDispatch} from 'react-redux';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {handleResetPasswordLink} from '../Utils/DeepLinkingUtils';
import {setDynamicLink} from '../redux/actions';
import QPSpinner from '../widgets/QPSpinner';
import {
  addNotificationListeners,
  checkNotificationPermission,
} from '../Utils/NotificationUtils';
import messaging from '@react-native-firebase/messaging';
import {Notifications} from 'react-native-notifications';
import {getNotification} from '../redux/actions/notification.actions';
import {navigationRef} from './RootNavigation';
import {setI18nConfig} from '../Utils/MultilinguaUtils';
import {WelcomeScreen} from '../components/dashboard/WelcomeScreen';
import {clearLoginUser} from '../redux/actions/login.action';
import RenderDrawer from './RenderDrawer';

let renderSpinner = () => {
  return (
    <View style={styles.loading}>
      <QPSpinner />
    </View>
  );
};

const AppRouter = props => {
  const authToken = useSelector(state => state.global.authToken);
  const bearerToken = useSelector(state => state.global.bearerToken);

  const userInfo = useSelector(state => state.global.userInfo);
  const languageCode = useSelector(state => state.global.languageCode);
  const dynamicLink = useSelector(state => state.global.dynamicLink);

  let [isAppActive, setAppActiveState] = useState(false);
  let [baseUrl, setBaseUrl] = useState(undefined);
  let [subscriberId, setSubscriberId] = useState(undefined);
  const isTokenExpired = useSelector(state => state.dashboard.isTokenExpired);
  const skipWelcome = useSelector(state => state.dashboard.skipWelcome);

  let [lastLoginArray, setLastLoginArray] = useState([]);

  const dispatch = useDispatch();

  const linking = {
    prefixes: [
      'https://mobileapps.questionpro.com/cx',
      'https://questionpro.offline.link',
    ],
  };

  useEffect(() => {
    global.baseUrl = '';
    global.subscriberId = '';
    setGlobalBaseUrl();
    setGlobalSubscriberId();
    const unsubscribeLinks = dynamicLinks().onLink(handleDynamicLink);
    Notifications.registerRemoteNotifications();
    checkNotificationPermission().then({});
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        if (link && link.url) {
          handleDynamicLink(link);
        }
      });

    const unsubscribeNotifications = messaging().onMessage(
      async remoteMessage => {
        console.log('on message' + JSON.stringify(remoteMessage));
        Notifications.postLocalNotification(
          {
            body: remoteMessage.notification.body,
            title: remoteMessage.notification.title,
            data: remoteMessage.data,
          },
          parseInt(remoteMessage.messageId),
        );
        dispatch(getNotification(authToken));
      },
    );

    addNotificationListeners();

    return () => {
      unsubscribeLinks();
      unsubscribeNotifications();
    };
  }, []);

  useEffect(() => {
    setGlobalBaseUrl();
    setGlobalSubscriberId();

    handleResetPasswordLink(
      dynamicLink,
      navigationRef,
      authToken,
      props.dispatch,
    );
  }, [dynamicLink]);

  useEffect(() => {
    if (isAppActive) {
      handleResetPasswordLink(
        dynamicLink,
        navigationRef,
        authToken,
        props.dispatch,
      );
      setAppActiveState(false);
    }
  }, [isAppActive]);

  useEffect(() => {
    if (!isStringNullOrEmpty(authToken)) {
      let lastLogin = lastLoginArray;
      let today = new Date();
      lastLogin.push(today);

      console.log(`LAST_LOGIN: ${lastLoginArray}`);
      let data = [
        [ASYNC_AUTH_TOKEN, authToken],
        [ASYNC_USER_INFO, JSON.stringify(userInfo)],
        [ASYNC_LAST_LOGIN, JSON.stringify(lastLoginArray)],
      ];
      AsyncStorage.multiSet(data, error => {});
    }
  }, [authToken]);

  useEffect(() => {
    if (authToken && baseUrl) {
      dispatch(getNotification(authToken));
      dispatch(clearLoginUser());
    }
  }, [authToken, baseUrl]);

  useEffect(() => {
    console.log(`Language Code: `, languageCode);
    setI18nConfig(languageCode);
  }, [languageCode]);

  const setGlobalBaseUrl = () => {
    AsyncStorage.getItem(BASE_URL).then(baseUrl => {
      if (baseUrl) {
        global.baseUrl = baseUrl;
        setBaseUrl(baseUrl);
      }
    });
  };

  const setGlobalSubscriberId = () => {
    AsyncStorage.getItem(SUBSCRIBER_ID).then(subscriberId => {
      console.log(`subscriber ID from async storage: ${subscriberId}`);
      if (subscriberId) {
        global.subscriberId = subscriberId;
        console.log(`subscriber ID from global: ${global.subscriberId}`);

        setSubscriberId(subscriberId);
      }
    });
  };

  const handleDynamicLink = link => {
    if (link && link.url) {
      props.dispatch(setDynamicLink(link.url));
      setAppActiveState(true);
    }
  };

  return (
    <NavigationContainer
      theme={MyTheme}
      ref={navigationRef}
      fallback={renderSpinner()}
      linking={linking}>
      {!isTokenExpired && authToken && bearerToken ? (
        skipWelcome ? (
          <RenderDrawer />
        ) : (
          <WelcomeScreen />
        )
      ) : (
        <SignInStack />
      )}
    </NavigationContainer>
  );
};

export default AppRouter;

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const MyTheme = {
  dark: false,
  colors: {
    background: Colors.darkerGrey,
    card: Colors.accent,
    text: Colors.white,
    notification: Colors.accent,
    primary: Colors.secondary,
  },
};
