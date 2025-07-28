import React, {useCallback, useState} from 'react';
import {RefreshControl, View} from 'react-native';
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
import PriorityBottomSheet from './components/PriorityBottomSheet';
import AssigneeBottomSheet from './components/AssigneeBottomSheet';
import {getClosedLoopTicketItem} from '../../../redux/actions/dashboard.actions';
import QPBottomSheet from '../takeaction/QPBottomSheet';
import QPBottomSheetHeader from '../takeaction/QPBottomSheetHeader';
import TicketTakeAction from '../takeaction/TIcketTakeAction';
import useActionHandler from './components/useActionHandler';
import {showErrorFlashMessage} from '../../../Utils/Utility';

const TicketStatusPriorityView = ({children}) => {
  return (
    <View style={ticketOverviewStyles.ticketStatusContainer}>{children}</View>
  );
};

export default function TicketOverview(props) {
  const {handleTicketAction} = useActionHandler();
  const [actionBottomSheetVisible, setActionBottomSheetVisible] =
    useState(false);
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

  const [priorityBottomSheetVisible, setPriorityBottomSheetVisible] =
    useState(false);
  const onClosePriorityBottomSheet = () => {
    setPriorityBottomSheetVisible(false);
  };

  const [statusBottomSheetVisible, setStatusBottomSheetVisible] =
    useState(false);
  const onCloseStatusBottomSheet = () => {
    setStatusBottomSheetVisible(false);
  };

  const fall = new Animated.Value(1);
  const onTakeActionHandler = () => {
    // setActionBottomSheetVisible(true);
    showErrorFlashMessage('Not Implemented Yet');
  };
  const handleStatusSelection = () => {
    setStatusBottomSheetVisible(true);
  };

  const handlePrioritySelection = () => {
    setPriorityBottomSheetVisible(true);
  };
  const handleOwnerSelection = () => {
    setAssigneeBottomSheetVisible(true);
  };

  const RenderStatusBottomSheet = ({onClose, visible}) => {
    return (
      <QPBottomSheet
        visible={visible}
        onClose={onClose}
        headerComponent={
          <QPBottomSheetHeader headerLabel={'Status'} onClose={onClose} />
        }>
        <SelectStatus
          data={statusList}
          screenName={'TicketOverview'}
          selectedIndex={statusIndex}
          handleOnPress={(item, index) => {
            if (ticketDetails.status === item.id) {
              onClose();
              return;
            }
            if (item.id === 2) {
              // popup assign user bottom sheet and let him choose an assignee
              handleOwnerSelection();
            } else {
              updateTicket({status: item.id});
            }
            setStatusIndex(index);
            onClose();
          }}
        />
      </QPBottomSheet>
    );
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    dispatch(getClosedLoopTicketItem('', ticketDetails.id, feedbackApiKey));

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const onCloseActionBottomSheet = () => {
    setActionBottomSheetVisible(false);
  };

  const onPressAction = item => {
    console.log('onPressAction', item);
    setActionBottomSheetVisible(false);
    handleTicketAction(item);
  };
  const [assigneeBottomSheetVisible, setAssigneeBottomSheetVisible] =
    useState(false);
  const onCloseAssigneeBottomSheet = () => {
    setAssigneeBottomSheetVisible(false);
  };
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
      <RenderStatusBottomSheet
        visible={statusBottomSheetVisible}
        onClose={onCloseStatusBottomSheet}
      />
      <PriorityBottomSheet
        visible={priorityBottomSheetVisible}
        onClose={onClosePriorityBottomSheet}
      />
      <AssigneeBottomSheet
        onClose={onCloseAssigneeBottomSheet}
        visible={assigneeBottomSheetVisible}
      />
      <QPBottomSheet
        visible={actionBottomSheetVisible}
        onClose={onCloseActionBottomSheet}
        headerComponent={
          <QPBottomSheetHeader
            headerLabel="Action"
            onClose={onCloseActionBottomSheet}
          />
        }>
        <TicketTakeAction onPress={onPressAction} />
      </QPBottomSheet>
    </TicketOverviewContainer>
  );
}
