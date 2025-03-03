import React, {useState} from 'react';
import BottomSheet from 'reanimated-bottom-sheet';
import {View} from 'react-native';
import BottomSheetHeader from '../../../../routes/commonUI/BottomSheetHeader';
import useUpdateTicket from '../hooks/useUpdateTicket';
import {useSelector} from 'react-redux';
import {getOwnerIndex} from '../../../../Utils/TicketUtils';
import ticketOverviewStyles from '../ticket.overview.style';
import {translate} from '../../../../Utils/MultilinguaUtils';
import SelectTicketOwner from '../../takeaction/SelectTicketOwner';

const AssigneeBottomSheet = React.forwardRef(({fall}, ref) => {
  const STATUS_ESCALATED = 2;
  const snapPoints = ['50%', '0%'];
  const updateTicket = useUpdateTicket();
  const {owners} = useSelector(state => state.dashboard.ownerDetails ?? []);
  const {assignToId} = useSelector(state => state.dashboard.ticket);
  const [ticketOwnerIndex, setTicketOwnerIndex] = useState(
    getOwnerIndex(owners, assignToId ?? 0),
  );

  const close = () => {
    ref.current.snapTo(snapPoints.length - 1);
  };
  const renderHeader = () => {
    return (
      <BottomSheetHeader
        title={translate('ticket_overview.select_ticket_owner')}
        onPressClose={() => close()}
      />
    );
  };

  const renderContent = () => {
    return (
      <View style={ticketOverviewStyles.contentContainer}>
        <SelectTicketOwner
          data={owners}
          selectedIndex={ticketOwnerIndex}
          handleOnPress={(item, index) => {
            close();
            if (
              assignToId !== item.ownerID &&
              STATUS_ESCALATED !== item.status
            ) {
              setTicketOwnerIndex(index);
              updateTicket({
                status: STATUS_ESCALATED,
                assignToId: item.ownerID,
              });
            }
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

export default AssigneeBottomSheet;
