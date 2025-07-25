import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TextInput,
  RefreshControl,
  Platform,
} from 'react-native';
import ClosedLoopCell from './ClosedloopCell';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {HeaderFilter, RenderSpinner} from '../../routes/commonUI/CommonUI';
import FabAddButton from '../../routes/commonUI/FabAddButton';
import FilterTicket from './takeaction/FilterTickets';
import Animated from 'react-native-reanimated';
import {useDispatch, useSelector} from 'react-redux';
import {
  getClosedLoopOwnerDetails,
  getClosedLoopTicketList,
} from '../../redux/actions/dashboard.actions';
import moment from 'moment';
import {DMYFORMAT, YMDFORMAT} from '../../Utils/AppConstants';

import {
  priorityList,
  statusList,
  ticketTypeList,
} from '../../Utils/TicketUtils';
import {translate} from '../../Utils/MultilinguaUtils';
import QPSpinner from '../../widgets/QPSpinner';
import {taglist} from '../view/ShowFilterTag';
import {resetDeleteTicketStatus} from '../../redux/actions/closedloop.actions';
import {baseTextStyles} from '../../styles/text.styles';
import {useNavigation} from '@react-navigation/native';
import {NoTicketFound} from './NoTicketFound';
import {showSuccessFlashMessage} from '../../Utils/Utility';
import QPBottomSheet from './takeaction/QPBottomSheet';
import QPBottomSheetHeader from './takeaction/QPBottomSheetHeader';

export const SearchIcon = () => {
  return (
    <IonIcons
      testID="search-icon"
      name="search"
      size={20}
      color={Colors.evenDarkerGrey}
    />
  );
};
export const SearchBox = ({onResetSearch, onQuerySubmit, currentText}) => {
  return (
    <View testID="search-box" style={[styles.searchBox]}>
      <SearchIcon />
      <TextInput
        testID="search-box-input"
        defaultValue={currentText}
        placeholder={translate('ticket_search_hint')}
        placeholderTextColor={Colors.evenDarkerGrey}
        style={[
          baseTextStyles.secondaryRegularText,
          {flex: 1, height: 42, margin: 0, color: Colors.filterIconColor},
        ]}
        returnKeyType={'search'}
        onSubmitEditing={event => {
          onQuerySubmit(event.nativeEvent.text);
        }}
      />
    </View>
  );
};

export function convertDateToYMDFORMAT(date) {
  return moment(date, DMYFORMAT).format(YMDFORMAT);
}

