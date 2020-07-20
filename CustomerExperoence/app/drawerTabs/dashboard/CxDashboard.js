import React, {useEffect, Component} from 'react';
import {View, Text} from 'react-native';

import {styles} from '../../styles/styles';
import {getDashboardContent, showLoading} from '../../actions';
import {connect} from 'react-redux';

const CxDashboard = props => {
  useEffect(() => {
    props.getDashboardContent(props.userInfo.authToken);
  }, [props, props.userInfo.authToken]);

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
