import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TextInput,
  RefreshControl,
  Pressable,
} from 'react-native';
import ClosedLoopCell from './ClosedloopCell';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../styles/color.constants';

import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {
  BottomSheetHeader,
  FabAddButton,
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
import {DMYFORMAT, YMDFORMAT} from '../../Utils/AppConstants';
import {setRangeFilter} from '../../redux/actions';

import {
  priorityList,
  statusList,
  ticketTypeList,
} from '../../Utils/TicketUtils';
// import {translate} from '../../Utils/MultilinguaUtils';
import QPSpinner from '../../widgets/QPSpinner';
import ShowFilterTag from '../view/ShowFilterTag';
import StringUtils from '../../Utils/StringUtils';
import {
  clearSyncTicketStatus,
  resetStatusId,
  syncTickets,
} from '../../redux/actions/closedloop.actions';
// import RenderSegmentBottomSheet from '../dashboard/RenderSegmentBottomSheet';

// const ClosedLoopTab = createMaterialTopTabNavigator();
const SearchIcon = () => {
  return (
    <IonIcons
      name="search"
      size={MarginConstants.halfTab * 7}
      color={Colors.lightBlack}
    />
  );
};
const SearchBox = ({onQuerySubmit, currentText}) => {
  return (
    <View style={[styles.searchBox, styles.rowItem]}>
      <SearchIcon />
      <TextInput
        placeholder="Search by ID"
        style={styles.titleText}
        returnKeyType={'search'}
        onSubmitEditing={event => {
          onQuerySubmit(event.nativeEvent.text);

          // onChangeCommentHandler(event.nativeEvent.text);
          // handleOnSubmit();
        }}
      />
    </View>
  );
};

export default function ClosedLoop(props) {
  const dispatch = useDispatch();
  const itemPerPage = 20;
  const {statusId} = useSelector(state => state.global);

  const [pageNumber, setPageNumber] = useState(1);
  const {feedbackApiKey, feedbackID, userID} = useSelector(
    state => state.global.userInfo,
  );
  // const [isLoading, setLoading] = useState(false);
  const [isPagination, setpagination] = useState(false);
  const {authToken, isTicketLoading, range, subscriberId} = useSelector(
    state => state.global,
  );
  const [isSearchVisible, setSearchVisibility] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [filterState, setFilterState] = useState({
    feedbackApiKey: feedbackApiKey,
    status: '',
    priority: '',
    assignToId: JSON.stringify(userID),
    pageNumber: pageNumber,
    perPage: itemPerPage,
    fromDate: convertDateToYMDFORMAT(range.startDate),
    toDate: convertDateToYMDFORMAT(range.endDate),
    type: '',
  });

  function convertDateToYMDFORMAT(date) {
    return moment(date, DMYFORMAT).format(YMDFORMAT);
  }
  // const ticketDetails = useSelector((state) => state.dashboard.ticketDetails);
  const ticketList = useSelector(state => state.dashboard.ticketList);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [showCheckBox, setShowCheckBox] = useState(false);

  const pagerOptions = useSelector(
    state => state.dashboard.ticketDetails.pagerOptions,
  );
  const currentFeedback = useSelector(state => state.dashboard.currentFeedback);
  const currentSegment = useSelector(state => state.dashboard.currentSegment);

  // const [ticketList, setTicketList] = useState([]);
  const owners = useSelector(state => state.dashboard.ownerDetails.owners);
  const keepSyncingTickets = useSelector(state => state.dashboard.ticketSync);
  const [refreshing, setRefreshing] = useState(false);
  const sync = () => {
    dispatch(
      syncTickets(
        authToken,
        {subscriberId: subscriberId, feedbackApiKey: feedbackApiKey},
        feedbackID,
      ),
    );
  };
  useEffect(() => {
    if (keepSyncingTickets) {
      sync();
    }
  }, [keepSyncingTickets]);
  const sampleFilterData = () => {
    const priority = priorityList.map(value => ({
      ...value,
      isChecked: false,
    }));
    const status = statusList.map(value => ({...value, isChecked: false}));
    const type = ticketTypeList.map(value => ({...value, isChecked: false}));
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

  const resetFilterState = range_ => {
    // setTicketList([]);
    setPageNumber(1);
    setFilterState(state => ({
      ...state,
      pageNumber: pageNumber,
      fromDate: moment(range_.startDate, DMYFORMAT).format(YMDFORMAT),
      toDate: moment(range_.endDate, DMYFORMAT).format(YMDFORMAT),
    }));
  };

  let getDataOnNewRange = range_ => {
    dispatch(setRangeFilter(range_));
    // reset pageNumber, ticket list, range

    resetFilterState(range_);
  };

  const filterByStatus = () => {
    if (StringUtils.isNotEmpty(statusId)) {
      setFilterState(state => ({
        ...state,
        status: statusId,
      }));
      dispatch(resetStatusId());
    }
  };
  useEffect(() => {
    filterByStatus();
  }, [statusId]);

  useEffect(() => {
    makeAPICall();
  }, [filterState]);

  useEffect(() => {
    resetFilterState(range);
  }, [currentSegment]);

  const makeAPICall = () => {
    // setLoading(true);
    if (keepSyncingTickets) {
      sync();
    }

    let filterObj = {
      ...filterState,
      fromDate: convertDateToYMDFORMAT(range.startDate),
      toDate: convertDateToYMDFORMAT(range.endDate),
    };

    getTicketList(filterObj, currentSegment.currentSegmentID);
    getTicketOwnerList(currentSegment.currentSegmentID);
    // dispatch(clearSyncTicketStatus());
  };

  const resetSyncTicket = () => {
    dispatch(clearSyncTicketStatus());
  };
  const wait = timeout => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  };
  const onRefresh = useCallback(() => {
    // setFilterState((state) => ({...state, pageNumber: 1}));
    // setTicketList([]);
    resetFilterState(range);
    setRefreshing(true);
    resetSyncTicket();
    makeAPICall();
    wait(500).then(() => setRefreshing(false));
  }, []);

  // useEffect(() => {
  //   updateTicketList();
  // }, [ticketDetails.data]);

  // const updateTicketList = () => {
  //   setLoading(false);
  //   setTicketList((state) =>
  //     getUniqueValues([...state, ...(ticketDetails.data ?? [])], 'id'),
  //   );
  // };

  // console.log('Ticket list: ', JSON.stringify(ticketDetails.data));
  useEffect(() => {
    updateFilterData();
  }, [owners]);

  const updateFilterData = () => {
    if (owners && owners.length > 0) {
      const managers = owners.map(value => ({...value, isChecked: false}));

      setFilterData(state => ({...state, managers: managers}));
    } else {
      setFilterData(state => ({...state, managers: []}));
    }
    console.log('OWNERS', JSON.stringify(owners));
  };
  // useEffect(() => {}, []);

  const getTicketList = (filterState_, currentSegmentId) => {
    // setRefreshing(true);

    // dispatch(showLoading(true));
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
    if (ticketList.length < pagerOptions.totalCount) {
      setpagination(true);
      setFilterState(state => ({
        ...state,
        pageNumber: state.pageNumber + 1,
      }));
    }
  };
  const getTicketOwnerList = segmentId_ => {
    dispatch(
      getClosedLoopOwnerDetails(authToken, {
        segmentID: segmentId_,
      }),
    );
  };

  const closedLoopTicketList = () => {
    return (
      <FlatList
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        }
        style={styles.flatList}
        data={ticketList}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.25}
        ListFooterComponent={isPagination ? <QPSpinner /> : <View />}
        extraData={[ticketList]}
        ListEmptyComponent={
          !isTicketLoading && !isPagination ? (
            <NoItemsFound>No tickets found</NoItemsFound>
          ) : (
            <View />
          )
        }
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => {
          return (
            <ClosedLoopCell
              data={item}
              index={index}
              showCheckBox={showCheckBox}
              isSelected={selectedTickets.includes(item.id)}
              onPressHandler={() => onPressHandler(item, index)}
              onLongPressHandler={() => onLongPressHandler(item, index)}
            />
          );
        }}
      />
    );
  };

  const onPressHandler = (item, index) => {
    console.log(`onPressHandler`);
    if (showCheckBox) {
      if (selectedTickets.includes(item.id)) {
        setSelectedTickets(selectedTickets.filter(id => id !== item.id));
      } else {
        setSelectedTickets(prevSelectedTickets => [
          ...prevSelectedTickets,
          item.id,
        ]);
      }
      return;
    }

    props.navigation.navigate('TicketDetails', item);
  };
  const onLongPressHandler = (item, index) => {
    console.log(`onLongPressHandler`);
    if (showCheckBox) {
      setSelectedTickets([]);
      setShowCheckBox(false);
      return;
    }
    if (selectedTickets.includes(item.id)) {
      setSelectedTickets(selectedTickets.filter(id => id !== item.id));
    } else {
      setSelectedTickets([...selectedTickets, item.id]);
    }
    setShowCheckBox(true);
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

  const getIds = items =>
    items
      .filter(item => item.isChecked === true)
      .map(id => id.id)
      .toString();

  const getOwnerIds = items =>
    items
      .filter(item => item.isChecked === true)
      .map(owner => owner.ownerID)
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

  const applyFilter = item => {
    setFilterData(item);

    console.log('StatusParam: ', JSON.stringify(item));
    // setTicketList([]);
    setFilterState(state => ({
      ...state,
      pageNumber: 1,
      status: getIds(item.status) ?? '',
      priority: getIds(item.priority) ?? '',
      assignToId: getOwnerIds(item.managers) ?? '',
      type: getIds(item.type) ?? '',
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

  const clearFilterData = item => {
    const priority = priorityList.map(value => ({
      ...value,
      isChecked: false,
    }));
    const status = statusList.map(value => ({...value, isChecked: false}));
    const type = ticketTypeList.map(value => ({...value, isChecked: false}));
    // const managers = owners.map((value) => ({...value, isChecked: false}));

    switch (item) {
      case 'priority':
        return priorityList.map(value => ({
          ...value,
          isChecked: false,
        }));

      case 'status':
        return statusList.map(value => ({
          ...value,
          isChecked: false,
        }));

      case 'type':
        return ticketTypeList.map(value => ({
          ...value,
          isChecked: false,
        }));

      case 'assignToId':
        return [];
    }
  };

  const submitQuery = useCallback(text => {
    // submitQuery
    setSearchText(text);
    console.log('KEYBOARD_SEARCH', JSON.stringify(text));
  }, []);

  const toogleSearchView = useCallback(() => {
    setSearchVisibility(state => !state);
  }, []);

  const RenderClosedLoop = () => {
    return (
      <View style={styles.container}>
        <Animated.View
          style={{
            opacity: Animated.add(0.3, Animated.multiply(fall, 1.0)),
            flex: 1,
          }}>
          <View
            style={{
              paddingHorizontal: MarginConstants.halfTab,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: Colors.white,
            }}>
            <HeaderFilter
              dateRange={range}
              onPressDateRange={getDataOnNewRange}
              onPressFilter={openFilter}
            />
            <Pressable onPress={() => setSearchVisibility(state => !state)}>
              <SearchIcon />
            </Pressable>
          </View>

          {/* <ClosedLoopTicketList /> */}
          <ShowFilterTag
            filterData={filterState}
            handleFilterTag={item => {
              setFilterState(state => ({
                ...state,
                [item]: '',
              }));
              setFilterData(state => ({
                ...state,
                [item]: clearFilterData(item),
              }));

              console.log(`CLICKED: ${item}`);
            }}
          />
          {isSearchVisible && (
            <SearchBox onQuerySubmit={submitQuery} currentText={searchText} />
          )}
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
  };

  return isTicketLoading && !isPagination ? (
    <RenderSpinner />
  ) : (
    RenderClosedLoop()
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},

  flatList: {flex: 1, paddingBottom: MarginConstants.halfTab},

  filterAndSearchBox: {
    flexDirection: 'row',

    alignItems: 'center',
    padding: PaddingConstants.halfTab,
    marginHorizontal: MarginConstants.tab1,
    backgroundColor: Colors.white,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginVertical: MarginConstants.halfTab,
    paddingHorizontal: MarginConstants.tab1,
    borderBottomWidth: 0.5,
    borderColor: Colors.filterIconColor,
  },
  searchBoxTextInput: {
    flex: 1,
    margin: MarginConstants.halfTab,
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
