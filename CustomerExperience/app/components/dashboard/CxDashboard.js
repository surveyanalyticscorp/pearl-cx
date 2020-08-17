import React, {useEffect, useCallback, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableHighlight,
  ScrollView,
  RefreshControl,
  FlatList,
} from 'react-native';
import {StackActions} from '@react-navigation/native';
import CXTrendItemWidget from './components/CXTrendItemWidget';
import {showLoading} from '../../redux/actions/index';
import {getDashboardContent} from '../../redux/actions/dashboard.actions';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {ASYNC_AUTH_TOKEN} from '../../api/Constant';
import {dashboardStyles} from './dashboard.style';
import {DotIndicator} from 'react-native-indicators';
import {Colors} from '../../styles/color.constants';
import Pie from 'react-native-pie';
const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};
const CxDashboard = props => {
  const [authToken, setAuthToken] = useState('');
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
        setAuthToken(token);
        props.getDashboardContent(token);
        setCallAPI(false);
      });
    }
  }, [callApi]);

  const getTrimmedNoOfResponses = () => {
    let responseText = "";
    let numberOfResponses = "";
    if (props.dashboardData.body) {
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
      responseText = numberOfResponses > 1 ? 'Responses' : 'Response';
    }

    let textView = (
      <View style={dashboardStyles.responseView}>
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
      <TouchableHighlight
        style={dashboardStyles.ticketButton}
        onPress={() => {
          let data = {
            storeId: '' + props.dashboardData.body.primaryStoreId,
            title: props.dashboardData.body.primaryStoreName + ' - Tickets',
            token: authToken,
          };
          const pushAction = StackActions.push('DetractorTickets', {
            data: data,
          });
          props.navigation.dispatch(pushAction);
        }}>
        <View>
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
    let percent = 0
    if (props.dashboardData.body) {
      percent = props.dashboardData.body.primaryStoreNPS.npsPercentage;
    }
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

  const renderStoreNPSList = () => {
    if (props.dashboardData.body.storeNPSList.length > 0) {
      let list = props.dashboardData.body.storeNPSList;
      let data = list.slice(0, 5);
      let title = props.dashboardData.body.systemPreferences.businessUnitName
        ? props.dashboardData.body.systemPreferences.businessUnitName
        : 'Business';
      return renderLists(data, title);
    }
  };

  const renderProductNPSList = () => {
    if (props.dashboardData.body.productNPSList.length > 0) {
      let list = props.dashboardData.body.productNPSList;
      let title = 'Products';
      return renderLists(list, title);
    }
  };

  const renderNoDataFound = () => {
    return (
      <View
        style={{
          flex: 1,
          marginTop: 20,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
        }}>
        <Text style={{color: 'black', fontSize: 16}}>
          No feedbacks received.
        </Text>
      </View>
    );
  };

  const renderRow = storeItem => {
    let name = storeItem.item.filterName
      ? storeItem.item.filterName
      : storeItem.item.storeName;
    let clickable = storeItem.item.storeName ? true : false;
    return (
      <CXTrendItemWidget
        storeName={name}
        nps={storeItem.item.NPSScore.npsPercentage}
        promoter={storeItem.item.NPSScore.promoters}
        passive={storeItem.item.NPSScore.passive}
        detractor={storeItem.item.NPSScore.detractors}
        isClickable={clickable}
        onPress={() => {
          let data = {storeId: storeItem.item.storeId + ''};
          const pushAction = StackActions.push('DashBoardStoreDetails', {
            name: props.dashboardData.body.primaryStoreName,
            data: data,
          });
          props.navigation.dispatch(pushAction);
        }}
      />
    );
  };
  const renderLists = (list, title) => {
    return (
      <View style={dashboardStyles.listViewContainer}>
        <View style={dashboardStyles.textView}>
          <Text style={dashboardStyles.listTitle}>{title}</Text>
        </View>
        <FlatList
          data={list}
          keyExtractor={item => item.filterName}
          renderItem={renderRow}
          onEndReachedThreshold={0.01}
          refreshing={false}
          ListEmptyComponent={renderNoDataFound}
        />
      </View>
    );
  };

  const renderDashboardContent = () => {
    if (!props.isError && !props.isLoading) {
      return (
        <View style={dashboardStyles.center}>
          {renderDonutChart()}
          {getTicketsButton()}
          {renderStoreNPSList()}
          {renderProductNPSList()}
        </View>
      );
    }
    return <View style={{flex: 1}} />;
  };

  const renderDashboard = () => {
    return (
      <ImageBackground
        resizeMode={'stretch'}
        source={require('../../config/images/background.png')}
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
