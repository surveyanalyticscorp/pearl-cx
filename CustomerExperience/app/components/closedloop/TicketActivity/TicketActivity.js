import React, {useState, useCallback} from 'react';
import {View, FlatList, ScrollView, RefreshControl} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {useDispatch, useSelector} from 'react-redux';
import {NoItemsFound} from '../../../routes/commonUI/CommonUI';
import {convertDateTimeAgo} from '../../../Utils/TimeUtils';
import {getClosedLoopTicketItemActivity} from '../../../redux/actions/dashboard.actions';
import {translate} from '../../../Utils/MultilinguaUtils';
import SelectSorting from '../takeaction/SelectSorting';
import {baseTextStyles} from '../../../styles/text.styles';
import ActivityText from '../../../widgets/closedloopWidget/ActivityText';
import TextLabel from '../../../widgets/TextLabel/TextLabel';
import SortingToggleButton from '../../../widgets/closedloopWidget/SortingToggleButton';
import {VerticalSpaceBox} from '../../../widgets/SpaceBox';
import styles from './ticketActivity.style';
import QPBottomSheet from '../takeaction/QPBottomSheet';
import QPBottomSheetHeader from '../takeaction/QPBottomSheetHeader';

const TicketActivityContainer = ({children}) => {
  return <View style={styles.rootContainer}>{children}</View>;
};

const RenderActivityItem = ({item}) => {
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

export function getTicketActivityList(list, item) {
  switch (item.id) {
    case 1:
      return list.slice().reverse();
    default:
      return list;
  }
}

const SortingView = ({onPress, text}) => {
  return (
    <View style={styles.sortingView}>
      <SortingToggleButton onPress={onPress} text={text} />
    </View>
  );
};

export default function TicketActivity(props) {
  const sortingList = [
    {id: 0, title: translate('activity.latest').toLocaleLowerCase()},
    {id: 1, title: translate('activity.oldest').toLocaleLowerCase()},
  ];
  const [sortingBottomSheetVisible, setSortingBottomSheetVisible] =
    useState(false);
  const onCloseSortingBottomSheet = () => {
    setSortingBottomSheetVisible(false);
  };
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const [currentSortingIndex, setCurrentIndex] = useState(0);

  const {authToken} = useSelector(state => state.global);
  const ticketId = useSelector(state => state.dashboard.ticket.id);
  const ticketActivityList = useSelector(
    state => state.dashboard.ticketActivity,
  );

  const openSortingBottomSheet = () => {
    setSortingBottomSheetVisible(true);
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
    return RenderActivityItem({item});
  };
  return (
    <TicketActivityContainer style={styles.rootContainer}>
      <SortingView
        onPress={openSortingBottomSheet}
        text={sortingList[currentSortingIndex].title}
      />

      <FlatList
        testID="flatlist-activity"
        listKey={`TicketActivity-${ticketId}`}
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

      <QPBottomSheet
        visible={sortingBottomSheetVisible}
        onClose={onCloseSortingBottomSheet}
        headerComponent={
          <QPBottomSheetHeader
            headerLabel={translate('activity.sorted_by')}
            onClose={onCloseSortingBottomSheet}
          />
        }>
        <SelectSorting
          data={sortingList}
          selectedIndex={currentSortingIndex}
          handleOnPress={(item, index) => {
            setCurrentIndex(index);
            onCloseSortingBottomSheet();
          }}
        />
      </QPBottomSheet>
    </TicketActivityContainer>
  );
}
