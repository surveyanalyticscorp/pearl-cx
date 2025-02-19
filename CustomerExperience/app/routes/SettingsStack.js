import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AppSettings from '../components/settings/AppSettings';
import AccountDetails from '../components/settings/AccountDetails';
import MenuIcon from './commonUI/MenuIcon';
import HeaderBackLeft from './commonUI/HeaderBackLeft';
import {translate} from '../Utils/MultilinguaUtils';

const SettingsStack = createStackNavigator();

const SettingStack = props => (
  <SettingsStack.Navigator>
    <SettingsStack.Screen
      name={translate('settings.settings')}
      component={AppSettings}
      options={({navigation, route}) => ({
        headerLeft: props => <MenuIcon />,
      })}
    />
    <SettingsStack.Screen
      name={translate('settings.account_details')}
      component={AccountDetails}
      options={({navigation, route}) => ({
        headerLeft: props => <HeaderBackLeft {...props} route={route} />,
      })}
    />
  </SettingsStack.Navigator>
);

export default SettingStack;
