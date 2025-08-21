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
import TicketTakeAction from '../takeaction/TIcketTakeAction';
import useActionHandler from './components/useActionHandler';
import ShowTitleAndText, {Title} from '../ui/ShowTitleAndText';
import {
  CommentText,
  getFoldedDescriptionText,
  getFoldedText,
} from '../TicketComments';
import StringUtils from '../../../Utils/StringUtils';
import TextLabel from '../../../widgets/TextLabel/TextLabel';
import {get} from 'lodash';
import {DescriptionDetails} from './components/DescriptionDetails';

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
  const temp =
    "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum";
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
  const {handleTicketAction} = useActionHandler();
  const [descriptionBottomSheetVisible, setDescriptionBottomSheetVisible] =
    useState(false);
  const onCloseDescriptionBottomSheet = () => {
    setDescriptionBottomSheetVisible(false);
  };

  const onPressDescriptionMore = () => {
    setDescriptionBottomSheetVisible(true);
  };
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
    setActionBottomSheetVisible(true);
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
          <ContactView onTakeActionHandler={onTakeActionHandler}>
            {/* {ticketDetails.comment?.length > 0 ? (
              <Title text={`${translate('ticket_overview.description')}:`} />
            ) : (
              <View />
            )} */}
            <TicketDescription onPress={onPressDescriptionMore} />
          </ContactView>
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
      <DescriptionBottomSheet
        onClose={onCloseDescriptionBottomSheet}
        isVisible={descriptionBottomSheetVisible}
      />
    </TicketOverviewContainer>
  );
}
