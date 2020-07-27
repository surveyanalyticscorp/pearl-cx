import {Text, View, ImageBackground, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {ASYNC_AUTH_TOKEN, ASYNC_USER_INFO} from '../api/types';
import AppRouter from '../routes/appRouter';
import {connect} from 'react-redux';
import {fillUserInfo, setIsLogin} from '../actions';
import {isStringNullOrEmpty} from '../Utils/Utility';

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
    async function getUserInfo() {
      return await AsyncStorage.getItem(ASYNC_USER_INFO);
    }
    getUserInfo().then(value => {
      if (!isStringNullOrEmpty(value)) {
        props.saveUserInfo(JSON.parse(value));
      }
    });
  }, [props]);

  useEffect(() => {
    let timer = setTimeout(() => {
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

const mapStateToProps = state => {
  console.log('Splash screen State:');
  console.log(state);
  return {};
};

// noinspection JSAnnotator
const mapDispatchToProps = dispatch => ({
  saveUserInfo: userInfo => {
    dispatch(setIsLogin(true));
    dispatch(fillUserInfo(userInfo));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SplashScreen);
