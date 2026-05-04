import React from 'react';
import {KeyboardAvoidingView, View} from 'react-native';
import BottomSheetHeader from '../../routes/commonUI/BottomSheetHeader';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
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
import {translate} from '../../Utils/MultilinguaUtils';

const RenderSegmentBottomSheet = ({callbackNode}) => {
  const dispatch = useDispatch();
  const bs = React.useRef(null);
  //   const fall = new Animated.Value(1);
  const bsSnapPoints = ['50%'];

  const isSegmentSelectorOpen = useSelector(
    state => state.dashboard.isSegmentSelectorOpen,
  );

  const segmentList_ = useSelector(
    state => state.dashboard.segmentDetails.segments,
  );
  const currentSegment = useSelector(state => state.dashboard.currentSegment);

  //   let segmentId = useSelector(
  //     (state) => state.dashboard.currentSegment.currentSegmentID,
  //   );
  useEffect(() => {
    if (bs.current) {
      if (isSegmentSelectorOpen) {
        bs.current.snapToIndex(0);
      } else {
        bs.current.close();
      }
    }
  }, [isSegmentSelectorOpen]);

  const renderSelectSegmentHeader = () => {
    return (
      <BottomSheetHeader
        title={translate('select_segment.select_segment')}
        onPressClose={() => {
          dispatch(setSegmentSelectorOpen(false));
        }}
      />
    );
  };

  const renderSelectSegment = props => {
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
          handleOnPress={item => handleSegmentSelectionAction(item)}
        />
      </View>
    );
  };

  const handleSegmentSelectionAction = item => {
    dispatch(setSegment(item));
    dispatch(setSegmentSelectorOpen(false));
  };

  return (
    <BottomSheet
      ref={bs}
      snapPoints={bsSnapPoints}
      index={-1}
      enablePanDownToClose={true}
    >
      <BottomSheetView>
        {renderSelectSegmentHeader()}
        {renderSelectSegment({})}
      </BottomSheetView>
    </BottomSheet>
  );
};

export default RenderSegmentBottomSheet;
