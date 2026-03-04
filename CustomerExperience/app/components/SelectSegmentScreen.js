import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getClosedLoopSegmentDetails} from '../redux/actions/dashboard.actions';
import {CloseButton, NoItemsFound} from '../routes/commonUI/CommonUI';
import ListItemSeparator from '../routes/commonUI/ListItemSeparator';
import {Colors} from '../styles/color.constants';
import {FontFamily, FontWeight} from '../styles/font.constants';
import {MarginConstants} from '../styles/margin.constants';
import {PaddingConstants} from '../styles/padding.constants';
import {TextSizes} from '../styles/textsize.constants';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {translate} from '../Utils/MultilinguaUtils';
import CheckmarkIcon from '../routes/commonUI/CheckmarkIcon';
import {baseTextStyles} from '../styles/text.styles';
import {SafeAreaView} from 'react-native-safe-area-context';

const SelectSegmentScreen = props => {
  const dispatch = useDispatch();
  let currentSegmentId = props.route.params.currentSegmentId;
  const setSegmentSelection = props.route.params.setSegmentSelection;
  // const [isLoading, setLoading] = useState(false);
  const textInputRef = useRef();
  const authToken = useSelector(state => state.global.authToken);
  const ownerID = useSelector(state => state.global.userInfo.userID);
  const segmentList = useSelector(state => state.dashboard.segmentList);
  const navigation = useNavigation();
  const defaultRequestBody = {
    pageOffset: 0,
    perPage: 100,
    segmentName: '',
    ownerID: ownerID,
  };
  // const [pageOffset, setPageOffset] = useState(0);
  const [requestBody, setRequestBody] = useState(defaultRequestBody);
  const [searchText, setSearchText] = useState('');
  const handleSegmentSelectionAction = item => {
    // setPageOffset(0);
    setRequestBody(defaultRequestBody);
    setSegmentSelection(item);
    if (navigation.canGoBack) {
      navigation.goBack();
    }
  };

  useEffect(() => {
    getSegmentData();
  }, [requestBody]);

  const loadMoreData = () => {
    // setPageOffset(pageOffset + 1);
    setRequestBody(prevState => ({
      ...prevState,
      pageOffset: prevState.pageOffset + 1,
    }));
  };

  const getSegmentData = () => {
    // setLoading(true);
    dispatch(
      getClosedLoopSegmentDetails(authToken, {
        pageOffset: `${requestBody.pageOffset}`,
        perPage: `${requestBody.perPage}`,
        segmentName: requestBody.segmentName,
        ownerID: `${requestBody.ownerID}`,
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
            <CheckmarkIcon index={index} />
          ) : (
            <View />
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const onSearchHandler = text => {
    // console.log('TEXT_INPUT:', JSON.stringify(textInputRef.current));

    setRequestBody({
      ...defaultRequestBody,
      segmentName: text ?? '',
    });
  };

  const clearSearchHandler = () => {
    setRequestBody(defaultRequestBody);
    textInputRef.current.clear();
  };

  const renderSegmentSearch = () => {
    return (
      <View
        style={[
          {
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <View
          style={[
            {
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            },
            styles.bottomBar,
          ]}>
          <TextInput
            testID="search-input"
            ref={textInputRef}
            defaultValue={requestBody.segmentName}
            style={[styles.searchInput, {flex: 1}]}
            placeholder={translate('select_segment.search_segment_name')}
            returnKeyType={'search'}
            placeholderTextColor={Colors.borderColor}
            onSubmitEditing={event => {
              // console.log('KEYBOARD_SEARCH', JSON.stringify(event.nativeEvent));
              onSearchHandler(event.nativeEvent.text);
              // setSearchText(event.nativeEvent.text);
              // onSearchHandler();
            }}
          />
          {requestBody.segmentName.length > 0 ? (
            <Pressable
              testID="clear-button"
              style={[styles.searchInput]}
              onPress={clearSearchHandler}>
              <IonIcons
                style={{marginHorizontal: MarginConstants.halfTab}}
                name={'close-circle'}
                size={20}
                color={Colors.filterIconColor}
              />
            </Pressable>
          ) : (
            <View />
          )}
        </View>
      </View>
    );
  };

  const globalSelectSegment = props => {
    return (
      <FlatList
        // ref={flatListRef}
        style={styles.flatList}
        data={segmentList}
        keyExtractor={item => item.segmentID + ''}
        renderItem={renderRow}
        ItemSeparatorComponent={ListItemSeparator}
        ListHeaderComponent={renderSegmentSearch}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.25}
        ListEmptyComponent={<NoItemsFound>No Segment found</NoItemsFound>}
        // ListFooterComponent={isLoading && <RenderSpinner />}
        refreshing={false}
        extraData={segmentList}
      />
    );
  };

  return (
    <SafeAreaView style={styles.rootContainer}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>
            {translate('dashboard.segment')}
          </Text>
          <CloseButton color={Colors.filterIconColor} />
        </View>

        {globalSelectSegment()}
      </View>
    </SafeAreaView>
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
    textAlign: 'center',
  },

  innerContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingStart: PaddingConstants.tab1_2x,
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
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    fontWeight: FontWeight._400,
    color: Colors.filterIconColor,
  },
  bottomBar: {
    borderBottomWidth: 0.5,

    borderColor: Colors.borderColor,
    padding: PaddingConstants.halfTab,
  },

  searchBox: {
    borderWidth: 0.5,
    borderColor: Colors.accent,
    padding: PaddingConstants.halfTab,
    borderRadius: 5,
  },
});
export default SelectSegmentScreen;
