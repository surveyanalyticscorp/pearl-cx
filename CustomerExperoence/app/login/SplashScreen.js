import {Text, View, ImageBackground, Image} from 'react-native';
import {styles} from '../styles/styles';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {AUTH_TOKEN} from '../api/types';
import {isStringNullOrEmpty} from '../Utils/Utility';

const SplashScreen = props => {
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
      if (isStringNullOrEmpty(authToken)) {
        props.navigation.navigate('SignedOut');
      } else {
        props.navigation.navigate('SignedIn');
      }
    }, 1000);
    return () => {
      clearTimeout(timer1);
    };
  }, [authToken, props.navigation]);

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
  return renderSplashScreenView();
};

export default SplashScreen;
