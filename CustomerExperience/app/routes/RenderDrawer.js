import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DrawerContent from './DrawerContent';
import {translate} from '../Utils/MultilinguaUtils';
import DashboardModalStack from './DashboardStack';
import ResponsesStack from './ResponsesStack';
import ClosedLoopStack from './ClosedLoopStack';
import SettingStack from './SettingsStack';
import {Colors} from '../styles/color.constants';
import {StyleSheet} from 'react-native';

const Drawer = createDrawerNavigator();

const RenderDrawer = () => {
  return (
    <Drawer.Navigator
      mode={'modal'}
      drawerStyle={styles.drawerStyle}
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen name="Dashboard" component={DashboardModalStack} />
      <Drawer.Screen name="Responses" component={ResponsesStack} />
      <Drawer.Screen name="ClosedLoop" component={ClosedLoopStack} />
      <Drawer.Screen
        name={translate('settings.settings')}
        component={SettingStack}
      />
    </Drawer.Navigator>
  );
};

export default RenderDrawer;

const styles = StyleSheet.create({
  drawerStyle: {
    backgroundColor: Colors.white,
    elevation: 5,
    zIndex: 100,
  },
});
