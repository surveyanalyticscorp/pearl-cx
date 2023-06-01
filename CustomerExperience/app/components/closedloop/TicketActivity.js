import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Pressable,
} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily, FontWeight} from '../../styles/font.constants';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {NoItemsFound} from '../../routes/CommonScreen';
import {getDateTimeAgo} from '../../Utils/TimeUtils';
import {getClosedLoopTicketItemActivity} from '../../redux/actions/dashboard.actions';
import IonIcons from 'react-native-vector-icons/Ionicons';

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
    <View style={styles.renderItemContainerStyle}>
      <View style={styles.renderItemStyle}>
        <Text style={styles.userName}>{item.userName ?? 'anonymous'}</Text>
      </View>
      <View style={{marginHorizontal: MarginConstants.tab1}}>
        <Text style={styles.activity}>{item.activityText}</Text>
      </View>
      <Text style={styles.date}>{convertDateTime(item.createdAt)}</Text>
    </View>
  );
};

const RenderMyItem = ({item}) => {
  return (
    <View style={styles.myRenderItemContainerStyle}>
      <View style={styles.myRenderItemStyle}>
        <Text style={styles.userName}>{'You'}</Text>
      </View>
      <View style={{marginHorizontal: MarginConstants.tab1}}>
        <Text style={styles.activity}> {item.activityText} </Text>
      </View>
      <Text style={styles.date}> {convertDateTime(item.createdAt)}</Text>
    </View>
  );
};

const SortingView = ({toggleSorting, isInverted}) => {
  return (
    <Pressable
      style={styles.sortingView}
      onPress={() => {
        toggleSorting();
      }}>
      <Text style={{color: Colors.accent}}>
        {`Sorted: ${isInverted ? 'Oldest' : 'Latest'}`}
      </Text>
      <SortingIcon
        iconName={isInverted ? 'caret-up' : 'caret-down'}
        color={Colors.accent}
      />
    </Pressable>
  );
};

function convertDateTime(dateStr) {
  return getDateTimeAgo(moment.utc(dateStr).toDate());
}

export default function TicketActivity(props) {
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const {authToken} = useSelector(state => state.global);
  const ticketId = useSelector(state => state.dashboard.ticket.id);
  const {userID} = useSelector(state => state.global.userInfo);
  const [isInverted, setIsInverted] = useState(false);
  const ticketActivityList = useSelector(
    state => state.dashboard.ticketActivity,
  );

  const toggleSorting = () => {
    setIsInverted(prev => !prev);
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
    return userID === item.userId ? RenderMyItem({item}) : RenderItem({item});
  };
  return (
    <View style={styles.container}>
      <SortingView toggleSorting={toggleSorting} isInverted={isInverted} />
      <FlatList
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        }
        style={styles.container}
        data={
          isInverted ? ticketActivityList.slice().reverse() : ticketActivityList
        }
        renderItem={getRenderItem}
        ListEmptyComponent={<NoItemsFound>No Activity...</NoItemsFound>}
        keyExtractor={item => JSON.stringify(item.id)}
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
    fontWeight: FontWeight.bold,
    fontSize: TextSizes.semiSecondary,
    marginHorizontal: MarginConstants.halfTab,
  },
  activity: {
    color: Colors.filterIconColor,
    fontSize: TextSizes.semiSecondary,
    fontWeight: FontWeight._400,
    flex: 1,
  },
  date: {
    flex: 1,
    color: Colors.filterIconColor,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.mediumText,
    marginStart: MarginConstants.halfTab,
    textAlign: 'right',
  },
  sortingView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: PaddingConstants.tab2,

    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: Colors.white,
    height: MarginConstants.tab4,
    width: '100%',
  },
});
