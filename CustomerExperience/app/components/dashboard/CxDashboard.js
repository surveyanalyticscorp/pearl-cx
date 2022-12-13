import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  View,
  BackHandler,
  BackPressEventName,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {showLoading} from '../../redux/actions/index';
import {
  getDashboardContent,
  setSegment,
  // getSegment,
  // getClosedLoopSegmentDetails,
  // setSegment,
  setSegmentSelectorOpen,
} from '../../redux/actions/dashboard.actions';
import {connect, useDispatch, useSelector} from 'react-redux';
import {dashboardStyles} from './dashboard.style';
import {Colors} from '../../styles/color.constants';
import {isObjectEmpty} from '../../Utils/Utility';
import QPSpinner from '../../widgets/QPSpinner';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import {DMYFORMAT, YMDFORMAT} from '../../Utils/AppConstants';
import {MarginConstants} from '../../styles/margin.constants';
import {
  VictoryPie,
  // VictoryChart,
  // VictoryBar,
  // VictoryTheme,
} from 'victory-native';
import {Sizes} from '../../styles/Size.constant';
import StringUtils from '../../Utils/StringUtils';
// import FilterHeader from '../FilterHeader';
import {getSelectedRange} from '../../Utils/DateFilterUtility';
import {setRangeFilter} from '../../redux/actions';
import {DashboardClosedLoopView} from './DashboardClosedLoopView';
import {translate} from '../../Utils/MultilinguaUtils';
// import MainDropDown from '../../widgets/drop-down/MainDropDown';
import AsyncStorage from '@react-native-community/async-storage';
import {ASYNC_LAST_LOGIN} from '../../api/Constant';
import {SEGMENT_SELECTED} from '../../redux/actions/dashboard.actions';
import {WelcomeScreen} from '../dashboard/WelcomeScreen';
import HorizontalScaleBar from '../../widgets/HorizontalScaleBar';
import {BottomSheetHeader, FabAddButton} from '../../routes/CommonScreen';
import {useNavigation} from '@react-navigation/native';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import {getSegmentIndex} from '../../Utils/TicketUtils';
import GlobalSelectSegment from './GlobalSelectSegment';
// import RenderSegmentBottomSheet from './RenderSegmentBottomSheet';

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

