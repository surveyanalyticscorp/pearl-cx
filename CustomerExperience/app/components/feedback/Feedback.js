import React, {useContext, useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';

import {MarginConstants} from '../../styles/margin.constants';
import {Colors} from '../../styles/color.constants';
import {clearError, setError, setRangeFilter} from '../../redux/actions';
import {connect, useDispatch, useSelector} from 'react-redux';
import QPSpinner from '../../widgets/QPSpinner';
import {showErrorFlashMessage, usePrevious} from '../../Utils/Utility';
import ArrayUtils from '../../Utils/ArrayUtils';
import {TextSizes} from '../../styles/textsize.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import moment from 'moment';
import {DMYFORMAT, YMDFORMAT} from '../../Utils/AppConstants';
import SafeAreaView from 'react-native-safe-area-view';
import {apiHandler} from '../../api/ApiHandler';
import {FontFamily} from '../../styles/font.constants';
import {Sizes} from '../../styles/Size.constant';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {dashboardStyles} from '../dashboard/dashboard.style';
import {translate} from '../../Utils/MultilinguaUtils';
import {HeaderFilter} from '../../routes/commonUI/CommonUI';
import BottomSheetHeader from '../../routes/commonUI/BottomSheetHeader';
import FabAddButton from '../../routes/commonUI/FabAddButton';
import Animated from 'react-native-reanimated';
import {useIsFocused} from '@react-navigation/native';
import {
  clearResponseData,
  fetchAllResponses,
  setAllResponsesEmpty,
  setResponseReadList,
} from '../../redux/actions/feedback.actions';
import SelectSorting from '../closedloop/takeaction/SelectSorting';
import BottomSheet from 'reanimated-bottom-sheet';
import {last} from 'lodash';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {ASYNC_RESPONSES_WITH_CX_MANAGER} from '../../api/Constant';
import Responses from './Responses';
import NoResponsesFound from './NoResponsesFound';
import FeedbackCell from './feedbackCell/FeedbackCells';
const FeedbackTab = createMaterialTopTabNavigator();
const FormContext = React.createContext();

function Feedback(props) {
  let dispatch = useDispatch();
  const {getItem} = useAsyncStorage(ASYNC_RESPONSES_WITH_CX_MANAGER);
  const allResponses = useSelector(state => state.response.allResponses);

  let currentSegment = useSelector(state => state.dashboard.currentSegment);
  let [feedbackData, setFeedbackData] = useState(allResponses);
  let [ticketStatus, setTicketStatus] = useState([]);
  let [pageOffset, setPageOffset] = useState(0);
  let [pagination, setPagination] = useState(false);
  let [showLoader, setShowLoader] = useState(false);

  let [sortingText, setSortingText] = useState({label: 'Date', index: 0});

  let prevRangeRef = usePrevious(props.range);
  let sortingAttribute = ['Date', 'Score', 'Segment', 'Email'];

  const sortingList = [
    {id: 0, title: 'Date'},
    {id: 1, title: 'Score'},
    {id: 2, title: 'Segment'},
    {id: 3, title: 'Email'},
  ];
  const [currentSortingIndex, setCurrentIndex] = useState(0);

  // sorting bottom sheet stuff
  const fall = new Animated.Value(1);
  const sortingBottomSheet = React.useRef();
  const sortingBottomSheetSnapPoints = ['45%', '0%'];

  const asyncGetResponseIDs = async () => {
    try {
      let resIds = JSON.parse(await getItem());
      console.log(ASYNC_RESPONSES_WITH_CX_MANAGER, 'data', resIds);

      dispatch(setResponseReadList(resIds !== null ? resIds : []));
    } catch (e) {
      console.log(ASYNC_RESPONSES_WITH_CX_MANAGER, 'CATCH', e);
    }
  };

  const openSortingBottomSheet = () => {
    sortingBottomSheet.current.snapTo(0);
  };
  const closeSortingBottomSheet = () => {
    sortingBottomSheet.current.snapTo(sortingBottomSheetSnapPoints.length - 1);
  };

  const renderSortingHeader = _title => {
    return (
      <BottomSheetHeader
        title={translate('responses.sort_by')}
        onPressClose={closeSortingBottomSheet}
      />
    );
  };

  const renderSortingSelectContent = () => {
    return (
      <View style={styles.contentContainer}>
        <SelectSorting
          data={sortingList}
          selectedIndex={currentSortingIndex}
          handleOnPress={(item, index) => {
            setSortText(sortingList[index].title, index);
            closeSortingBottomSheet();
          }}
        />
      </View>
    );
  };

  const onSuccess = success => {
    setShowLoader(false);
    setPagination(false);
  };
  const onError = error => {
    setShowLoader(false);
    setPagination(false);

    console.log('FEEDBACK/Responses list data error', JSON.stringify(error));
  };
  let getFeedbackData = () => {
    /**
     * To avoid multiple API calls for each tab
     * */
    asyncGetResponseIDs();
    if (showLoader || pagination) {
      const data = {
        pageOffset: pageOffset,
        sentiment: 'All',
        storeId: currentSegment.currentSegmentID,
        startDate: moment(props.range.startDate, DMYFORMAT).format(YMDFORMAT),
        endDate: moment(props.range.endDate, DMYFORMAT).format(YMDFORMAT),
        filterText: sortingText.label.toLowerCase(),
      };
      console.log(
        'SEGMENT_ON_RESPONSE:',

        JSON.stringify(data),
      );

      dispatch(fetchAllResponses(props.authToken, data, onSuccess, onError));
    }
  };

  useEffect(() => {
    setShowLoader(true);
  }, []);

  useEffect(() => {
    if (pageOffset === 0) {
      ArrayUtils.isNotEmpty(allResponses) && dispatch(setAllResponsesEmpty());
    } else {
      getFeedbackData();
    }
  }, [pageOffset]);

  useEffect(() => {
    showLoader && getFeedbackData();
  }, [showLoader]);

  useEffect(() => {
    console.log('CURRENT_SEGMENT: ', JSON.stringify(currentSegment));
    setShowLoader(true);
    if (prevRangeRef && prevRangeRef !== props.range) {
      if (pageOffset === 0) {
        dispatch(setAllResponsesEmpty());
      } else {
        setPageOffset(0);
      }
    }
  }, [props.range]);

  useEffect(() => {
    dispatch(setAllResponsesEmpty());

    setPageOffset(0);
    setShowLoader(true);
  }, [currentSegment, sortingText.label]);

  useEffect(() => {
    getFeedbackData();
  }, [pagination]);

  let onEndReached = () => {
    setPagination(state => !state);
    setPageOffset(pageOffset + 1);
  };

  let onRefresh = () => {
    setShowLoader(true);
    if (pageOffset === 0) {
      dispatch(setAllResponsesEmpty());
    } else {
      setPageOffset(0);
    }
  };

  let setSortText = (text, index) => {
    setSortingText({label: text, index: index});
  };

  let renderSpinner = () => {
    return (
      <View style={styles.loading}>
        <QPSpinner />
      </View>
    );
  };

  const dateRangeHandler = range_ => {
    dispatch(setRangeFilter(range_));
    // setFeedbackData([]);
    dispatch(setAllResponsesEmpty());
    setPageOffset(0);
    setShowLoader(true);
  };

  const filterHandler = () => {
    openSortingBottomSheet();
  };

  return (
    <SafeAreaView
      testID="safe-area-view"
      forceInset={{top: 'never', bottom: 'never'}}
      style={styles.safeAreaView}>
      <Animated.View
        style={[
          styles.safeAreaView,
          {opacity: Animated.add(0.3, Animated.multiply(fall, 1.0))},
        ]}>
        <HeaderFilter
          testID="header-filter"
          onPressDateRange={dateRangeHandler}
          onPressFilter={filterHandler}
          hasSortIcon={true}
          hasFilterIcon={false}
        />
        <View
          style={{
            marginHorizontal: '0%',
            marginVertical: '0%',
            backgroundColor: Colors.fullTransparent,
          }}></View>
        <FormContext.Provider
          value={{
            ticketStatus: ticketStatus,
            feedbackData: [],
            onFeedbackEndReached: onEndReached,
            onRefresh: onRefresh,
            range: props.range,
            token: props.authToken,
            sortingText: sortingText.label,
            setSortingText: setSortText,
            isLoading: showLoader,
          }}>
          <Responses
            testID={'responses-component'}
            onRefresh={onRefresh}
            isLoading={showLoader}
            onEndReached={onEndReached}
          />
        </FormContext.Provider>
        {showLoader && renderSpinner()}
      </Animated.View>
      <BottomSheet
        testID="sorting-bottom-sheet"
        ref={sortingBottomSheet}
        snapPoints={sortingBottomSheetSnapPoints}
        initialSnap={sortingBottomSheetSnapPoints.length - 1}
        enabledGestureInteraction={true}
        renderContent={renderSortingSelectContent}
        renderHeader={renderSortingHeader}
        callbackNode={fall}
      />
    </SafeAreaView>
  );
}

const mapStateToProps = state => {
  return {
    isError: state.global.isError,
    errorMessage: state.global.errorMessage,
    authToken: state.global.authToken,
    range: state.global.range,
  };
};

const mapDispatchToProps = dispatch => ({
  setError: error => {
    dispatch(setError(error));
  },
  clearError: () => {
    dispatch(clearError(false));
  },
  setRange: range => {
    dispatch(setRangeFilter(range));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  container: {
    marginTop: MarginConstants.tab1,
  },
  emptyView: {
    flex: 1,
    marginTop: MarginConstants.tab3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  emptyText: {
    color: Colors.primary,
    fontSize: TextSizes.primary,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterView: {
    marginVertical: MarginConstants.halfTab,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.tab1,
    flexDirection: 'row',
  },
  filterText: {
    color: Colors.accent,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.primary,
    textAlign: 'center',
    paddingHorizontal: PaddingConstants.halfTab,
  },
  contentContainer: {
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    height: '100%',
  },
});
