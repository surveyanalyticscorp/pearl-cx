import {ImageBackground, Image, StyleSheet} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {ASYNC_AUTH_TOKEN, ASYNC_USER_INFO} from '../../api/Constant';
import AppRouter from '../../routes/appRouter';
import {connect} from 'react-redux';
import {fillUserInfo, setAuthToken} from '../../redux/actions/index';
import {isStringNullOrEmpty} from '../../Utils/Utility';
import {DASHBOARD_RANGE, setDashboardRangeFilter} from '../../redux/actions/dashboard.actions';

function SplashScreen(props) {
  let [moveNext, setMoveNext] = useState(false);
  let splashTimer = useRef(null);


  useEffect(() => {

    splashTimer = setTimeout(() => {
      AsyncStorage.multiGet([ASYNC_AUTH_TOKEN, ASYNC_USER_INFO, DASHBOARD_RANGE]).then(response => {
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
        setMoveNext(true)
      })
    },1000);

    return () => {
      clearTimeout(splashTimer);
    };
  }, []);

  let renderSplashScreenView = () => {
    return (
        <ImageBackground
            resizeMode={'cover'}
            source={require('../../config/images/background_inverted.png')}
            style={styles.backgroundContainer}>
          <Image
              style={{width:'70%'}}
              resizeMode={'contain'}
              source={require('../../config/images/whiteCXLogo.png')}
          />
        </ImageBackground>
    );
  };

  return moveNext ? <AppRouter /> : renderSplashScreenView();
}

const mapStateToProps = state => {
  return {}
};

const mapDispatchToProps = dispatch => ({
  saveUserInfo: userInfo => {
    dispatch(fillUserInfo(userInfo));
  },
  setToken: (token) => {
    dispatch(setAuthToken(token))
  },
  setRange: (range) => {
    dispatch(setDashboardRangeFilter(range))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }

});
