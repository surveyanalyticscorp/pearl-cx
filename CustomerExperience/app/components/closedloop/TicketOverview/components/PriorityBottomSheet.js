import React, {useState} from 'react';

import useUpdateTicket from '../hooks/useUpdateTicket';
import {useSelector} from 'react-redux';
import {
  getPriorityIndexById,
  priorityList,
} from '../../../../Utils/TicketUtils';
import SelectPriority from '../../takeaction/SelectPriority';
import {QPBottomSheet, QPBottomSheetHeader} from '../../../../widgets/QPBottomSheet';

const PriorityBottomSheet = ({visible, onClose}, ref) => {
  const updateTicket = useUpdateTicket();
  const {priority} = useSelector(state => state.dashboard.ticket);
  const [priorityIndex, setPriorityIndex] = useState(
    getPriorityIndexById(priority ?? -1),
  );

  return (
    <QPBottomSheet
      visible={visible}
      onClose={onClose}
      headerComponent={
        <QPBottomSheetHeader headerLabel={'Priority'} onClose={onClose} />
      }>
      <SelectPriority
        data={priorityList}
        selectedIndex={priorityIndex}
        screenName={'TicketOverview'}
        handleOnPress={(item, index) => {
          setPriorityIndex(index);
          updateTicket({priority: item.id});
          onClose();
        }}
      />
    </QPBottomSheet>
  );
};

export default PriorityBottomSheet;
