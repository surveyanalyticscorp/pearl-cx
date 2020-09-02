import React, {useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet, Dimensions, Text} from 'react-native';
import {
    NavigationContainer,
    useNavigation,
    DrawerActions,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../styles/color.constants';
import {fontFamily} from '../styles/font.constants';
import DrawerContent from '../routes/DrawerContent';
import CxDashboard from '../components/dashboard/CxDashboard';
import {createDrawerNavigator} from '@react-navigation/drawer';
import SignInStack from './signInStack';
import {MyTheme} from '../styles/styles';
import {isStringNullOrEmpty} from '../Utils/Utility';
import Feedback from '../components/feedback/Feedback';
import FeedbackDetails from '../components/feedback/FeedbackDetails'
import {EventRegister} from 'react-native-event-listeners';
import FeedbackUpdate from '../components/feedback/FeedbackUpdate'
import { CommonActions } from '@react-navigation/native';
import DashBoardStoreDetails from '../components/dashboard/components/DashBoardStoreDetails'
import {ASYNC_AUTH_TOKEN, ASYNC_USER_INFO} from '../api/Constant';
import AsyncStorage from '@react-native-community/async-storage';
import {useSelector} from "react-redux";
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {PaddingConstants} from '../styles/padding.constants';
import {TextSizes} from '../styles/textsize.constants';
import DetractorScenes from '../components/dashboard/components/DetractorScenes';
import TicketOverview from '../components/dashboard/ticketManagement/TicketOverview';
import {MarginConstants} from '../styles/margin.constants';

const Drawer = createDrawerNavigator();
const RootStack = createStackNavigator();
const FeedbackTab = createMaterialTopTabNavigator();
const DetractorTicketsTab = createMaterialTopTabNavigator();
const TicketLogTab = createMaterialTopTabNavigator();

let { width } = Dimensions.get('window');

const AppRouter = props => {

    const authToken = useSelector(state => state.global.authToken);
    const userInfo = useSelector(state => state.global.userInfo);

    useEffect(() => {
        if (!isStringNullOrEmpty(authToken)) {
            let data = [[ASYNC_AUTH_TOKEN, authToken],[ASYNC_USER_INFO, JSON.stringify(userInfo)]];
            AsyncStorage.multiSet(data, (error) => {});
        }
    }, [authToken]);

    const MenuIcon = () => {
        const navigation = useNavigation();
        return (
            <View style={styles.rightHeaderButton}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.dispatch(DrawerActions.toggleDrawer());
                    }}>
                    <Icon name="menu" size={20} color="white"/>
                </TouchableOpacity>
            </View>
        );
    };
    const FeedbackCalendar = (props) => {
        return (
            <View style={styles.rightHeaderButton}>
                <TouchableOpacity
                    onPress={() => {
                        props.route.params.openCalendar()
                    }}>
                    <MaterialIcon name="more-vert" size={30} color="white"/>
                </TouchableOpacity>
            </View>
        );
    };

    const HeaderBackLeft = () => {
        const navigation = useNavigation();
        return (
            <View style={styles.leftHeaderButton}>
                <TouchableOpacity
                    onPress={() => {
                        const popAction = CommonActions.goBack();
                        navigation.dispatch(popAction);
                    }}>
                    <Icon name="arrow-left" size={20} color= {Colors.white}/>
                </TouchableOpacity>
            </View>
        );
    };

    const DashboardCalendar = () => {
        return (
            <View style={styles.rightHeaderButton}>
                <TouchableOpacity
                    onPress={() => {
                        EventRegister.emit('openDashboardCalendar', true);
                    }}>
                    <MaterialIcon name="more-vert" size={30} color="white"/>
                </TouchableOpacity>
            </View>
        );
    };

    const EditTicket = () => {
        return (
            <View style={[styles.rightHeaderButton,{marginHorizontal: MarginConstants.tab1}]}>
                <TouchableOpacity
                    onPress={() => {

                    }}>
                    <Text style={styles.editText}> Edit </Text>
                </TouchableOpacity>
            </View>
        );
    };

    const TicketLogTabStack = props => (
        <TicketLogTab.Navigator tabBarOptions={{
            labelStyle: {color: Colors.primary, width: width/3, fontSize: TextSizes.secondary},
            indicatorStyle: {backgroundColor: Colors.accent},
            style:{backgroundColor: Colors.white, width: '100%'},
            initialLayout: {width: Dimensions.get('window').width},
            tabStyle:{height: 1.5*PaddingConstants.tab4}
        }}
                                lazy
                                keyboardDismissMode={'auto'}
        >
            <TicketLogTab.Screen name="Overview" component={TicketOverview} initialParams={{data: props.route.params.item}}/>
            <TicketLogTab.Screen name="Comments" component={TicketOverview} />
            <TicketLogTab.Screen name="Logs" component={TicketOverview} />
        </TicketLogTab.Navigator>
    );

    const FeedbackTabStack = props => (
        <FeedbackTab.Navigator tabBarOptions={{
            labelStyle: {color: Colors.primary, width: width/4, fontSize: TextSizes.secondary},
            indicatorStyle: {backgroundColor: Colors.accent},
            style:{backgroundColor: Colors.white, width: '100%'},
            initialLayout: {width: Dimensions.get('window').width},
            tabStyle:{height: 1.7*PaddingConstants.tab4}
        }}
                       keyboardDismissMode={'auto'}
        >
            <FeedbackTab.Screen name="All" component={Feedback} />
            <FeedbackTab.Screen name="Detractor" component={Feedback} />
            <FeedbackTab.Screen name="Passive" component={Feedback} />
            <FeedbackTab.Screen name="Promoter" component={Feedback} />
        </FeedbackTab.Navigator>
    );

    const DetractorTicketsTabStack = props => (
        <DetractorTicketsTab.Navigator tabBarOptions={{
            labelStyle: {color: Colors.primary, width: width/3, fontSize: TextSizes.secondary},
            indicatorStyle: {backgroundColor: Colors.accent},
            style:{backgroundColor: Colors.white, width: '100%'},
            initialLayout: {width: Dimensions.get('window').width},
            tabStyle:{height: 1.5*PaddingConstants.tab4}
        }}
                                       lazy
                                       keyboardDismissMode={'auto'}
        >
            <DetractorTicketsTab.Screen name="New" component={DetractorScenes} initialParams={{data: props.route.params.data, dataCount:0}}/>
            <DetractorTicketsTab.Screen name="Pending" component={DetractorScenes} initialParams={{data: props.route.params.data, dataCount:1}}/>
            <DetractorTicketsTab.Screen name="Resolved" component={DetractorScenes} initialParams={{data: props.route.params.data, dataCount:2}}/>
        </DetractorTicketsTab.Navigator>
    );

    const feedbackStack = props => (
        <RootStack.Navigator>
            <RootStack.Screen
                name="Feedback"
                component={FeedbackTabStack}
                options={({ navigation, route }) => ({
            headerLeft: props => <MenuIcon />,
            headerRight: props => <FeedbackCalendar {...props} route={route}/>,
        })}
            />
            <RootStack.Screen
                name="Feedback Details"
                component={FeedbackDetails}
                options={{
                    headerLeft: props => <HeaderBackLeft />,
                }}
            />
            <RootStack.Screen
                name="Change Status"
                component={FeedbackUpdate}
                options={{
                    headerLeft: props => <HeaderBackLeft />,
                }}
            />

        </RootStack.Navigator>
    );

    const dashboardStack = props => (
        <RootStack.Navigator>
            <RootStack.Screen
                name="Dashboard"
                component={CxDashboard}
                options={{
                    headerLeft: props => <MenuIcon/>,
                    headerRight: props => <DashboardCalendar/>,
                }}
            />
            <RootStack.Screen
                name="DashBoardStoreDetails"
                component={DashBoardStoreDetails}
                options={({ route }) => ({
                    title: route.params.name ? route.params.name : 'DashBoardStore',
                    headerLeft: props => <HeaderBackLeft />,
                })}
            />
            <RootStack.Screen
                name="DetractorTickets"
                component={DetractorTicketsTabStack}
                options={{
                    headerLeft: props => <HeaderBackLeft />,
                }}
            />
            <RootStack.Screen
                name="Ticket Details"
                component={TicketLogTabStack}
                options={({ navigation, route }) => ({
                    headerLeft: props => <HeaderBackLeft />,
                    headerRight: props => route.state && route.state.index !== 0 ? <View/> : <EditTicket />,
                })}
            />
        </RootStack.Navigator>
    );

    return (
        <NavigationContainer theme={MyTheme}>
            {authToken ? <Drawer.Navigator
                    drawerStyle={styles.drawerStyle}
                    drawerContent={props => <DrawerContent {...props} />}>
                    <Drawer.Screen name="Feedback" children={feedbackStack}/>
                    <Drawer.Screen name="Dashboard" component={dashboardStack}/>
                </Drawer.Navigator>
                :
                <SignInStack/>
            }
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
        marginLeft: 10
    },
    rightHeaderButton: {
        flexDirection: 'row',
        marginLeft: 20
    },
    editText: {
        color: Colors.white,
        textAlignVertical:'center',
        fontSize: TextSizes.largeText,
        fontFamily: fontFamily.Regular,
        paddingTop:5,
        paddingLeft:5,
    }

});
