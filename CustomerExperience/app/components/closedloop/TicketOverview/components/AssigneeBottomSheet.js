import React, {useState} from 'react';
import useUpdateTicket from '../hooks/useUpdateTicket';
import {useSelector} from 'react-redux';
import {getOwnerIndex} from '../../../../Utils/TicketUtils';
import {translate} from '../../../../Utils/MultilinguaUtils';
import SelectTicketOwner from '../../takeaction/SelectTicketOwner';
import {QPBottomSheet, QPBottomSheetHeader} from '../../../../widgets/QPBottomSheet';

const AssigneeBottomSheet = ({onClose, visible}) => {
  const STATUS_ESCALATED = 2;
  const updateTicket = useUpdateTicket();
  const {owners} = useSelector(state => state.dashboard.ownerDetails ?? []);
  const {assignToId} = useSelector(state => state.dashboard.ticket);
  const [ticketOwnerIndex, setTicketOwnerIndex] = useState(
    getOwnerIndex(owners, assignToId ?? 0),
  );

  return (
    <QPBottomSheet
      visible={visible}
      onClose={onClose}
      bottomSheetHeight="60%"
      headerComponent={
        <QPBottomSheetHeader
          headerLabel={translate('ticket_overview.select_ticket_owner')}
          onClose={onClose}
        />
      }>
      <SelectTicketOwner
        data={owners}
        selectedIndex={ticketOwnerIndex}
        handleOnPress={(item, index) => {
          console.log('handleOnPress', item, index);

          setTicketOwnerIndex(index);
          // escalating ticket and assigning a new owner
          updateTicket({
            status: STATUS_ESCALATED,
            assignToId: item.ownerID,
          });
          onClose();
        }}
      />
    </QPBottomSheet>
  );
};

export default AssigneeBottomSheet;
