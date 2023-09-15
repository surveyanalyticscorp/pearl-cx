import React, {useEffect, useRef, useState} from 'react';
import {
  // Dimensions,
  StyleSheet,
  Text,
  Pressable,
  View,
} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import FontIcon from 'react-native-vector-icons/FontAwesome';
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
  // ASYNC_PUSH_TOKEN,
  ASYNC_USER_INFO,
  BASE_URL,
  SUBSCRIBER_ID,
} from '../api/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  // connect,
  useSelector,
  useDispatch,
} from 'react-redux';
import {TextSizes} from '../styles/textsize.constants';
import {MarginConstants} from '../styles/margin.constants';
import AppSettings from '../components/settings/AppSettings';
import AccountDetails from '../components/settings/AccountDetails';
import {Sizes} from '../styles/Size.constant';
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
import Notification from '../components/Notification';
// import CreateTicket from '../components/dashboard/components/CreateTicket';
import CreateTicket from '../components/dashboard/ticketManagement/CreateTicket';
import SearchTicket from '../components/dashboard/components/SearchTicket';
import TicketFilter from '../components/dashboard/components/TicketFilter';
import {getNotification} from '../redux/actions/notification.actions';
import ResponsesStack from './ResponsesStack';
// import TicketsStack from './TicketsStack';
import ClosedLoopStack from './ClosedLoopStack';
import {
  CloseButton,
  CloseLoopTicketsTabs,
  HeaderBackLeft,
  MenuIcon,
  SearchIcon,
} from './CommonScreen';
import CommonScreens from './CommonScreen';
import {navigationRef} from './RootNavigation';
import {setI18nConfig, translate} from '../Utils/MultilinguaUtils';
// import MainDropDown from '../widgets/drop-down/MainDropDown';
// import {
//   getClosedLoopOwnerDetails,
//   SEGMENT_SELECTED,
//   setSegment,
//   setSegmentSelectorOpen,
// } from '../redux/actions/dashboard.actions';
import {WelcomeScreen} from '../components/dashboard/WelcomeScreen';
import SegmentSelector from '../components/SegmentSelector';
import Feedback from '../components/feedback/Feedback';
import ClosedLoop from '../components/closedloop/ClosedLoop';
// import SearchStack from './SearchStack';
// import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';

// import {connect} from 'react-redux';

const Drawer = createDrawerNavigator();
const DetractorStack = createStackNavigator();
const SettingsStack = createStackNavigator();

