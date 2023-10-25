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
  Pressable,
  Image,
} from 'react-native';
import {showLoading} from '../../redux/actions/index';
import {getDashboardContent} from '../../redux/actions/dashboard.actions';
import {connect, useDispatch, useSelector} from 'react-redux';
import {dashboardStyles} from './dashboard.style';
import {Colors} from '../../styles/color.constants';
import {isObjectEmpty} from '../../Utils/Utility';
import QPSpinner from '../../widgets/QPSpinner';
// import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import {DMYFORMAT, YMDFORMAT} from '../../Utils/AppConstants';
import {MarginConstants} from '../../styles/margin.constants';
import {VictoryPie} from 'victory-native';
import {Sizes} from '../../styles/Size.constant';
import StringUtils from '../../Utils/StringUtils';
import {getSelectedRange} from '../../Utils/DateFilterUtility';
import {setRangeFilter} from '../../redux/actions';
import {DashboardClosedLoopView} from './DashboardClosedLoopView';
import {translate} from '../../Utils/MultilinguaUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_LAST_LOGIN} from '../../api/Constant';
import {SEGMENT_SELECTED} from '../../redux/actions/dashboard.actions';
import HorizontalScaleBar from '../../widgets/HorizontalScaleBar';
import {FabAddButton, HeaderFilter} from '../../routes/CommonScreen';
import QPButton from '../../widgets/Button';
import {buttonStyles} from '../../styles/button.styles';
import {GaugeChart} from './GaugeChart';
import {textStyles} from '../../styles/text.styles';

const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

const getTrimmedNoOfResponses = responseCount => {
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

function RenderDonutInformation({icon, title, count}) {
  return (
    <View style={dashboardStyles.responseView}>
      <Text style={dashboardStyles.responseText}>{count}</Text>
      <View style={dashboardStyles.separator} />
      <View style={dashboardStyles.ticketTypeContainer}>
        <Image source={icon} style={{width: 16, height: 16}} />
        {/* <Icon
          name={icon}
          size={Sizes.inlineIcons}
          color={Colors.borderColor}
        /> */}
        <Text style={dashboardStyles.response}>{title}</Text>
      </View>
    </View>
  );
}

function RenderDonutInfoContainer({responseCount, surveyCount}) {
  const responseIcon = require('./../../../assets/images/responses_icon.png');
  const surveyIcon = require('./../../../assets/images/surveys_icon.png');
  return (
    <View style={[dashboardStyles.donutInfoContainer, {flexDirection: 'row'}]}>
      <RenderDonutInformation
        icon={surveyIcon}
        title={translate('dashboard.surveys')}
        count={surveyCount}
      />
      <RenderDonutInformation
        icon={responseIcon}
        title={translate('dashboard.responses')}
        count={responseCount}
      />
    </View>
  );
}

const RenderDetailsInformation = props => {
  const navigateToResponses = () => {
    props.navigation.navigate('dashboard_to_responses');
  };

  return (
    <QPButton
      testID="dashboardToResponseButton"
      style={buttonStyles.outlinePrimaryButtonMedium}
      onPress={navigateToResponses}
      buttonText={translate('dashboard.view_responses')}
      textStyle={buttonStyles.outlinePrimaryButtonMediumText}
    />
  );
};
const RenderSegmentDashboardData = props => {
  console.log('NPS OBJECT', JSON.stringify(props.currentNPSData.NPSScore));
  const data = props.currentNPSData?.NPSScore;
  const {npsPercentage, benchmarkScore} = props.currentNPSData?.NPSScore;
  const surveyCount = useSelector(
    state => state.dashboard.dashboardData.surveyCount,
  );
  // ?? props.dashboardData.primaryStoreNPS;
  let responses = props.currentNPSData?.NPSScore?.totalResponses ?? 0;
  // ??
  // props.dashboardData.primaryStoreNPS.totalResponses;
  let responseCount = getTrimmedNoOfResponses(responses);
  // const surveyCount = props?.dashboardData?.surveyCount ?? 0;
  console.log('Gauge DATA', npsPercentage, benchmarkScore);
  return (
    <View style={dashboardStyles.chartContainer}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          backgroundColor: Colors.white,
          marginHorizontal: MarginConstants.tab2,
        }}>
        <RenderDonutInfoContainer
          responseCount={responseCount}
          surveyCount={surveyCount}
        />
        <RenderDetailsInformation {...props} />
      </View>
      {/* <GaugeChart npsScore={npsPercentage} benchmark={benchmarkScore} /> */}

      <DashboardGuageChart
        npsScore={npsPercentage}
        benchmark={benchmarkScore}
      />
    </View>
  );
};

