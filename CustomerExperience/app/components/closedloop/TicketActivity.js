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
import {FilterIcon, NoItemsFound} from '../../routes/CommonScreen';
import {convertDateTimeAgo} from '../../Utils/TimeUtils';
import {getClosedLoopTicketItemActivity} from '../../redux/actions/dashboard.actions';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {translate} from '../../Utils/MultilinguaUtils';
import {buttonStyles} from '../../styles/button.styles';

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

const SortingView = ({toggleSorting, isInverted}) => {
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
      onPress={() => {
        toggleSorting();
      }}>
      <FilterIcon
        style={{marginHorizontal: MarginConstants.halfTab}}
        color={Colors.accentLight}
      />
      <Text style={buttonStyles.textButtonText}>
        {`Sorted by ${
          isInverted
            ? translate('activity.oldest').toLocaleLowerCase()
            : translate('activity.latest').toLocaleLowerCase()
        }`}
      </Text>
      {/* <SortingIcon
        iconName={isInverted ? 'caret-up' : 'caret-down'}
        color={Colors.accent}
      /> */}
    </Pressable>
  );
};

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
    // return userID === item.userId ? RenderMyItem({item}) : RenderItem({item});
    return RenderItem({item});
  };
  return (
    <View style={[styles.container, {margin: MarginConstants.tab1}]}>
      <View style={styles.sortingView}>
        <SortingView toggleSorting={toggleSorting} isInverted={isInverted} />
      </View>
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
});
