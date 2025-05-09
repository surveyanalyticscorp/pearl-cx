import React, {useCallback, useState} from 'react';
import {RefreshControl, View} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import BottomSheetHeader from '../../../routes/commonUI/BottomSheetHeader';
import {useDispatch, useSelector} from 'react-redux';
import {getStatusIndexById, statusList} from '../../../Utils/TicketUtils';
import SelectStatus from '../takeaction/SelectStatus';
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
import {getClosedLoopTicketItem} from '../../../redux/actions/dashboard.actions';

const TicketStatusPriorityView = ({children}) => {
  return (
    <View style={ticketOverviewStyles.ticketStatusContainer}>{children}</View>
  );
};

export default function TicketOverview(props) {
  const isFromClosedLoopScreen =
    translate('dashboard.closed_loop') === props.route.params.prevScreen;

  const updateTicket = useUpdateTicket();
  const ticketDetails = useSelector(state => state.dashboard.ticket);
  const feedbackApiKey = useSelector(
    state => state.global.userInfo.feedbackApiKey,
  );
  const [refreshing, setRefreshing] = useState(false);
  const [statusIndex, setStatusIndex] = useState(
    getStatusIndexById(ticketDetails.status ?? -1),
  );
  const dispatch = useDispatch();
  console.log('TTTTT', ticketDetails ?? '');

  /// BOTTOM SHEET

  // variables for bottom sheet
  const actionBottomSheet = React.useRef();
  const statusBottomSheet = React.useRef();
  const priorityBottomSheet = React.useRef();
  const assigneeBottomSheet = React.useRef();
  const statusBottomSheetSnapPoints = ['55', '0'];

  const fall = new Animated.Value(1);
  const onTakeActionHandler = () => {
    priorityBottomSheet.current.snapTo(1);
    statusBottomSheet.current.snapTo(1);
    assigneeBottomSheet.current.snapTo(1);
    actionBottomSheet.current.snapTo(0);
  };
  const handleStatusSelection = () => {
    priorityBottomSheet.current.snapTo(1);
    statusBottomSheet.current.snapTo(0);
    assigneeBottomSheet.current.snapTo(1);
    actionBottomSheet.current.snapTo(1);
  };

  const handlePrioritySelection = () => {
    priorityBottomSheet.current.snapTo(0);
    statusBottomSheet.current.snapTo(1);
    assigneeBottomSheet.current.snapTo(1);
    actionBottomSheet.current.snapTo(1);
  };
  const handleOwnerSelection = () => {
    priorityBottomSheet.current.snapTo(1);
    statusBottomSheet.current.snapTo(1);
    assigneeBottomSheet.current.snapTo(0);
    actionBottomSheet.current.snapTo(1);
  };

  const renderStatusHeader = () => {
    return <BottomSheetHeader title={'Status'} onPressClose={closeBS} />;
  };

  const RenderStatusSelectContent = () => {
    return (
      <View style={ticketOverviewStyles.contentContainer}>
        <SelectStatus
          data={statusList}
          screenName={'TicketOverview'}
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

  const RenderStatusBottomSheet = () => {
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

  const closeBS = () => {
    statusBottomSheet.current.snapTo(statusBottomSheetSnapPoints.length - 1);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    dispatch(getClosedLoopTicketItem('', ticketDetails.id, feedbackApiKey));

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <TicketOverviewContainer>
      <Animated.ScrollView
        style={{
          opacity: Animated.add(0.3, Animated.multiply(fall, 1.0)),
        }}
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        }>
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
      <RenderStatusBottomSheet />
      <PriorityBottomSheet ref={priorityBottomSheet} fall={fall} />
      <AssigneeBottomSheet ref={assigneeBottomSheet} fall={fall} />
      <ActionBottomSheet ref={actionBottomSheet} fall={fall} />
    </TicketOverviewContainer>
  );
}
