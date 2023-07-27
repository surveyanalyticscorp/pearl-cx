import {ImageBackground, Image, StyleSheet} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ASYNC_AUTH_TOKEN,
  ASYNC_BEARER_TOKEN,
  ASYNC_CLF_BASE_URL,
  ASYNC_USER_INFO,
} from '../../api/Constant';
// import AppRouter from '../../routes/appRouter';
import {connect} from 'react-redux';
import {fillUserInfo, setAuthToken} from '../../redux/actions/index';
import {isStringNullOrEmpty} from '../../Utils/Utility';
import {DASHBOARD_RANGE} from '../../redux/actions/dashboard.actions';
import {setLanguageInfo, setRangeFilter} from '../../redux/actions';
import {WelcomeScreen} from '../dashboard/WelcomeScreen';
import AppRouter from '../../routes/appRouter';

function SplashScreen(props) {
  let [moveNext, setMoveNext] = useState(false);
  let splashTimer = useRef(null);

  useEffect(() => {
    splashTimer = setTimeout(() => {
      AsyncStorage.getItem(ASYNC_CLF_BASE_URL).then(clfBase => {
        console.log(
          'Async Storage: saved clf base url from splash screen',
          clfBase,
        );
        if (!isStringNullOrEmpty(clfBase)) {
          global.clfBaseUrl = clfBase;
        }
      });

      AsyncStorage.getItem(ASYNC_BEARER_TOKEN).then(bearerToken => {
        console.log(
          'Async Storage: saved bearerToken from splash screen',
          bearerToken,
        );
        if (!isStringNullOrEmpty(bearerToken)) {
          global.bearerToken = bearerToken;
        }
      });
      AsyncStorage.multiGet([
        ASYNC_AUTH_TOKEN,
        ASYNC_USER_INFO,
        DASHBOARD_RANGE,
      ]).then(response => {
        let token = response[0][1];
        let userInfo = response[1][1];
        let dashboardRange = response[2][1];
        props.setToken(token);
        if (!isStringNullOrEmpty(userInfo)) {
          props.saveUserInfo(JSON.parse(userInfo));
        }
        if (!isStringNullOrEmpty(dashboardRange)) {
          props.setRange(JSON.parse(dashboardRange));
        }
        setMoveNext(true);
      });
    }, 1000);

    return () => {
      clearTimeout(splashTimer);
    };
  }, []);

  let renderSplashScreenView = () => {
    return (
      <ImageBackground
        resizeMode={'cover'}
        source={require('../../config/images/background1.png')}
        style={styles.backgroundContainer}>
        <Image
          style={{width: '70%'}}
          resizeMode={'contain'}
          source={require('../../config/images/cx-logo.png')}
        />
      </ImageBackground>
    );
  };

  return moveNext ? <AppRouter /> : renderSplashScreenView();
  // return moveNext ? <WelcomeScreen /> : renderSplashScreenView();
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => ({
  saveUserInfo: userInfo => {
    dispatch(fillUserInfo(userInfo));
    dispatch(setLanguageInfo(userInfo));
  },
  setToken: token => {
    dispatch(setAuthToken(token));
  },
  setRange: range => {
    dispatch(setRangeFilter(range));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
