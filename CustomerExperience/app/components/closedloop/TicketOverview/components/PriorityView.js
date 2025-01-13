import React from 'react';
import {useSelector} from 'react-redux';
import {translate} from '../../../../Utils/MultilinguaUtils';
import {getPriorityById} from '../../../../Utils/TicketUtils';
import ShowTitleAndDropdown from '../../ui/ShowTitleAndDropdown';
import {RenderPriorityIcon} from '../../../../routes/commonUI/CommonUI';
import {MarginConstants} from '../../../../styles/margin.constants';
const PriorityView = ({onPress}) => {
  const {priority} = useSelector(state => state.dashboard.ticket);

  const priorityName =
    priority === undefined
      ? translate('ticket_overview.select_priority')
      : getPriorityById(priority);

  return (
    <ShowTitleAndDropdown
      title={translate('close_loop.priority')}
      currentItemName={priorityName}
      onPress={onPress}
      hasArrowDownIcon
      frontIcon={
        <RenderPriorityIcon
          style={{margin: MarginConstants.halfTab}}
          title={priorityName}
        />
      }
    />
  );
};

export default PriorityView;
