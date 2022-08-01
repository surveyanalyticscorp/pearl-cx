import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  View,
  BackHandler,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {showLoading} from '../../redux/actions/index';
import {
  getDashboardContent,
  getSegment,
} from '../../redux/actions/dashboard.actions';
import {connect, useSelector} from 'react-redux';
import {dashboardStyles} from './dashboard.style';
import {Colors} from '../../styles/color.constants';
import {isObjectEmpty} from '../../Utils/Utility';
import QPSpinner from '../../widgets/QPSpinner';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import {DMYFORMAT, YMDFORMAT} from '../../Utils/AppConstants';
import {MarginConstants} from '../../styles/margin.constants';
import {VictoryPie} from 'victory-native';
import {Sizes} from '../../styles/Size.constant';
import StringUtils from '../../Utils/StringUtils';
import FilterHeader from '../FilterHeader';
import {getSelectedRange} from '../../Utils/DateFilterUtility';
import {setRangeFilter} from '../../redux/actions';
import {DashboardClosedLoopView} from './DashboardClosedLoopView';
import {translate} from '../../Utils/MultilinguaUtils';
import MainDropDown from '../../widgets/drop-down/MainDropDown';
import AsyncStorage from '@react-native-community/async-storage';
import {ASYNC_LAST_LOGIN} from '../../api/Constant';
import {SEGMENT_SELECTED} from '../../redux/actions/dashboard.actions';
import {WelcomeScreen} from '../dashboard/WelcomeScreen';

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

