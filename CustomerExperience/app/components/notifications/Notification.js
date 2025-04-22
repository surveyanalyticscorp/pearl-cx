import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  Pressable,
  Animated,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Colors, priorityColors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily} from '../../styles/font.constants';
import {showErrorFlashMessage} from '../../Utils/Utility';
import {useDispatch, useSelector} from 'react-redux';
import {apiHandler} from '../../api/ApiHandler';
import moment from 'moment';
import {HalfMonthDateYearFormat} from '../../Utils/AppConstants';
import QPSpinner from '../../widgets/QPSpinner';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {Notifications} from 'react-native-notifications';
import {connect} from 'react-redux';
import {clearNotification} from '../../redux/actions/notification.actions';
import {translate} from '../../Utils/MultilinguaUtils';
import IonIcons from 'react-native-vector-icons/Ionicons';
import TextLabel from '../../widgets/TextLabel/TextLabel';
import {useNavigation} from '@react-navigation/native';

const NotificationItem = (item, index) => {
  const text = item.notificationText;
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => {
        navigation.navigate('TicketDetails', {
          ticketItem: item.ticket,
          parentRoute: 'Dashboard',
        });
      }}
      style={styles.notificationItem}>
      <TextLabel color={Colors.acc} text={text} />
    </Pressable>
  );
};

const Notification = props => {
  let row: Array<any> = [];
  let prevOpenedRow;

  let [clearAllAlert, showClearAllAlert] = useState(false);
  const isLoading = useSelector(state => state.global.isLoading);
  const authToken = useSelector(state => state.global.authToken);
  const dispatch = useDispatch();

  useEffect(() => {
    props.navigation.setParams({clearAllNotifications: clearAllNotifications});
    Notifications.removeAllDeliveredNotifications();
  }, []);

  let clearAllNotifications = () => {
    showClearAllAlert(true);
  };

  let renderClearAllAlert = () => {
    return Alert.alert(
      translate('dashboard.clear_all_notification'),
      translate('dashboard.are_you_sure'),
      [
        {
          text: translate('yes'),
          onPress: () => {
            showClearAllAlert(false);
            props.clearNotificationAction(undefined);
            apiHandler.clearNotification(
              {'Auth-Token': authToken},
              {},
              response => {},
              error => {
                showErrorFlashMessage(error.errorAlert);
              },
            );
          },
        },
        {
          text: translate('no'),
          onPress: () => {
            showClearAllAlert(false);
          },
        },
      ],
      {cancelable: false},
    );
  };

  let clearNotification = (notification, index) => {
    props.clearNotificationAction(notification);
    if (row[index]) {
      row[index].close();
    }

    apiHandler.clearNotification(
      {'Auth-Token': authToken},
      {id: notification.id},
      response => {},
      error => {
        showErrorFlashMessage(error.errorAlert);
      },
    );
  };

  let viewTicket = ticketID => {
    props.navigation.navigate(translate('close_loop.ticket_details'), {
      ticketID: ticketID,
      parentRoute: 'Dashboard',
    });
  };

  const leftSwipe = (progress, dragX, item) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <Pressable onPress={() => clearNotification(item)} activeOpacity={0.5}>
        <View style={styles.deleteBox}>
          <Animated.Text style={{transform: [{scale: scale}]}}>
            Deleting
          </Animated.Text>
        </View>
      </Pressable>
    );
  };

  let RenderPriorityRow = ({priority}) => {
    let color = getPriorityColor(priority);
    return (
      <View style={styles.subTitleRow}>
        <IonIcons name="flag" size={12} color={color.border} />
        <Text style={styles.subtitle}> {priority}</Text>
      </View>
    );
  };

  let getPriorityColor = priority => {
    switch (priority) {
      case 'critical':
        return priorityColors.critical;
      case 'high':
        return priorityColors.high;
      case 'normal':
        return priorityColors.normal;
      case 'low':
        return priorityColors.low;
      default:
        return priorityColors.unassigned;
    }
  };

  let renderRow = ({item, index}) => {
    console.log(`Notification Item: ${JSON.stringify(item)}`);
    let imagePath =
      item.logType === 'U'
        ? require('../../config/images/notification_comment_blue.png')
        : require('../../config/images/notification_ticket_blue.png');
    let text = item.notificationText.replace(item.emailAddress, '');
    let time = moment(item.timestamp).format(HalfMonthDateYearFormat);
    let priority = 'high';
    return (
      <Swipeable
        ref={ref => (row[index] = ref)}
        friction={1}
        leftThreshold={40}
        rightThreshold={80}
        renderLeftActions={(progress, dragX) =>
          leftSwipe(progress, dragX, item)
        }
        onSwipeableWillOpen={() => clearNotification(item, index)}>
        <TouchableWithoutFeedback
          onPress={() => {
            let object = JSON.parse(item.data);
            viewTicket(object.CXTicket);
          }}>
          <View style={styles.row}>
            <Image style={styles.ticketIcon} source={imagePath} />
            <View style={styles.rowTextContainer}>
              <Text style={styles.titleContainer}>
                <Text style={styles.regularFont}>{text}</Text>
                <Text style={styles.boldFont}> {item.emailAddress}</Text>
              </Text>
              <View
                style={[
                  styles.titleContainer,
                  {flexDirection: 'row', justifyContent: 'space-between'},
                ]}>
                <Text style={styles.subtitle}>{time}</Text>
                <RenderPriorityRow priority={priority} />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Swipeable>
    );
  };

  let closePreviousOpenRow = index => {
    // console.log('onSwipeableWillOpen');
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
  };

  let renderSpinner = () => {
    return (
      <View style={styles.loading}>
        <QPSpinner />
      </View>
    );
  };

  let renderContainer = () => {
    if (props.notificationLogs.length === 0) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.boldFont}>
            {translate('dashboard.no_notification_to_display')}
          </Text>
        </View>
      );
    } else {
      return (
        <FlatList
          data={props.notificationLogs}
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
      {clearAllAlert && renderClearAllAlert()}
    </View>
  );
};

const mapStateToProps = state => {
  return {
    notificationLogs: state.notification.notificationLogs,
  };
};

const mapDispatchToProps = dispatch => ({
  clearNotificationAction: notification => {
    dispatch(clearNotification(notification));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Notification);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: PaddingConstants.halfTab,
    backgroundColor: Colors.white,
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
    backgroundColor: Colors.white,
    margin: MarginConstants.tab1,
    borderRadius: 2,
    padding: MarginConstants.tab1_2x,
  },
});
