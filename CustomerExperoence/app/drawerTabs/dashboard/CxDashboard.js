import React, {useEffect, Component} from 'react';
import {View, Text} from 'react-native';

import {styles} from '../../styles/styles';
import AsyncStorage from '@react-native-community/async-storage';
import {ASYNC_AUTH_TOKEN} from '../../api/types';
import {getDashboardContent} from '../../actions';
import {connect} from 'react-redux';

const CxDashboard = props => {
  useEffect(() => {
    async function getAuthToken() {
      return await AsyncStorage.getItem(ASYNC_AUTH_TOKEN);
    }
    getAuthToken().then(token => {});
  });
  return (
    <View style={styles.center}>
      <Text style={styles.title}>CxDashboar screen </Text>
      <Text style={styles.title}>{props.dashboard} </Text>
    </View>
  );
};

const mapStateToProps = state => {
  console.log('State:');
  console.log(state);
  return {
    dashboardData: state.dashboardData,
  };
};


const mapDispatchToProps = dispatch => ({
  getFeedbackList: token => {
    dispatch(getDashboardContent(token));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CxDashboard);