const Benchmark = ({benchmark}) => {
  return (
    <View
      style={{
        alignItems: 'center',
        marginHorizontal: MarginConstants.tab1,
        marginBottom: MarginConstants.tab4,
      }}>
      <Text style={textStyles.optionTextBold}>{benchmark}</Text>
      <Text style={textStyles.secondaryText}>{`Benchmark`}</Text>
    </View>
  );
};

const NPSLabel = ({npsScore, benchmark}) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100%',
      }}>
      <GaugeChart npsScore={npsScore} benchmark={benchmark} />

      <Text style={textStyles.optionTextBold}>{npsScore ?? 0}</Text>
      <Text style={textStyles.secondaryText}>NPS</Text>
      {/* <Text style={textStyles.optionTextBold}>{npsScore}</Text>
      <Text style={textStyles.optionText}>NPS</Text> */}
    </View>
  );
};

function DashboardGuageChart({npsScore, benchmark}) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <NPSLabel npsScore={npsScore} benchmark={benchmark} />
      {/* <GaugeChart npsScore={npsScore} benchmark={benchmark} /> */}
      <Benchmark benchmark={benchmark} />
    </View>
  );
}

const CxDashboard = props => {
  let isFocused = useDispatch();

  let [refreshing, setRefreshing] = useState(false);
  let [comparision, setComparision] = useState(false);
  let [exitAlert, showExitAlert] = useState(false);
  let [lastLoginArray, setLastLoginArray] = useState([]);

  let segmentId = useSelector(
    state => state.dashboard.currentSegment.currentSegmentID,
  );
  const {range, wantToReload} = props;

  useEffect(() => {
    if (isFocused) {
      getDashboardData();
    }
  }, [isFocused]);

  const onRefresh = useCallback(() => {
    getDashboardData();
    wait(500).then();
  }, [segmentId]);

  useEffect(() => {
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
    }

    getDashboardData();
  }, [range, wantToReload, segmentId]); //props.navigation

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    getLastLogin();
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);
  //////////////////////////////////////////////
  const getLastLogin = async () => {
    try {
      const lastLogin = await AsyncStorage.getItem(ASYNC_LAST_LOGIN);
      if (JSON.parse(lastLogin) !== null) {
        setLastLoginArray(JSON.parse(lastLogin));
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

  const onDateRangeChangeHandler = range_ => {
    props.setRange(range_);
  };

  function handleBackPress() {
    if (
      props.route.name === translate('dashboard.dashboard') &&
      !props.navigation.canGoBack()
    ) {
      showExitAlert(true);
      return true;
    } else {
      showExitAlert(false);
      return false;
    }
  }

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
      fromDate: moment(props.range.startDate, DMYFORMAT).format(YMDFORMAT),
      toDate: moment(props.range.endDate, DMYFORMAT).format(YMDFORMAT),
    };
    if (data.startDate !== 'Invalid date') {
      props.getDashboardContent(props.authToken, data, segmentId);
    }
  };

  const RenderHorizontalBarView = () => {
    return <HorizontalScaleBar value={'40'} />;
  };

  const renderDonutChart = () => {
    console.log('NPS OBJECT', JSON.stringify(props.currentNPSData.NPSScore));
    let data = props.currentNPSData?.NPSScore;
    // ?? props.dashboardData.primaryStoreNPS;
    let responses = props.currentNPSData?.NPSScore?.totalResponses ?? 0;
    // ??
    // props.dashboardData.primaryStoreNPS.totalResponses;
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
        : [Colors.darkGrey];
    return (
      <View style={dashboardStyles.container}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: Colors.white,
            marginHorizontal: MarginConstants.tab2,
          }}>
          <RenderDonutInfoContainer responseCount={responseCount} />
          <RenderDetailsInformation {...props} />
        </View>

        <View style={dashboardStyles.chartContainer}>
          <View style={dashboardStyles.donut}>
            <VictoryPie
              data={victoryPieData}
              width={5 * MarginConstants.tab4}
              height={6 * MarginConstants.tab4}
              innerRadius={2.4 * MarginConstants.tab4}
              radius={2.0 * MarginConstants.tab4}
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
                {data?.npsPercentage ?? 0}
              </Text>
              <Text style={[dashboardStyles.npsText]}>NPS</Text>
              <View style={[dashboardStyles.emptySeparator]}></View>
              {/* api data missing */}
              {/* <Text style={[dashboardStyles.detailsText]}>Company NPS 32</Text>
            <Text style={[dashboardStyles.detailsText]}>Your YTD NPS 27</Text> */}
              {/* translation missing */}

              {/* <HorizontalScaleBar value={data?.npsPercentage ?? 0} /> */}
              <View
                style={{
                  zIndex: 99,
                  marginTop: MarginConstants.tab1,
                }}></View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  let getNPSIcon = sentiment => {
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

  let getClosedLoopView = () => {
    return (
      <View style={dashboardStyles.closedLoopView}>
        <DashboardClosedLoopView
          // ticketCount={props.dashboardData.detractorTicketsCount}
          ticketCount={props.ticketCount}
        />
      </View>
    );
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

  let renderRow = storeItem => {
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

  let renderSegmentTitle = text => {
    return (
      <View style={dashboardStyles.dashboardTitleContainer}>
        <Text style={dashboardStyles.dashboardTitle}>{text}</Text>
      </View>
    );
  };
  let renderWelcomeMessage = text => {
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

          {renderSegmentTitle(
            props.segment.currentSegment ??
              props.dashboardData.primaryStoreName,
          )}
          {/* {renderDonutChart()} */}
          <RenderSegmentDashboardData {...props} />
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
        {/* <StatusBar barStyle={'light-content'} /> */}
        {/* <FilterHeader
          actionOnArrowClick={() => {
            setComparision(true);
          }}
          callDataAPI={() => {}}
          {...props}
        /> */}
        <HeaderFilter
          hasFilterIcon={false}
          dateRange={range}
          onPressDateRange={onDateRangeChangeHandler}
        />

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

        <FabAddButton onPress={onFabPressHandler} />
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

  let onFabPressHandler = () => {
    props.navigation.navigate(translate('responses.new_ticket'));
  };

  return renderDashboard();
};

const mapStateToProps = state => {
  return {
    dashboardData: state.dashboard.dashboardData,
    ticketCount: state.dashboard.dashBoardTicketCount,
    currentNPSData: state.dashboard.currentNPSData,
    userInfo: state.global.userInfo,
    isLoading: state.global.isLoading,
    isError: state.global.isError,
    errorMessage: state.global.errorMessage,
    authToken: state.global.authToken,
    range: state.global.range,
    sDate: state.global.range.startDate,
    eDate: state.global.range.endDate,
    wantToReload: state.global.wantToReloadDashboard,
    segment: state.dashboard.currentSegment,
    // isSegmentSelectorOpen: state.dashboard.isSegmentSelectorOpen,
    segmentList: state.dashboard.segmentDetails.segments,
  };
};

const mapDispatchToProps = dispatch => ({
  updateSegment: segment => {
    dispatch({
      type: SEGMENT_SELECTED,
      payload: segment,
    });
  },

  getDashboardContent: (token, data, segmentId) => {
    dispatch(showLoading(true));
    dispatch(getDashboardContent(token, data, segmentId));
  },
  // getSegmentDetails: (token, data) => {
  //   dispatch(getClosedLoopSegmentDetails(token, data));
  // },
  showLoading: flag => {
    dispatch(showLoading(flag));
  },
  setRange: range => {
    dispatch(setRangeFilter(range));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CxDashboard);
