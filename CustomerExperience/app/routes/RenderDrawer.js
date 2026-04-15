import React from 'react';
import {StyleSheet} from 'react-native';
import DrawerContent from '../routes/DrawerContent';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DashboardModalStack from './DashboardModalStack';
import {translate} from '../Utils/MultilinguaUtils';
import ResponsesStack from './ResponsesStack';
import ClosedLoopStack from './ClosedLoopStack';
import SettingStack from './SettingsStack';
import {Colors} from '../styles/color.constants';

const Drawer = createDrawerNavigator();

const RenderDrawer = () => {
  return (
    <Drawer.Navigator
      screenOptions={{headerShown: false, presentation: 'modal'}}
      drawerStyle={styles.drawerStyle}
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen name="DashboardTab" component={DashboardModalStack} />
      <Drawer.Screen name="Responses" component={ResponsesStack} />
      <Drawer.Screen name="Closedloop" component={ClosedLoopStack} />
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
