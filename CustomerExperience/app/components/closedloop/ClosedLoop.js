import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, View, StyleSheet} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {HeaderFilter, RenderSpinner} from '../../routes/commonUI/CommonUI';
import FabAddButton from '../../routes/commonUI/FabAddButton';
import {SearchBox} from './ui/SearchBox';
import ClosedLoopTicketList from './ClosedLoopTicketList';
// Animated from react-native used above (Reanimated v3 removed Value/add/multiply)
import {useDispatch, useSelector} from 'react-redux';
import {
  getClosedLoopOwnerDetails,
  getClosedLoopTicketList,
} from '../../redux/actions/dashboard.actions';
import {convertDateToYMDFORMAT, getFilterCount, wait} from '../../Utils/TicketUtils';
import {translate} from '../../Utils/MultilinguaUtils';
import {resetDeleteTicketStatus} from '../../redux/actions/closedloop.actions';
import {useNavigation} from '@react-navigation/native';
import {showSuccessFlashMessage} from '../../Utils/Utility';
import {VerticalSpaceBox} from '../../widgets/SpaceBox';
import useTicketFilter from './hooks/useTicketFilter';

export default function ClosedLoop(props) {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {authToken, isTicketLoading, range} = useSelector(
    state => state.global,
  );
  const ticketList = useSelector(state => state.dashboard.ticketList);
  const pagerOptions = useSelector(
    state => state.dashboard.ticketDetails.pagerOptions,
  );
  const currentFeedback = useSelector(state => state.dashboard.currentFeedback);
  const currentSegment = useSelector(state => state.dashboard.currentSegment);
  const createTicketResponse = useSelector(
    state => state.dashboard.createTicketResponse,
  );
  const {ticketDeleteStatus} = useSelector(state => state.dashboard);

  const [isPagination, setIsPagination] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [showCheckBox, setShowCheckBox] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filterBottomSheetVisible, setFilterBottomSheetVisible] =
    useState(false);

  const fall = useRef(new Animated.Value(1)).current;

  const {
    filterState,
    setFilterState,
    filterData,
    searchText,
    resetFilterState,
    applyFilter,
    resetFilter,
    onResetSearch,
    submitQuery,
  } = useTicketFilter();

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
    makeAPICall();
  }, [filterState, range]);

  useEffect(() => {
    if (createTicketResponse.message) {
      showSuccessFlashMessage(createTicketResponse.message);
    }
  }, [createTicketResponse]);

  useEffect(() => {
    resetFilterState(range);
  }, [currentSegment]);

  const makeAPICall = () => {
    const filterObj = {
      ...filterState,
      fromDate: convertDateToYMDFORMAT(range.startDate),
      toDate: convertDateToYMDFORMAT(range.endDate),
    };
    getTicketList(filterObj, currentSegment.currentSegmentID);
    getTicketOwnerList(currentSegment.currentSegmentID);
  };

  const onRefresh = useCallback(() => {
    resetFilterState(range);
    setRefreshing(true);
    makeAPICall();
    wait(500).then(() => setRefreshing(false));
  }, [range]);

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
    if (ticketList.length < pagerOptions?.totalCount) {
      setIsPagination(true);
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

  const onPressHandler = (item, index) => {
    navigation.navigate('TicketDetails', {
      ticketItem: item,
      prevScreen: translate('dashboard.closed_loop'),
    });
  };

  const onFabHandler = () => {
    navigation.navigate(translate('responses.new_ticket'));
  };

  const onCloseFilter = () => {
    setFilterBottomSheetVisible(false);
  };

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
    navigation.navigate('TicketFilter', {
      data: filterData,
      onPressHandler: handleAction,
    });
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
        <VerticalSpaceBox />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.white},

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
