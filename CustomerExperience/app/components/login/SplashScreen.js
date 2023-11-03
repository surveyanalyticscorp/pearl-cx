import {ImageBackground, Image, StyleSheet} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ACCESS_CODE,
  ASYNC_AUTH_TOKEN,
  ASYNC_BEARER_TOKEN,
  ASYNC_CLF_BASE_URL,
  ASYNC_USER_INFO,
  BASE_URL,
} from '../../api/Constant';
// import AppRouter from '../../routes/appRouter';
import {connect, useDispatch, useSelector} from 'react-redux';
import {
  fillUserInfo,
  setAuthToken,
  setBearerToken,
} from '../../redux/actions/index';
import {isStringNullOrEmpty} from '../../Utils/Utility';
import {DASHBOARD_RANGE} from '../../redux/actions/dashboard.actions';
import {setLanguageInfo, setRangeFilter} from '../../redux/actions';
import {WelcomeScreen} from '../dashboard/WelcomeScreen';
import AppRouter from '../../routes/appRouter';
import {
  SET_ACCESS_CODE,
  authenticatePanel,
  setAccessCode,
  setBaseUrl,
  updateBaseUrl,
} from '../../redux/actions/login.actions';
import StringUtils from '../../Utils/StringUtils';

function SplashScreen(props) {
  let [moveNext, setMoveNext] = useState(false);
  let splashTimer = useRef(null);
  const dispatch = useDispatch();

  const setGlobalBaseUrl = () => {
    AsyncStorage.getItem(BASE_URL).then(baseUrl => {
      // console.log(`subscriber ID from async storage: ${subscriberId}`);

      //console.log(`Base url from async storage: ${baseUrl}`);
      if (baseUrl) {
        global.baseUrl = baseUrl;
        dispatch(setBaseUrl(baseUrl));
      }
    });
  };

  const setAuthAccessCode = () => {
    AsyncStorage.getItem(ACCESS_CODE).then(accessCode => {
      // console.log(`subscriber ID from async storage: ${subscriberId}`);
      //console.log(`Base url from async storage: ${baseUrl}`);
      if (accessCode && accessCode.length > 0) {
        dispatch(setAccessCode(accessCode));
        dispatch(authenticatePanel({accessCode: accessCode}));
      }
    });
  };

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
      ]).then(response => {
        let token = response[0][1];
        let userInfo = response[1][1];
        let dashboardRange = response[2][1];
        props.setToken(token);
        if (!isStringNullOrEmpty(userInfo)) {
          props.saveUserInfo(JSON.parse(userInfo));
          // setGlobalBaseUrl();
          setAuthAccessCode();
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
