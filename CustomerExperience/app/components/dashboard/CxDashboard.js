import React, {useCallback, useEffect, useState} from 'react';
import {
  RefreshControl,
  ScrollView,
  Text,
  View,
  BackHandler,
  Alert,
  SafeAreaView,
} from 'react-native';
import {showLoading} from '../../redux/actions/index';
import {
  getDashboardContent,
  getFirstTimeClosedLoopSegmentDetails,
} from '../../redux/actions/dashboard.actions';
import {connect, useDispatch, useSelector} from 'react-redux';
import {dashboardStyles} from './dashboard.style';
import {Colors} from '../../styles/color.constants';
import {isObjectEmpty} from '../../Utils/Utility';
import QPSpinner from '../../widgets/QPSpinner';
import moment from 'moment';
import {DMYFORMAT, YMDFORMAT} from '../../Utils/AppConstants';
import {MarginConstants} from '../../styles/margin.constants';
import StringUtils from '../../Utils/StringUtils';
import {getSelectedRange} from '../../Utils/DateFilterUtility';
import {setRangeFilter} from '../../redux/actions';
import {DashboardClosedLoopView} from './DashboardClosedLoopView';
import {translate} from '../../Utils/MultilinguaUtils';
import AsyncStorage, {
  useAsyncStorage,
} from '@react-native-async-storage/async-storage';
import {
  ASYNC_LAST_LOGIN,
  ASYNC_RESPONSES_WITH_CX_MANAGER,
} from '../../api/Constant';
import {SEGMENT_SELECTED} from '../../redux/actions/dashboard.actions';
import {FabAddButton, HeaderFilter} from '../../routes/CommonScreen';
import NpsGaugeChart from '../../widgets/dashboardWidget/NpsGaugeChart';
import {baseTextStyles} from '../../styles/text.styles';
import {FontWeight} from '../../styles/font.constants';
import Animated from 'react-native-reanimated';
import {StatusDashboardBottomSheet} from './ClosedLoopDashboard';
import ScoreIndicatorIcon from '../../widgets/dashboardWidget/ScoreIndicatorIcon';
import DottedLine from '../../widgets/dashboardWidget/DottedLine';
import TextLabel from '../../widgets/TextLabel/TextLabel';
import CsatToggleButton from '../../widgets/dashboardWidget/CsatToggleButton';
import CsatScoreLabel from '../../widgets/dashboardWidget/CsatScoreLabel';
import CsatChart from '../../widgets/dashboardWidget/CsatChart';
import DashboardWidgetTitle from '../../widgets/dashboardWidget/RenderSegmentTitle';
import ResponsesButton from '../../widgets/dashboardWidget/ResponsesButton';
import RenderInfoContainer from '../../widgets/dashboardWidget/RenderInfoContainer';
import LegendScoreView from '../../widgets/dashboardWidget/LegendScoreView';
import AsyncStorageData from '../../Utils/AsyncUtil';

const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

let getNPSColor = nps => {
  if (nps < 0) {
    return Colors.detractor2;
  } else if (nps >= 0 && nps <= 50) {
    return Colors.passive2;
  } else {
    return Colors.promoter2;
  }
};

const NPSIcon = ({nps}) => {
  return (
    <View style={dashboardStyles.npsIcon}>
      <View
        style={[
          dashboardStyles.roundSquareShape,
          {backgroundColor: getNPSColor(nps)},
        ]}
      />
      <DottedLine borderStyle="solid" />
    </View>
  );
};

const NpsScoreView = () => {
  const {npsPercentage, benchmarkScore} = useSelector(
    state => state.dashboard?.currentNPSData?.NPSScore,
  );
  const hasBenchmark = benchmarkScore && benchmarkScore !== 0;

  return (
    <View style={dashboardStyles.squareView}>
      <NPSIcon nps={npsPercentage} />
      <TextLabel text={'NPS:'} fontWeight={FontWeight.bold} />
      <TextLabel
        text={StringUtils.floatToDecimal(npsPercentage)}
        fontWeight={FontWeight.bold}
        color={getNPSColor(npsPercentage)}
      />
      {hasBenchmark ? (
        <TextLabel
          text={`${StringUtils.floatToDecimal(npsPercentage - benchmarkScore)}`}
          baseTextStyle={baseTextStyles.semiSecondaryRegularText}
          color={Colors.evenDarkerGrey}
        />
      ) : (
        <View />
      )}
      {hasBenchmark ? (
        <ScoreIndicatorIcon diff={npsPercentage - benchmarkScore} />
      ) : (
        <View />
      )}
    </View>
  );
};

