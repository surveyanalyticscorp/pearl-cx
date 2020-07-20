import {Text, View, ImageBackground, Image} from 'react-native';
import {styles} from '../styles/styles';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {ASYNC_AUTH_TOKEN} from '../api/types';
import {isStringNullOrEmpty} from '../Utils/Utility';
import AppRouter from '../routes/appRouter';

const SplashScreen = props => {
  const [authToken, setAuthToken] = useState('');
  const [moveNext, setMoveNext] = useState(false);

  useEffect(() => {
    async function getAuthToken() {
      return await AsyncStorage.getItem(ASYNC_AUTH_TOKEN);
    }
    getAuthToken().then(value => {
      setAuthToken(value);
    });
  }, []);

  useEffect(() => {
    let timer = setTimeout(() => {
      if (isStringNullOrEmpty(authToken)) {
        //props.navigation.navigate('SignedOut');
      } else {
        //props.navigation.navigate('SignedOut');
      }
      setMoveNext(true);
    }, 1000);
    return () => {
      clearTimeout(timer);
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

  let appRouter = () => {
    return <AppRouter authToken={authToken} />;
  };

  return moveNext ? appRouter() : renderSplashScreenView();
};

export default SplashScreen;
