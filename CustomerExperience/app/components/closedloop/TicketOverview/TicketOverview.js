import React, {useCallback, useState} from 'react';
import {Pressable, RefreshControl, View} from 'react-native';
import Animated from 'react-native-reanimated';
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
import {Title} from '../ui/ShowTitleAndText';
import {CommentText, getFoldedDescriptionText} from '../TicketComments';
import {DescriptionDetails} from './components/DescriptionDetails';
import {Tag} from '../ui/Tags';

const TicketStatusPriorityView = ({children}) => {
  return (
    <View style={ticketOverviewStyles.ticketStatusContainer}>{children}</View>
  );
};
const DescriptionBottomSheet = ({isVisible, onClose, onPress}) => {
  return (
    <QPBottomSheet
      visible={isVisible}
      onClose={onClose}
      bottomSheetHeight="80%"
      headerComponent={
        <QPBottomSheetHeader headerLabel="Description" onClose={onClose} />
      }>
      <DescriptionDetails onPress={onPress} />
    </QPBottomSheet>
  );
};
const TicketDescription = ({onPress}) => {
  const {comment} = useSelector(state => state.dashboard.ticket);
  if (comment && comment.length > 0) {
    return (
      <View>
        <Pressable onPress={onPress}>
          <Title text={`${translate('ticket_overview.description')}:`} />
          <CommentText text={getFoldedDescriptionText(comment, 20)} />
        </Pressable>
      </View>
    );
  } else {
    return <View />;
  }
};

export default function TicketOverview(props) {
  // const {handleTicketAction} = useActionHandler();
  const [descriptionBottomSheetVisible, setDescriptionBottomSheetVisible] =
    useState(false);
  const onCloseDescriptionBottomSheet = () => {
    setDescriptionBottomSheetVisible(false);
  };

  const onPressDescriptionMore = () => {
    setDescriptionBottomSheetVisible(true);
  };
  // const [actionBottomSheetVisible, setActionBottomSheetVisible] =
  //   useState(false);
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

  // const fall = new Animated.Value(1);
  // const onTakeActionHandler = () => {
  //   setActionBottomSheetVisible(true);
  // };
  const handleStatusSelection = () => {
    setStatusBottomSheetVisible(true);
  };

  const handlePrioritySelection = () => {
    setPriorityBottomSheetVisible(true);
  };
  const handleOwnerSelection = useCallback(() => {
    setAssigneeBottomSheetVisible(true);
  }, []);

  const handleStatusPress = useCallback(
    (item, index, onClose) => {
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
    },
    [ticketDetails.status, handleOwnerSelection, updateTicket],
  );

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
          handleOnPress={(item, index) =>
            handleStatusPress(item, index, onClose)
          }
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
  }, [dispatch, ticketDetails.id, feedbackApiKey]);

  // const onCloseActionBottomSheet = () => {
  //   setActionBottomSheetVisible(false);
  // };

  // const handleActionPress = useCallback(
  //   item => {
  //     console.log('onPressAction', item);
  //     setActionBottomSheetVisible(false);
  //     handleTicketAction(item);
  //   },
  //   [handleTicketAction],
  // );

  // const onPressAction = handleActionPress;

  const [assigneeBottomSheetVisible, setAssigneeBottomSheetVisible] =
    useState(false);
  const onCloseAssigneeBottomSheet = () => {
    setAssigneeBottomSheetVisible(false);
  };
  return (
    <TicketOverviewContainer>
      <Animated.ScrollView
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        }>
        <View style={ticketOverviewStyles.container}>
          <TicketStatusPriorityView>
            <StatusView onPress={handleStatusSelection} />
            <PriorityView onPress={handlePrioritySelection} />
            <AssignedToView />
          </TicketStatusPriorityView>
          <DescriptionView showResponseButton={isFromClosedLoopScreen}>
            <TicketDescription onPress={onPressDescriptionMore} />
            <Tag tags={ticketDetails?.tags ?? []} />
          </DescriptionView>
          <ContactView />
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
      {/* <QPBottomSheet
        visible={actionBottomSheetVisible}
        onClose={onCloseActionBottomSheet}
        headerComponent={
          <QPBottomSheetHeader
            headerLabel="Action"
            onClose={onCloseActionBottomSheet}
          />
        }>
        <TicketTakeAction onPress={onPressAction} />
      </QPBottomSheet> */}
      <DescriptionBottomSheet
        onClose={onCloseDescriptionBottomSheet}
        isVisible={descriptionBottomSheetVisible}
      />
    </TicketOverviewContainer>
  );
}
