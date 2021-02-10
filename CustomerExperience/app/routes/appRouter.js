import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { NavigationContainer, useNavigation} from '@react-navigation/native';
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
    ASYNC_USER_INFO,
} from '../api/Constant';
import AsyncStorage from '@react-native-community/async-storage';
import {connect, useSelector} from 'react-redux';
import {TextSizes} from '../styles/textsize.constants';
import {MarginConstants} from '../styles/margin.constants';
import AppSettings from '../components/settings/AppSettings';
import AccountDetails from '../components/settings/AccountDetails';
import {Sizes} from '../styles/Size.constant';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {handleResetPasswordLink} from '../Utils/DeepLinkingUtils';
import {setDynamicLink} from '../redux/actions';
import QPSpinner from '../widgets/QPSpinner';
import {addNotificationListeners, checkNotificationPermission} from '../Utils/NotificationUtils';
import messaging from '@react-native-firebase/messaging';
import {Notifications} from 'react-native-notifications';
import Notification from '../components/Notification';
import CreateTicket from '../components/dashboard/components/CreateTicket';
import SearchTicket from '../components/dashboard/components/SearchTicket';
import TicketFilter from '../components/dashboard/components/TicketFilter';
import {getNotification} from "../redux/actions/notification.actions";
import ResponsesStack from "./ResponsesStack";
import {
    CloseButton, CloseLoopTicketsTab,
    HeaderBackLeft,
    MenuIcon,
    SearchIcon,
} from "./CommonScreen";
import CommonScreens from "./CommonScreen";
import {navigationRef} from "./RootNavigation";


const Drawer = createDrawerNavigator();
const DetractorStack = createStackNavigator();
const SettingsStack = createStackNavigator();

