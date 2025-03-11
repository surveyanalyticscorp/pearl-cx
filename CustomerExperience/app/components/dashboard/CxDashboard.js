import React, {useCallback, useEffect, useState} from 'react';
import {RefreshControl, ScrollView, View, SafeAreaView} from 'react-native';
import {showLoading} from '../../redux/actions/index';
import {
  getDashboardContent,
  getFirstTimeClosedLoopSegmentDetails,
} from '../../redux/actions/dashboard.actions';
import {useDispatch, useSelector} from 'react-redux';
import {dashboardStyles} from './dashboard.style';
import {isObjectEmpty} from '../../Utils/Utility';
import QPSpinner from '../../widgets/QPSpinner';
import moment from 'moment';
import {DMYFORMAT, YMDFORMAT} from '../../Utils/AppConstants';
import StringUtils from '../../Utils/StringUtils';
import {getSelectedRange} from '../../Utils/DateFilterUtility';
import {setRangeFilter} from '../../redux/actions';
import {translate} from '../../Utils/MultilinguaUtils';
import {HeaderFilter} from '../../routes/commonUI/CommonUI';
import FabAddButton from '../../routes/commonUI/FabAddButton';
import Animated from 'react-native-reanimated';
import {
  ClosedLoopDashboard,
  StatusDashboardBottomSheet,
} from './ClosedLoopDashboard';

import RenderSegmentDashboardData from './cxDashboard/RenderSegmentDashboardData';
import useBackHandler from './hooks/useBackHandler';
import AnimatedView from '../../widgets/AnimatedView';
import {useNavigation} from '@react-navigation/native';

const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};
const CreateTicketButton = () => {
  const navigation = useNavigation();
  let onFabPressHandler = useCallback(() => {
    navigation.navigate(translate('responses.new_ticket'));
  }, [navigation]);

  return <FabAddButton onPress={onFabPressHandler} />;
};

let DashboardSpinner = () => {
  const isLoading = useSelector(state => state.global.isLoading);

  return isLoading ? (
    <View style={dashboardStyles.loading}>
      <QPSpinner />
    </View>
  ) : null;
};

let RenderDashboardContent = ({children}) => {
  const isError = useSelector(state => state.global.isError);
  const isLoading = useSelector(state => state.global.isLoading);
  const dashboardData = useSelector(state => state.dashboard.dashboardData);

  if (!isError && !isLoading && !isObjectEmpty(dashboardData)) {
    return (
      <SafeAreaView>
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
  const {range, authToken, wantToReloadDashboard} = useSelector(
    state => state.global,
  );
  const primaryStoreNPS = useSelector(
    state => state.dashboard.dashboardData.primaryStoreNPS,
  );

  let dispatch = useDispatch();
  let [refreshing, setRefreshing] = useState(false);
  const {renderExitAlert, exitAlert} = useBackHandler(navigation);

  const statusBottomSheetRef = React.useRef();
  const statusBottomSheetSnapPoints = ['62%', '0%'];
  const fall = new Animated.Value(1);

  useEffect(() => {
    Notifications.registerRemoteNotifications();
  }, []);
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
    }
    console.log('CALL DASHBOARD from range, wantToReload, segmentId');

    getDashboardData();
  }, [range, wantToReloadDashboard, segmentId]); //props.navigation

  useEffect(() => {
    if (primaryStoreNPS) {
      dispatch(showLoading(false));
      // props.showLoading(false);
      setRefreshing(false);
    }
  }, [primaryStoreNPS]);

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
    }
  };

  return (
    <View
      testID="cx-dashboard"
      forceInset={{bottom: 'never', top: 'never'}}
      style={dashboardStyles.container}>
      <AnimatedView fall={fall}>
        <HeaderFilter hasFilterIcon={false} />
        <ScrollView
          contentContainerStyle={dashboardStyles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <RenderDashboardContent>
            <RenderSegmentDashboardData />
            <ClosedLoopDashboard openStatusBS={openStatusBS} />
          </RenderDashboardContent>
          <DashboardSpinner />
          {exitAlert && renderExitAlert()}
        </ScrollView>
      </AnimatedView>
      <StatusDashboardBottomSheet
        ref={statusBottomSheetRef}
        snapPoints={statusBottomSheetSnapPoints}
        fall={fall}
      />
      <CreateTicketButton />
    </View>
  );
};
export default CxDashboard;
