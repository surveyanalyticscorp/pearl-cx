import React, {useEffect, useCallback, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  TouchableHighlight,
  ScrollView,
  RefreshControl,
} from 'react-native';

import {styles} from '../../styles/styles';
import {getDashboardContent, showLoading} from '../../actions';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {ASYNC_AUTH_TOKEN} from '../../api/types';
import {dashboardStyles} from './dashboard.style';
import {DotIndicator} from 'react-native-indicators';
import {Colors} from '../../styles/color.constants';
import Pie from 'react-native-pie';
const {height, width} = Dimensions.get('window');
const factor = width > height ? height : width;
const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};
const CxDashboard = props => {
  const [callApi, setCallAPI] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setCallAPI(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    async function getAuthToken() {
      return await AsyncStorage.getItem(ASYNC_AUTH_TOKEN);
    }
    if (callApi) {
      getAuthToken().then(token => {
        props.getDashboardContent(token);
        setCallAPI(false);
      });
    }
  }, [callApi, props]);

  const renderErrorMessage = () => {
    if (props.isError) {
      return (
        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessage}>{props.errorMessage.message}</Text>
        </View>
      );
    }
    return <View style={{flex: 1}} />;
  };

  const getTrimmedNoOfResponses = () => {
    let numberOfResponsesNumber = 0;
    if (props.dashboardData.body.primaryStoreNPS.totalResponses) {
      numberOfResponsesNumber =
        props.dashboardData.body.primaryStoreNPS.totalResponses;
    }
    let numberOfResponses = numberOfResponsesNumber + '';

    if (numberOfResponsesNumber >= 10000) {
      numberOfResponses =
        Math.round(numberOfResponsesNumber / 1000).toFixed(
          numberOfResponsesNumber > 10000 ? 0 : 1,
        ) + 'K';
    } else if (numberOfResponsesNumber >= 1000) {
      numberOfResponses = (numberOfResponsesNumber / 1000).toFixed(1) + 'K';
    }
    let responseText = numberOfResponses > 1 ? 'Responses' : 'Response';
    let textView = (
      <View style={{flex: 0.5, justifyContent: 'center', alignItems: 'center'}}>
        <Text
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={dashboardStyles.responseText}>
          {numberOfResponses}
        </Text>
        <Text
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={dashboardStyles.response}>
          {responseText}
        </Text>
      </View>
    );

    return textView;
  };

  const getTicketText = () => {
    let ticketText = '';
    let pendingCount = props.dashboardData.body.DetractorTicketsCount.pending;
    let newCount = props.dashboardData.body.DetractorTicketsCount.new;
    if (pendingCount > 0) {
      ticketText =
        pendingCount + ' Pending ' + (pendingCount > 1 ? 'tickets' : 'ticket');
    }
    if (newCount > 0) {
      if (pendingCount > 0) {
        ticketText = newCount + ' New, ' + ticketText;
      } else {
        ticketText = newCount + ' New ' + (newCount > 1 ? 'tickets' : 'ticket');
      }
    }
    if (newCount == 0 && pendingCount == 0) {
      ticketText = 'No Pending tickets';
    }
    return ticketText;
  };

  const getTicketsButton = () => {
    return (
      <TouchableHighlight style={{flex: 1}} onPress={() => {}}>
        <View style={dashboardStyles.ticketButton}>
          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={dashboardStyles.ticketText}>
            {getTicketText()}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };

  const renderDonutChart = () => {
    let percent = props.dashboardData.body.primaryStoreNPS.npsPercentage;
    let color = percent < 0 ? Colors.negativePassive : Colors.positivePassive;
    let roundColor =
      percent < 0 ? Colors.negativePromter : Colors.positivePromter;
    return (
      <View style={dashboardStyles.chartContainer}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.5}}>
            <Pie
              radius={80}
              innerRadius={60}
              sections={[
                {
                  percentage: percent,
                  color: roundColor,
                },
              ]}
              backgroundColor={color}
            />
            <View style={dashboardStyles.gauge}>
              <Text style={dashboardStyles.gaugeText}>{percent + ''}</Text>
              <Text style={dashboardStyles.npmGaugeText}>NPS</Text>
            </View>
          </View>
          {getTrimmedNoOfResponses()}
        </View>
      </View>
    );
  };

  const renderDashboardContent = () => {
    if (!props.isError) {
      return (
        <View style={dashboardStyles.center}>
          {renderDonutChart()}
          {getTicketsButton()}
        </View>
      );
    }
    return <View style={{flex: 1}} />;
  };

  const renderDashboard = () => {
    return (
      <ImageBackground
        resizeMode={'stretch'}
        source={require('../../images/background.png')}
        style={dashboardStyles.imageBackgroundContainer}>
        {renderScreen()}
      </ImageBackground>
    );
  };

  const renderScreen = () => {
    return (
      <ScrollView
        contentContainerStyle={dashboardStyles.cxContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={dashboardStyles.cxContainer}>
          {renderDashboardContent()}
          {renderIndicator()}
        </View>
      </ScrollView>
    );
  };

  const renderIndicator = () => {
    if (props.isLoading) {
      return <DotIndicator color={Colors.white} count={3} size={10} />;
    }
  };

  return renderDashboard();
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
