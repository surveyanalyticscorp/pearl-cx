import React, {useState} from 'react';
import BottomSheet from 'reanimated-bottom-sheet';
import {View} from 'react-native';
import BottomSheetHeader from '../../../../routes/commonUI/BottomSheetHeader';

import useUpdateTicket from '../hooks/useUpdateTicket';
import {useSelector} from 'react-redux';
import {
  getPriorityIndexById,
  priorityList,
} from '../../../../Utils/TicketUtils';
import ticketOverviewStyles from '../ticket.overview.style';
import SelectPriority from '../../takeaction/SelectPriority';

const PriorityBottomSheet = React.forwardRef(({fall}, ref) => {
  const snapPoints = ['50%', '0%'];
  const updateTicket = useUpdateTicket();
  const {priority} = useSelector(state => state.dashboard.ticket);
  const [priorityIndex, setPriorityIndex] = useState(
    getPriorityIndexById(priority ?? -1),
  );

  const close = () => {
    ref.current.snapTo(snapPoints.length - 1);
  };
  const renderHeader = () => {
    return (
      <BottomSheetHeader title={'Priority'} onPressClose={() => close()} />
    );
  };

  const renderContent = () => {
    return (
      <View style={ticketOverviewStyles.contentContainer}>
        <SelectPriority
          data={priorityList}
          selectedIndex={priorityIndex}
          screenName={'TicketOverview'}
          handleOnPress={(item, index) => {
            close();
            setPriorityIndex(index);
            updateTicket({priority: item.id});
          }}
        />
      </View>
    );
  };

  return (
    <BottomSheet
      ref={ref}
      snapPoints={snapPoints}
      initialSnap={snapPoints.length - 1}
      renderContent={renderContent}
      renderHeader={renderHeader}
      callbackNode={fall}
    />
  );
});

export default PriorityBottomSheet;
