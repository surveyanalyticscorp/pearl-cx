import * as React from 'react';
import {useEffect, useCallback, useState} from 'react';
import {Platform} from 'react-native';

import {StyleSheet, Text, Pressable, View} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import {Colors} from '../styles/color.constants';
import {FontFamily} from '../styles/font.constants';
import DrawerContent from '../routes/DrawerContent';
import CxDashboard from '../components/dashboard/CxDashboard';
import {createDrawerNavigator} from '@react-navigation/drawer';
import SignInStack from './signInStack';
import {isStringNullOrEmpty, showSuccessFlashMessage} from '../Utils/Utility';
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
import {MarginConstants} from '../styles/margin.constants';
import AppSettings from '../components/settings/AppSettings';
import AccountDetails from '../components/settings/AccountDetails';
import {Sizes} from '../styles/Size.constant';
import {handleResetPasswordLink} from '../Utils/DeepLinkingUtils';
import QPSpinner from '../widgets/QPSpinner';
import {
  addNotificationListeners,
  checkNotificationPermission,
  requestNotificationPermission,
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
import PushNotification from '../components/notifications/PushNotifications';

const Drawer = createDrawerNavigator();
const DetractorStack = createStackNavigator();
const SettingsStack = createStackNavigator();

const AppRouter = props => {
  const authToken = useSelector(state => state.global.authToken);
  const bearerToken = useSelector(state => state.global.bearerToken);
  const userInfo = useSelector(state => state.global.userInfo);
  const languageCode = useSelector(state => state.global.languageCode);
  const notificationCount = useSelector(
    state => state.notification.notificationLogs.length,
  );
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

    Notifications.registerRemoteNotifications();
    checkNotificationPermission().then({});

    /* {"notification":
      {"android":{},
      "body":
      "{\"id\":71,\"type\":2,\"hasRead\":false,\"notificationText\":\"Ticket #520 priority changed to MEDIUM by Mehedi Hasan.\",\"createdAt\":\"2025-01-28T02:55:34.394Z\",\"ticket\":{\"id\":520,\"feedbackId\":27233,\"assignToId\":81504},\"media\":null}",
      "title":"Ticket priority notification"},
      "sentTime":1738061734538,"data":{},
      "from":"163493809530",
      "messageId":"0:1738061734550760%0ee3cfb10ee3cfb1","ttl":2419200,
      "collapseKey":"com.questionpro.cxonthego"}
    
      */

    /*
      {
      "android":{},
      "body":"{
        \"id\":26131,
        \"type\":2,
        \"hasRead\":false,
        \"notificationText\":\"Ticket #164001 priority changed to MEDIUM by Mehedi Hasan.\",
        \"createdAt\":\"2025-04-11T06:36:19.249Z\",
        \"ticket\":{
          \"id\":164001,
          \"feedbackId\":27233,
          \"assignToId\":81504
          },
        \"media\":null
        }",
      "title":"Ticket priority notification"
      }
*/

    const unsubscribeNotifications = messaging().onMessage(
      async remoteMessage => {
        console.log('on message' + JSON.stringify(remoteMessage.notification));

        // {"android":{},"body":"{\"id\":21532,\"type\":2,\"hasRead\":false,\"notificationText\":\"Ticket #135847 priority changed to MEDIUM by Mehedi Hasan.\",\"createdAt\":\"2025-02-11T22:50:19.105Z\",\"ticket\":{\"id\":135847,\"feedbackId\":27233,\"assignToId\":81504},\"media\":null}","title":"Ticket priority notification"}
        const body = JSON.parse(remoteMessage.notification.body);

        Notifications.postLocalNotification(
          {
            body: body.notificationText,
            title: remoteMessage.notification.title,
            data: body,
          },
          parseInt(remoteMessage.messageId),
        );
      },
    );
    addNotificationListeners();

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
    if (authToken && baseUrl && userInfo) {
      dispatch(getNotification(userInfo?.userID));
      dispatch(clearLoginUser());
    }
  }, [authToken, baseUrl, userInfo.userID]);

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

  const NotificationIcon = () => {
    let navigation = useNavigation();
    return (
      <View
        style={[
          styles.rightHeaderButton,
          {marginHorizontal: MarginConstants.tab2},
        ]}>
        <Pressable
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          onPress={() => {
            navigation.navigate('Notifications');
          }}>
          <FontIcon
            name={'bell'}
            size={1.1 * Sizes.icons}
            color={Colors.white}
          />
        </Pressable>

        {notificationCount > 0 ? renderNotificationBadge() : <View />}
      </View>
    );
  };

  let renderNotificationBadge = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: -7,
          right: -7,
          width: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: 'red',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: TextSizes.primary, color: 'white'}}>
          {' '}
          {notificationCount}{' '}
        </Text>
      </View>
    );
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
