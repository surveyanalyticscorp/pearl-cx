import * as React from 'react';
import {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Colors} from '../styles/color.constants';
import {FontFamily} from '../styles/font.constants';
import DrawerContent from '../routes/DrawerContent';
import CxDashboard from '../components/dashboard/CxDashboard';
import {createDrawerNavigator} from '@react-navigation/drawer';
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
import {TextSizes} from '../styles/textsize.constants';
import AppSettings from '../components/settings/AppSettings';
import AccountDetails from '../components/settings/AccountDetails';
import QPSpinner from '../widgets/QPSpinner';
import {
  addNotificationListeners,
  checkNotificationPermission,
} from '../Utils/NotificationUtils';
import messaging from '@react-native-firebase/messaging';
import {Notifications} from 'react-native-notifications';
import SearchTicket from '../components/dashboard/components/SearchTicket';
import TicketFilter from '../components/dashboard/components/TicketFilter';
import {getNotification} from '../redux/actions/notification.actions';
import ResponsesStack from './ResponsesStack';
import ClosedLoopStack from './ClosedLoopStack';
import {CloseButton} from './commonUI/CommonUI';
import HeaderBackLeft from './commonUI/HeaderBackLeft';
import MenuIcon from './commonUI/MenuIcon';
import CommonScreens from './CommonScreen';
import {navigationRef} from './RootNavigation';
import {setI18nConfig, translate} from '../Utils/MultilinguaUtils';

import {WelcomeScreen} from '../components/dashboard/WelcomeScreen';
import SegmentSelector from '../components/SegmentSelector';
import Feedback from '../components/feedback/Feedback';
import ClosedLoop from '../components/closedloop/ClosedLoop';
import {clearLoginUser} from '../redux/actions/login.action';

const Drawer = createDrawerNavigator();
const DetractorStack = createStackNavigator();
const SettingsStack = createStackNavigator();

const AppRouter = props => {
  const authToken = useSelector(state => state.global.authToken);
  const bearerToken = useSelector(state => state.global.bearerToken);
  const userInfo = useSelector(state => state.global.userInfo);
  const languageCode = useSelector(state => state.global.languageCode);

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

  const fetchNotifications = () => {
    if (userInfo && userInfo.userID) {
      setTimeout(() => {
        dispatch(getNotification(userInfo?.userID));
      }, 5000);
    }
  };

  useEffect(() => {
    global.baseUrl = '';
    global.subscriberId = '';
    setGlobalBaseUrl();
    setGlobalSubscriberId();

    Notifications.registerRemoteNotifications();
    checkNotificationPermission().then({});
    addNotificationListeners();

    const unsubscribeNotifications = messaging().onMessage(
      async remoteMessage => {
        console.log('on message' + JSON.stringify(remoteMessage.notification));
        console.log('on message remoteMessage' + JSON.stringify(remoteMessage));

        fetchNotifications();
      },
    );

    return () => {
      unsubscribeNotifications();
    };
  }, []);

  useEffect(() => {
    if (isAppActive) {
      setAppActiveState(false);
    }
  }, [isAppActive, lastLoginArray, userInfo]);

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
      dispatch(clearLoginUser());
    }
  }, [authToken, baseUrl]);

  useEffect(() => {
    fetchNotifications();
  }, [userInfo]);

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

  const dashboardStack = props => (
    <DetractorStack.Navigator>
      <DetractorStack.Screen
        name={translate('dashboard.dashboard')}
        component={CxDashboard}
        options={({navigation, route}) => ({
          headerTitle: props => {
            return (
              <SegmentSelector
                screenName={translate('dashboard.dashboard')}
                navigation={navigation}
              />
            );
          },

          headerLeft: props => <MenuIcon />,
        })}
      />

      <DetractorStack.Screen
        name="Search Ticket"
        component={SearchTicket}
        options={({navigation, route}) => ({
          headerShown: false,
          headerLeft: props => <HeaderBackLeft {...props} route={route} />,
        })}
      />

      <DetractorStack.Screen
        key={'dashboard_to_responses'}
        name={'dashboard_to_responses'}
        component={Feedback}
        options={({navigation, route}) => ({
          headerLeft: props => <HeaderBackLeft {...props} route={route} />,

          headerTitle: props => {
            return (
              <SegmentSelector
                screenName={'Responses'}
                navigation={navigation}
              />
            );
          },
          headerShown: true,
        })}
      />
      <DetractorStack.Screen
        key={'dashboard_to_closed_loop'}
        name={'dashboard_to_closed_loop'}
        component={ClosedLoop}
        options={({navigation, route}) => ({
          headerLeft: props => <HeaderBackLeft {...props} route={route} />,

          headerTitle: props => {
            return (
              <SegmentSelector
                screenName={'ClosedLoop'}
                navigation={navigation}
              />
            );
          },
          headerShown: true,
        })}
      />
      {CommonScreens(DetractorStack)}
    </DetractorStack.Navigator>
  );

  const dashboardModalStack = props => (
    <DetractorStack.Navigator mode="modal">
      <DetractorStack.Screen
        name="Dashboard"
        component={dashboardStack}
        options={({navigation, route}) => ({headerShown: false})}
      />

      <DetractorStack.Screen
        name={translate('filter_by')}
        component={TicketFilter}
        options={({navigation, route}) => ({
          headerLeft: props => <View />,
          headerRight: props => <CloseButton />,
        })}
      />
    </DetractorStack.Navigator>
  );

  const settingStack = props => (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name={translate('settings.settings')}
        component={AppSettings}
        options={({navigation, route}) => ({
          headerLeft: props => <MenuIcon />,
        })}
      />
      <SettingsStack.Screen
        name={translate('settings.account_details')}
        component={AccountDetails}
        options={({navigation, route}) => ({
          headerLeft: props => <HeaderBackLeft {...props} route={route} />,
        })}
      />
    </SettingsStack.Navigator>
  );

  let renderSpinner = () => {
    return (
      <View style={styles.loading}>
        <QPSpinner />
      </View>
    );
  };

  const RenderDrawer = () => {
    return (
      <Drawer.Navigator
        mode={'modal'}
        drawerStyle={styles.drawerStyle}
        drawerContent={props => <DrawerContent {...props} />}>
        <Drawer.Screen name="Dashboard" component={dashboardModalStack} />
        <Drawer.Screen name="Responses" component={ResponsesStack} />
        <Drawer.Screen name="ClosedLoop" component={ClosedLoopStack} />
        <Drawer.Screen
          name={translate('settings.settings')}
          component={settingStack}
        />
      </Drawer.Navigator>
    );
  };

  console.log('LAST LOGIN DATA', JSON.stringify(lastLoginArray));

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
  drawerStyle: {
    backgroundColor: Colors.white,
    elevation: 5,
    zIndex: 100,
  },
  leftHeaderButton: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  rightHeaderButton: {
    flexDirection: 'row',
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: {
    color: Colors.white,
    textAlignVertical: 'center',
    fontSize: TextSizes.primary,
    fontFamily: FontFamily.regular,
    paddingTop: 5,
    paddingLeft: 5,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appbarTitle: {fontSize: TextSizes.primary, color: Colors.white},
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
