import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TextInput,
  RefreshControl,
  Pressable,
  Platform,
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
import {translate} from '../../Utils/MultilinguaUtils';
import QPSpinner from '../../widgets/QPSpinner';
import ShowFilterTag, {taglist} from '../view/ShowFilterTag';
import StringUtils from '../../Utils/StringUtils';
import {
  clearSyncTicketStatus,
  resetDeleteTicketStatus,
  resetStatusId,
  syncTickets,
} from '../../redux/actions/closedloop.actions';
import {baseTextStyles} from '../../styles/text.styles';
import {useNavigation} from '@react-navigation/core';
// import RenderSegmentBottomSheet from '../dashboard/RenderSegmentBottomSheet';

// const ClosedLoopTab = createMaterialTopTabNavigator();
const SearchIcon = () => {
  return <IonIcons name="search" size={20} color={Colors.evenDarkerGrey} />;
};
const SearchBox = ({onResetSearch, onQuerySubmit, currentText}) => {
  // const placeHolder = currentText.trim().length > 0 ? currentText :
  // console.log('STATE_CHANGING, ', JSON.stringify(currentText));
  // const [text, setText] = useState(currentText);

  return (
    <View style={[styles.searchBox]}>
      <SearchIcon />
      <TextInput
        defaultValue={currentText}
        placeholder={translate('ticket_search_hint')}
        style={[
          baseTextStyles.secondaryRegularText,
          {flex: 1, height: 42, margin: 0, color: Colors.filterIconColor},
        ]}
        returnKeyType={'search'}
        onSubmitEditing={event => {
          onQuerySubmit(event.nativeEvent.text);
        }}
      />
      {/* <CloseIcon onResetSearch={onResetSearch} /> */}
    </View>
  );
};

const CloseIcon = ({onResetSearch}) => {
  return (
    <Pressable onPress={onResetSearch}>
      <IonIcons
        name="close"
        size={MarginConstants.halfTab * 6}
        color={Colors.filterIconColor}
      />
    </Pressable>
  );
};