const CxDashboard = (props) => {
  let [refreshing, setRefreshing] = useState(false);
  let [comparision, setComparision] = useState(false);
  let [exitAlert, showExitAlert] = useState(false);
  let [lastLoginArray, setLastLoginArray] = useState([]);
  let [welcomeScreenShow, setWelcomeScreenShown] = useState(false);

  // let [mSegment, setSegment] = useState(props.segment);
  // let [segmentName, setSegmentName] = useState('Given');

  // let mData = useSelector((state) => state.dashboard);
  // console.log({mdata: mData.dashboard.segment});
  // let {segment} = mData;

  // useEffect(() => {
  //   if (segment) {
  //     setSegmentName(segment);
  //   }
  // }, [mData]);

  const onRefresh = useCallback(() => {
    //setRefreshing(true);//No need to show 2 loading
    let data = {
      startDate: moment(props.sDate, DMYFORMAT).format(YMDFORMAT),
      endDate: moment(props.eDate, DMYFORMAT).format(YMDFORMAT),
    };
    props.getDashboardContent(props.authToken, data);

    wait(500).then();
  }, [props.range]);
  //////////////////////////////////
  // useEffect(() => {
  // props.navigation.setParams({selectedSegment: selectSegment});
  // let selectSegment = (segment) => {
  //   setSegment(segment);
  // };
  // setSegment(props.segment);
  // }, [props.segment]);
  /////////////////////////////////////
  useEffect(() => {
    /*const unsubscribe = props.navigation.addListener('focus', () => {
           // Add code here which execute every time when user landed on screen.

        });
        return unsubscribe;*/
    if (
      StringUtils.isEmpty(props.range.startDate) &&
      StringUtils.isEmpty(props.range.endDate)
    ) {
      let selectedRange = getSelectedRange({type: 1});
      props.setRange({
        type: 1,
        startDate: selectedRange.startDate,
        endDate: selectedRange.endDate,
      });
      let data = {
        startDate: moment(selectedRange.startDate, DMYFORMAT).format(YMDFORMAT),
        endDate: moment(selectedRange.endDate, DMYFORMAT).format(YMDFORMAT),
      };
      props.getDashboardContent(props.authToken, data);
    } else {
      getDashboardData();
    }
  }, [props.range, props.wantToReload]); //props.navigation

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    getLastLogin();
    return function cleanup() {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);
  //////////////////////////////////////////////
  const getLastLogin = async () => {
    try {
      const lastLogin = await AsyncStorage.getItem(ASYNC_LAST_LOGIN);
      if (JSON.parse(lastLogin) !== null) {
        setLastLoginArray(JSON.parse(lastLogin));
        // console.log(`LAST LOGIN ASYNC: ${lastLoginArray}`);
      }
    } catch (e) {
      // console.log(`LAST LOGIN ASYNC ERROR: ${JSON.stringify(e)}`);
    }
  };
  /////////////////////////////////////////////
  useEffect(() => {
    if (comparision) {
      getDashboardData();
      setComparision(false);
    }
  }, [comparision]);

  useEffect(() => {
    if (props.dashboardData.detractorTicketsCount) {
      props.showLoading(false);
      setRefreshing(false);
    }
  }, [props.dashboardData.detractorTicketsCount]);

  let handleBackPress = () => {
    /*if(!props.navigation.canGoBack()) {
            showExitAlert(true);
        }*/
    showExitAlert(true);
    return true;
  };

  let renderExitAlert = () => {
    return Alert.alert(
      translate('exit_app'),
      translate('exit_message'),
      [
        {
          text: translate('yes'),
          onPress: () => {
            showExitAlert(false);
            BackHandler.exitApp();
          },
        },
        {
          text: translate('no'),
          onPress: () => {
            showExitAlert(false);
          },
        },
      ],
      {cancelable: false},
    );
  };

  let getDashboardData = () => {
    let data = {
      startDate: moment(props.range.startDate, DMYFORMAT).format(YMDFORMAT),
      endDate: moment(props.range.endDate, DMYFORMAT).format(YMDFORMAT),
    };
    props.getDashboardContent(props.authToken, data);
    console.log(`${JSON.stringify(props)} :Data`);
  };

  const renderDonutChart = () => {
    let data = props.dashboardData.primaryStoreNPS;
    let responses = props.dashboardData.primaryStoreNPS.totalResponses;
    let responseCount = getTrimmedNoOfResponses(responses);
    let victoryPieData =
      responseCount !== 0
        ? [
            {
              y: data.promoterFormattedPercent,
              x: '',
            },
            {
              y: data.passiveFormattedPercent,
              x: '',
            },
            {
              y: data.detractorFormattedPercent,
              x: '',
            },
          ]
        : [
            {y: 100, x: ''}, //for empty nps chart
          ];
    let victoryPieColorScale =
      responseCount !== 0
        ? [Colors.promoter2, Colors.passive2, Colors.detractor2]
        : [Colors.primary];
    return (
      <View style={dashboardStyles.chartContainer}>
        <View style={dashboardStyles.donut}>
          <VictoryPie
            data={victoryPieData}
            width={5 * MarginConstants.tab4}
            height={6 * MarginConstants.tab4}
            innerRadius={2.3 * MarginConstants.tab4}
            radius={2.1 * MarginConstants.tab4}
            style={{
              labels: {
                fill: 'transparent',
              },
            }}
            colorScale={victoryPieColorScale}
            endAngle={-90}
            startAngle={90}
          />
          <View style={dashboardStyles.npsView}>
            <Text style={[dashboardStyles.npsPercentText]}>
              {data.npsPercentage}
            </Text>
            <Text style={[dashboardStyles.npsText]}>NPS</Text>
            <View style={[dashboardStyles.emptySeparator]}></View>
            {/* api data missing */}
            {/* <Text style={[dashboardStyles.detailsText]}>Company NPS 32</Text>
            <Text style={[dashboardStyles.detailsText]}>Your YTD NPS 27</Text> */}
            {/* translation missing */}
            <View style={{marginTop: 12}}>
              {renderDetailsInformation(
                'View Responses',
                'viewDetails',
                (tag) => {
                  // console.log(tag);
                },
              )}
            </View>
          </View>
        </View>
        {renderDonutInfoContainer(responseCount)}
      </View>
    );
  };

  let renderDonutInfoContainer = (responseCount) => {
    return (
      <View style={dashboardStyles.donutInfoContainer}>
        {renderDonutInformation(
          'check-square',
          translate('dashboard.surveys'),
          props.dashboardData.surveyCount,
        )}
        {renderDonutInformation(
          'th-large',
          translate('dashboard.responses'),
          responseCount,
        )}
      </View>
    );
  };

  let renderDonutInformation = (icon, title, count) => {
    return (
      <View style={dashboardStyles.responseView}>
        <Text style={dashboardStyles.responseText}>{count}</Text>
        <View style={dashboardStyles.separator} />
        <View style={dashboardStyles.ticketTypeContainer}>
          <Icon
            name={icon}
            size={Sizes.inlineIcons}
            color={Colors.borderColor}
          />
          <Text style={dashboardStyles.response}>{title}</Text>
        </View>
      </View>
    );
  };
  let getNPSIcon = (sentiment) => {
    let icon;
    switch (sentiment) {
      case 'Detractor':
        icon = require('./../../../assets/images/detractor.png');
        break;
      case 'Passive':
        icon = require('./../../../assets/images/passive.png');
        break;
      default:
        icon = require('./../../../assets/images/promoter.png');
        break;
    }

    return <Image source={icon} style={{width: 12, height: 12}} />;
  };
  let renderDetailsInformation = (title, tag, onPressTab) => {
    return (
      <TouchableOpacity
        style={{
          marginBottom: 12,
        }}
        onPress={() => onPressTab(tag)}>
        <View style={{marginStart: Sizes.inlineIcons}} />
        <Text style={{textAlign: 'left', color: Colors.accentLight}}>
          {title}
        </Text>
      </TouchableOpacity>
      //   <View style={dashboardStyles.responseView}>
      //     <Text style={dashboardStyles.responseText}>{count}</Text>
      //     <View style={dashboardStyles.separator} />
      //     <View style={dashboardStyles.ticketTypeContainer}>
      //       <Icon
      //         name={icon}
      //         size={Sizes.inlineIcons}
      //         color={Colors.borderColor}
      //       />
      //       <Text style={dashboardStyles.response}>{title}</Text>
      //     </View>
      //   </View>
    );
  };

  let getClosedLoopView = () => {
    return (
      <View style={dashboardStyles.closedLoopView}>
        <DashboardClosedLoopView
          ticketCount={props.dashboardData.detractorTicketsCount}
        />
      </View>
    );
  };

  const getTrimmedNoOfResponses = (responseCount) => {
    let numberOfResponses = responseCount ? responseCount : 0;

    if (numberOfResponses >= 10000) {
      numberOfResponses =
        Math.round(numberOfResponses / 1000).toFixed(
          numberOfResponses > 10000 ? 0 : 1,
        ) + 'K';
    } else if (numberOfResponses >= 1000) {
      numberOfResponses = (numberOfResponses / 1000).toFixed(1) + 'K';
    }
    return numberOfResponses;
  };

  let renderNoDataFound = () => {
    return (
      <View style={dashboardStyles.emptyView}>
        <Text style={dashboardStyles.emptyText}>
          {translate('dashboard.no_segment_found')}
        </Text>
      </View>
    );
  };

  let renderRow = (storeItem) => {
    return (
      <View
        style={[
          dashboardStyles.row,
          {
            backgroundColor:
              storeItem.item.storeName === props.dashboardData.primaryStoreName
                ? Colors.accentGradient
                : Colors.white,
          },
        ]}>
        <Text style={dashboardStyles.productText}>
          {storeItem.item.storeName}
        </Text>
        <Text style={dashboardStyles.productText}>
          {storeItem.item.NPSScore.npsPercentage}
        </Text>
      </View>
    );
  };

  let renderListHeader = () => {
    return (
      <View style={dashboardStyles.productHeaderView}>
        <Text style={dashboardStyles.listTitle}>Segment</Text>
        <Text style={dashboardStyles.listTitle}>NPS</Text>
      </View>
    );
  };

  let renderStoreNPSList = () => {
    let list = props.dashboardData.storeNPSList;
    return (
      <View style={dashboardStyles.listViewContainer}>
        <View style={dashboardStyles.list}>
          <FlatList
            data={list.sort(
              (a, b) => b.NPSScore.npsPercentage - a.NPSScore.npsPercentage,
            )}
            keyExtractor={(item, index) => index + ''}
            renderItem={renderRow}
            onEndReachedThreshold={0.01}
            refreshing={false}
            ListEmptyComponent={renderNoDataFound}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={renderListHeader}
          />
        </View>
      </View>
    );
  };

  let renderSegmentTitle = (text) => {
    return (
      <View style={dashboardStyles.dashboardTitleContainer}>
        <Text style={dashboardStyles.dashboardTitle}>{text}</Text>
      </View>
    );
  };
  let renderWelcomeMessage = (text) => {
    return (
      <View style={dashboardStyles.dashboardTitleContainer}>
        <Text style={dashboardStyles.dashboardTitle}>{text}</Text>
      </View>
    );
  };

  let renderDashboardContent = () => {
    if (
      !props.isError &&
      !props.isLoading &&
      !isObjectEmpty(props.dashboardData)
    ) {
      const segmentOptions = ['Main Segment', 'Child Segment'];
      return (
        <SafeAreaView>
          <View
            style={{
              flex: 1,
              marginHorizontal: 16,
              marginVertical: 8,
              flexDirection: 'row',
            }}>
            <View
              style={{
                flex: 1,
                marginHorizontal: 16,

                flexDirection: 'column',
                alignContent: 'flex-end',
              }}></View>
          </View>

          {renderSegmentTitle(props.dashboardData.primaryStoreName)}
          {renderDonutChart()}
          {renderSegmentTitle(translate('dashboard.closed_loop'))}
          {getClosedLoopView()}
          {/* {renderSegmentTitle(translate('dashboard.comparison'))}
          {renderStoreNPSList()} */}
        </SafeAreaView>
      );
    }
    return <View style={dashboardStyles.container} />;
  };

  let renderDashboard = () => {
    return (
      <SafeAreaView
        forceInset={{bottom: 'never', top: 'never'}}
        style={dashboardStyles.container}>
        {/* <FilterHeader
          actionOnArrowClick={() => {
            setComparision(true);
          }}
          callDataAPI={() => {}}
          {...props}
        /> */}
        <ScrollView
          contentContainerStyle={dashboardStyles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={dashboardStyles.container}>
            {renderDashboardContent()}
            {renderSpinner()}
            {exitAlert && renderExitAlert()}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  let renderSpinner = () => {
    if (props.isLoading) {
      return (
        <View style={dashboardStyles.loading}>
          <QPSpinner />
        </View>
      );
    }
  };

  let renderWelcomeScreen = () => {
    return <WelcomeScreen />;
  };

  // return welcomeScreenShow ? renderDashboard() : renderWelcomeScreen();
  return renderDashboard();
};

const mapStateToProps = (state) => {
  return {
    dashboardData: state.dashboard.dashboardData,
    userInfo: state.global.userInfo,
    isLoading: state.global.isLoading,
    isError: state.global.isError,
    errorMessage: state.global.errorMessage,
    authToken: state.global.authToken,
    range: state.global.range,
    sDate: state.global.range.startDate,
    eDate: state.global.range.endDate,
    wantToReload: state.global.wantToReloadDashboard,
    segment: state.dashboard.segment,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateSegment: (segment) => {
    dispatch({
      type: SEGMENT_SELECTED,
      payload: segment,
    });
  },

  getDashboardContent: (token, data) => {
    dispatch(showLoading(true));
    dispatch(getDashboardContent(token, data));
  },
  showLoading: (flag) => {
    dispatch(showLoading(flag));
  },
  setRange: (range) => {
    dispatch(setRangeFilter(range));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CxDashboard);
