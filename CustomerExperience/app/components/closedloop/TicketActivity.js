import React, {useState, useCallback} from 'react';
import {View, StyleSheet, FlatList, RefreshControl} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {FontWeight} from '../../styles/font.constants';
import {useDispatch, useSelector} from 'react-redux';
import {NoItemsFound} from '../../routes/commonUI/CommonUI';
import BottomSheetHeader from '../../routes/commonUI/BottomSheetHeader';
import {convertDateTimeAgo} from '../../Utils/TimeUtils';
import {getClosedLoopTicketItemActivity} from '../../redux/actions/dashboard.actions';
import {translate} from '../../Utils/MultilinguaUtils';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import SelectSorting from './takeaction/SelectSorting';
import {baseTextStyles} from '../../styles/text.styles';
import ActivityText from '../../widgets/closedloopWidget/ActivityText';
import TextLabel from '../../widgets/TextLabel/TextLabel';
import SortingToggleButton from '../../widgets/closedloopWidget/SortingToggleButton';
import {VerticalSpaceBox} from '../../widgets/SpaceBox';

const RenderItem = ({item}) => {
  const {userName, createdAt, activityText} = item;
  return (
    <View style={styles.myRenderItemContainerStyle}>
      <View style={{...styles.myRenderItemStyle, marginTop: 0}}>
        <TextLabel
          color={Colors.accent}
          text={userName ?? translate('ticket_list.anonymous')}
        />
        <TextLabel
          color={Colors.evenDarkerGrey}
          baseTextStyle={baseTextStyles.semiSecondaryRegularText}
          text={convertDateTimeAgo(createdAt)}
        />
      </View>
      <VerticalSpaceBox />
      <ActivityText text={activityText} />
    </View>
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
  // const {userID} = useSelector(state => state.global.userInfo);
  const ticketActivityList = useSelector(
    state => state.dashboard.ticketActivity,
  );

  function getTicketActivityList(list, item) {
    // console.log(JSON.stringify(item));
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

  console.log(
    'Padding half, tab1, tab2, tab3, tab4',
    PaddingConstants.halfTab,
    PaddingConstants.tab1,
    PaddingConstants.tab2,
    PaddingConstants.tab3,
    PaddingConstants.tab4,
  );
  console.log(
    'Margin half, tab1, tab2, tab3, tab4',
    MarginConstants.halfTab,
    MarginConstants.tab1,
    MarginConstants.tab2,
    MarginConstants.tab3,
    MarginConstants.tab4,
  );
  console.log(
    `TextSizes.donutPercentText: ${TextSizes.donutPercentText}`,
    `TextSizes.extraLargeText: ${TextSizes.extraLargeText}`,
    `TextSizes.largeText: ${TextSizes.largeText}`,
    `TextSizes.primary: ${TextSizes.primary}`,
    `TextSizes.secondary: ${TextSizes.secondary}`,
    `TextSizes.semiSecondary: ${TextSizes.semiSecondary}`,
    `TextSizes.semiMediumText: ${TextSizes.semiMediumText}`,
    `TextSizes.mediumText: ${TextSizes.mediumText}`,
    `TextSizes.smallText: ${TextSizes.smallText}`,
  );

  const getRenderItem = ({item}) => {
    // return userID === item.userId ? RenderMyItem({item}) : RenderItem({item});
    return RenderItem({item});
  };
  return (
    <View style={[styles.container, {margin: MarginConstants.tab1}]}>
      <Animated.View
        testID="animated-view"
        style={[
          styles.container,
          {
            opacity: Animated.add(0.3, Animated.multiply(fall, 1.0)),
          },
        ]}>
        <View style={styles.sortingView}>
          <SortingToggleButton
            onPress={openSortingBottomSheet}
            text={sortingList[currentSortingIndex].title}
          />
        </View>
        <FlatList
          testID="flatlist-activity"
          refreshControl={
            <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
          }
          style={styles.container}
          data={getTicketActivityList(
            ticketActivityList,
            sortingList[currentSortingIndex],
          )}
          renderItem={getRenderItem}
          ListEmptyComponent={<NoItemsFound>{'No Activity...'}</NoItemsFound>}
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
  },

  myRenderItemContainerStyle: {
    justifyContent: 'center',
    backgroundColor: Colors.white,
    margin: MarginConstants.tab1,
    borderRadius: 5,
    padding: MarginConstants.tab1_2x,
  },
  renderItemContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    padding: PaddingConstants.halfTab,
    margin: MarginConstants.tab1,
    borderRadius: 5,
  },
  userName: {
    ...baseTextStyles.primaryRegularText,
    color: Colors.accent,
  },
  activity: {
    color: Colors.filterIconColor,
    fontSize: TextSizes.semiSecondary,
    fontWeight: FontWeight._400,
    flex: 1,
  },
  normalText: {
    color: Colors.filterIconColor,
    fontSize: TextSizes.semiSecondary,
    fontWeight: FontWeight._400,
    flex: 1,
  },
  boldText: {
    color: Colors.filterIconColor,
    fontSize: TextSizes.semiSecondary,
    fontWeight: FontWeight.bold,
    flex: 1,
  },
  date: {
    flex: 1,
    color: Colors.evenDarkerGrey,
    ...baseTextStyles.semiSecondaryRegularText,
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
