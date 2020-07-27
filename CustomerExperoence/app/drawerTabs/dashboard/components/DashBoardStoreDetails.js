import React, {Component, useEffect, useCallback, useState} from 'react';
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
import CXTrendItemWidget from '../components/CXTrendItemWidget';
import {styles} from '../../../styles/styles';
import {
  clearError,
  getStoreDashboardContent,
  showLoading,
} from '../../../actions';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {ASYNC_AUTH_TOKEN} from '../../../api/types';
import {dashboardStyles} from '../dashboard.style';
import {DotIndicator} from 'react-native-indicators';
import {Colors} from '../../../styles/color.constants';
import Pie from 'react-native-pie';
import {MarginConstants} from '../../../styles/margin.constants';

const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

class DashBoardStoreDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authToken: '',
      callApi: true,
    };
    this.apiCall();
  }
  apiCall = () => {
    async function getAuthToken() {
      return await AsyncStorage.getItem(ASYNC_AUTH_TOKEN);
    }

    if (this.state.callApi) {
      getAuthToken().then(token => {
        this.setState({authToken: token});
        this.props.getDashboardContent(token, this.props.route.params.data);
        this.setState({callApi: false});
      });
    }
  };

  getTrimmedNoOfResponses = () => {
    let numberOfResponsesNumber = 0;
    if (this.props.storeData.body.primaryStoreNPS.totalResponses) {
      numberOfResponsesNumber = this.props.storeData.body.primaryStoreNPS
        .totalResponses;
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

  getTicketText = () => {
    let ticketText = '';
    let pendingCount = this.props.storeData.body.DetractorTicketsCount.pending;
    let newCount = this.props.storeData.body.DetractorTicketsCount.new;
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

  getTicketsButton = () => {
    return (
      <TouchableHighlight
        style={dashboardStyles.ticketButton}
        onPress={() => {
          let data = {
            storeId: '' + this.props.storeData.body.primaryStoreId,
            title: this.props.storeData.body.primaryStoreName + ' - Tickets',
            token: authToken,
          };
          const pushAction = StackActions.push('DetractorTickets', {
            data: data,
          });
          this.props.navigation.dispatch(pushAction);
        }}>
        <View>
          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={dashboardStyles.ticketText}>
            {this.getTicketText()}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };

  renderDonutChart = () => {
    let percent = this.props.storeData.body.primaryStoreNPS.npsPercentage;
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
          {this.getTrimmedNoOfResponses()}
        </View>
      </View>
    );
  };

  renderStoreNPSList = () => {
    if (this.props.storeData.body.storeNPSList.length > 0) {
      let list = this.props.storeData.body.storeNPSList;
      let data = list.slice(0, 5);
      let title = this.props.storeData.body.systemPreferences.businessUnitName
        ? this.props.storeData.body.systemPreferences.businessUnitName
        : 'Business';
      return this.renderLists(data, title);
    }
  };

  renderProductNPSList = () => {
    if (this.props.storeData.body.productNPSList.length > 0) {
      let list = this.props.storeData.body.productNPSList;
      let title = 'Products';
      return this.renderLists(list, title);
    }
  };

  renderNoDataFound = () => {
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

  renderRow = storeItem => {
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
          let titleJSON = {title: this.props.storeData.body.primaryStoreName};
          const pushAction = StackActions.push('DashBoardStoreDetails', {
            data: data,
          });
          this.props.navigation.dispatch(pushAction);
        }}
      />
    );
  };

  renderLists = (list, title) => {
    return (
      <View
        style={[
          dashboardStyles.listViewContainer,
          {height: MarginConstants.tab4 * 10},
        ]}>
        <View style={dashboardStyles.textView}>
          <Text style={dashboardStyles.listTitle}>{title}</Text>
        </View>
        <FlatList
          data={list}
          keyExtractor={item => item.filterName}
          renderItem={this.renderRow}
          onEndReachedThreshold={0.01}
          refreshing={false}
          ListEmptyComponent={this.renderNoDataFound}
        />
      </View>
    );
  };

  renderDashboardContent = () => {
    if (!this.props.isError && !this.props.isLoading) {
      return (
        <View style={dashboardStyles.center}>
          {this.renderDonutChart()}
          {this.getTicketsButton()}
          {this.renderStoreNPSList()}
          {this.renderProductNPSList()}
        </View>
      );
    }
    return <View style={{flex: 1}} />;
  };

  renderDashboard = () => {
    return (
      <ImageBackground
        resizeMode={'stretch'}
        source={require('../../../images/background.png')}
        style={dashboardStyles.imageBackgroundContainer}>
        {this.props.storeData === '' || this.props.isLoading
          ? this.renderIndicator()
          : this.renderScreen()}
      </ImageBackground>
    );
  };

  renderScreen = () => {
    return (
      <ScrollView contentContainerStyle={dashboardStyles.cxContainer}>
        <View style={dashboardStyles.cxContainer}>
          {this.renderDashboardContent()}
          {this.renderIndicator()}
        </View>
      </ScrollView>
    );
  };

  renderIndicator = () => {
    if (this.props.storeData === '' || this.props.isLoading) {
      return <DotIndicator color={Colors.white} count={3} size={10} />;
    }
  };

  render() {
    return this.renderDashboard();
  }
}

const mapStateToProps = state => {
  console.log('CxDashboard State:');
  console.log(state);
  return {
    storeData: state.dashboard.storeDashboard,
    userInfo: state.global.userInfo,
    isLoading: state.global.isLoading,
    isError: state.global.isError,
    errorMessage: state.global.errorMessage,
  };
};

const mapDispatchToProps = dispatch => ({
  cleanError: () => {
    dispatch(clearError(false));
  },
  getDashboardContent: (token, param) => {
    dispatch(showLoading(true));
    dispatch(getStoreDashboardContent(token, param));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashBoardStoreDetails);
