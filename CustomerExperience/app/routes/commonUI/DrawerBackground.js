import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {SafeAreaView} from 'react-native-safe-area-context';

const DrawerBackground = ({children}) => {
  return (
    <View testID="drawer-container" style={styles.container}>
      <SafeAreaView
        forceInset={{top: 'always', bottom: 'never'}}
        style={styles.safeArea}>
        {children}
      </SafeAreaView>
    </View>
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
    backgroundColor: Colors.drawerBackground,
  },
});
