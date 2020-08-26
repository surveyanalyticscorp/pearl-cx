import React, {useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {
    NavigationContainer,
    useNavigation,
    DrawerActions,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../styles/color.constants';
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
import DetractorTickets from '../components/dashboard/components/DetractorTickets';
import DashBoardStoreDetails from '../components/dashboard/components/DashBoardStoreDetails'
import {ASYNC_AUTH_TOKEN, ASYNC_USER_INFO} from '../api/Constant';
import AsyncStorage from '@react-native-community/async-storage';
import {useSelector} from "react-redux";

const Drawer = createDrawerNavigator();
const RootStack = createStackNavigator();

const AppRouter = props => {

    const signIn = useSelector(state => state.global.authToken);
    const userInfo = useSelector(state => state.global.userInfo);

    useEffect(() => {
        if (!isStringNullOrEmpty(signIn)) {
            let data = [[ASYNC_AUTH_TOKEN, signIn],[ASYNC_USER_INFO, JSON.stringify(userInfo)]];
            AsyncStorage.multiSet(data, (error) => {});
        }
    }, [signIn]);

    const HeaderLeft = () => {
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

    const HeaderRight = () => {
        return (
            <View style={styles.rightHeaderButton}>
                <TouchableOpacity
                    onPress={() => {
                        EventRegister.emit('openCalendar', true);
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

    const DashboardHeaderRight = () => {
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

    const feedbackStack = props => (
        <RootStack.Navigator>
            <RootStack.Screen
                name="Feedback"
                component={Feedback}
                options={{
                    headerLeft: props => <HeaderLeft/>,
                    headerRight: props => <HeaderRight/>,
                }}
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
                    headerLeft: props => <HeaderLeft/>,
                    headerRight: props => <DashboardHeaderRight/>,
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
                component={DetractorTickets}
                options={{
                    headerLeft: props => <HeaderBackLeft />,
                }}
            />
        </RootStack.Navigator>
    );

    return (
        <NavigationContainer theme={MyTheme}>
            {signIn ? <Drawer.Navigator
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
    }

});
