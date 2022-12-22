import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ScrollView,
  BackHandler,
  Alert,
} from 'react-native';
import ClosedLoopCell from './ClosedloopCell';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../styles/color.constants';

import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {
  BottomSheetHeader,
  FabAddButton,
  FilterDateBox,
  FilterIcon,
  HeaderFilter,
  NoItemsFound,
  RenderSpinner,
} from '../../routes/CommonScreen';
import FilterTicket from './takeaction/FilterTickets';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import {useDispatch, useSelector} from 'react-redux';
import {
  getClosedLoopOwnerDetails,
  getClosedLoopTicketList,
} from '../../redux/actions/dashboard.actions';
import moment from 'moment';
import {
  DMYFORMAT,
  HalfMonthDateYearFormat,
  YMDFORMAT,
} from '../../Utils/AppConstants';
import {setRangeFilter, showLoading} from '../../redux/actions';

import {
  priorityList,
  statusList,
  ticketTypeList,
} from '../../Utils/TicketUtils';
import {translate} from '../../Utils/MultilinguaUtils';
import QPSpinner from '../../widgets/QPSpinner';
// import RenderSegmentBottomSheet from '../dashboard/RenderSegmentBottomSheet';

// const ClosedLoopTab = createMaterialTopTabNavigator();

export default function ClosedLoop(props) {
  const dispatch = useDispatch();
  const itemPerPage = 2;
  const {feedbackApiKey} = useSelector((state) => state.global.userInfo);

  const {authToken, range, isLoading} = useSelector((state) => state.global);
  const [filterState, setFilterState] = useState({
    feedbackApiKey: feedbackApiKey,
    status: '',
    priority: '',
    assignToId: '',
    pageNumber: 1,
    perPage: itemPerPage,
    fromDate: moment(range.startDate, DMYFORMAT).format(YMDFORMAT),
    toDate: moment(range.endDate, DMYFORMAT).format(YMDFORMAT),
    type: '',
  });
  const ticketDetails = useSelector((state) => state.dashboard.ticketDetails);
  // const state = useSelector((state) => state.dashboard);
  const pagerOptions = useSelector(
    (state) => state.dashboard.ticketDetails.pagerOptions,
  );
  const currentFeedback = useSelector(
    (state) => state.dashboard.currentFeedback,
  );
  const currentSegment = useSelector((state) => state.dashboard.currentSegment);

  const [ticketList, setTicketList] = useState([]);
  const owners = useSelector((state) => state.dashboard.ownerDetails.owners);

  const [refreshing, setRefreshing] = useState(false);
  const sampleFilterData = () => {
    const priority = priorityList.map((value) => ({
      ...value,
      isChecked: false,
    }));
    const status = statusList.map((value) => ({...value, isChecked: false}));
    const type = ticketTypeList.map((value) => ({...value, isChecked: false}));
    // const managers = owners.map((value) => ({...value, isChecked: false}));

    return {
      priority: priority,
      status: status,
      managers: [],
      type: type,
    };
  };

  const [filterData, setFilterData] = useState(sampleFilterData());
  // console.log('OWNERS', JSON.stringify(owners));

  const resetFilterState = (range_, pagenumber) => {
    setFilterState((state) => ({
      ...state,
      pageNumber: pagenumber,
      fromDate: moment(range_.startDate, DMYFORMAT).format(YMDFORMAT),
      toDate: moment(range_.endDate, DMYFORMAT).format(YMDFORMAT),
    }));
  };

  let getDataOnNewRange = (range_) => {
    dispatch(setRangeFilter(range_));
    // reset pageNumber, ticket list, range
    setTicketList([]);
    resetFilterState(range_, 1);
  };

  useEffect(() => {
    getTicketList(filterState, currentSegment.currentSegmentID);
    getTicketOwnerList(currentSegment.currentSegmentID);
  }, [filterState]);

  useEffect(() => {
    setTicketList([]);
    resetFilterState(range, 1);

    // getTicketList(filterState, currentSegment.currentSegmentID);
    // getTicketOwnerList(currentSegment.currentSegmentID);
  }, [currentSegment]);

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };
  const onRefresh = useCallback(() => {
    setFilterState((state) => ({...state, pageNumber: 1}));
    setTicketList([]);

    setRefreshing(true);
    getTicketList(filterState);
    wait(500).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    setTicketList((state) => [
      ...new Set([...state, ...(ticketDetails.data ?? [])]),
    ]);
  }, [ticketDetails]);

  // console.log('Ticket list: ', JSON.stringify(ticketDetails.data));
  useEffect(() => {
    if (owners && owners.length > 0) {
      const managers = owners.map((value) => ({...value, isChecked: false}));

      setFilterData((state) => ({...state, managers: managers}));
      console.log('OWNERS', JSON.stringify(owners));
    }
  }, [owners]);

  // useEffect(() => {}, []);

  const getTicketList = (filterState_, currentSegmentId) => {
    // setRefreshing(true);

    dispatch(showLoading(true));
    dispatch(
      getClosedLoopTicketList(
        authToken,
        filterState_,
        currentFeedback.feedbackID,
        currentSegmentId,
      ),
    );

    //   dispatch(
    //     getClosedLoopOwnerDetails(authToken, {
    //       segmentID: currentSegment.currentSegmentID,
    //     }),
    //   );
  };

  const loadMoreData = () => {
    if (!isLoading && ticketList.length < pagerOptions.totalCount) {
      setFilterState((state) => ({
        ...state,
        pageNumber: state.pageNumber + 1,
      }));
    }
  };
  const getTicketOwnerList = (segmentId_) => {
    dispatch(
      getClosedLoopOwnerDetails(authToken, {
        segmentID: segmentId_,
      }),
    );
  };

  const getSearchIcon = () => {
    return <IonIcons name="search" size={20} color={Colors.lightBlack} />;
  };

  const closedLoopTicketList = () => {
    return (
      <FlatList
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        }
        style={styles.container}
        data={ticketList}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.25}
        ListFooterComponent={isLoading ? <QPSpinner /> : <View />}
        extraData={[ticketList]}
        // ListEmptyComponent={<NoItemsFound>No tickets found</NoItemsFound>}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => {
          return (
            <ClosedLoopCell
              data={item}
              index={index}
              onPressHandler={() => onPressHandler(item, index)}
            />
          );
        }}
      />
    );
  };

  const onPressHandler = (item, index) => {
    props.navigation.navigate('TicketDetails', item);
  };

  const onFabHandler = () => {
    props.navigation.navigate('New Ticket');
  };

  const renderFilterContent = () => {
    return (
      <View style={styles.contentContainer}>
        <FilterTicket
          data={filterData}
          onPressHandler={(item, action) => handleAction(item, action)}
        />
      </View>
    );
  };

  const getIds = (items) =>
    items
      .filter((item) => item.isChecked === true)
      .map((id) => id.id)
      .toString();

  const getOwnerIds = (items) =>
    items
      .filter((item) => item.isChecked === true)
      .map((owner) => owner.ownerID)
      .toString();

  const handleAction = (item, action) => {
    switch (action) {
      case 'apply':
        applyFilter(item);
        break;
      default:
        closeFilter();
    }
  };
  const closeFilter = () => {
    bs.current.snapTo(bsSnapPoints.length - 1);
  };
  const openFilter = () => {
    bs.current.snapTo(0);
  };

  const applyFilter = (item) => {
    setFilterData(item);

    console.log('StatusParam: ', JSON.stringify(item));
    setTicketList([]);
    setFilterState((state) => ({
      ...state,
      pageNumber: 1,
      status: getIds(item.status),
      priority: getIds(item.priority),
      assignToId: getOwnerIds(item.managers),
      type: getIds(item.type),
    }));

    console.log('Apply filter');
    closeFilter();
  };

  const renderFilterHeader = () => {
    return (
      <BottomSheetHeader
        title={'Ticket Filter'}
        onPressClose={() => closeFilter()}
      />
    );
  };

  // variables for bottom sheet
  const bs = React.useRef(null);
  const fall = new Animated.Value(1);
  const bsSnapPoints = ['80%', '90%', '0%'];
  const [shadow, setShadow] = useState(false);

  // return isLoading ? <RenderSpinner /> : <RenderClosedLoop />;
  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          opacity: Animated.add(0.3, Animated.multiply(fall, 1.0)),
          flex: 1,
        }}>
        <HeaderFilter
          dateRange={range}
          onPressDateRange={getDataOnNewRange}
          onPressFilter={openFilter}
        />
        {/* <ClosedLoopTicketList /> */}
        {closedLoopTicketList()}
        <FabAddButton onPress={onFabHandler} />

        {/* <TicketTakeAction /> */}
        {/* <TicketDetails /> */}
        {/* <TicketOverview /> */}
        {/* <TicketComments /> */}
        {/* <TicketActivity /> */}
        {/* <CreateTicket /> */}
        {/* <SendEmail /> */}
        {/* <TakeActionScreen /> */}
        {/* <FilterTicket
    data={filterData}
    onPressHandler={(item, action) => handleAction(item, action)}
  /> */}
      </Animated.View>
      {/* <RenderSegmentBottomSheet
        // ref={bs}
        // snapPoints={bsSnapPoints}
        callbackNode={fall}
      /> */}
      <BottomSheet
        ref={bs}
        snapPoints={bsSnapPoints}
        initialSnap={bsSnapPoints.length - 1}
        enabledGestureInteraction={true}
        renderContent={renderFilterContent}
        renderHeader={renderFilterHeader}
        callbackNode={fall}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},

  filterAndSearchBox: {
    flexDirection: 'row',

    alignItems: 'center',
    padding: PaddingConstants.halfTab,
    marginHorizontal: MarginConstants.tab1,
    backgroundColor: Colors.white,
  },

  filterBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    padding: PaddingConstants.tab1,
    margin: MarginConstants.tab1,
  },
  contentContainer: {backgroundColor: Colors.white, height: '100%'},
});
