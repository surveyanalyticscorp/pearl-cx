import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {useTheme, Caption, Drawer} from 'react-native-paper';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';

import {Colors} from '../styles/color.constants';

//import {AuthContext} from '../components/context';

export function DrawerContent(props) {
  const paperTheme = useTheme();

  //const {signOut, toggleTheme} = React.useContext(AuthContext);

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={styles.navDrawerHeaderImageContainer}>
              <Image
                style={styles.navDrawerHeaderImage}
                source={require('../images/login_logo.png')}
                resizeMode="contain"
              />
            </View>

            <View style={styles.userEmail}>
              <Caption style={styles.caption}>
                datta.kunde@questionpro.com
              </Caption>
              <Caption style={styles.caption}>company Name</Caption>
            </View>
          </View>

          <Drawer.Section style={styles.drawerSection}>
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
      <Drawer.Section style={styles.bottomDrawerSection}>
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
            //signOut();
          }}
        />
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  userEmail: {
    marginTop: 20,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  navDrawerHeaderImageContainer: {
    flex: 0.3,
    justifyContent: 'center',
  },
  navDrawerHeaderImage: {
    height: 40,
    width: undefined,
    marginTop: 50,
  },
});
