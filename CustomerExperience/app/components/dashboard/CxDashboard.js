import React, {useCallback, useEffect, useState} from 'react';
import {
  RefreshControl,
  ScrollView,
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
import {isObjectEmpty} from '../../Utils/Utility';
import QPSpinner from '../../widgets/QPSpinner';
import moment from 'moment';
import {DMYFORMAT, YMDFORMAT} from '../../Utils/AppConstants';
import {MarginConstants} from '../../styles/margin.constants';
import StringUtils from '../../Utils/StringUtils';
import {getSelectedRange} from '../../Utils/DateFilterUtility';
import {setRangeFilter} from '../../redux/actions';
import {translate} from '../../Utils/MultilinguaUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_LAST_LOGIN} from '../../api/Constant';
import {HeaderFilter} from '../../routes/commonUI/CommonUI';
import FabAddButton from '../../routes/commonUI/FabAddButton';
import Animated from 'react-native-reanimated';
import {
  ClosedLoopDashboard,
  StatusDashboardBottomSheet,
} from './ClosedLoopDashboard';

import RenderSegmentDashboardData from './cxDashboard/RenderSegmentDashboardData';

const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

let RenderDashboardContent = ({children}) => {
  const isError = useSelector(state => state.global.isError);
  const isLoading = useSelector(state => state.global.isLoading);
  const dashboardData = useSelector(state => state.dashboard.dashboardData);

  if (!isError && !isLoading && !isObjectEmpty(dashboardData)) {
    return (
      <SafeAreaView>
        <RenderSegmentDashboardData />
        {/* <ClosedLoopView openStatusBS={openStatusBS} /> */}
        {children}
      </SafeAreaView>
    );
  }
  return <View style={dashboardStyles.container} />;
};

const CxDashboard = ({route, navigation}) => {
  console.log('CX DASHBOARD SCREEN RENDER');

  const segmentId = useSelector(
    state => state.dashboard.currentSegment.currentSegmentID,
  );
  const {range, authToken, wantToReloadDashboard, isLoading} = useSelector(
    state => state.global,
  );
  const primaryStoreNPS = useSelector(
    state => state.dashboard.dashboardData.primaryStoreNPS,
  );

  let dispatch = useDispatch();
  let [refreshing, setRefreshing] = useState(false);
  let [exitAlert, showExitAlert] = useState(false);
  // let [lastLoginArray, setLastLoginArray] = useState([]);

  const statusBottomSheetRef = React.useRef();
  const statusBottomSheetSnapPoints = ['55%', '0%'];
  const fall = new Animated.Value(1);

  const openStatusBS = () => {
    statusBottomSheetRef.current.snapTo(0);
  };

  const getSegmentData = () => {
    dispatch(
      getFirstTimeClosedLoopSegmentDetails(authToken, {pageOffset: '0'}),
    );
  };

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
      dispatch(
        setRangeFilter({
          type: 1,
          startDate: selectedRange.startDate,
          endDate: selectedRange.endDate,
        }),
      );

      // props.setRange();
    }
    console.log('CALL DASHBOARD from range, wantToReload, segmentId');

    getDashboardData();
  }, [range, wantToReloadDashboard, segmentId]); //props.navigation

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // getLastLogin();
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);
  //////////////////////////////////////////////
  // const getLastLogin = async () => {
  //   try {
  //     const lastLogin = await AsyncStorage.getItem(ASYNC_LAST_LOGIN);
  //     if (JSON.parse(lastLogin) !== null) {
  //       setLastLoginArray(JSON.parse(lastLogin));
  //     }
  //   } catch (e) {
  //     console.log(`LAST LOGIN ASYNC ERROR: ${JSON.stringify(e)}`);
  //   }
  // };

  useEffect(() => {
    if (primaryStoreNPS) {
      dispatch(showLoading(false));
      // props.showLoading(false);
      setRefreshing(false);
    }
  }, [primaryStoreNPS]);

  function handleBackPress() {
    if (
      route.name === translate('dashboard.dashboard') &&
      !navigation.canGoBack()
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
      startDate: moment(range.startDate, DMYFORMAT).format(YMDFORMAT),
      endDate: moment(range.endDate, DMYFORMAT).format(YMDFORMAT),
      fromDate: moment(range.startDate, DMYFORMAT).format(YMDFORMAT),
      toDate: moment(range.endDate, DMYFORMAT).format(YMDFORMAT),
    };
    if (data.startDate !== 'Invalid date') {
      dispatch(showLoading(true));
      dispatch(getDashboardContent(authToken, data, segmentId));
      // props.getDashboardContent(authToken, data, segmentId);
    }
  };

  let renderSpinner = () => {
    if (isLoading) {
      return (
        <View style={dashboardStyles.loading}>
          <QPSpinner />
        </View>
      );
    }
  };

  let onFabPressHandler = () => {
    navigation.navigate(translate('responses.new_ticket'));
  };

  return (
    <View
      testID="cx-dashboard"
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
        <HeaderFilter hasFilterIcon={false} />

        <ScrollView
          contentContainerStyle={dashboardStyles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={dashboardStyles.container}>
            <RenderDashboardContent>
              <ClosedLoopDashboard openStatusBS={openStatusBS} />
            </RenderDashboardContent>
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
      />
    </View>
  );
};

// const mapStateToProps = state => {
//   return {
//     dashboardData: state.dashboard.dashboardData,

//     isLoading: state.global.isLoading,
//     isError: state.global.isError,
//     errorMessage: state.global.errorMessage,
//     authToken: state.global.authToken,
//     range: state.global.range,

//     wantToReload: state.global.wantToReloadDashboard,

//     segmentList: state.dashboard.segmentDetails.segments,
//   };
// };

// const mapDispatchToProps = dispatch => ({
//   // updateSegment: segment => {
//   //   dispatch({
//   //     type: SEGMENT_SELECTED,
//   //     payload: segment,
//   //   });
//   // },

//   getDashboardContent: (token, data, segmentId) => {
//     dispatch(showLoading(true));
//     dispatch(getDashboardContent(token, data, segmentId));
//   },

//   showLoading: flag => {
//     dispatch(showLoading(flag));
//   },
//   setRange: range => {
//     dispatch(setRangeFilter(range));
//   },
// });

// export default connect(mapStateToProps, mapDispatchToProps)(CxDashboard);
export default CxDashboard;