const CxDashboard = (props) => {
  let dispatch = useDispatch();
  let isFocused = useDispatch();

  let [refreshing, setRefreshing] = useState(false);
  let [comparision, setComparision] = useState(false);
  let [exitAlert, showExitAlert] = useState(false);
  let [lastLoginArray, setLastLoginArray] = useState([]);
  let segmentId = useSelector(
    (state) => state.dashboard.currentSegment.currentSegmentID,
  );
  const {range, wantToReload} = props;
  // const segmentSelectorOpenState = useSelector(
  //   (state) => state.dashboard.isSegmentSelectorOpen,
  // );
  const navigation = useNavigation();
  const {subscriberId} = useState(useSelector((state) => state.global));
  const bs = React.useRef(null);
  const fall = new Animated.Value(1);
  const bsSnapPoints = ['50%', '0%'];
  // const [shadow, setShadow] = useState(false);

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

  useEffect(() => {
    if (isFocused) {
      getDashboardData();
    }
  }, [isFocused]);

  const onRefresh = useCallback(() => {
    //setRefreshing(true);//No need to show 2 loading
    // let data = {
    //   startDate: moment(props.sDate, DMYFORMAT).format(YMDFORMAT),
    //   endDate: moment(props.eDate, DMYFORMAT).format(YMDFORMAT),
    // };
    // props.getDashboardContent(props.authToken, data);

    getDashboardData();
    wait(500).then();
  }, [segmentId]);
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
    console.log('DASHBOARD_1');

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
      // getDashboardData();
      // let data = {
      //   startDate: moment(selectedRange.startDate, DMYFORMAT).format(YMDFORMAT),
      //   endDate: moment(selectedRange.endDate, DMYFORMAT).format(YMDFORMAT),
      // };
      // props.getDashboardContent(props.authToken, data);
      // dispatcher(getClosedLoopSegmentDetails(props.authToken, {statusID: 0}));
    }
    // else {
    //   getDashboardData();
    // }
    getDashboardData();
  }, [range, wantToReload, segmentId]); //props.navigation

  useEffect(() => {
    BackHandler.addEventListener(BackPressEventName, handleBackPress);
    // BackHandler.addEventListener(handleBackPress);

    getLastLogin();
    return () => {
      BackHandler.removeEventListener(BackPressEventName, handleBackPress);
      // console.log('removed ');
      // BackHandler.removeEventListener(handleBackPress);
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
      console.log('DASHBOARD_2');

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
    if (!props.navigation.canGoBack()) {
      showExitAlert(true);
      console.log('go back pressed, show exit');
    } else {
      showExitAlert(false);
      props.navigation.goBack();
      console.log('go back pressed, just navigate');
    }
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
        : [Colors.darkGrey];
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

            <HorizontalScaleBar value={data.npsPercentage} />
            <View
              style={{
                zIndex: 99,
                marginTop: MarginConstants.tab1,
              }}>
              {renderDetailsInformation(
                'View Responses',
                'viewDetails',
                (tag) => {},
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
        onPress={() => {
          console.log('tap tap');
          props.navigation.navigate('Responses');
        }}>
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
          // ticketCount={props.dashboardData.detractorTicketsCount}
          ticketCount={props.ticketCount}
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
        {/* <RenderSegmentSelector
          bs_={bs}
          bsSnapPoints_={bsSnapPoints}
          fall_={fall}
          renderSelectSegment_={renderSelectSegment}
          renderSelectSegmentHeader_={renderSelectSegmentHeader}
        /> */}
        {/* <RenderSegmentBottomSheet
          // ref={bs}
          // snapPoints={bsSnapPoints}
          callbackNode={fall}
        /> */}
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

  let renderWelcomeScreen = () => {
    return <WelcomeScreen />;
  };

  let onFabPressHandler = () => {
    props.navigation.navigate('New Ticket');
  };

  useEffect(() => {
    if (bs.current) {
      bs.current.snapTo(
        props.isSegmentSelectorOpen ? 0 : bsSnapPoints.length - 1,
      );
    }
    // console.log({isOpen: props.isSegmentSelectorOpen});
  }, [props.isSegmentSelectorOpen]);

  const handleSegmentSelectionAction = (item) => {
    // setDefaultEmail(item);
    // richText.current.setContentHTML(item.templateText);
    dispatch(setSegment(item));

    dispatch(setSegmentSelectorOpen(false));
    bs.current.snapTo(bsSnapPoints.length - 1);
  };

  const renderSelectSegmentHeader = () => {
    return (
      <BottomSheetHeader
        title={'Select Segment'}
        onPressClose={() => {
          dispatch(setSegmentSelectorOpen(false));
        }}
      />
    );
  };

  const renderSelectSegment = () => {
    return (
      <View
        //  style={styles.contentContainer}
        style={{backgroundColor: Colors.white, height: '100%'}}>
        <GlobalSelectSegment
          data={props.segmentList}
          selectedIndex={
            getSegmentIndex(
              props.segmentList ?? [],
              props.segment.currentSegmentID,
            ) ?? 0
          }
          handleOnPress={(item) => handleSegmentSelectionAction(item)}
        />
      </View>
    );
  };

  const RenderSegmentSelector = ({
    bs_,
    bsSnapPoints_,
    fall_,
    renderSelectSegment_,
    renderSelectSegmentHeader_,
  }) => {
    return (
      <BottomSheet
        ref={bs_}
        snapPoints={bsSnapPoints_}
        initialSnap={bsSnapPoints_.length - 1}
        enabledGestureInteraction={true}
        renderContent={renderSelectSegment_}
        renderHeader={renderSelectSegmentHeader_}
        callbackNode={fall_}
      />
    );
  };

  // return welcomeScreenShow ? renderDashboard() : renderWelcomeScreen();
  return renderDashboard();
};

const mapStateToProps = (state) => {
  return {
    dashboardData: state.dashboard.dashboardData,
    ticketCount: state.dashboard.dashBoardTicketCount,
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
    isSegmentSelectorOpen: state.dashboard.isSegmentSelectorOpen,
    segmentList: state.dashboard.segmentDetails.segments,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateSegment: (segment) => {
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
  showLoading: (flag) => {
    dispatch(showLoading(flag));
  },
  setRange: (range) => {
    dispatch(setRangeFilter(range));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CxDashboard);
