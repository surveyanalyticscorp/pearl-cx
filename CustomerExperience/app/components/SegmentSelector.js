import React from 'react';
import {Text, View, Pressable, StyleSheet, Platform} from 'react-native';
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
import {MarginConstants} from '../styles/margin.constants';

const SegmentText = ({screenName, segmentName}) => {
  // const title = `${screenName ? screenName + ':' : ''} ${
  //   segmentName ?? ''
  // }`;

  return (
    <View style={{width: '100%', flexDirection: 'column'}}>
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.appbarTitle}>
        {screenName}
      </Text>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={styles.appbarSegmentName}>
        {segmentName}
      </Text>
    </View>
  );
};

const SegmentSelector = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const authToken = useSelector(state => state.global.authToken);
  // const segmentSelectorOpenState = useSelector(
  //   (state) => state.dashboard.isSegmentSelectorOpen,
  // );
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
    // dispatch(setSegmentSelectorOpen(!segmentSelectorOpenState));
    // console.log('CURRENT_SEGMENT_ID', JSON.stringify(currentSegment));

    const pushAction = StackActions.push(translate('dashboard.segment'), {
      currentSegmentId: currentSegment.currentSegmentID,
      setSegmentSelection: setSegmentSelection,
    });

    navigation.dispatch(pushAction);
  };

  const setSegmentSelection = segment_ => {
    dispatch(setSegment(segment_));
  };

  // console.log('SEGMENT_SELECTOR_VIEW');
  // return <SegmentText segmentName={currentSegment.currentSegment} />;

  return segmentList && segmentList.length > 1 ? (
    // <View style={styles.container}>
    <Pressable style={styles.innerContainer} onPress={onPressHandle}>
      <SegmentText
        screenName={props.screenName}
        segmentName={currentSegment.currentSegment ?? ''}
      />

      <SimpleLineIcon name={'arrow-down'} size={15} color={Colors.darkGrey} />
    </Pressable>
  ) : (
    // </View>
    <SegmentText
      screenName={props.screenName}
      segmentName={currentSegment.currentSegment}
    />
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  appbarTitle: {
    fontSize: TextSizes.primary,
    color: Colors.white,
    marginEnd: MarginConstants.tab3,
  },

  appbarSegmentName: {
    fontSize: TextSizes.secondary,
    color: Colors.white,
    marginEnd: MarginConstants.tab3,
  },

  innerContainer: {
    flex: 1,
    width: Platform.OS === 'ios' ? '100%' : '96%',
    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'space-between',
  },
});

export default SegmentSelector;
