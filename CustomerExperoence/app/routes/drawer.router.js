import React from 'react';
import {DrawerContent} from './DrawerContent';
import FeedbackAll from '../drawerTabs/FeedbackAll';
import FeedbackDetractor from '../drawerTabs/FeedbackDetractor';
import Screen2 from '../drawerTabs/Screen2';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Colors} from '../styles/color.constants';

const Drawer = createDrawerNavigator();
const MaterialTopTabs = createMaterialTopTabNavigator();

const createFeedbackTopTabs = props => {
  return (
    <MaterialTopTabs.Navigator
      scrollEnabled={true}
      tabStyle={{backgroundColor: Colors.white}}>
      <MaterialTopTabs.Screen name="All" component={FeedbackAll} />
      <MaterialTopTabs.Screen name="Detractor" component={FeedbackDetractor} />
      <MaterialTopTabs.Screen name="Passive" component={FeedbackAll} />
      <MaterialTopTabs.Screen name="Promoter" component={FeedbackDetractor} />
    </MaterialTopTabs.Navigator>
  );
};

const NavigationDrawer = ({navigation}) => (
  <Drawer.Navigator
    drawerStyle={{
      backgroundColor: Colors.white,
      elevation: 5,
      zIndex: 100,
    }}
    drawerContent={props => <DrawerContent {...props} />}>
    <Drawer.Screen name="Feedback" children={createFeedbackTopTabs} />
    <Drawer.Screen name="Dashboard" component={Screen2} />
  </Drawer.Navigator>
);

export default NavigationDrawer;
