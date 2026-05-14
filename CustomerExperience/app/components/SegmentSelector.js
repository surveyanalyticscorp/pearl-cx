import React, {useCallback, useState} from 'react';
import {Text, View, Pressable, StyleSheet} from 'react-native';
import {Colors} from '../styles/color.constants';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import {useDispatch, useSelector} from 'react-redux';
import {
  getClosedLoopOwnerDetails,
  setSegment,
} from '../redux/actions/dashboard.actions';
import {useEffect} from 'react';
import {translate} from '../Utils/MultilinguaUtils';
import {MarginConstants} from '../styles/margin.constants';
import SegmentText from './SegmentText';
import {IonIcon} from '../Utils/IconUtils';
import {StackActions, useNavigation} from '@react-navigation/native';
import {QPBottomSheet, QPBottomSheetHeader} from '../widgets/QPBottomSheet';
import {SegmentSheetContent} from './selectSegmentScreen/SegmentSheetContent';

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
  const authToken = useSelector(state => state.global.authToken);
  const segmentList = useSelector(
    state => state.dashboard.segmentDetails.segments,
  );
  const currentSegment = useSelector(state => state.dashboard.currentSegment);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (currentSegment.currentSegmentID) {
      dispatch(
        getClosedLoopOwnerDetails(authToken, {
          segmentID: currentSegment.currentSegmentID,
        }),
      );
    }
  }, [currentSegment]);

  const closeSheet = useCallback(() => setVisible(false), []);

  const onSegmentSelected = useCallback(
    segment_ => {
      dispatch(setSegment(segment_));
      closeSheet();
    },
    [dispatch, closeSheet],
  );

  return (
    <>
      <View style={styles.titleWrapper}>
        <RenderSegmentSelector
          segmentList={segmentList}
          screenName={props.screenName}
          currentSegment={currentSegment}
          onPress={() => setVisible(true)}
        />
      </View>

      <QPBottomSheet
        visible={visible}
        onClose={closeSheet}
        bottomSheetHeight="80%"
        headerComponent={
          <QPBottomSheetHeader
            headerLabel={translate('dashboard.segment')}
            onClose={closeSheet}
          />
        }>
        <SegmentSheetContent
          currentSegmentId={currentSegment.currentSegmentID}
          onSelect={onSegmentSelected}
        />
      </QPBottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
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
