import React, {useState, useCallback} from 'react';
import {
  View,
  FlatList,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
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
import {VerticalSpaceBox} from '../../../widgets/SpaceBox';
import styles from './ticketActivity.style';
import QPBottomSheet from '../takeaction/QPBottomSheet';
import QPBottomSheetHeader from '../takeaction/QPBottomSheetHeader';
import {MarginConstants} from '../../../styles/margin.constants';
import DropDownButton from '../takeaction/DropDownButton';
import QPDropDownMenu from '../takeaction/QPDropDownMenu';

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
  const [dropDownPosition, setDropDownPosition] = useState({x: 0, y: 0});

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
      <View style={activityStyles.sortingView}>
        <DropDownButton
          label={sortingList[currentSortingIndex].title}
          onPress={openSortingBottomSheet}
          isOpen={sortingBottomSheetVisible}
          style={{margin: MarginConstants.tab1}}
          onLayout={event => {
            const {height, x, y} = event.nativeEvent.layout;
            console.log('DropDownButton height:', height, 'y:', y, 'x:', x);
            setDropDownPosition({
              x: x,
              y: height * 4,
            });
          }}
        />
      </View>

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

      {/* <QPBottomSheet
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
      </QPBottomSheet> */}

      <QPDropDownMenu
        visible={sortingBottomSheetVisible}
        onClose={() => setSortingBottomSheetVisible(false)}
        anchorPosition={dropDownPosition}
        anchorType="top"
        items={sortingList.map(item => item.title)}
        onSelectItem={selectedTitle => {
          const selectedIndex = sortingList.findIndex(
            item => item.title === selectedTitle,
          );
          if (selectedIndex !== -1) {
            setCurrentIndex(selectedIndex);
          }
          setSortingBottomSheetVisible(false);
        }}
        selectedItem={sortingList[currentSortingIndex].title}
      />
    </TicketActivityContainer>
  );
}

const activityStyles = StyleSheet.create({
  sortingView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-start',
    marginBottom: MarginConstants.halfTab,
    backgroundColor: Colors.white,
  },
});