export const getFilterCount = filterState => {
  let count = 0;
  for (let tag of taglist) {
    if (filterState.hasOwnProperty(tag) && filterState[tag]) {
      if (filterState[tag].length > 0) {
        count++;
      }
    }
  }

  return count;
};
const ClosedLoopTicketList = ({
  onPressReset,
  onRefresh,
  refreshing,
  ticketList,
  isPagination,
  isTicketLoading,
  onPressHandler,
  selectedTickets,
  showCheckBox,
  loadMoreData,
}) => {
  return (
    <FlatList
      refreshControl={
        <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
      }
      style={styles.flatList}
      contentContainerStyle={{flexGrow: 1}}
      data={ticketList}
      onEndReached={loadMoreData}
      onEndReachedThreshold={0.25}
      ListFooterComponent={isPagination ? <QPSpinner /> : <View />}
      extraData={[ticketList]}
      ListEmptyComponent={
        !isTicketLoading && !isPagination ? (
          <NoTicketFound onPressReset={onPressReset} />
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
          />
        );
      }}
    />
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
  const [isPagination, setpagination] = useState(false);
  const {authToken, isTicketLoading, range, subscriberId} = useSelector(
    state => state.global,
  );
  const [isSearchVisible, setSearchVisibility] = useState(false);
  const [searchText, setSearchText] = useState('');
  const initialFilterState = {
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
  };

  const [filterState, setFilterState] = useState(initialFilterState);

  const ticketList = useSelector(state => state.dashboard.ticketList);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [showCheckBox, setShowCheckBox] = useState(false);

  const pagerOptions = useSelector(
    state => state.dashboard.ticketDetails.pagerOptions,
  );
  const currentFeedback = useSelector(state => state.dashboard.currentFeedback);
  const currentSegment = useSelector(state => state.dashboard.currentSegment);
  const createTicketResponse = useSelector(
    state => state.dashboard.createTicketResponse,
  );
  const owners = useSelector(state => state.dashboard.ownerDetails.owners);
  const [refreshing, setRefreshing] = useState(false);
  const {ticketDeleteStatus} = useSelector(state => state.dashboard);

  useEffect(() => {
    if (
      ticketDeleteStatus.status &&
      ticketDeleteStatus.status.trim() === 'success'
    ) {
      dispatch(resetDeleteTicketStatus());
      onRefresh();
    }
  }, [ticketDeleteStatus]);

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
    };
  };

  const [filterData, setFilterData] = useState(sampleFilterData());

  const resetFilterState = range_ => {
    setPageNumber(1);
    setFilterState(state => ({
      ...state,
      pageNumber: pageNumber,
      fromDate: moment(range_.startDate, DMYFORMAT).format(YMDFORMAT),
      toDate: moment(range_.endDate, DMYFORMAT).format(YMDFORMAT),
    }));
  };

  const filterByStatus = statusId_ => {
    let tempStatusData = [];

    filterData.status.map(value => {
      // console.log('STATUS_ID_FILTER', 'STATUS OBJECT', JSON.stringify(value));
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
  };
  useEffect(() => {
    if (statusId) {
      filterByStatus(statusId);
    }
  }, [statusId]);

  useEffect(() => {
    makeAPICall();
    if (createTicketResponse.message) {
      showSuccessFlashMessage(createTicketResponse.message);
    }
  }, [filterState, range, createTicketResponse]);

  useEffect(() => {
    resetFilterState(range);
  }, [currentSegment]);

  const makeAPICall = () => {
    let filterObj = {
      ...filterState,
      fromDate: convertDateToYMDFORMAT(range.startDate),
      toDate: convertDateToYMDFORMAT(range.endDate),
    };

    getTicketList(filterObj, currentSegment.currentSegmentID);
    getTicketOwnerList(currentSegment.currentSegmentID);
  };

  const wait = timeout => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  };
  const onRefresh = useCallback(() => {
    resetFilterState(range);
    setRefreshing(true);
    makeAPICall();
    wait(500).then(() => setRefreshing(false));
  }, []);

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
  };

  const getTicketList = (filterState_, currentSegmentId) => {
    dispatch(
      getClosedLoopTicketList(
        authToken,
        filterState_,
        currentFeedback.feedbackID,
        currentSegmentId,
      ),
    );
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

  const onResetSearch = useCallback(() => {
    setSearchText('');
    setFilterState(prev => ({...prev, search: ''}));
    console.log('RESET_SEARCH', JSON.stringify(''));
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
    onCloseFilter();
    switch (action) {
      case 'apply':
        applyFilter(item);
        break;
      default:
        break;
    }
  };

  const openFilter = () => {
    // bs.current.snapTo(0);
    setFilterBottomSheetVisible(true);
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
  };

  // variables for bottom sheet
  const bs = React.useRef(null);
  const fall = new Animated.Value(1);

  const bsSnapPoints = ['64%', '0%'];
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

  const submitQuery = useCallback(searchText => {
    setSearchText(searchText);
    setFilterState(prev => ({...prev, search: searchText}));
    console.log('KEYBOARD_SEARCH', JSON.stringify({searchText, filterState}));
  }, []);

  const resetFilter = useCallback(() => {
    setFilterState(initialFilterState);
    setFilterData(sampleFilterData());
    setSearchText(initialFilterState.search);
  }, []);

  const [filterBottomSheetVisible, setFilterBottomSheetVisible] =
    useState(false);
  const onCloseFilter = () => {
    setFilterBottomSheetVisible(false);
  };
  return isTicketLoading && !isPagination ? (
    <RenderSpinner />
  ) : (
    <View testID="closed-loop-container" style={styles.container}>
      <Animated.View
        style={{
          opacity: Animated.add(0.3, Animated.multiply(fall, 1.0)),
          flex: 1,
        }}>
        <HeaderFilter
          style={{justifyContent: 'space-between'}}
          onPressFilter={openFilter}
          filterCount={getFilterCount(filterState)}
        />

        {ticketList.length > 0 ? (
          <SearchBox
            onResetSearch={onResetSearch}
            onQuerySubmit={submitQuery}
            currentText={searchText}
          />
        ) : null}

        <ClosedLoopTicketList
          onPressReset={resetFilter}
          onRefresh={onRefresh}
          refreshing={refreshing}
          ticketList={ticketList}
          isPagination={isPagination}
          isTicketLoading={isTicketLoading}
          onPressHandler={onPressHandler}
          selectedTickets={selectedTickets}
          showCheckBox={showCheckBox}
          loadMoreData={loadMoreData}
        />
        <FabAddButton onPress={onFabHandler} />
      </Animated.View>

      <RenderFilterBottomSheet
        filterData={filterData}
        visible={filterBottomSheetVisible}
        onClose={onCloseFilter}
        onPressHandler={handleAction}
      />
    </View>
  );
}

const RenderFilterBottomSheet = ({
  filterData,
  visible,
  onClose,
  onPressHandler,
}) => {
  return (
    <QPBottomSheet
      visible={visible}
      onClose={onClose}
      bottomSheetHeight="60%"
      headerComponent={
        <QPBottomSheetHeader
          headerLabel={translate('ticket_overview.filter_ticket')}
          onClose={onClose}
        />
      }>
      <FilterTicket data={filterData} onPressHandler={onPressHandler} />
    </QPBottomSheet>
  );
};

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
