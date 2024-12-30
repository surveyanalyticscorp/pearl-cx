import React from 'react';
import {ImageBackground, SafeAreaView, StyleSheet} from 'react-native';

const DrawerBackground = ({children}) => {
  return (
    <ImageBackground
      testID="drawer-container"
      resizeMode={'cover'}
      source={require('../../../app/config/images/drawerBanner.png')}
      style={styles.container}>
      <SafeAreaView
        forceInset={{top: 'always', bottom: 'never'}}
        style={styles.safeArea}>
        {children}
      </SafeAreaView>
    </ImageBackground>
  );
};

export default DrawerBackground;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 100,
  },
});
