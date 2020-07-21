import React, {useEffect, Component, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {styles} from '../../styles/styles';
import {getDashboardContent, showLoading} from '../../actions';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {ASYNC_AUTH_TOKEN} from '../../api/types';
import BarIndicator from 'react-native-indicators/src/components/bar-indicator';
import {TextSizes} from '../../styles/textsize.constants';
import {MarginConstants} from '../../styles/margin.constants';

const CxDashboard = props => {
  const [callApi, setCallAPI] = useState(false);

  useEffect(() => {
    async function getAuthToken() {
      return await AsyncStorage.getItem(ASYNC_AUTH_TOKEN);
    }
    if (!callApi) {
      getAuthToken().then(token => {
        props.getDashboardContent(token);
        setCallAPI(true);
      });
    }
  }, [callApi, props]);

  useEffect(() => {
    if (props.dashboardData) {
      console.log('Dashboard data: ' + props.dashboardData.body);
    }
  }, [props.dashboardData]);

  const renderErrorMessage = () => {
    if (props.isError) {
      return (
        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessage}>
            {props.errorMessage.message}
          </Text>
        </View>
      );
    }
    return <View style={{flex: 1}} />;
  };

  const renderDashboardContent = () => {
    if (!props.isError) {
      return (
        <View style={dashboardStyles.center}>
          <Text style={styles.title}> Dashboard content</Text>
        </View>
      );
    }
    return <View style={{flex: 1}} />;
  };

  return props.isLoading ? (
    <View style={dashboardStyles.center}>
      <BarIndicator color="#2589E3" count={5} size={35} />
    </View>
  ) : (
    <View style={dashboardStyles.cxContainer}>
      {renderErrorMessage()}
      {renderDashboardContent()}
    </View>
  );
};

const mapStateToProps = state => {
  console.log('CxDashboard State:');
  console.log(state);
  return {
    dashboardData: state.dashboard.dashboardData,
    userInfo: state.global.userInfo,
    isLoading: state.global.isLoading,
    isError: state.global.isError,
    errorMessage: state.global.errorMessage,
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

const dashboardStyles = StyleSheet.create({
  cxContainer: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    marginBottom: 16,
  },
});
