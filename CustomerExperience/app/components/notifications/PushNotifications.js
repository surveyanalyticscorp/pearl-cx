import {View, Text, StyleSheet, FlatList, Pressable} from 'react-native';
import React, {useEffect} from 'react';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily} from '../../styles/font.constants';
import {useDispatch, useSelector} from 'react-redux';
import QPSpinner from '../../widgets/QPSpinner';
import {
  getNotification,
  readNotification,
} from '../../redux/actions/notification.actions';
import {translate} from '../../Utils/MultilinguaUtils';
import TextLabel from '../../widgets/TextLabel/TextLabel';
import {useNavigation} from '@react-navigation/native';
import {baseTextStyles} from '../../styles/text.styles';
import {convertDateTimeAgo} from '../../Utils/TimeUtils';
import NewResponseDot from '../feedback/feedbackCell/NewResponseDot';
import {HorizontalSpaceBox} from '../../widgets/SpaceBox';
import EmptyList from '../../routes/commonUI/EmptyList';
import {EmptyView} from '../closedloop/EmptyComment';

const NotificationItem = ({item, index}) => {
  const text = item.notificationText;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.global.userInfo);
  console.log('NOTIFICATION ITEM', JSON.stringify(item));
  return (
    <Pressable
      onPress={() => {
        navigation.navigate('TicketDetails', {ticketItem: item.ticket});
        dispatch(readNotification(item.id, userInfo?.userID));
      }}
      style={{
        ...styles.notificationItem,
        backgroundColor: Colors.white,
      }}>
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}>
        <NewResponseDot
          style={{marginTop: MarginConstants.tab1}}
          isNewResponse={!item.hasRead}
        />
        <HorizontalSpaceBox />
        <TextLabel color={Colors.accent} text={text} />
      </View>
      <View style={styles.timeContainerStyle}>
        <TextLabel
          color={Colors.evenDarkerGrey}
          baseTextStyle={baseTextStyles.semiSecondaryRegularText}
          text={convertDateTimeAgo(item.createdAt)}
        />
      </View>
    </Pressable>
  );
};

const PushNotification = props => {
  const isLoading = useSelector(state => state.global.isLoading);
  const userInfo = useSelector(state => state.global.userInfo);
  const {notificationLogs, readNotification} = useSelector(
    state => state.notification,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getNotification(userInfo?.userID));
  }, []);

  useEffect(() => {
    if (readNotification && readNotification.status === 'success') {
      dispatch(getNotification(userInfo?.userID));
    }
  }, [readNotification]);

  let renderRow = ({item, index}) => {
    return <NotificationItem item={item} index={index} />;
  };

  let renderSpinner = () => {
    return (
      <View style={styles.loading}>
        <QPSpinner />
      </View>
    );
  };

  let renderContainer = () => {
    if (notificationLogs.length === 0) {
      return (
        <EmptyView
          title={translate('dashboard.no_notification_to_display')}
          subTitle={'check back later'}
        />
      );
    } else {
      return (
        <FlatList
          data={notificationLogs}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderRow}
          ListFooterComponent={() => (
            <View style={{paddingBottom: PaddingConstants.tab2}} />
          )}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? renderSpinner() : renderContainer()}
    </View>
  );
};

export default PushNotification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: PaddingConstants.halfTab,
    backgroundColor: Colors.darkerGrey,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    padding: 1.2 * PaddingConstants.tab1,
    margin: MarginConstants.tab1,
    backgroundColor: Colors.white,
    // borderColor: Colors.accentLight,
    // borderRadius: 4,
    // borderWidth: 1,
  },
  rowTextContainer: {
    marginHorizontal: MarginConstants.tab1,
    paddingHorizontal: PaddingConstants.tab1,
    borderColor: Colors.darkGrey,
    borderRadius: 4,
    borderWidth: 1,
  },
  titleContainer: {
    fontSize: TextSizes.secondary,
    color: Colors.primary,
    marginVertical: MarginConstants.halfTab,
  },
  regularFont: {
    fontFamily: FontFamily.regular,
  },
  boldFont: {
    fontFamily: FontFamily.semiBold,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: TextSizes.semiSecondary,
    color: Colors.secondary,
  },
  ticketIcon: {
    width: 1.1 * MarginConstants.tab3,
    height: 1.1 * MarginConstants.tab3,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBox: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: MarginConstants.tab1,
    width: 80,
    height: 70,
  },
  subTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginEnd: MarginConstants.tab4,
  },

  notificationItem: {
    justifyContent: 'center',

    margin: MarginConstants.tab1,
    borderRadius: 2,
    padding: MarginConstants.tab1_2x,
  },
  timeContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
});