const AppRouter = props => {

    const authToken = useSelector(state => state.global.authToken);
    const userInfo = useSelector(state => state.global.userInfo);
    const dynamicLink = useSelector(state => state.global.dynamicLink);
    let [isAppActive, setAppActiveState] = useState(false);
    let [notificationCount, setNotificationCount] = useState(0);
    let ref = useRef();

    const linking = {
        prefixes: ['https://mobileapps.questionpro.com/cx','https://questionpro.offline.link'],
    };

    useEffect(() => {
        const unsubscribeLinks = dynamicLinks().onLink(handleDynamicLink);
        Notifications.registerRemoteNotifications();
        checkNotificationPermission().then({});
        dynamicLinks()
            .getInitialLink()
            .then(link => {
                if (link && link.url) {
                    handleDynamicLink(link)
                }
            });

        const unsubscribeNotifications = messaging().onMessage(async remoteMessage => {
            console.log("on message"+JSON.stringify(remoteMessage));
            Notifications.postLocalNotification({
                body: remoteMessage.notification.body,
                title: remoteMessage.notification.title,
                data: remoteMessage.data
            }, parseInt(remoteMessage.messageId));
            props.getNotification(authToken);
        });

        addNotificationListeners();

        return () => {
            unsubscribeLinks();
            unsubscribeNotifications()
        };

    },[]);

    useEffect(() => {
        handleResetPasswordLink(dynamicLink, ref, authToken, props.dispatch);
    },[dynamicLink]);

    useEffect(() => {
        if(isAppActive) {
            handleResetPasswordLink(dynamicLink, ref, authToken, props.dispatch);
            setAppActiveState(false);
        }
    },[isAppActive]);

    useEffect(() =>{
        setNotificationCount(props.notificationLogs.length)
    },[props.notificationLogs]);

    const handleDynamicLink = link => {
        if (link && link.url) {
            props.dispatch(setDynamicLink(link.url));
            setAppActiveState(true)
        }
    };

    useEffect(() => {
        if (!isStringNullOrEmpty(authToken)) {
            let data = [[ASYNC_AUTH_TOKEN, authToken],[ASYNC_USER_INFO, JSON.stringify(userInfo)]];
            AsyncStorage.multiSet(data, (error) => {});
            props.getNotification(authToken);
        }
    }, [authToken]);


    const NotificationIcon = () => {
        let navigation = useNavigation();
        return (
            <View style={[styles.rightHeaderButton,{marginHorizontal: MarginConstants.tab2}]}>
                <TouchableOpacity
                    hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                    onPress={() => {
                        //alert('open notification screen')
                        navigation.navigate('Notifications')
                    }}>
                    <FontIcon name={'bell'} size={1.1*Sizes.icons} color={Colors.white}/>
                </TouchableOpacity>
                {/** show unread/badge icon when notification read/unread status comes*/}
                {notificationCount > 0 ? renderNotificationBadge() : <View/>}
            </View>
        );
    };

    let renderNotificationBadge = () =>{
      return <View style={{position: 'absolute', top: -7, right: -7, width: 16, height: 16, borderRadius: 8, backgroundColor:  'red', alignItems:'center'}}>
          <Text style={{fontSize: 10, color: 'white'}}> {notificationCount} </Text>
      </View>
    };

    const ClearAllButton = (props) =>{
        return (
            <View style={[styles.rightHeaderButton,{marginHorizontal: 1.5*MarginConstants.tab1}]}>
                <TouchableOpacity
                    onPress={() => {
                        props.route.params.clearAllNotifications();
                    }}>
                    <Text style={styles.saveText}> Clear All </Text>
                </TouchableOpacity>
            </View>
        );
    };


    const dashboardStack = props => (
        <DetractorStack.Navigator>
            <DetractorStack.Screen
                name="Dashboard"
                component={CxDashboard}
                options={({ navigation, route }) => ({
                    headerLeft: props => <MenuIcon/>,
                    headerRight: props => <NotificationIcon />,
                })}
            />
            <DetractorStack.Screen
                name="Closed Loop"
                component={CloseLoopTicketsTab}
                options={({ navigation, route }) => ({
                    headerLeft: props => <HeaderBackLeft {...props} route={route}/>,
                    headerRight: props => <SearchIcon route={'Dashboard'}/>,

                })}
            />
            <DetractorStack.Screen
                name="Search Ticket"
                component={SearchTicket}
                options={({ navigation, route }) => ({
                    headerShown: false,
                    headerLeft: props => <HeaderBackLeft {...props} route={route}/>,
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
                options={({ navigation, route }) => ({ headerShown: false })}
            />
            <DetractorStack.Screen
                key={"Notifications"}
                name="Notifications"
                component={Notification}
                options={({ navigation, route }) => ({
                    headerLeft: props => <HeaderBackLeft/>,
                    headerRight: props => <ClearAllButton {...props} route={route}/>
                })}
            />
            <DetractorStack.Screen
                name="New Ticket"
                component={CreateTicket}
                options={({ navigation, route }) => ({
                    headerLeft: props => <View/>,
                    headerRight: props => <CloseButton/>
                })}
            />
            <DetractorStack.Screen
                name="Filter By"
                component={TicketFilter}
                options={({ navigation, route }) => ({
                    headerLeft: props => <View/>,
                    headerRight: props => <CloseButton/>
                })}
            />

        </DetractorStack.Navigator>
    );

    const settingStack = (props) => (
        <SettingsStack.Navigator>
            <SettingsStack.Screen
                name="Settings"
                component={AppSettings}
                options={({ navigation, route }) => ({
                    headerLeft: props => <MenuIcon/>,
                })}
            />
            <SettingsStack.Screen
                name="Account Details"
                component={AccountDetails}
                options={({ navigation, route }) => ({
                    headerLeft: props => <HeaderBackLeft {...props} route={route}/>,
                })}
            />
        </SettingsStack.Navigator>
    );

    let renderSpinner = () => {
        return (
            <View style={styles.loading}>
                <QPSpinner />
            </View>
        )
    };

    return (
        <NavigationContainer
            theme={MyTheme}
            ref={navigationRef}
            fallback={renderSpinner()}
            linking={linking} >
            {authToken ? <Drawer.Navigator
                    drawerStyle={styles.drawerStyle}
                    drawerContent={props => <DrawerContent {...props} />}>
                    <Drawer.Screen name="Dashboard" component={dashboardModalStack}/>
                    <Drawer.Screen name="Responses" component={ResponsesStack}/>
                    <Drawer.Screen name="Settings" component={settingStack}/>
                </Drawer.Navigator>
                :
                <SignInStack/>
            }
        </NavigationContainer>
    );
};

const mapStateToProps = state => {
    return {
        notificationLogs: state.notification.notificationLogs
    };
};


const mapDispatchToProps = dispatch => ({
    dispatch,
    getNotification: (token) => {
        dispatch(getNotification(token))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);

const styles = StyleSheet.create({
    drawerStyle: {
        backgroundColor: Colors.white,
        elevation: 5,
        zIndex: 100,
    },
    leftHeaderButton: {
        flexDirection: 'row',
        marginLeft: 10
    },
    rightHeaderButton: {
        flexDirection: 'row',
        marginLeft: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    saveText: {
        color: Colors.white,
        textAlignVertical:'center',
        fontSize: TextSizes.primary,
        fontFamily: FontFamily.regular,
        paddingTop:5,
        paddingLeft:5,
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

});

const MyTheme = {
    dark: false,
    colors: {
        background: Colors.darkerGrey,
        card: Colors.accent,
        text: Colors.white,
        notification: Colors.accent,
        primary: Colors.secondary
    },
};
