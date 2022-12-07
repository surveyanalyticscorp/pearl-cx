import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import ClosedLoopCell from './ClosedloopCell';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../styles/color.constants';

import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {
  BottomSheetHeader,
  FabAddButton,
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
import {showLoading} from '../../redux/actions';
import {useIsFocused} from '@react-navigation/native';
import {
  priorityList,
  statusList,
  ticketTypeList,
} from '../../Utils/TicketUtils';

// const ClosedLoopTab = createMaterialTopTabNavigator();

export default function ClosedLoop(props) {
  const dispatch = useDispatch();
  const {authToken, range, isLoading} = useSelector((state) => state.global);
  const [filterState, setFilterState] = useState({
    status: '',
    priority: '',
    assignToId: '',
    pageNumber: 1,
    perPage: 20,
    fromDate: moment(range.startDate, DMYFORMAT).format(YMDFORMAT),
    toDate: moment(range.endDate, DMYFORMAT).format(YMDFORMAT),
    type: '',
  });
  const ticketDetails = useSelector((state) => state.dashboard.ticketDetails);
  // const state = useSelector((state) => state.dashboard);
  const currentFeedback = useSelector(
    (state) => state.dashboard.currentFeedback,
  );
  const currentSegment = useSelector((state) => state.dashboard.currentSegment);
  const [ticketList, setTicketList] = useState([]);
  const [owners, setOwners] = useState(
    useSelector((state) => state.dashboard.ownerDetails.owners ?? []),
  );
  const [refreshing, setRefreshing] = useState(false);

  const isFocused = useIsFocused();
  useEffect(() => {
    getTicketList(filterState);
    getTicketOwnerList(currentSegment.currentSegmentID);
  }, [isFocused, filterState, currentSegment]);

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getTicketList(filterState);
    wait(500).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    setTicketList((state) => ticketDetails.data ?? []);
  }, [ticketDetails]);

  // console.log('Ticket list: ', JSON.stringify(ticketDetails.data));

  const sampleFilterData = () => {
    const priority = priorityList.map((value) => ({
      ...value,
      isChecked: false,
    }));
    const status = statusList.map((value) => ({...value, isChecked: false}));
    const type = ticketTypeList.map((value) => ({...value, isChecked: false}));
    const managers = owners;
    console.log('OWNERS', JSON.stringify(owners));
    return {
      priority: priority,
      status: status,
      selectedManager: [],
      managers: managers,
      type: type,
    };
  };

  const [filterData, setFilterData] = useState(sampleFilterData());

  const getTicketList = (filterState_) => {
    dispatch(showLoading(true));
    // setRefreshing(true);

    dispatch(
      getClosedLoopTicketList(
        authToken,
        filterState_,
        currentFeedback.feedbackID,
        currentSegment.currentSegmentID,
      ),
    );

    dispatch(
      getClosedLoopOwnerDetails(authToken, {
        segmentID: currentSegment.currentSegmentID,
      }),
    );
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

  const getFilterIcon = () => {
    return (
      <TouchableOpacity onPress={() => openFilter()}>
        <IonIcons name="funnel" size={20} color={Colors.lightBlack} />
      </TouchableOpacity>
    );
  };

  const HeaderFilter = () => {
    return (
      <View style={styles.filterAndSearchBox}>
        {getFilterIcon()}
        {getFilterDateBox()}
        {/* <View
          style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
          {getSearchIcon()}
        </View> */}
      </View>
    );
  };
  const getDateText = (dateRange) => {
    const sDate = moment(dateRange.startDate, DMYFORMAT).format(
      HalfMonthDateYearFormat,
    );
    const eDate = moment(dateRange.endDate, DMYFORMAT).format(
      HalfMonthDateYearFormat,
    );
    return (
      <Text style={{margin: MarginConstants.halfTab, color: Colors.lightBlack}}>
        {`${sDate} - ${eDate}`}
      </Text>
    );
  };

  const getDateIcon = () => {
    return (
      <IonIcons
        style={{margin: MarginConstants.halfTab}}
        name="calendar"
        size={20}
        color={Colors.lightBlack}
      />
    );
  };

  const handleDateFilter = () => {
    console.log('date filter');
  };

  const getFilterDateBox = () => {
    return (
      <TouchableOpacity onPress={handleDateFilter}>
        <View style={styles.filterBox}>
          {getDateText(range)}
          {getDateIcon()}
        </View>
      </TouchableOpacity>
    );
  };

  const ClosedLoopTicketList = () => {
    return ticketList.length !== 0 ? (
      <FlatList
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        }
        style={styles.container}
        data={ticketList}
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
    ) : (
      <NoItemsFound>No tickets found</NoItemsFound>
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

  const getOwnerIds = (items) => items.map((owner) => owner.ownerID).toString();

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
    setFilterState((state) => ({
      ...state,
      status: getIds(item.status),
      priority: getIds(item.priority),
      assignToId: getOwnerIds(item.selectedManager),
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

  const RenderClosedLoop = () => {
    return (
      <View style={styles.container}>
        <Animated.View
          style={{
            opacity: Animated.add(0.3, Animated.multiply(fall, 1.0)),
            flex: 1,
          }}>
          <HeaderFilter />
          <ClosedLoopTicketList />
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
        <BottomSheet
          ref={bs}
          snapPoints={bsSnapPoints}
          initialSnap={bsSnapPoints.length - 1}
          enabledGestureInteraction={true}
          renderContent={renderFilterContent}
          renderHeader={renderFilterHeader}
          callbackNode={fall}
          onCloseEnd={() => setShadow(false)}
          onOpenStart={() => setShadow(true)}
        />
      </View>
    );
  };

  return isLoading ? <RenderSpinner /> : <RenderClosedLoop />;
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
