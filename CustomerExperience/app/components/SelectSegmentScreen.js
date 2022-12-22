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
import {CloseButton, listItemSeparator} from '../routes/CommonScreen';
import {Colors} from '../styles/color.constants';
import {FontFamily} from '../styles/font.constants';
import {MarginConstants} from '../styles/margin.constants';
import {PaddingConstants} from '../styles/padding.constants';
import {TextSizes} from '../styles/textsize.constants';
import IonIcons from 'react-native-vector-icons/Ionicons';

const SelectSegmentScreen = (props) => {
  const dispatch = useDispatch();
  let currentSegmentId = props.route.params.currentSegmentId;
  const setSegmentSelection = props.route.params.setSegmentSelection;
  const [isLoading, setLoading] = useState(false);
  const authToken = useSelector((state) => state.global.authToken);
  const segmentList = useSelector((state) => state.dashboard.segmentList);
  const navigation = useNavigation();
  const [pageOffset, setPageOffset] = useState(0);
  const handleSegmentSelectionAction = (item) => {
    setPageOffset(0);
    setSegmentSelection(item);
    if (navigation.canGoBack) {
      navigation.goBack();
    }
  };

  useEffect(() => {
    getSegmentData();
  }, [pageOffset]);

  const loadMoreData = () => {
    setPageOffset(pageOffset + 1);
  };

  const getSegmentData = () => {
    setLoading(true);
    dispatch(
      getClosedLoopSegmentDetails(authToken, {
        pageOffset: pageOffset.toString(),
      }),
    );
  };

  const renderRow = ({item, index}) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => handleSegmentSelectionAction(item)}>
        <View style={styles.row}>
          <Text style={styles.title}>{item.segmentName}</Text>
          {currentSegmentId === item.segmentID ? (
            <IonIcons
              style={{marginHorizontal: MarginConstants.halfTab}}
              name={'checkmark'}
              size={20}
              color={Colors.filterIconColor}
            />
          ) : (
            <View />
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  };

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

  const globalSelectSegment = (props) => {
    return (
      <FlatList
        // ref={flatListRef}
        style={styles.flatList}
        data={segmentList}
        keyExtractor={(item) => item.segmentID + ''}
        renderItem={renderRow}
        ItemSeparatorComponent={listItemSeparator}
        ListHeaderComponent={renderSegmentSearch}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.25}
        // ListFooterComponent={isLoading && <RenderSpinner />}
        refreshing={false}
        extraData={segmentList}
      />
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

        {globalSelectSegment()}
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
