import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getClosedLoopSegmentDetails} from '../redux/actions/dashboard.actions';
import {
  CloseButton,
  listItemSeparator,
  RenderSpinner,
} from '../routes/CommonScreen';
import {Colors} from '../styles/color.constants';
import {FontFamily} from '../styles/font.constants';
import {MarginConstants} from '../styles/margin.constants';
import {PaddingConstants} from '../styles/padding.constants';
import {TextSizes} from '../styles/textsize.constants';

const SelectSegmentScreen = (props) => {
  // {currentSegmentId, setSegmentSelection}
  const dispatch = useDispatch();
  let currentSegmentId = props.route.params.currentSegmentId;
  const setSegmentSelection = props.route.params.setSegmentSelection;
  // const [isLoading, setLoading] = useState(false);
  const isLoading = useSelector((state) => state.global.isLoading);
  const authToken = useSelector((state) => state.global.authToken);
  const segmentDetails = useSelector((state) => state.dashboard.segmentDetails);
  // const [segmentList, setSegmentList] = useState([]);
  const segmentList = useSelector((state) => state.dashboard.segmentList);
  // const currentSegment = useSelector((state) => state.dashboard.currentSegment);
  const navigation = useNavigation();
  const [pageOffset, setPageOffset] = useState(0);
  // const isInfocus = useIsFocused();
  const handleSegmentSelectionAction = (item) => {
    // dispatch(setSegment(item));
    // dispatch(setSegmentSelectorOpen(false));
    setPageOffset(0);
    setSegmentSelection(item);
    if (navigation.canGoBack) {
      navigation.goBack();
    }
  };
  console.log('CURRENT_SEGMENT_ID', currentSegmentId);
  console.log('CURRENT_SEGMENT_LIST', JSON.stringify(segmentList));

  useEffect(() => {
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

  // useEffect(() => {
  // let data = pageOffset === 0 ? [] : [...segmentList_];
  // data = [...data, ...segmentDetails.segments];

  // setSegmentList_([new Set(data)]);
  // setLoading(false);
  // if (pageOffset === 0) {
  //   // setSegmentList(segmentDetails.segments);
  // } else {
  //   let list = [...segmentList, ...segmentDetails.segments];
  //   let uniqueList = [
  //     ...new Map(list.map((item) => [item['segmentID'], item])).values(),
  //   ];
  // setSegmentList(uniqueList);
  // setSegmentList([...new Set(list)]);
  // let data = pageOffset === 0 ? [] : [...segmentList];
  // data = [...data, ...segmentDetails.segments];

  // setSegmentList([new Set(data)]);
  // }
  // }, [segmentDetails]);

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
    if (!isLoading && segmentList.length < segmentDetails.count) {
      setPageOffset(pageOffset + 1);
      console.log('LOAD_MORE_updated_pageOffset');
    }

    console.log('LOAD_MORE');
  };

  const getSegmentData = () => {
    // setLoading(true);
    dispatch(
      getClosedLoopSegmentDetails(authToken, {
        pageOffset: pageOffset.toString(),
      }),
    );
  };
  const RenderSelectSegment = (props) => {
    return (
      <View
        // style={styles.contentContainer}
        style={styles.innerContainer}>
        <GlobalSelectSegment
        // {...props}
        // data={segmentList}
        // selectedIndex={
        //   getSegmentIndex(segmentList_ ?? [], currentSegmentId) ?? 0
        // }
        // currentSegmentId={currentSegmentId}
        // loadMoreData={loadMoreData}
        // handleOnPress={(item) => handleSegmentSelectionAction(item)}
        />
        {/* {globalSelectSegment()} */}
      </View>
    );
  };

  const GlobalSelectSegment = (props) => {
    // const [filteredList, setFilteredList] = useState(data);
    // const [selectedIndex, setSelectedIndex] = useState(props.selectedIndex ?? 0);

    // const flatListRef = React.createRef();
    // const scrollPositionRef = React.createRef();
    const renderRow = ({item, index}) => {
      return (
        <TouchableWithoutFeedback
          onPress={() => handleSegmentSelectionAction(item)}>
          <View style={styles.row}>
            <Text style={styles.title}>{item.segmentName}</Text>
            {/* {currentSegmentId === item.segmentID ? (
              <IonIcon
                style={{marginHorizontal: MarginConstants.halfTab}}
                name={'checkmark'}
                size={20}
                color={Colors.filterIconColor}
              />
            ) : (
              <View />
            )} */}
          </View>
        </TouchableWithoutFeedback>
      );
    };

    // const handleOnPress = (item, index) => {
    //   handleOnPress(item);
    // };

    console.log('Segment_API_CALL');

    const renderSegmentSearch = () => {
      return (
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          onChangeText={(text) => {
            console.log(text);
            // if (text) {
            //   setFilteredList((state) =>
            //     state.filter((item) =>
            //       item.segmentName.toLowerCase().includes(text.toLowerCase()),
            //     ),
            //   );
            // } else {
            //   setFilteredList(data);
            // }
          }}
        />
      );
    };

    return (
      // <View style={styles.innerContainer}>
      <FlatList
        // ref={flatListRef}
        style={styles.flatList}
        data={segmentList}
        keyExtractor={(item) => item.segmentID + ''}
        renderItem={renderRow}
        ItemSeparatorComponent={listItemSeparator}
        ListHeaderComponent={renderSegmentSearch}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.05}
        ListFooterComponent={isLoading && <RenderSpinner />}
        refreshing={false}
        extraData={[segmentList]}
        // onViewableItemsChanged={() => {
        //   flatListRef.current.scrollToOffset({
        //     animated: false,
        //     offset: scrollPositionRef.current,
        //   });
        // }}
        // onScroll={(event) =>
        //   (scrollPositionRef.current = event.nativeEvent.contentOffset.y)
        // }
      />
      // </View>
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

  innerContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',

    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: MarginConstants.tab2,
  },
  flatList: {
    flex: 1,

    marginHorizontal: MarginConstants.tab2,
    marginVertical: MarginConstants.tab1,
    fontFamily: FontFamily.bold,
    fontSize: TextSizes.largeText,
  },
  header: {
    marginHorizontal: MarginConstants.tab2,
    fontFamily: FontFamily.bold,
    fontSize: TextSizes.largeText,
    marginVertical: MarginConstants.tab1,
    color: Colors.filterIconColor,
  },
  title: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.secondary,
    marginStart: MarginConstants.halfTab,
    color: Colors.filterIconColor,
  },
  searchInput: {
    borderBottomWidth: 1,
    borderColor: Colors.filterIconColor,

    marginBottom: MarginConstants.tab2,
  },
});
export default SelectSegmentScreen;
