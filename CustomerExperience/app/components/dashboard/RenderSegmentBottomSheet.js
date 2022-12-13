import React from 'react';
import {KeyboardAvoidingView, View} from 'react-native';
import {BottomSheetHeader} from '../../routes/CommonScreen';
import BottomSheet from 'reanimated-bottom-sheet';
// import Animated from 'react-native-reanimated';
import {useDispatch, useSelector} from 'react-redux';
import {
  setSegment,
  setSegmentSelectorOpen,
} from '../../redux/actions/dashboard.actions';
import GlobalSelectSegment from './GlobalSelectSegment';
import {getSegmentIndex} from '../../Utils/TicketUtils';
import {Colors} from '../../styles/color.constants';
import {useEffect} from 'react';

const RenderSegmentBottomSheet = ({callbackNode}) => {
  const dispatch = useDispatch();
  const bs = React.useRef(null);
  //   const fall = new Animated.Value(1);
  const bsSnapPoints = ['50%', '0%'];

  const isSegmentSelectorOpen = useSelector(
    (state) => state.dashboard.isSegmentSelectorOpen,
  );

  const segmentList_ = useSelector(
    (state) => state.dashboard.segmentDetails.segments,
  );
  const currentSegment = useSelector((state) => state.dashboard.currentSegment);

  //   let segmentId = useSelector(
  //     (state) => state.dashboard.currentSegment.currentSegmentID,
  //   );
  useEffect(() => {
    if (bs.current) {
      bs.current.snapTo(isSegmentSelectorOpen ? 0 : bsSnapPoints.length - 1);
    }
    // console.log({isOpen: props.isSegmentSelectorOpen});
  }, [isSegmentSelectorOpen]);

  const renderSelectSegmentHeader = () => {
    return (
      <BottomSheetHeader
        title={'Select Segment'}
        onPressClose={() => {
          dispatch(setSegmentSelectorOpen(false));
        }}
      />
    );
  };

  const renderSelectSegment = (props) => {
    // {
    //   console.log('SEGMENT_LIST: ', JSON.stringify(segmentList), segmentId);
    // }
    return (
      <View
        //  style={styles.contentContainer}
        style={{backgroundColor: Colors.white, height: '100%'}}>
        <GlobalSelectSegment
          {...props}
          data={segmentList_}
          selectedIndex={
            getSegmentIndex(
              segmentList_ ?? [],
              currentSegment.currentSegmentID,
            ) ?? 0
          }
          handleOnPress={(item) => handleSegmentSelectionAction(item)}
        />
      </View>
    );
  };

  const handleSegmentSelectionAction = (item) => {
    dispatch(setSegment(item));
    dispatch(setSegmentSelectorOpen(false));
  };

  return (
    <BottomSheet
      ref={bs}
      snapPoints={bsSnapPoints}
      initialSnap={bsSnapPoints.length - 1}
      renderContent={renderSelectSegment}
      renderHeader={renderSelectSegmentHeader}
      callbackNode={callbackNode}
      enabledInnerScrolling={true}
    />
  );
};

export default RenderSegmentBottomSheet;
