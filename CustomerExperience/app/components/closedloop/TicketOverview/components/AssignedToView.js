import React from 'react';

import {useSelector} from 'react-redux';
import ShowTitleAndDropdown from '../../ui/ShowTitleAndDropdown';
import {translate} from '../../../../Utils/MultilinguaUtils';
import {getOwnerNameById} from '../../../../Utils/TicketUtils';

const AssignedToView = () => {
  const {assignToId} = useSelector(state => state.dashboard.ticket);

  const {owners} = useSelector(state => state.dashboard.ownerDetails ?? []);

  const ownerName =
    assignToId === undefined
      ? 'Select owner'
      : getOwnerNameById(owners, assignToId);

  return (
    <ShowTitleAndDropdown
      title={translate('ticket_overview.assigned_to')}
      currentItemName={ownerName}
      hasArrowDownIcon={false}
      isDisabled={true}
    />
  );
};

export default AssignedToView;
