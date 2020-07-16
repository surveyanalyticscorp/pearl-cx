import React from 'react';

import {
  createSwitchNavigator,
  createAppContainer,
  StackActions,
} from 'react-navigation';

import {
  NavigationContainer,
  useNavigation,
  DrawerActions,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';

import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
} from 'react-native-paper';

import SplashScreen from '../login/SplashScreen';
import SignInScreen from '../login/SignIn';
import CompanyCode from '../login/CompanyCode';
import MarketingScreen from '../login/MarketingScreen';
import ForgotPassword from '../login/ForgotPassword';
import {DrawerContent} from './DrawerContent';

import FeedbackAll from '../drawerTabs/feedback/FeedbackAll';
import FeedbackDetractor from '../drawerTabs/feedback/FeedbackDetractor';
import Screen2 from '../drawerTabs/dashboard/Dashboard';

import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {Colors} from '../styles/color.constants';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CxDashboard from '../drawerTabs/dashboard/CxDashboard';

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

const feedbackStack = props => (
  <RootStack.Navigator>
    <RootStack.Screen
      name="Feedback"
      component={createFeedbackTopTabs}
      options={{
        headerLeft: props => <HeaderLeft />,
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
      <Drawer.Screen name="Dashboard" component={dashboardStack} />
    </Drawer.Navigator>
  </NavigationContainer>
);

const SignOutStack = props => (
  <NavigationContainer>
    <RootStack.Navigator headerMode="none">
      <RootStack.Screen name="MarketingScreen" component={MarketingScreen} />
      <RootStack.Screen name="CompanyCode" component={CompanyCode} navigation={props.navigation}/>
      <RootStack.Screen name="SignInScreen" component={SignInScreen} />
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
