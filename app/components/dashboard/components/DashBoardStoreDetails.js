import React, {Component} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableHighlight,
  ScrollView,
  FlatList,
} from 'react-native';
import {StackActions} from '@react-navigation/native';
import CXTrendItemWidget from './CXTrendItemWidget';
import {clearError} from '../../../redux/actions/index';
import {connect} from 'react-redux';
import {dashboardStyles} from '../dashboard.style';
import {Colors} from '../../../styles/color.constants';
import Pie from 'react-native-pie';
import {MarginConstants} from '../../../styles/margin.constants';
import {apiHandler} from '../../../api/ApiHandler';
import {showMessage} from 'react-native-flash-message';
import QPSpinner from '../../../widgets/QPSpinner';

class DashBoardStoreDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      callApi: true,
      isLoading: false,
      isError: false,
    };
    this.apiCall();
    this.storeData = '';
  }

  apiCall = () => {

    if (this.state.callApi) {
      this.setState({isLoading: true});
      apiHandler.getCXDashBoard(
          this.props.authToken,
          this.props.route.params.data,
          response => {
            this.storeData = response;
            this.props.navigation.setParams({
              name: response.body.primaryStoreName,
            });
            this.setState({callApi: false});
          },
          error => {
            this.setState({isLoading: false});
            this.setState({isError: true});
          },
      );
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.isError) {
      showMessage({
        message: 'There was an error completing this request!',
        type: 'danger',
        icon: 'auto',
        backgroundColor: Colors.red,
        color: Colors.white,
      });
      let timer = setTimeout(() => {
        this.setState({isError: false});
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }

  getTrimmedNoOfResponses = () => {
    let numberOfResponsesNumber = 0;
    if (this.storeData.body.primaryStoreNPS.totalResponses) {
      numberOfResponsesNumber = this.storeData.body.primaryStoreNPS
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
    let pendingCount = this.storeData.body.DetractorTicketsCount.pending;
    let newCount = this.storeData.body.DetractorTicketsCount.new;
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
    if (newCount === 0 && pendingCount === 0) {
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
                storeId: '' + this.storeData.body.primaryStoreId,
                title: this.storeData.body.primaryStoreName + ' - Tickets',
                token: this.props.authToken,
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
    let percent = this.storeData.body.primaryStoreNPS.npsPercentage;
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
    if (this.storeData.body.storeNPSList.length > 0) {
      let list = this.storeData.body.storeNPSList;
      let data = list.slice(0, 5);
      let title = this.storeData.body.systemPreferences.businessUnitName
          ? this.storeData.body.systemPreferences.businessUnitName
          : 'Business';
      return this.renderLists(data, title);
    }
  };

  renderProductNPSList = () => {
    if (this.storeData.body.productNPSList.length > 0) {
      let list = this.storeData.body.productNPSList;
      let title = 'Products';
      return this.renderLists(list, title);
    }
  };

  renderNoDataFound = () => {
    return (
        <View style={dashboardStyles.emptyView}>
          <Text style={dashboardStyles.emptyText}>No feedbacks received.</Text>
        </View>
    );
  };

  renderRow = storeItem => {
    let name = storeItem.item.filterName
        ? storeItem.item.filterName
        : storeItem.item.storeName;
    let clickable =  storeItem.item.hasOwnProperty('storeName');
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
                name: this.storeData.body.primaryStoreName,
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
              {
                height:
                    MarginConstants.tab4 * 2 +
                    MarginConstants.tab4 * 1.5 * list.length,
              },
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
    if (!this.state.isLoading) {
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
            resizeMode={'cover'}
            source={require('../../../config/images/background1.png')}
            style={dashboardStyles.imageBackgroundContainer}>
          {this.storeData === '' || this.state.isLoading
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
    if (this.state.isLoading) {
      return <QPSpinner spinnerColor={Colors.white}/>;
    }
  };

  render() {
    return this.renderDashboard();
  }
}

const mapStateToProps = state => {
  return {
    userInfo: state.global.userInfo,
    authToken: state.global.authToken
  };
};

const mapDispatchToProps = dispatch => ({
  cleanError: () => {
    dispatch(clearError(false));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DashBoardStoreDetails);
