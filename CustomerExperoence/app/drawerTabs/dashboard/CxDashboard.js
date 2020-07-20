import React, {useEffect, Component} from 'react';
import {View, Text} from 'react-native';

import {styles} from '../../styles/styles';
import {getDashboardContent, showLoading} from '../../actions';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {ASYNC_AUTH_TOKEN} from '../../api/types';

const CxDashboard = props => {
  useEffect(() => {
    async function getAuthToken() {
      return await AsyncStorage.getItem(ASYNC_AUTH_TOKEN);
    }
    getAuthToken().then(token => {
      props.getDashboardContent(token);
    });
  }, [props]);

  useEffect(() => {
    if (props.dashboardData) {
      console.log('Dashboard data: ' + props.dashboard.dashboardData.body);
    }
  }, [props.dashboardData]);

  return (
    <View style={styles.center}>
      <Text style={styles.title}>CxDashboar screen </Text>
      <Text style={styles.title}>{props.dashboard.dashboardData} </Text>
    </View>
  );
};

const mapStateToProps = state => {
  console.log('CxDashboard State:');
  console.log(state);
  return {
    dashboardData: state.dashboardData,
    userInfo: state.global.userInfo,
  };
};

const mapDispatchToProps = dispatch => ({
  getDashboardContent: token => {
    dispatch(showLoading(true));
    dispatch(getDashboardContent(token));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CxDashboard);
