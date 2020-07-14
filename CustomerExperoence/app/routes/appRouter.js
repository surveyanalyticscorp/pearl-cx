import React, {Component} from 'react';

import {initStore} from '../store/store';
import {Provider} from 'react-redux';
import {View, TouchableOpacity, Text} from 'react-native';

import {useColorScheme, AppearanceProvider} from 'react-native-appearance';
import {
  NavigationContainer,
  DarkTheme,
  useNavigation,
  DrawerActions,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../styles/color.constants';
import {DrawerContent} from '../routes/DrawerContent';
import Screen2 from '../drawerTabs/Screen2';
import {createDrawerNavigator} from '@react-navigation/drawer';
import FeedbackAll from '../drawerTabs/FeedbackAll';
import FeedbackDetractor from '../drawerTabs/FeedbackDetractor';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import SignInStack from './signInStack';

const Drawer = createDrawerNavigator();
const store = initStore();
const RootStack = createStackNavigator();
const AppRouter = () => {
  const colorScheme = useColorScheme();

  const MyTheme = {
    dark: false,
    colors: {
      primary: 'white',
      background: 'white',
      card: '#65509f',
      text: 'white',
      border: 'green',
    },
  };
  const HeaderLeft = () => {
    const navigation = useNavigation();
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => {
            navigation.dispatch(DrawerActions.toggleDrawer());
          }}>
          <Icon name="menu" size={35} color="white" />
        </TouchableOpacity>
      </View>
    );
  };
  const MaterialTopTabs = createMaterialTopTabNavigator();
  //const App1 = reduxifyNavigator(AppNavigator, 'root');

  const createFeedbackTopTabs = props => {
    return (
      <MaterialTopTabs.Navigator
        scrollEnabled={true}
        tabStyle={{backgroundColor: Colors.white}}>
        <MaterialTopTabs.Screen name="All" component={FeedbackAll} />
        <MaterialTopTabs.Screen
          name="Detractor"
          component={FeedbackDetractor}
        />
        <MaterialTopTabs.Screen name="Passive" component={FeedbackAll} />
        <MaterialTopTabs.Screen name="Promoter" component={FeedbackDetractor} />
      </MaterialTopTabs.Navigator>
    );
  };

  const feedbackStack = props => (
    <RootStack.Navigator>
      <RootStack.Screen
        name="AlL"
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
        component={Screen2}
        options={{
          headerLeft: props => <HeaderLeft />,
        }}
      />
    </RootStack.Navigator>
  );
  const signIn = false;
  return (
    <Provider store={store}>
      <AppearanceProvider>
        <NavigationContainer
          theme={colorScheme == 'dark' ? DarkTheme : MyTheme}>
          {signIn ? (
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
          ) : (
            <SignInStack />
          )}
        </NavigationContainer>
      </AppearanceProvider>
    </Provider>
  );
};

export default AppRouter;
