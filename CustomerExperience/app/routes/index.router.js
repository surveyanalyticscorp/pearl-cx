import React from 'react';

import {
  createSwitchNavigator,
  createAppContainer,
  StackActions,
} from 'react-navigation';
import {EventRegister} from 'react-native-event-listeners';
import {
  NavigationContainer,
  useNavigation,
  DrawerActions,
} from '@react-navigation/native';

import SplashScreen from '../components/login/SplashScreen';
import Login from '../components/login/Login';
import CompanyCode from '../components/login/CompanyCode';
import MarketingScreen from '../components/login/MarketingScreen';
import ForgotPassword from '../components/login/ForgotPassword';
import DrawerContent from './DrawerContent';

import FeedbackAll from '../components/feedback/FeedbackAll';
import FeedbackDetractor from '../components/feedback/FeedbackDetractor';

import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {Colors} from '../styles/color.constants';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CxDashboard from '../components/dashboard/CxDashboard';

const RootStack = createStackNavigator();
const Drawer = createDrawerNavigator();
const MaterialTopTabs = createMaterialTopTabNavigator();

const MyTheme = {
  dark: false,
  colors: {
    primary: 'white',
    background: 'white',
    card: Colors.accent,
    text: 'white',
    border: 'green',
  },
};

const createFeedbackTopTabs = props => {
  return (
    <MaterialTopTabs.Navigator
      swipeEnabled={false}
      tabBarOptions={{
        indicatorStyle: {backgroundColor: '#FF0000'},
        scrollEnabled: true,
        labelStyle: {color: '#000000', fontSize: 12},
        tabStyle: {width: 150},
        style: {backgroundColor: '#FFFFFF'},
      }}>
      <MaterialTopTabs.Screen name="All" component={FeedbackAll} />
      <MaterialTopTabs.Screen name="Detractor" component={FeedbackDetractor} />
      <MaterialTopTabs.Screen name="Passive" component={FeedbackAll} />
      <MaterialTopTabs.Screen name="Promoter" component={FeedbackDetractor} />
    </MaterialTopTabs.Navigator>
  );
};

const HeaderLeft = () => {
  const navigation = useNavigation();
  return (
    <View style={{flexDirection: 'row', marginLeft: 20}}>
      <TouchableOpacity
        onPress={() => {
          navigation.dispatch(DrawerActions.toggleDrawer());
        }}>
        <Icon name="menu" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const HeaderRight = route => {
  const navigation = useNavigation();
  return (
    <View style={{flexDirection: 'row', marginLeft: 20}}>
      <TouchableOpacity
        onPress={() => {
          EventRegister.emit('openCalendar', true);
        }}>
        <Icon name="more-vert" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const feedbackStack = props => (
  <RootStack.Navigator>
    <RootStack.Screen
      name="Feedback"
      component={createFeedbackTopTabs}
      options={({route}) => ({
        headerLeft: props => <HeaderLeft route={route} />,
        headerRight: props => <HeaderRight route={route} />,
      })}
    />
  </RootStack.Navigator>
);

const dashboardStack = props => (
  <RootStack.Navigator>
    <RootStack.Screen
      name="Dashboard"
      component={CxDashboard}
      options={{
        headerLeft: props => <HeaderLeft />,
      }}
    />
  </RootStack.Navigator>
);

const NavigationDrawer = props => (
  <NavigationContainer theme={MyTheme}>
    <Drawer.Navigator
      drawerStyle={{
        backgroundColor: Colors.white,
        elevation: 5,
        zIndex: 100,
      }}
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen name="Feedback" children={feedbackStack} />
      <Drawer.Screen name="Dashboard" children={dashboardStack} />
    </Drawer.Navigator>
  </NavigationContainer>
);

const SignOutStack = props => (
  <NavigationContainer>
    <RootStack.Navigator headerMode="none">
      <RootStack.Screen name="MarketingScreen" component={MarketingScreen} />
      <RootStack.Screen
        name="CompanyCode"
        component={CompanyCode}
        navigation={props.navigation}
      />
      <RootStack.Screen name="Login" component={Login} />
      <RootStack.Screen name="ForgotPassword" component={ForgotPassword} />
    </RootStack.Navigator>
  </NavigationContainer>
);

const AppNavigator = createSwitchNavigator(
  {
    SplashScreen: {
      screen: SplashScreen,
    },

    SignedIn: {
      screen: NavigationDrawer,
    },
    SignedOut: {
      screen: SignOutStack,
    },
  },
  {
    initialRouteName: 'SplashScreen',
  },
);

export default createAppContainer(AppNavigator);