const BenchmarkIcon = ({benchmark}) => {
  return (
    <View>
      <View
        style={[
          dashboardStyles.roundSquareShape,
          {backgroundColor: getNPSColor(benchmark)},
        ]}
      />
      <DottedLine />
    </View>
  );
};
const BenchmarkView = () => {
  const {benchmarkScore} = useSelector(
    state => state.dashboard.currentNPSData?.NPSScore,
  );
  return benchmarkScore !== 0 ? (
    <View style={dashboardStyles.squareView}>
      <BenchmarkIcon benchmark={benchmarkScore} />
      <TextLabel text={`Benchmark: ${benchmarkScore}`} />
    </View>
  ) : (
    <View style={dashboardStyles.emptyBenchmarkView} />
  );
};

const RenderSegmentDashboardData = () => {
  const {scoringModel, primaryStoreName} = useSelector(
    state => state.dashboard?.dashboardData,
  );

  const currentSegmentName = useSelector(
    state => state.dashboard?.currentSegment?.currentSegment,
  );

  const title = `${currentSegmentName ?? primaryStoreName} ${
    scoringModel === 1 ? 'CSAT' : 'NPS'
  }`;
  return (
    <View
      style={
        scoringModel === 1
          ? dashboardStyles.csatChartContainer
          : dashboardStyles.chartContainer
      }>
      <DashboardWidgetTitle text={title} child={<ResponsesButton />} />
      <RenderInfoContainer />
      {scoringModel && scoringModel === 1 ? (
        <RenderCSATChart />
      ) : (
        <RenderNPSChart />
      )}
    </View>
  );
};

const ChartLegendView = () => {
  const {
    promoters,
    passive,
    detractors,
    promoterPercent,
    passivePercent,
    detractorPercent,
  } = useSelector(state => state.dashboard.currentNPSData?.NPSScore);

  const {scoringModel} = useSelector(state => state.dashboard?.dashboardData);
  return (
    <View
      style={
        scoringModel === 1
          ? dashboardStyles.csatLegendContainer
          : dashboardStyles.npsLegendContainer
      }>
      <LegendScoreView
        title={scoringModel === 1 ? 'Negatives' : 'Detractors'}
        count={detractors}
        percentage={detractorPercent}
        backgroundColor={Colors.detractor2}
      />
      <LegendScoreView
        title={scoringModel === 1 ? 'Neutral' : 'Passive'}
        count={passive}
        percentage={passivePercent}
        backgroundColor={Colors.passive2}
      />
      <LegendScoreView
        title={scoringModel === 1 ? 'Positives' : 'Promoters'}
        count={promoters}
        percentage={promoterPercent}
        backgroundColor={Colors.promoter2}
      />
    </View>
  );
};

const NPSView = () => {
  return (
    <View style={dashboardStyles.npsViewContainer}>
      <NpsGaugeChart />
      <NpsScoreView />
      <BenchmarkView />
      <ChartLegendView />
    </View>
  );
};

const RenderNoDataFound = () => {
  return (
    <View style={dashboardStyles.emptyView}>
      <Text style={dashboardStyles.emptyText}>
        {translate('dashboard.no_segment_found')}
      </Text>
    </View>
  );
};

function RenderNPSChart() {
  const NPSScore = useSelector(
    state => state.dashboard.currentNPSData?.NPSScore,
  );

  return (
    <View style={dashboardStyles.renderNpsChartContainer}>
      {NPSScore ? <NPSView /> : <View />}
    </View>
  );
}

const ClosedLoopView = props => {
  return (
    <View style={dashboardStyles.closedLoopView}>
      <DashboardClosedLoopView
        // ticketCount={props.dashboardData.detractorTicketsCount}
        ticketCount={props.ticketCount}
        {...props}
      />
    </View>
  );
};

let RenderDashboardContent = props => {
  if (
    !props.isError &&
    !props.isLoading &&
    !isObjectEmpty(props.dashboardData)
  ) {
    return (
      <SafeAreaView>
        <RenderSegmentDashboardData />
        <ClosedLoopView {...props} />
      </SafeAreaView>
    );
  }
  return <View style={dashboardStyles.container} />;
};

