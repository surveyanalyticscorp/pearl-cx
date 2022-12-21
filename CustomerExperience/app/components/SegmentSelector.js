import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
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
// import {SEGMENT_SELECTOR} from '../api/Constant';
import {translate} from '../Utils/MultilinguaUtils';

const SegmentSelector = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const authToken = useSelector((state) => state.global.authToken);
  // const segmentSelectorOpenState = useSelector(
  //   (state) => state.dashboard.isSegmentSelectorOpen,
  // );
  const segmentList = useSelector(
    (state) => state.dashboard.segmentDetails.segments,
  );
  const currentSegment = useSelector((state) => state.dashboard.currentSegment);

  useEffect(() => {
    console.log('SELECTED SEGMENT__', JSON.stringify(currentSegment));

    if (currentSegment.currentSegmentID) {
      dispatch(
        getClosedLoopOwnerDetails(authToken, {
          segmentID: currentSegment.currentSegmentID,
        }),
      );
    }
  }, [currentSegment]);

  const onPressHandle = () => {
    // dispatch(setSegmentSelectorOpen(!segmentSelectorOpenState));
    // console.log('CURRENT_SEGMENT_ID', JSON.stringify(currentSegment));

    const pushAction = StackActions.push(translate('dashboard.segment'), {
      currentSegmentId: currentSegment.currentSegmentID,
      setSegmentSelection: setSegmentSelection,
    });

    navigation.dispatch(pushAction);
  };

  const setSegmentSelection = (segment_) => {
    dispatch(setSegment(segment_));
  };

  const SegmentText = ({segmentName}) => {
    const title = `${props.screenName ? props.screenName + ':' : ''} ${
      segmentName ?? ''
    }`;

    return <Text style={styles.appbarTitle}>{title}</Text>;
  };

  return segmentList && segmentList.length > 1 ? (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressHandle}>
        <View style={styles.innerContainer}>
          <SegmentText segmentName={currentSegment.currentSegment ?? ''} />
          <SimpleLineIcon
            name={'arrow-down'}
            size={15}
            color={Colors.darkGrey}
          />
        </View>
      </TouchableOpacity>
    </View>
  ) : (
    <SegmentText segmentName={currentSegment.currentSegment} />
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  appbarTitle: {fontSize: TextSizes.primary, color: Colors.white},
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default SegmentSelector;
