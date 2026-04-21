import React from 'react';
import {Text, View, Pressable, StyleSheet} from 'react-native';
import {Colors} from '../styles/color.constants';
import {TextSizes} from '../styles/textsize.constants';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import {useDispatch, useSelector} from 'react-redux';
import {
  getClosedLoopOwnerDetails,
  setSegment,
} from '../redux/actions/dashboard.actions';
import {useEffect} from 'react';
import {StackActions, useNavigation} from '@react-navigation/native';
import {translate} from '../Utils/MultilinguaUtils';
import {MarginConstants} from '../styles/margin.constants';
import SegmentText from './SegmentText';
import {IonIcon} from '../Utils/IconUtils';

export const NotiificationIcon = () => {
  const navigation = useNavigation();
  const notificationLogs = useSelector(
    state => state.notification.notificationLogs,
  );

  const unreadCount = notificationLogs?.filter(log => !log.hasRead).length || 0;

  return (
    <Pressable
      onPress={() => {
        const action = StackActions.push('notifications');
        navigation.dispatch(action);
        // navigation.navigate('Notifications');
      }}
      style={styles.notificationContainer}>
      <IonIcon name={'notifications'} size={22} color={Colors.white} />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount}</Text>
        </View>
      )}
    </Pressable>
  );
};

const RenderSegmentSelector = ({
  segmentList,
  screenName,
  currentSegment,
  onPress,
}) => {
  return segmentList && segmentList.length > 1 ? (
    <Pressable style={styles.innerContainer} onPress={onPress}>
      <SegmentText
        screenName={screenName}
        segmentName={currentSegment.currentSegment ?? ''}
      />

      <SimpleLineIcon name={'arrow-down'} size={15} color={Colors.darkGrey} />
    </Pressable>
  ) : (
    <View style={styles.innerContainer}>
      <SegmentText
        screenName={screenName}
        segmentName={currentSegment.currentSegment}
      />
    </View>
  );
};

const SegmentSelector = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const authToken = useSelector(state => state.global.authToken);
  const segmentList = useSelector(
    state => state.dashboard.segmentDetails.segments,
  );
  const currentSegment = useSelector(state => state.dashboard.currentSegment);

  useEffect(() => {
    console.log('SELECTED SEGMENT__', JSON.stringify(props));

    if (currentSegment.currentSegmentID) {
      dispatch(
        getClosedLoopOwnerDetails(authToken, {
          segmentID: currentSegment.currentSegmentID,
        }),
      );
    }
  }, [currentSegment]);

  const onPressHandle = () => {
    const pushAction = StackActions.push(translate('dashboard.segment'), {
      currentSegmentId: currentSegment.currentSegmentID,
      setSegmentSelection: setSegmentSelection,
    });

    navigation.dispatch(pushAction);
  };

  const setSegmentSelection = segment_ => {
    dispatch(setSegment(segment_));
  };

  return (
    <View style={styles.titleWrapper}>
      <RenderSegmentSelector
        segmentList={segmentList}
        screenName={props.screenName}
        currentSegment={currentSegment}
        onPress={onPressHandle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  titleWrapper: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationContainer: {
    position: 'relative',
    marginRight: MarginConstants.tab1_2x,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.red,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default SegmentSelector;