const RenderCSATChart = () => {
  const NPSScore = useSelector(
    state => state.dashboard.currentNPSData?.NPSScore,
  );
  return NPSScore ? (
    <View style={dashboardStyles.csatContainer}>
      <CsatChart />
      <CsatScoreLabel />
      <CsatToggleButton />
      <ChartLegendView />
    </View>
  ) : (
    <View />
  );
};

const CxDashboard = props => {
  console.log('CX DASHBOARD SCREEN RENDER');

  let dispatch = useDispatch();
  let [refreshing, setRefreshing] = useState(false);
  let [exitAlert, showExitAlert] = useState(false);
  let [lastLoginArray, setLastLoginArray] = useState([]);

  const statusBottomSheetRef = React.useRef();
  const statusBottomSheetSnapPoints = ['55%', '0%'];
  const fall = new Animated.Value(1);

  const openStatusBS = () => {
    statusBottomSheetRef.current.snapTo(0);
  };

  const getSegmentData = () => {
    dispatch(
      getFirstTimeClosedLoopSegmentDetails(props.authToken, {pageOffset: '0'}),
    );
  };
  let segmentId = useSelector(
    state => state.dashboard.currentSegment.currentSegmentID,
  );
  const range = props.range;
  const wantToReload = props.wantToReload;

  const loadDashboardData = segmentId => {
    getDashboardData();
    if (!segmentId) {
      getSegmentData();
    }
  };

  useEffect(() => {
    loadDashboardData(segmentId);
  }, [segmentId]);

  const onRefresh = useCallback(() => {
    console.log('CALL DASHBOARD from RELOAD');

    loadDashboardData(segmentId);
    wait(500).then();
  }, [segmentId]);

  useEffect(() => {
    if (
      StringUtils.isEmpty(range.startDate) &&
      StringUtils.isEmpty(range.endDate)
    ) {
      let selectedRange = getSelectedRange({type: 1});
      props.setRange({
        type: 1,
        startDate: selectedRange.startDate,
        endDate: selectedRange.endDate,
      });
    }
    console.log('CALL DASHBOARD from range, wantToReload, segmentId');

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
      console.log(`LAST LOGIN ASYNC ERROR: ${JSON.stringify(e)}`);
    }
  };

  useEffect(() => {
    if (props.dashboardData.primaryStoreNPS) {
      props.showLoading(false);
      setRefreshing(false);
    }
  }, [props.dashboardData.primaryStoreNPS]);

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
    console.log('CALL DASHBOARD');
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

  let RenderDashboard = () => {
    return (
      <View
        forceInset={{bottom: 'never', top: 'never'}}
        style={[
          dashboardStyles.container,
          {paddingBottom: MarginConstants.tab1},
        ]}>
        <Animated.View
          style={[
            dashboardStyles.container,

            {
              opacity: Animated.add(0.3, Animated.multiply(fall, 1.0)),
            },
          ]}>
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
              <RenderDashboardContent openStatusBS={openStatusBS} {...props} />
              {renderSpinner()}
              {exitAlert && renderExitAlert()}
            </View>
          </ScrollView>
        </Animated.View>
        <FabAddButton onPress={onFabPressHandler} />

        <StatusDashboardBottomSheet
          ref={statusBottomSheetRef}
          snapPoints={statusBottomSheetSnapPoints}
          fall={fall}
          ticketCount={props.ticketCount}
        />
      </View>
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

  return <RenderDashboard />;
};

const mapStateToProps = state => {
  return {
    dashboardData: state.dashboard.dashboardData,
    ticketCount: state.dashboard.dashBoardTicketCount,
    isLoading: state.global.isLoading,
    isError: state.global.isError,
    errorMessage: state.global.errorMessage,
    authToken: state.global.authToken,
    range: state.global.range,

    wantToReload: state.global.wantToReloadDashboard,

    segmentList: state.dashboard.segmentDetails.segments,
  };
};

const mapDispatchToProps = dispatch => ({
  // updateSegment: segment => {
  //   dispatch({
  //     type: SEGMENT_SELECTED,
  //     payload: segment,
  //   });
  // },

  getDashboardContent: (token, data, segmentId) => {
    dispatch(showLoading(true));
    dispatch(getDashboardContent(token, data, segmentId));
  },

  showLoading: flag => {
    dispatch(showLoading(flag));
  },
  setRange: range => {
    dispatch(setRangeFilter(range));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CxDashboard);
