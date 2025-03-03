import React, {useEffect} from 'react';
import {ImageBackground, SafeAreaView, StyleSheet} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {useSelector} from 'react-redux';

const LoginBackground = ({children}) => {
  return (
    <ImageBackground
      testID="login-container"
      resizeMode={'cover'}
      source={require('../../../config/images/background1.png')}
      style={styles.container}>
      <SafeAreaView
        forceInset={{top: 'always', bottom: 'never'}}
        style={styles.safeArea}>
        {children}
      </SafeAreaView>
    </ImageBackground>
  );
};

export default LoginBackground;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: PaddingConstants.tab2,
  },
});
