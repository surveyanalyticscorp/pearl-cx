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
import {DMYFORMAT, YMDFORMAT} from '../../Utils/AppConstants';
import {showLoading} from '../../redux/actions';
import {dashboardStyles} from '../dashboard/dashboard.style';
import QPSpinner from '../../widgets/QPSpinner';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {watchPostTicketComment} from '../../redux/sagas/ClosedLoopSaga';

// const ClosedLoopTab = createMaterialTopTabNavigator();

export default function ClosedLoop(props) {
  const dispatch = useDispatch();
  const {authToken, range, isLoading} = useSelector((state) => state.global);

  const ticketDetails = useSelector((state) => state.dashboard.ticketDetails);
  // const state = useSelector((state) => state.dashboard);
  const currentFeedback = useSelector(
    (state) => state.dashboard.currentFeedback,
  );
  const currentSegment = useSelector((state) => state.dashboard.currentSegment);
  const [ticketList, setTicketList] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  const isFocused = useIsFocused();
  useEffect(() => {
    getTicketList();
  }, [isFocused]);

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getTicketList();
    wait(500).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    setTicketList((state) => ticketDetails.data ?? []);
  }, [ticketDetails]);

  // console.log('Ticket list: ', JSON.stringify(ticketDetails.data));
  const sampleTicketList = [
    {
      customerName: 'Jassica Palm',
      ticketId: '9033212',
      npsScore: '3',
      nps: 'Detractor',
      priority: 'Normal',
      status: 'Escalated',
      date: '15 May, 2022',
      userAvatar: 'https://reactnative.dev/img/tiny_logo.png',
      messsage:
        'The manager completely botched our loan application! We were there for more than four hours trying to resolve t...',
    },
    {
      customerName: 'Jil Kirk',
      ticketId: '9033213',
      npsScore: '2',
      nps: 'Detractor',
      priority: 'Normal',
      status: 'Escalated',
      date: '15 May, 2022',
      userAvatar: 'https://reactnative.dev/img/tiny_logo.png',
      messsage:
        'The manager completely botched our loan application! We were there for more than four hours trying to resolve t...',
    },
    {
      customerName: 'Jassica Palm',
      ticketId: '9033214',
      npsScore: '2',
      nps: 'Detractor',
      priority: 'Normal',
      status: 'Escalated',
      date: '15 May, 2022',
      userAvatar: 'https://reactnative.dev/img/tiny_logo.png',
      messsage:
        'The manager completely botched our loan application! We were there for more than four hours trying to resolve t...',
    },
    {
      customerName: 'Jassica Palm',
      ticketId: '9033215',
      npsScore: '2',
      nps: 'Detractor',
      priority: 'Normal',
      status: 'Escalated',
      date: '15 May, 2022',
      userAvatar: 'https://reactnative.dev/img/tiny_logo.png',
      messsage:
        'The manager completely botched our loan application! We were there for more than four hours trying to resolve t...',
    },
  ];

  const sampleFilterData = {
    priority: [
      {title: 'Critical', isChecked: false},
      {title: 'High', isChecked: false},
      {title: 'Normal', isChecked: false},
      {title: 'Low', isChecked: false},
      {title: 'Unassigned', isChecked: false},
    ],
    status: [
      {title: 'New', isChecked: false},
      {title: 'Open', isChecked: false},
      {title: 'Escalated', isChecked: false},
      {title: 'Overdue', isChecked: false},
      {title: 'Resolved', isChecked: false},
      {title: 'Closed', isChecked: false},
    ],
    managers: [
      {
        value: 'Dummy 1',
        url: 'https://picsum.photos/id/237/200',
      },
      {
        value: 'Dummy 2',
        url: 'https://picsum.photos/id/327/200',
      },
      {
        value: 'Dummy 3',
        url: 'https://picsum.photos/id/247/200',
      },
    ],
    selectedManager: {},
  };

  const [filterData, setFilterData] = useState(sampleFilterData);
  const sampleData = {
    dateRageText: 'Nov 14, 2017 -Mar 14, 2018',
  };

  const getTicketList = () => {
    dispatch(showLoading(true));
    // setRefreshing(true);
    const params = {
      fromDate: moment(range.startDate, DMYFORMAT).format(YMDFORMAT),
      toDate: moment(range.endDate, DMYFORMAT).format(YMDFORMAT),
    };
    dispatch(
      getClosedLoopTicketList(
        authToken,
        params,
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
        <View
          style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
          {getSearchIcon()}
        </View>
      </View>
    );
  };
  const getDateText = () => {
    return (
      <Text style={{margin: MarginConstants.halfTab, color: Colors.lightBlack}}>
        {sampleData.dateRageText}
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
          {getDateText()}
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
  const bsSnapPoints = ['75%', '85%', '0%'];
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
