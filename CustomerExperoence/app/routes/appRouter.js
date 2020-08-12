/* eslint-disable */
import React, {useState, useEffect} from 'react';

import {View, TouchableOpacity} from 'react-native';
import { StackActions } from 'react-navigation';
import {useColorScheme} from 'react-native-appearance';
import {
    NavigationContainer,
    DarkTheme,
    useNavigation,
    DrawerActions,
} from '@react-navigation/native';

import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../styles/color.constants';
import DrawerContent from '../routes/DrawerContent';
import CxDashboard from '../components/dashboard/CxDashboard';
import {createDrawerNavigator} from '@react-navigation/drawer';
import SignInStack from './signInStack';
import {MyTheme} from '../styles/styles';
import {connect} from 'react-redux';
import {isStringNullOrEmpty} from '../Utils/Utility';
import Feedback from '../components/feedback/Feedback';
import FeedbackDetail from '../components/feedback/FeedbackDetails'
import {EventRegister} from 'react-native-event-listeners';
import FeedbackUpdate from '../components/feedback/FeedbackUpdate'
import { CommonActions } from '@react-navigation/native';
import DetractorTickets from '../components/dashboard/components/DetractorTickets';
import DashBoardStoreDetails from '../components/dashboard/components/DashBoardStoreDetails'
const Drawer = createDrawerNavigator();
const RootStack = createStackNavigator();

const AppRouter = props => {
    const colorScheme = useColorScheme();
    const [signIn, setSignIn] = useState(!isStringNullOrEmpty(props.authToken));

    useEffect(() => {
        if (props.userInfo && !isStringNullOrEmpty(props.userInfo.authToken)) {
            setSignIn(props.isLogin);
        }
    }, [props.isLogin, props.userInfo]);

    const HeaderLeft = () => {
        const navigation = useNavigation();
        return (
            <View style={{flexDirection: 'row', marginLeft: 20}}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.dispatch(DrawerActions.toggleDrawer());
                    }}>
                    <Icon name="menu" size={30} color="white"/>
                </TouchableOpacity>
            </View>
        );
    };

    const HeaderRight = () => {
        return (
            <View style={{flexDirection: 'row', marginLeft: 20}}>
                <TouchableOpacity
                    onPress={() => {
                        EventRegister.emit('openCalendar', true);
                    }}>
                    <Icon name="more-vert" size={30} color="white"/>
                </TouchableOpacity>
            </View>
        );
    };

    const HeaderBackLeft = () => {
        const navigation = useNavigation();
        return (
            <View style={{flexDirection: 'row', marginLeft: 10}}>
                <TouchableOpacity
                    onPress={() => {
                        const popAction = CommonActions.goBack();
                        navigation.dispatch(popAction);
                    }}>
                    <Icon name="keyboard-arrow-left" size={32} color="white"/>
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
                component={FeedbackDetail}
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

    //const signIn = !isStringNullOrEmpty(props.userInfo.authToken);
    return (
        <NavigationContainer theme={colorScheme == 'dark' ? DarkTheme : MyTheme}>
            {signIn ? (
                <Drawer.Navigator
                    drawerStyle={{
                        backgroundColor: Colors.white,
                        elevation: 5,
                        zIndex: 100,
                    }}
                    drawerContent={props => <DrawerContent {...props} />}>
                    <Drawer.Screen name="Feedback" children={feedbackStack}/>
                    <Drawer.Screen name="Dashboard" component={dashboardStack}/>
                </Drawer.Navigator>
            ) : (
                <SignInStack/>
            )}
        </NavigationContainer>
    );
};

const mapStateToProps = state => {
    console.log('AppRouter State:');
    console.log(state);
    return {
        userInfo: state.global.userInfo,
        isLogin: state.global.isLogin,
    };
};

const mapDispatchToProps = dispatch => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AppRouter);
