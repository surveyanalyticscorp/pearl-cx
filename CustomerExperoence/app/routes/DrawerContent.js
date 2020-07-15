import React from 'react';
import {View, Image} from 'react-native';
import {routesStyles} from './routes.styles';
import {useTheme, Caption, Drawer} from 'react-native-paper';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';

import {Colors} from '../styles/color.constants';
import AsyncStorage from '@react-native-community/async-storage';
import {AUTH_TOKEN} from '../api/types';

//import {AuthContext} from '../components/context';

export function DrawerContent(props) {
  const paperTheme = useTheme();

  //const {signOut, toggleTheme} = React.useContext(AuthContext);

  return (
    <View style={{flex: 1, elevation: 5, zIndex: 100}}>
      <DrawerContentScrollView {...props}>
        <View style={routesStyles.drawerContent}>
          <View style={routesStyles.userInfoSection}>
            <View style={routesStyles.navDrawerHeaderImageContainer}>
              <Image
                style={routesStyles.navDrawerHeaderImage}
                source={require('../images/login_logo.png')}
                resizeMode="contain"
              />
            </View>

            <View style={routesStyles.userEmail}>
              <Caption style={routesStyles.caption}>
                datta.kunde@questionpro.com
              </Caption>
              <Caption style={routesStyles.caption}>company Name</Caption>
            </View>
          </View>

          <Drawer.Section style={routesStyles.drawerSection}>
            <DrawerItem
              icon={({color, size}) => (
                <Image
                  source={require('../images/feedback_icon.png')}
                  resizeMode="contain"
                  style={{width: 20, height: 20, tintColor: Colors.black}}
                />
              )}
              label="Feedback"
              labelStyle={{color: Colors.black}}
              onPress={() => {
                props.navigation.navigate('Feedback');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Image
                  source={require('../images/dashboard_icon.png')}
                  resizeMode="contain"
                  style={{width: 20, height: 20, tintColor: Colors.black}}
                />
              )}
              label="Dashboard"
              labelStyle={{color: Colors.black}}
              onPress={() => {
                props.navigation.navigate('Dashboard');
              }}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={routesStyles.bottomDrawerSection}>
        <DrawerItem
          icon={({color, size}) => (
            <Image
              source={require('../images/logout.png')}
              resizeMode="contain"
              style={{width: 20, height: 20, tintColor: Colors.black}}
            />
          )}
          label="Sign Out"
          labelStyle={{color: Colors.black}}
          onPress={() => {
            AsyncStorage.clear().then(() => {});
          }}
        />
      </Drawer.Section>
    </View>
  );
}