const AppRouter = props => {
  // const {updateSegment} = props;
  const authToken = useSelector(state => state.global.authToken);
  const bearerToken = useSelector(state => state.global.bearerToken);

  const userInfo = useSelector(state => state.global.userInfo);
  const languageCode = useSelector(state => state.global.languageCode);
  const dynamicLink = useSelector(state => state.global.dynamicLink);
  const notificationCount = useSelector(
    state => state.notification.notificationLogs.length,
  );
  let [isAppActive, setAppActiveState] = useState(false);
  let [baseUrl, setBaseUrl] = useState(undefined);
  let [subscriberId, setSubscriberId] = useState(undefined);

  let [lastLoginArray, setLastLoginArray] = useState([]);

  const dispatch = useDispatch();

  const linking = {
    prefixes: [
      'https://mobileapps.questionpro.com/cx',
      'https://questionpro.offline.link',
    ],
  };

  // useEffect(() => {
  //   console.log('SELECTED SEGMENT__', JSON.stringify(currentSegment));

  //   if (currentSegment.currentSegmentID) {
  //     dispatch(
  //       getClosedLoopOwnerDetails(authToken, {
  //         segmentID: currentSegment.currentSegmentID,
  //       }),
  //     );
  //   }
  // }, [currentSegment]);

  useEffect(() => {
    // setSegmentOptions((segments) => segmentDetails?.segments ?? []);
    // setSelectedSegment((segment) => ({
    //   segmentName: segmentDetails.currentSegment,
    //   segmentID: segmentDetails.currentSegmentID,
    // }));

    // console.log('Segment List', segmentOptions);
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
    // }, [segmentDetails]);
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

      // setSegmentOptions(['Main Segment', 'Child Segment']);

      // AsyncStorage.getItem(ASYNC_LAST_LOGIN).then((req) => {
      //   lastLoginArray = JSON.parse(req);
      //   if (lastLoginArray.length >= 2) {
      //     let today = new Date();
      //     lastLoginArray.push(today);
      //     let newArray = lastLoginArray.slice(
      //       lastLoginArray.length - 2,
      //       lastLoginArray.length,
      //     );
      //     lastLoginArray = newArray;
      //   }
      // }.catch((error) => console.log(`async storage error: ${error}`);));
      console.log(`LAST_LOGIN: ${lastLoginArray}`);
      let data = [
        [ASYNC_AUTH_TOKEN, authToken],
        [ASYNC_USER_INFO, JSON.stringify(userInfo)],
        [ASYNC_LAST_LOGIN, JSON.stringify(lastLoginArray)],
      ];
      AsyncStorage.multiSet(data, error => {});
    }
    setMoveNext(state => !authToken);
  }, [authToken]);

  useEffect(() => {
    if (authToken && baseUrl) {
      dispatch(getNotification(authToken));
    }
  }, [authToken, baseUrl]);

  useEffect(() => {
    console.log(`Language Code: `, languageCode);
    setI18nConfig(languageCode);
  }, [languageCode]);

  const setGlobalBaseUrl = () => {
    AsyncStorage.getItem(BASE_URL).then(baseUrl => {
      // console.log(`subscriber ID from async storage: ${subscriberId}`);

      //console.log(`Base url from async storage: ${baseUrl}`);
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

        // setBaseUrl(baseUrl);
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
            //alert('open notification screen')
            navigation.navigate('Notifications');
          }}>
          <FontIcon
            name={'bell'}
            size={1.1 * Sizes.icons}
            color={Colors.white}
          />
        </Pressable>
        {/** show unread/badge icon when notification read/unread status comes*/}
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

  const ClearAllButton = props => {
    return (
      <View
        style={[
          styles.rightHeaderButton,
          {marginHorizontal: 1.5 * MarginConstants.tab1},
        ]}>
        <Pressable
          onPress={() => {
            props.route.params.clearAllNotifications();
          }}>
          <Text style={styles.saveText}>
            {' '}
            {translate('dashboard.clear_all')}{' '}
          </Text>
        </Pressable>
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
          // headerRight: (props) => <NotificationIcon />,
          // headerRight: (props) => <SearchIcon route={'Dashboard'} />,
        })}
      />
      <DetractorStack.Screen
        name={translate('close_loop.close_loop')}
        component={CloseLoopTicketsTabs}
        options={({navigation, route}) => ({
          headerLeft: props => <HeaderBackLeft {...props} route={route} />,
          headerRight: props => <SearchIcon route={'Dashboard'} />,
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
      {/* <DetractorStack.Screen
        name={translate('responses.new_ticket')}
        component={CreateTicket}
        options={({navigation, route}) => ({
          // headerLeft: (props) => <View />,
          // headerRight: (props) => <CloseButton />,
          headerLeft: props => <HeaderBackLeft {...props} route={route} />,

          headerShown: true,
        })}
      /> */}
      <DetractorStack.Screen
        name={'dashboard_to_responses'}
        component={Feedback}
        options={({navigation, route}) => ({
          // title: 'Responses',
          // headerLeft: (props) => <View />,
          // headerRight: (props) => <CloseButton />,
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
        name={'dashboard_to_closed_loop'}
        component={ClosedLoop}
        options={({navigation, route}) => ({
          // title: 'Responses',
          // headerLeft: (props) => <View />,
          // headerRight: (props) => <CloseButton />,
          headerTitle: props => {
            return (
              <SegmentSelector
                screenName={'Closed loop'}
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
        key={'Notifications'}
        name="Notifications"
        component={Notification}
        options={({navigation, route}) => ({
          headerLeft: props => <HeaderBackLeft />,
          headerRight: props => <ClearAllButton {...props} route={route} />,
        })}
      />
      {/* <DetractorStack.Screen
        name={translate('responses.new_ticket')}
        component={CreateTicket}
        options={({navigation, route}) => ({
          // headerLeft: (props) => <View />,
          // headerRight: (props) => <CloseButton />,
          headerShown: false,
        })}
      /> */}
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
        drawerStyle={styles.drawerStyle}
        drawerContent={props => <DrawerContent {...props} />}>
        <Drawer.Screen name="Dashboard" component={dashboardModalStack} />
        <Drawer.Screen name="Responses" component={ResponsesStack} />
        {/* <Drawer.Screen name="Tickets" component={TicketsStack} /> */}
        <Drawer.Screen name="ClosedLoop" component={ClosedLoopStack} />
        {/* <Drawer.Screen name="Search Response" component={SearchStack} /> */}
        <Drawer.Screen
          name={translate('settings.settings')}
          component={settingStack}
        />
      </Drawer.Navigator>
    );
  };

  let [moveNext, setMoveNext] = useState(false);
  let splashTimer = useRef(null);
  const welcomeScreenData = useSelector(
    state => state.dashboard.welcomeScreenData,
  );
  useEffect(() => {
    if (welcomeScreenData) {
      splashTimer.current = setTimeout(() => {
        setMoveNext(true);
      }, 3000);
      return () => {
        clearTimeout(splashTimer.current);
      };
    }
  }, [moveNext, welcomeScreenData]);

  const onSkipHandler = () => {
    console.log('SKIP!!');
    setMoveNext(true);

    if (splashTimer.current) {
      clearTimeout(splashTimer.current);
    }
  };

  return (
    <NavigationContainer
      theme={MyTheme}
      ref={navigationRef}
      fallback={renderSpinner()}
      linking={linking}>
      {authToken && bearerToken ? (
        moveNext ? (
          <RenderDrawer />
        ) : (
          <WelcomeScreen skipHandler={onSkipHandler} />
        )
      ) : (
        <SignInStack />
      )}
    </NavigationContainer>
  );
};

// function mapStateToProps(state) {
//   return {
//     segment: state.segment,
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     updateSegment: (segmentName) =>
//       dispatch({type: SEGMENT_SELECTED, payload: segmentName}),
//   };

// return {
//   setSegment: (segment) =>
//   console.log(`call segment ${segment}`)
//     dispatch({type: SEGMENT_SELECTED, payload: segment}),
// };
// }

// export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);

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
