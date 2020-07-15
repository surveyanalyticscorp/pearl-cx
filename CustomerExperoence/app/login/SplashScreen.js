import {Text, View, ImageBackground, Image} from 'react-native';
import {styles} from '../styles/styles';
import React, {useEffect, useState} from 'react';
import AppRouter from '../routes/appRouter';
import AsyncStorage from '@react-native-community/async-storage';
import {AUTH_TOKEN} from '../api/types';

const SplashScreen = props => {
  const [navigateToScreen, setNavigateToScreen] = useState(false);
  const [authToken, setAuthToken] = useState('');

  useEffect(() => {
    async function getAuthToken() {
      return await AsyncStorage.getItem(AUTH_TOKEN);
    }
    getAuthToken().then(value => {
      setAuthToken(value);
    });
  }, []);

  useEffect(() => {
    let timer1 = setTimeout(() => {
      //setNavigateToScreen(true);
      props.navigation.navigate('SignedOut');
    }, 1000);
    return () => {
      clearTimeout(timer1);
    };
  }, [props.navigation]);

  let renderSplashScreenView = () => {
    return (
      <View style={{flex: 1}}>
        <ImageBackground
          resizeMode={'stretch'}
          source={require('../images/background_inverted.png')}
          style={{
            width: '100%',
            height: '100%',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            style={{width: '70%'}}
            resizeMode="contain"
            source={require('../images/whiteCXLogo.png')}
          />
        </ImageBackground>
      </View>
    );
  };

  let renderAppScreens = () => {
    return <AppRouter authToken={authToken} />;
  };

  //return navigateToScreen ? renderAppScreens() : renderSplashScreenView();
  return renderSplashScreenView();
};

export default SplashScreen;
