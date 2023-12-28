import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Pressable,
  ScrollView,
} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily, FontWeight} from '../../styles/font.constants';
import {useDispatch, useSelector} from 'react-redux';
import {
  BottomSheetHeader,
  FilterIcon,
  NoItemsFound,
} from '../../routes/CommonScreen';
import {convertDateTimeAgo} from '../../Utils/TimeUtils';
import {getClosedLoopTicketItemActivity} from '../../redux/actions/dashboard.actions';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {translate} from '../../Utils/MultilinguaUtils';
import {buttonStyles} from '../../styles/button.styles';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import SelectSorting from './takeaction/SelectSorting';

const SortingIcon = ({iconName, size, color}) => {
  return (
    <IonIcons
      name={iconName}
      size={size ?? 16}
      color={color ?? Colors.filterIconColor}
    />
  );
};

const RenderItem = ({item}) => {
  return (
    // <View style={styles.renderItemContainerStyle}>
    //   <View style={styles.renderItemStyle}>
    <View style={styles.myRenderItemContainerStyle}>
      <View style={styles.myRenderItemStyle}>
        <Text style={styles.userName}>
          {item.userName ?? translate('ticket_list.anonymous')}
        </Text>
        <Text style={styles.date}>{convertDateTimeAgo(item.createdAt)}</Text>
      </View>
      <View style={{marginHorizontal: MarginConstants.tab1}}>
        <Text style={styles.activity}>{item.activityText}</Text>
      </View>
    </View>
  );
};

const RenderMyItem = ({item}) => {
  return (
    <View style={styles.myRenderItemContainerStyle}>
      <View style={styles.myRenderItemStyle}>
        <Text style={styles.userName}>{translate('activity.you')}</Text>
      </View>
      <View style={{marginHorizontal: MarginConstants.tab1}}>
        <Text style={styles.activity}> {item.activityText} </Text>
      </View>
      <Text style={styles.date}> {convertDateTimeAgo(item.createdAt)}</Text>
    </View>
  );
};

const SortingView = ({onPress, text}) => {
  return (
    <Pressable
      // style={styles.sortingView}
      style={[
        buttonStyles.textButton,
        {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.white,
          padding: PaddingConstants.tab1,
          margin: MarginConstants.tab1,
        },
      ]}
      onPress={onPress}>
      <FilterIcon
        style={{marginHorizontal: MarginConstants.halfTab}}
        color={Colors.accentLight}
      />
      <Text style={buttonStyles.textButtonText}>
        {/* {`Sorted by ${
          isInverted
            ? translate('activity.oldest').toLocaleLowerCase()
            : translate('activity.latest').toLocaleLowerCase()
        }`} */}
        {text}
      </Text>
      {/* <SortingIcon
        iconName={isInverted ? 'caret-up' : 'caret-down'}
        color={Colors.accent}
      /> */}
    </Pressable>
  );
};

export default function TicketActivity(props) {
  const sortingList = [
    {id: 0, title: translate('activity.latest').toLocaleLowerCase()},
    {id: 1, title: translate('activity.oldest').toLocaleLowerCase()},
  ];
  const [currentSortingIndex, setCurrentIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const {authToken} = useSelector(state => state.global);
  const ticketId = useSelector(state => state.dashboard.ticket.id);
  const {userID} = useSelector(state => state.global.userInfo);
  const ticketActivityList = useSelector(
    state => state.dashboard.ticketActivity,
  );

  function getTicketActivityList(list, item) {
    console.log(JSON.stringify(item));
    switch (item.id) {
      case 1:
        return list.slice().reverse();
      default:
        return list;
    }
  }

  // sorting bottom sheet stuff
  const fall = new Animated.Value(1);
  const sortingBottomSheet = React.useRef();
  const sortingBottomSheetSnapPoints = ['45%', '0%'];

  const openSortingBottomSheet = () => {
    sortingBottomSheet.current.snapTo(0);
  };
  const closeSortingBottomSheet = () => {
    sortingBottomSheet.current.snapTo(sortingBottomSheetSnapPoints.length - 1);
  };

  const renderSortingHeader = _title => {
    return (
      <BottomSheetHeader
        title={translate('activity.sorted_by')}
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
            setCurrentIndex(index);
            closeSortingBottomSheet();
          }}
        />
      </View>
    );
  };

  const makeAPICall = () => {
    dispatch(
      getClosedLoopTicketItemActivity(authToken, JSON.stringify(ticketId)),
    );
  };

  const wait = timeout => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    makeAPICall();
    wait(500).then(() => setRefreshing(false));
  }, []);

  const getRenderItem = ({item}) => {
    // return userID === item.userId ? RenderMyItem({item}) : RenderItem({item});
    return RenderItem({item});
  };
  return (
    <View style={[styles.container, {margin: MarginConstants.tab1}]}>
      <Animated.View
        style={[
          styles.container,
          {
            opacity: Animated.add(0.3, Animated.multiply(fall, 1.0)),
          },
        ]}>
        <View style={styles.sortingView}>
          <SortingView
            onPress={openSortingBottomSheet}
            text={sortingList[currentSortingIndex].title}
          />
        </View>
        <FlatList
          refreshControl={
            <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
          }
          style={styles.container}
          data={getTicketActivityList(
            ticketActivityList,
            sortingList[currentSortingIndex],
          )}
          renderItem={getRenderItem}
          ListEmptyComponent={<NoItemsFound>No Activity...</NoItemsFound>}
          keyExtractor={item => JSON.stringify(item.id)}
        />
      </Animated.View>
      <BottomSheet
        ref={sortingBottomSheet}
        snapPoints={sortingBottomSheetSnapPoints}
        initialSnap={sortingBottomSheetSnapPoints.length - 1}
        enabledGestureInteraction={true}
        renderContent={renderSortingSelectContent}
        renderHeader={renderSortingHeader}
        callbackNode={fall}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: PaddingConstants.tab1,
  },
  commentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  renderItemStyle: {
    flex: 1,
    flexDirection: 'row',

    justifyContent: 'space-between',
    paddingVertical: PaddingConstants.halfTab,
  },
  myRenderItemStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingVertical: PaddingConstants.halfTab,
    marginBottom: MarginConstants.tab1,
    marginHorizontal: MarginConstants.tab1,
  },

  myRenderItemContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.white,
    padding: PaddingConstants.halfTab,
    margin: MarginConstants.tab1,
    borderRadius: 5,
  },
  renderItemContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    padding: PaddingConstants.halfTab,
    margin: MarginConstants.tab1,
    borderRadius: 5,
  },
  userName: {
    color: Colors.accent,
    fontWeight: FontWeight.normal,
    fontSize: TextSizes.secondary,
  },
  activity: {
    color: Colors.filterIconColor,
    fontSize: TextSizes.semiSecondary,
    fontWeight: FontWeight._400,
    flex: 1,
  },
  date: {
    flex: 1,
    color: Colors.evenDarkerGrey,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.mediumText,
    marginStart: MarginConstants.halfTab,
    textAlign: 'right',
  },
  sortingView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: MarginConstants.halfTab,
  },
  contentContainer: {backgroundColor: Colors.white, height: '100%'},
});
