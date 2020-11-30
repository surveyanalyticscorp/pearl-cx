import React, {useEffect, useRef, useState} from 'react';
import {AppState, Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {DrawerActions, NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../styles/color.constants';
import {FontFamily} from '../styles/font.constants';
import DrawerContent from '../routes/DrawerContent';
import CxDashboard from '../components/dashboard/CxDashboard';
import {createDrawerNavigator} from '@react-navigation/drawer';
import SignInStack from './signInStack';
import {isStringNullOrEmpty} from '../Utils/Utility';
import Feedback from '../components/feedback/Feedback';
import FeedbackDetails from '../components/feedback/FeedbackDetails';
import {
    ASYNC_AUTH_TOKEN,
    ASYNC_USER_INFO,
} from '../api/Constant';
import AsyncStorage from '@react-native-community/async-storage';
import {connect, useSelector} from 'react-redux';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {PaddingConstants} from '../styles/padding.constants';
import {TextSizes} from '../styles/textsize.constants';
import DetractorScenes from '../components/dashboard/components/DetractorScenes';
import TicketOverview from '../components/dashboard/ticketManagement/TicketOverview';
import {MarginConstants} from '../styles/margin.constants';
import TicketComments from '../components/dashboard/ticketManagement/TicketComments';
import UpdateTicket from '../components/dashboard/ticketManagement/UpdateTicket';
import DashboardDateFilter from '../components/dashboard/components/DashboardDateFilter';
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

const Drawer = createDrawerNavigator();
const RootStack = createStackNavigator();
const DetractorTicketsTab = createMaterialTopTabNavigator();
const TicketLogTab = createMaterialTopTabNavigator();

let { width } = Dimensions.get('window');

const AppRouter = props => {

    const authToken = useSelector(state => state.global.authToken);
    const userInfo = useSelector(state => state.global.userInfo);
    const dynamicLink = useSelector(state => state.global.dynamicLink);

    let [isAppActive, setAppActiveState] = useState(false);
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
                //type: remoteMessage.data.type
            }, parseInt(remoteMessage.messageId));
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
        }
    }, [authToken]);

    const MenuIcon = () => {
        let navigation = useNavigation();
        return (
            <View style={styles.rightHeaderButton}>
                <TouchableOpacity
                    hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                    onPress={() => {
                        navigation.dispatch(DrawerActions.toggleDrawer());
                    }}>
                    <Icon name="menu" size={Sizes.icons} color="white"/>
                </TouchableOpacity>
            </View>
        );
    };

    const HeaderBackLeft = (props) => {
        const navigation = useNavigation();
        return (
            <View style={styles.leftHeaderButton}>
                <TouchableOpacity
                    hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                    onPress={() => {
                        if(props && props.route && props.route.params && props.route.params.onBackPress) {
                            props.route.params.onBackPress();
                            navigation.goBack()
                        } else {
                            navigation.goBack()
                        }
                    }}>
                    <Icon name="arrow-left" size={20} color= {Colors.white}/>
                </TouchableOpacity>
            </View>
        );
    };

    const EditTicket = () => {
        let navigation = useNavigation();
        return (
            <View style={[styles.rightHeaderButton,{marginHorizontal: 1.5*MarginConstants.tab1}]}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate("Update Ticket");
                    }}>
                    <MaterialIcon name={'edit'} size={25} color={Colors.white}/>
                </TouchableOpacity>
            </View>
        );
    };

    const SearchIcon = () => {
        let navigation = useNavigation();
        return (
            <View style={[styles.rightHeaderButton,{marginHorizontal: MarginConstants.tab2}]}>
                <TouchableOpacity
                    onPress={() => {
                        alert('navigate to search screen')
                    }}>
                    <Icon name={'magnifier'} size={20} color={Colors.white}/>
                </TouchableOpacity>
            </View>
        );
    };

    const NotificationIcon = () => {
        let navigation = useNavigation();
        /**
         * show badge on the basis of unread notification
         * */
        return (
            <View style={[styles.rightHeaderButton,{marginHorizontal: MarginConstants.tab2}]}>
                <TouchableOpacity
                    hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                    onPress={() => {
                        alert('open notification screen')
                    }}>
                    <FontIcon name={'bell'} size={22} color={Colors.white}/>
                </TouchableOpacity>
                <View style={{position: 'absolute', top: -2, right: -2}}>
                    <FontIcon name={'circle'} size={12} color={Colors.red}/>
                </View>
            </View>
        );
    };


    const SaveDashboardDate = (props) => {
        return (
            <View style={[styles.rightHeaderButton,{marginHorizontal: 1.5*MarginConstants.tab1}]}>
                <TouchableOpacity
                    onPress={() => {
                        props.route.params.saveRange();
                    }}>
                    <Text style={styles.saveText}> Save </Text>
                </TouchableOpacity>
            </View>
        );
    };

    const DateRangeTab = createMaterialTopTabNavigator();

    const DateRangeTabStack = props => (
        <DateRangeTab.Navigator tabBarOptions={{
            labelStyle: {color: Colors.primary, width: width/2, fontSize: TextSizes.secondary},
            indicatorStyle: {backgroundColor: Colors.accent},
            style:{backgroundColor: Colors.white, width: '100%'},
            initialLayout: {width: Dimensions.get('window').width},
            tabStyle:{height: 1.3*PaddingConstants.tab4}
        }}
                                lazy
                                keyboardDismissMode={'auto'}
        >
            <DateRangeTab.Screen name="Month" component={DashboardDateFilter} initialParams={{range: props.route.params.range, setRange: props.route.params.setRange}}/>
            <DateRangeTab.Screen name="Custom" component={DashboardDateFilter} initialParams={{range: props.route.params.range, setRange: props.route.params.setRange}}/>
        </DateRangeTab.Navigator>
    );

    const TicketLogTabStack = props => (
        <TicketLogTab.Navigator tabBarOptions={{
            labelStyle: {width: width/3, fontSize: TextSizes.semiSecondary},
            indicatorStyle: {backgroundColor: Colors.accent},
            style:{backgroundColor: Colors.white, width: '100%'},
            initialLayout: {width: Dimensions.get('window').width},
            tabStyle:{height: 1.5*PaddingConstants.tab4},
            activeTintColor: Colors.accent,
            inactiveTintColor: Colors.primary,
        }}
                                lazy
                                keyboardDismissMode={'auto'}
        >
            <TicketLogTab.Screen name="Overview" component={TicketOverview} initialParams={{data: props.route.params.item}}/>
            <TicketLogTab.Screen name="Comments" component={TicketComments} initialParams={{data: props.route.params.item}}/>
            <TicketLogTab.Screen name="Logs" component={TicketComments} initialParams={{data: props.route.params.item}}/>
        </TicketLogTab.Navigator>
    );

    const DetractorTicketsTabStack = props => (
        <DetractorTicketsTab.Navigator tabBarOptions={{
            labelStyle: {width: width/3, fontSize: TextSizes.secondary},
            indicatorStyle: {backgroundColor: Colors.accent},
            style:{backgroundColor: Colors.white, width: '100%'},
            initialLayout: {width: Dimensions.get('window').width},
            tabStyle:{height: 1.5*PaddingConstants.tab4},
            activeTintColor: Colors.accent,
            inactiveTintColor: Colors.primary,
        }}
                                       lazy
                                       keyboardDismissMode={'auto'}
        >
            <DetractorTicketsTab.Screen name="New" component={DetractorScenes} initialParams={{ dataCount:0}}/>
            <DetractorTicketsTab.Screen name="Pending" component={DetractorScenes} initialParams={{ dataCount:1}}/>
            <DetractorTicketsTab.Screen name="Escalated" component={DetractorScenes} initialParams={{ dataCount:3}}/>
            <DetractorTicketsTab.Screen name="Resolved" component={DetractorScenes} initialParams={{ dataCount:2}}/>
        </DetractorTicketsTab.Navigator>
    );

    const feedbackStack = props => (
        <RootStack.Navigator>
            <RootStack.Screen
                name="Feedback"
                component={Feedback}
                options={({ navigation, route }) => ({
                    headerLeft: props => <MenuIcon />,
                })}
            />
            <RootStack.Screen
                name="Feedback Details"
                component={FeedbackDetails}
                options={({ navigation, route }) => ({
                    headerLeft: props => <HeaderBackLeft {...props} route={route}/>,
                })}
            />
            <RootStack.Screen
                name="Date Range"
                component={DateRangeTabStack}
                options={({ navigation, route }) => ({
                    headerLeft: props => <HeaderBackLeft />,
                    headerRight: props => <SaveDashboardDate {...props} route={route}/>
                })}
            />

        </RootStack.Navigator>
    );

    const dashboardStack = props => (
        <RootStack.Navigator>
            <RootStack.Screen
                name="Dashboard"
                component={CxDashboard}
                options={({ navigation, route }) => ({
                    headerLeft: props => <MenuIcon/>,
                    headerRight: props => <NotificationIcon />,
                })}
            />
            <RootStack.Screen
                name="Closed Loop"
                component={DetractorTicketsTabStack}
                options={({ navigation, route }) => ({
                    headerLeft: props => <HeaderBackLeft {...props} route={route}/>,
                    headerRight: props => <SearchIcon />,

                })}
            />
            <RootStack.Screen
                name="Ticket Details"
                component={TicketLogTabStack}
                options={({ navigation, route }) => ({
                    headerLeft: props => <HeaderBackLeft {...props} route={route}/>,
                    headerRight: props => route.state && route.state.index !== 0 ? <View/> : <EditTicket />,
                })}
            />
            <RootStack.Screen
                name="Update Ticket"
                component={UpdateTicket}
                options={({ navigation, route }) => ({
                    headerLeft: props => <HeaderBackLeft {...props} route={route}/>,
                })}
            />
            <RootStack.Screen
                name="Date Range"
                component={DateRangeTabStack}
                options={({ navigation, route }) => ({
                    headerLeft: props => <HeaderBackLeft {...props} route={route}/>,
                    headerRight: props => <SaveDashboardDate {...props} route={route}/>
                })}
            />
        </RootStack.Navigator>
    );

    const settingStack = (props) => (
        <RootStack.Navigator>
            <RootStack.Screen
                name="Settings"
                component={AppSettings}
                options={({ navigation, route }) => ({
                    headerLeft: props => <MenuIcon/>,
                })}
            />
            <RootStack.Screen
                name="Account Details"
                component={AccountDetails}
                options={({ navigation, route }) => ({
                    headerLeft: props => <HeaderBackLeft {...props} route={route}/>,
                })}
            />
        </RootStack.Navigator>
    );

    let renderSpinner = () => {
        return (
            <View style={styles.loading}>
                <QPSpinner />
            </View>
        )
    };

    return (
        <NavigationContainer theme={MyTheme} ref={ref} fallback={renderSpinner()} linking={linking} >
            {authToken ? <Drawer.Navigator
                    drawerStyle={styles.drawerStyle}
                    drawerContent={props => <DrawerContent {...props} />}>
                    <Drawer.Screen name="Dashboard" component={dashboardStack}/>
                    <Drawer.Screen name="Feedback" component={feedbackStack}/>
                    <Drawer.Screen name="Settings" component={settingStack}/>
                </Drawer.Navigator>
                :
                <SignInStack/>
            }
        </NavigationContainer>
    );
};

const mapDispatchToProps = dispatch => ({
    dispatch
});

export default connect(null, mapDispatchToProps)(AppRouter);

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
