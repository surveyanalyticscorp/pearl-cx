import React, {useState} from 'react';
import {View} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import BottomSheetHeader from '../../../routes/commonUI/BottomSheetHeader';
import {useSelector} from 'react-redux';
import {
  getOwnerIndex,
  getPriorityIndexById,
  getStatusIndexById,
  priorityList,
  statusList,
} from '../../../Utils/TicketUtils';
import SelectStatus from '../takeaction/SelectStatus';
import SelectPriority from '../takeaction/SelectPriority';
import SelectTicketOwner from '../takeaction/SelectTicketOwner';
import {translate} from '../../../Utils/MultilinguaUtils';
import ticketOverviewStyles from './ticket.overview.style';
import TicketOverviewContainer from './components/TicketOverviewContainer';

import useUpdateTicket from './hooks/useUpdateTicket';
import DescriptionView from './components/DescriptionView';
import DeleteView from './components/DeleteView';
import ContactView from './components/ContactView';
import StatusView from './components/StatusView';
import PriorityView from './components/PriorityView';
import AssignedToView from './components/AssignedToView';
import ActionBottomSheet from './components/ActionBottomSheet';
import PriorityBottomSheet from './components/PriorityBottomSheet';
import AssigneeBottomSheet from './components/AssigneeBottomSheet';

const TicketStatusPriorityView = ({children}) => {
  return (
    <View style={ticketOverviewStyles.ticketStatusContainer}>{children}</View>
  );
};

const RenderOwnerSelectContent = () => {
  const updateTicket = useUpdateTicket();
  const {owners} = useSelector(state => state.dashboard.ownerDetails ?? []);
  const {assignToId} = useSelector(state => state.dashboard.ticket);
  const [ticketOwnerIndex, setTicketOwnerIndex] = useState(
    getOwnerIndex(owners, assignToId ?? 0),
  );

  return (
    <View style={ticketOverviewStyles.contentContainer}>
      <SelectTicketOwner
        data={owners}
        selectedIndex={ticketOwnerIndex}
        handleOnPress={(item, index) => {
          setTicketOwnerIndex(index);
          updateTicket({assignToId: item.ownerID});
        }}
      />
    </View>
  );
};

const RenderPrioritySelectContent = () => {
  const updateTicket = useUpdateTicket();
  const {priority} = useSelector(state => state.dashboard.ticket);

  const [priorityIndex, setPriorityIndex] = useState(
    getPriorityIndexById(priority ?? -1),
  );
  return (
    <View style={ticketOverviewStyles.contentContainer}>
      <SelectPriority
        data={priorityList}
        selectedIndex={priorityIndex}
        handleOnPress={(item, index) => {
          setPriorityIndex(index);
          updateTicket({priority: item.id});
        }}
      />
    </View>
  );
};
export default function TicketOverview(props) {
  const bottomSheetEnum = {
    status: 'status',
    priority: 'priority',
    owners: 'owners',
    segment: 'segment',
  };
  const isFromClosedLoopScreen =
    translate('dashboard.closed_loop') === props.route.params.prevScreen;

  const updateTicket = useUpdateTicket();
  const [currentBS, setCurrentBS] = useState(bottomSheetEnum.status);
  const ticketDetails = useSelector(state => state.dashboard.ticket);

  const [statusIndex, setStatusIndex] = useState(
    getStatusIndexById(ticketDetails.status ?? -1),
  );

  console.log('TTTTT', ticketDetails ?? '');

  /// BOTTOM SHEET

  // variables for bottom sheet
  const actionBottomSheet = React.useRef();
  const statusBottomSheet = React.useRef();
  const priorityBottomSheet = React.useRef();
  const assigneeBottomSheet = React.useRef();

  const statusBottomSheetSnapPoints = ['50', '0'];
  const priorityBottomSheetSnapPoints = ['50', '0'];
  const assigneeBottomSheetSnapPoints = ['50', '0'];

  const fall = new Animated.Value(1);
  const onTakeActionHandler = () => {
    actionBottomSheet.current.snapTo(0);
  };
  const handleStatusSelection = () => {
    setCurrentBS(bottomSheetEnum.status);
    statusBottomSheet.current.snapTo(0);
  };

  const handlePrioritySelection = () => {
    // setCurrentBS(bottomSheetEnum.priority);
    priorityBottomSheet.current.snapTo(0);
  };
  const handleOwnerSelection = () => {
    // setCurrentBS(bottomSheetEnum.owners);
    assigneeBottomSheet.current.snapTo(0);
  };

  const renderStatusHeader = () => {
    return <BottomSheetHeader title={'Status'} onPressClose={closeBS} />;
  };

  const RenderStatusSelectContent = () => {
    return (
      <View style={ticketOverviewStyles.contentContainer}>
        <SelectStatus
          data={statusList}
          selectedIndex={statusIndex}
          handleOnPress={(item, index) => {
            if (ticketDetails.status === item.id) {
              closeBS();
              return;
            }
            if (item.id === 2) {
              // popup assign user bottom sheet and let him choose an assignee
              handleOwnerSelection();
            } else {
              updateTicket({status: item.id});
            }
            setStatusIndex(index);
          }}
        />
      </View>
    );
  };

  const RenderStatusBottomSheet = ({currentBS_}) => {
    return (
      <BottomSheet
        ref={statusBottomSheet}
        snapPoints={statusBottomSheetSnapPoints}
        initialSnap={statusBottomSheetSnapPoints.length - 1}
        renderContent={RenderStatusSelectContent}
        renderHeader={renderStatusHeader}
        callbackNode={fall}
      />
    );
  };

  const RenderPriorityHeader = () => {
    return <BottomSheetHeader title={'Priority'} onPressClose={closeBS} />;
  };

  const RenderOwnerHeader = () => {
    return (
      <BottomSheetHeader
        title={translate('ticket_overview.select_ticket_owner')}
        onPressClose={closeBS}
      />
    );
  };

  const closeBS = () => {
    statusBottomSheet.current.snapTo(statusBottomSheetSnapPoints.length - 1);
  };

  return (
    <TicketOverviewContainer>
      <Animated.ScrollView
        style={{
          opacity: Animated.add(0.3, Animated.multiply(fall, 1.0)),
        }}>
        <View style={ticketOverviewStyles.container}>
          <TicketStatusPriorityView>
            <StatusView onPress={handleStatusSelection} />
            <PriorityView onPress={handlePrioritySelection} />
            <AssignedToView />
          </TicketStatusPriorityView>
          <DescriptionView showResponseButton={isFromClosedLoopScreen} />
          <ContactView onTakeActionHandler={onTakeActionHandler} />
          <DeleteView />
        </View>
      </Animated.ScrollView>
      <RenderStatusBottomSheet currentBS_={currentBS} />
      <PriorityBottomSheet ref={priorityBottomSheet} fall={fall} />
      <AssigneeBottomSheet ref={assigneeBottomSheet} fall={fall} />
      <ActionBottomSheet ref={actionBottomSheet} fall={fall} />
    </TicketOverviewContainer>
  );
}
