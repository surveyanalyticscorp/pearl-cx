import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  getClosedLoopSegmentDetails,
  // setSegment,
  // setSegmentSelectorOpen,
} from '../redux/actions/dashboard.actions';
import {CloseButton} from '../routes/CommonScreen';
import {Colors} from '../styles/color.constants';
import {FontFamily} from '../styles/font.constants';
import {MarginConstants} from '../styles/margin.constants';
import {PaddingConstants} from '../styles/padding.constants';
import {TextSizes} from '../styles/textsize.constants';
// import {getSegmentIndex} from '../Utils/TicketUtils';
import GlobalSelectSegment from './dashboard/GlobalSelectSegment';

const SelectSegmentScreen = (props) => {
  // {currentSegmentId, setSegmentSelection}
  const dispatch = useDispatch();
  let currentSegmentId = props.route.params.currentSegmentId;
  const setSegmentSelection = props.route.params.setSegmentSelection;
  const [isLoading, setLoading] = useState(false);
  const authToken = useSelector((state) => state.global.authToken);
  const segmentDetails = useSelector((state) => state.dashboard.segmentDetails);
  const [segmentList, setSegmentList] = useState([]);
  // const currentSegment = useSelector((state) => state.dashboard.currentSegment);
  const navigation = useNavigation();
  const [pageOffset, setPageOffset] = useState(0);
  const handleSegmentSelectionAction = (item) => {
    // dispatch(setSegment(item));
    // dispatch(setSegmentSelectorOpen(false));
    setSegmentSelection(item);
    if (navigation.canGoBack) {
      setSegmentList([]);
      navigation.goBack();
    }
  };
  console.log('CURRENT_SEGMENT_ID', currentSegmentId);

  useEffect(() => {
    console.log('Segment_API_CALL_FIRSTTIME');
    getSegmentData();
  }, [authToken]);

  useEffect(() => {
    getSegmentData();
  }, [pageOffset]);
  // useCallback(() => {
  //   setSegmentList_((prevState) => [
  //     ...new Set([...prevState, ...(segmentDetails.segments ?? [])]),
  //   ]);
  // }, [segmentDetails.pageOffset]);

  useEffect(() => {
    // let data = pageOffset === 0 ? [] : [...segmentList_];
    // data = [...data, ...segmentDetails.segments];

    // setSegmentList_([new Set(data)]);
    setLoading(false);
    if (pageOffset === 0) {
      setSegmentList(segmentDetails.segments);
    } else {
      setSegmentList((prevState) => [
        ...new Set([...prevState, ...segmentDetails.segments]),
      ]);
    }
  }, [segmentDetails]);

  // const loadMoreData = useCallback(() => {
  //   console.log('Segment_API_CALL_LOADMORE');

  //   if (segmentList_.length < segmentDetails.count) {
  //     setPageOffset((state) => state + 1);
  //     getSegmentData(pageOffset);
  //   }
  // }, []);

  const loadMoreData = () => {
    // console.log('LOAD_MORE', segmentList.length, segmentDetails.count);
    // if (!isLoading && segmentList.length < segmentDetails.count) {
    //   setPageOffset((state) => state + 1);
    //   getSegmentData();
    // }
    !isLoading && setPageOffset((state) => state + 1);
  };

  const getSegmentData = () => {
    setLoading(true);
    dispatch(
      getClosedLoopSegmentDetails(authToken, {
        pageOffset: pageOffset.toString(),
      }),
    );
  };
  const RenderSelectSegment = (props) => {
    return (
      <View
        //  style={styles.contentContainer}
        style={{backgroundColor: Colors.white, flex: 1}}>
        <GlobalSelectSegment
          // {...props}
          data={segmentList}
          // selectedIndex={
          //   getSegmentIndex(segmentList_ ?? [], currentSegmentId) ?? 0
          // }
          currentSegmentId={currentSegmentId}
          loadMoreData={loadMoreData}
          handleOnPress={(item) => handleSegmentSelectionAction(item)}
        />
      </View>
    );
  };
  return (
    <View style={styles.rootContainer}>
      <View style={styles.container}>
        <View
          style={[
            styles.rowContainer,
            {
              maxHeight: MarginConstants.tab4,
              alignItems: 'center',
              justifyContent: 'space-between',
            },
          ]}>
          <Text style={styles.headerText}>{'Select Segment'}</Text>
          <CloseButton color={Colors.filterIconColor} />
        </View>
        <RenderSelectSegment />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.white,
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
    marginHorizontal: MarginConstants.tab1,
    marginTop:
      Platform.OS === 'ios' ? MarginConstants.tab4 : MarginConstants.tab1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,

    marginTop: MarginConstants.tab1,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',

    // backgroundColor: Colors.accentLight,
  },
  headerText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.largeText,
    padding: PaddingConstants.tab1,
    color: Colors.filterIconColor,
  },
});
export default SelectSegmentScreen;
