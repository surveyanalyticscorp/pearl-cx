import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {MarginConstants} from '../../styles/margin.constants';
import {Colors} from '../../styles/color.constants';
import {clearError, setError, setRangeFilter} from '../../redux/actions';
import {connect, useDispatch, useSelector} from 'react-redux';
import QPSpinner from '../../widgets/QPSpinner';
import {usePrevious} from '../../Utils/Utility';
import ArrayUtils from '../../Utils/ArrayUtils';
import {TextSizes} from '../../styles/textsize.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import moment from 'moment';
import {DMYFORMAT, YMDFORMAT} from '../../Utils/AppConstants';
import SafeAreaView from 'react-native-safe-area-view';
import {FontFamily} from '../../styles/font.constants';
import {translate} from '../../Utils/MultilinguaUtils';
import {HeaderFilter} from '../../routes/commonUI/CommonUI';
import BottomSheetHeader from '../../routes/commonUI/BottomSheetHeader';
import Animated from 'react-native-reanimated';
import {
  fetchAllResponses,
  setAllResponsesEmpty,
  setResponseReadList,
} from '../../redux/actions/feedback.actions';
import SelectSorting from '../closedloop/takeaction/SelectSorting';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {ASYNC_RESPONSES_WITH_CX_MANAGER} from '../../api/Constant';
import Responses from './Responses';
import QPBottomSheet from '../closedloop/takeaction/QPBottomSheet';
import QPBottomSheetHeader from '../closedloop/takeaction/QPBottomSheetHeader';
const FormContext = React.createContext();

const SortingBottomSheet = ({
  onClose,
  isVisible,
  sortingText,
  setSortingText,
  sortingList,
}) => {
  return (
    <QPBottomSheet
      visible={isVisible}
      onClose={onClose}
      headerComponent={
        <QPBottomSheetHeader headerLabel="Status" onClose={onClose} />
      }>
      <SelectSorting
        data={sortingList}
        selectedIndex={sortingText['index']}
        handleOnPress={(item, index) => {
          setSortingText(sortingList[index].title, index);
          onClose();
        }}
      />
    </QPBottomSheet>
  );
};

function Feedback(props) {
  let dispatch = useDispatch();
  const {getItem} = useAsyncStorage(ASYNC_RESPONSES_WITH_CX_MANAGER);
  const allResponses = useSelector(state => state.response.allResponses);

  let currentSegment = useSelector(state => state.dashboard.currentSegment);
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
  const fall = new Animated.Value(1);

  const [sortingBottomSheetVisible, setSortingBottomSheetVisible] =
    useState(false);
  const asyncGetResponseIDs = async () => {
    try {
      let resIds = JSON.parse(await getItem());
      console.log(ASYNC_RESPONSES_WITH_CX_MANAGER, 'data', resIds);

      dispatch(setResponseReadList(resIds !== null ? resIds : []));
    } catch (e) {
      console.log(ASYNC_RESPONSES_WITH_CX_MANAGER, 'CATCH', e);
    }
  };

  const openSortingBottomSheet = useCallback(() => {
    setSortingBottomSheetVisible(true);
  }, []);

  const closeSortingBottomSheet = useCallback(() => {
    setSortingBottomSheetVisible(false);
  }, []);

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
    setPageOffset(state => state + 1);
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
          onPressFilter={openSortingBottomSheet}
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

      <SortingBottomSheet
        isVisible={sortingBottomSheetVisible}
        onClose={closeSortingBottomSheet}
        sortingText={sortingText}
        setSortingText={setSortText}
        sortingList={sortingList}
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
