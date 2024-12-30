import {ImageBackground, Image, StyleSheet} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ASYNC_AUTH_TOKEN,
  ASYNC_BEARER_TOKEN,
  ASYNC_CLF_BASE_URL,
  ASYNC_LOGGED_IN_ALREADY,
  ASYNC_LOGIN_EXPIRE_DATE,
  ASYNC_USER_INFO,
  BASE_URL,
} from '../../api/Constant';
import {connect, useDispatch, useSelector} from 'react-redux';
import {
  fillUserInfo,
  setAuthToken,
  setBearerToken,
  setIsFirstTime,
} from '../../redux/actions/index';
import {isStringNullOrEmpty} from '../../Utils/Utility';
import {
  DASHBOARD_RANGE,
  setTokenExpired,
} from '../../redux/actions/dashboard.actions';
import {setLanguageInfo, setRangeFilter} from '../../redux/actions';
import AppRouter from '../../routes/appRouter';
import {setBaseUrl} from '../../redux/actions/login.actions';
import moment from 'moment';
import {sendAnalyticsEvent} from '../../Utils/AnalyticLogs';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_EVENTS_SCREEN,
} from '../../Utils/Analytic.constants';
import DeviceInfo from 'react-native-device-info';
import AppInfo from '../../Utils/AppInfo';
import useLogoutProcess from '../../routes/drawerContent/useLogoutProcess';

const isExpireDateValid = expireDate => {
  const today = new Date();
  return expireDate && moment(today).isAfter(moment(expireDate));
};

function SplashScreen(props) {
  let [moveNext, setMoveNext] = useState(false);

  let splashTimer = useRef(null);
  const dispatch = useDispatch();

  const setGlobalBaseUrl = () => {
    AsyncStorage.getItem(BASE_URL).then(baseUrl => {
      // console.log(`subscriber ID from async storage: ${subscriberId}`);

      console.log(`Base url from Splash Screen async storage: ${baseUrl}`);
      if (baseUrl) {
        global.baseUrl = baseUrl;
        dispatch(setBaseUrl(baseUrl));
      }
    });
  };

  useEffect(() => {
    splashTimer.current = setTimeout(() => {
      AsyncStorage.getItem(ASYNC_LOGIN_EXPIRE_DATE).then(expireDate => {
        dispatch(setTokenExpired(isExpireDateValid(expireDate)));
      });

      AsyncStorage.getItem(ASYNC_CLF_BASE_URL).then(clfBase => {
        console.log(
          'Async Storage: saved clf base url from splash screen',
          clfBase,
        );
        if (!isStringNullOrEmpty(clfBase)) {
          global.clfBaseUrl = clfBase;
        }
      });

      AsyncStorage.getItem(ASYNC_CLF_BASE_URL).then(clfBase => {
        console.log(
          'Async Storage: saved base url from splash screen',
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
          props.setBearerToken(bearerToken);
          global.bearerToken = bearerToken;
        }
      });
      AsyncStorage.multiGet([
        ASYNC_AUTH_TOKEN,
        ASYNC_USER_INFO,
        DASHBOARD_RANGE,
        ASYNC_LOGGED_IN_ALREADY,
      ]).then(response => {
        let token = response[0][1];
        let userInfo = response[1][1];
        let dashboardRange = response[2][1];
        let loggedInAlready = response[3][1];
        props.setToken(token);
        if (!isStringNullOrEmpty(userInfo)) {
          props.saveUserInfo(JSON.parse(userInfo));
          setGlobalBaseUrl();
        }
        if (!isStringNullOrEmpty(dashboardRange)) {
          props.setRange(JSON.parse(dashboardRange));
        }
        console.log(
          'loggedInAlready',
          JSON.stringify(loggedInAlready),
          loggedInAlready !== 'true',
        );
        dispatch(setIsFirstTime(loggedInAlready !== 'true'));
        setMoveNext(true);
      });
    }, 1000);

    return () => {
      clearTimeout(splashTimer.current);
    };
  }, []);

  let renderSplashScreenView = () => {
    sendAnalyticsEvent(ANALYTICS_EVENTS.APP_OPEN, {
      screen: ANALYTICS_EVENTS_SCREEN.SPLASH_SCREEN,
      ...AppInfo,
    });
    return (
      <ImageBackground
        testID="splash-background"
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

  return moveNext ? (
    <AppRouter testID="app-router" />
  ) : (
    renderSplashScreenView()
  );
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
  setBearerToken: token => {
    dispatch(setBearerToken(token));
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