export default function ClosedLoop(props) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const itemPerPage = 20;
  const statusId = useSelector(state => state.global.statusId);
  console.log('STATUS_ID_FILTER', statusId);

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
    // showMyTickets: true,
    assignToId: JSON.stringify(userID),
    userId: JSON.stringify(userID),
    pageNumber: pageNumber,
    perPage: itemPerPage,
    fromDate: convertDateToYMDFORMAT(range.startDate),
    toDate: convertDateToYMDFORMAT(range.endDate),
    type: '',
    search: '',
  });

  console.log('STATUS_ID_FILTER_useeffect', JSON.stringify(filterState));

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
  const {ticketDeleteStatus} = useSelector(state => state.dashboard);
  const sync = () => {
    console.log('SYNC_API, api called');
    if (!isTicketLoading) {
      dispatch(
        syncTickets(
          authToken,
          {subscriberId: subscriberId, feedbackApiKey: feedbackApiKey},
          feedbackID,
        ),
      );
    }
  };

  useEffect(() => {
    if (
      ticketDeleteStatus.status &&
      ticketDeleteStatus.status.trim() === 'success'
    ) {
      dispatch(resetDeleteTicketStatus());
      onRefresh();
    }
  }, [ticketDeleteStatus]);

  useEffect(() => {
    if (keepSyncingTickets) {
      console.log('SYNC_API, when keeSyncingChanged');

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
    // const showMyTickets = true;
    const assignToId = JSON.stringify(userID);
    const userId = JSON.stringify(userID);
    return {
      priority: priority,
      status: status,
      managers: [],
      type: type,
      assignToId,
      userId,
      // showMyTickets: showMyTickets,
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

  function setStatusToFilter(data, statusId_) {
    let arr = [];
    data.map(value => {
      console.log(value);
      arr.push({...value, isChecked: value.id === statusId_});
    });
    return arr;
  }

  const filterByStatus = statusId_ => {
    let tempStatusData = [];

    filterData.status.map(value => {
      console.log('STATUS_ID_FILTER', 'STATUS OBJECT', JSON.stringify(value));
      tempStatusData.push({
        ...value,
        isChecked: value.id === parseInt(statusId_),
      });
    });

    setFilterState(state => ({
      ...state,
      status: statusId_,
    }));
    setFilterData(state => ({
      ...state,
      status: tempStatusData,
    }));
    // dispatch(resetStatusId());
  };
  useEffect(() => {
    if (statusId) {
      filterByStatus(statusId);
    }
  }, [statusId]);

  useEffect(() => {
    makeAPICall();
  }, [filterState, range]);

  useEffect(() => {
    resetFilterState(range);
  }, [currentSegment]);

  const makeAPICall = () => {
    console.log('SYNC_API, when makeAPICall called');
    if (keepSyncingTickets && !isTicketLoading) {
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
    // console.log('OWNERS', JSON.stringify(owners));
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
              // onLongPressHandler={() => onLongPressHandler(item, index)}
            />
          );
        }}
      />
    );
  };

  const onResetSearch = useCallback(() => {
    if (searchText.trim().length > 0) {
      setSearchText('');
      setFilterState(prev => ({...prev, search: ''}));
      // console.log('RESET_SEARCH', JSON.stringify(''));
    } else {
      setSearchVisibility(false);
    }
  }, [searchText]);

  const onPressHandler = (item, index) => {
    // console.log(`onPressHandler`);
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

    navigation.navigate('TicketDetails', {
      ticketItem: item,
      prevScreen: translate('dashboard.closed_loop'),
    });
  };
  const onLongPressHandler = (item, index) => {
    // console.log(`onLongPressHandler`);
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
    navigation.navigate(translate('responses.new_ticket'));
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

    // console.log('StatusParam: ', JSON.stringify(item));
    // setTicketList([]);
    setFilterState(state => ({
      ...state,
      pageNumber: 1,
      status: getIds(item.status) ?? '',
      priority: getIds(item.priority) ?? '',
      assignToId: item.assignToId,
      type: getIds(item.type) ?? '',
      // showMyTickets: item.showMyTickets,
    }));

    // console.log('Apply filter');
    closeFilter();
  };

  const renderFilterHeader = () => {
    return (
      <BottomSheetHeader
        title={translate('ticket_overview.filter_ticket')}
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
    setSearchText(text);
    setFilterState(prev => ({...prev, search: text}));
    // console.log('KEYBOARD_SEARCH', JSON.stringify(text));
  }, []);

  const toogleSearchView = useCallback(() => {
    setSearchVisibility(state => !state);
  }, []);

  const getFilterCount = filterState => {
    let count = 0;
    for (let tag of taglist) {
      if (filterState.hasOwnProperty(tag) && filterState[tag]) {
        console.log('TAG_ITEM_COUNT', tag, filterState[tag]);
        if (filterState[tag].length > 0) {
          count++;
        }
      }
    }

    return count;
  };

  const RenderClosedLoop = () => {
    return (
      <View style={styles.container}>
        <Animated.View
          style={{
            opacity: Animated.add(0.3, Animated.multiply(fall, 1.0)),
            flex: 1,
          }}>
          <HeaderFilter
            style={{justifyContent: 'space-between'}}
            dateRange={range}
            onPressDateRange={getDataOnNewRange}
            onPressFilter={openFilter}
            filterCount={getFilterCount(filterState)}
          />
          {/* {!isSearchVisible && (
              <Pressable
                style={{marginHorizontal: MarginConstants.tab1}}
                onPress={() => setSearchVisibility(true)}>
                <SearchIcon />
              </Pressable>
            )} */}

          {/* <ClosedLoopTicketList /> */}
          {/* <ShowFilterTag
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
            }}
          /> */}
          {true && (
            <SearchBox
              onResetSearch={onResetSearch}
              onQuerySubmit={submitQuery}
              currentText={searchText}
            />
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

  flatList: {
    flex: 1,
    marginHorizontal: MarginConstants.tab1,
    padding: MarginConstants.halfTab,
  },

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
    marginVertical: MarginConstants.tab1,
    marginHorizontal: MarginConstants.tab2,
    paddingHorizontal: MarginConstants.tab1,
    paddingVertical: Platform.OS === 'ios' ? MarginConstants.halfTab : 0,
    borderBottomWidth: 0.5,
    borderColor: Colors.filterIconColor,
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
