import React from 'react';
import {translate} from '../../../../Utils/MultilinguaUtils';
import {useSelector} from 'react-redux';
import {getStatusById} from '../../../../Utils/TicketUtils';
import ShowTitleAndDropdown from '../../ui/ShowTitleAndDropdown';
import {RenderStatusIcon} from '../../../../routes/commonUI/CommonUI';
import {MarginConstants} from '../../../../styles/margin.constants';

const StatusView = ({onPress}) => {
  const {status} = useSelector(state => state.dashboard.ticket);
  const statusName =
    status === undefined
      ? translate('close_loop.status')
      : getStatusById(status);
  return (
    <ShowTitleAndDropdown
      title={translate('close_loop.status')}
      currentItemName={statusName}
      onPress={onPress}
      hasArrowDownIcon
      frontIcon={
        <RenderStatusIcon
          style={{margin: MarginConstants.halfTab}}
          title={statusName}
        />
      }
    />
  );
};

export default StatusView;
