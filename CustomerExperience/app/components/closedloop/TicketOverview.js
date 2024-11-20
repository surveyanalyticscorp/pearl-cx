import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  Alert,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily, FontWeight} from '../../styles/font.constants';

import QPButton from '../../widgets/Button';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import TicketTakeAction from './takeaction/TIcketTakeAction';

import BottomSheetHeader from '../../routes/commonUI/BottomSheetHeader';
import {
  RenderSpinner,
  RenderPriorityIcon,
  RenderStatusIcon,
} from '../../routes/commonUI/CommonUI';
import {CopyIcon} from '../../routes/commonUI/CommonUI';
import {useDispatch, useSelector} from 'react-redux';
import {
  getOwnerIndex,
  getOwnerNameById,
  getPriorityById,
  getPriorityIndexById,
  getStatusById,
  getStatusIndexById,
  priorityList,
  statusList,
} from '../../Utils/TicketUtils';
import moment from 'moment';
import {FullMonthDateYearFormat} from '../../Utils/AppConstants';
import {
  getClosedLoopOwnerDetails,
  updateClfTicket,
} from '../../redux/actions/dashboard.actions';
import SelectStatus from './takeaction/SelectStatus';
import SelectPriority from './takeaction/SelectPriority';
import SelectTicketOwner from './takeaction/SelectTicketOwner';
import {StackActions, useNavigation} from '@react-navigation/native';
import {translate} from '../../Utils/MultilinguaUtils';
import {
  isObjectEmpty,
  showInfoFlashMessage,
  showSuccessFlashMessage,
} from '../../Utils/Utility';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {
  deleteTickets,
  updateSetTicketEscalation,
} from '../../redux/actions/closedloop.actions';
import NPSScoreView from '../view/NPSScoreView';
import {buttonStyles} from '../../styles/button.styles';
import Clipboard from '@react-native-clipboard/clipboard';
import {baseTextStyles} from '../../styles/text.styles';
import StringUtils from '../../Utils/StringUtils';
import {ChildContainer} from '../../widgets/ParentContainer';
import TextLabel from '../../widgets/TextLabel/TextLabel';
import ShowTitleAndDropdown from '../closedloop/ui/ShowTitleAndDropdown';

export const CopyTicketIdButton = ({ticket}) => {
  const onPress = () => {
    Clipboard.setString(JSON.stringify(ticket.id));
    showInfoFlashMessage(translate('close_loop.copied_success'));
  };

  return (
    <Pressable testID="copy-ticket-id-button" onPress={onPress}>
      <View style={styles.ticketIdView}>
        <CopyIcon size={16} tintColor={Colors.accentLight} />
      </View>
    </Pressable>
  );
};

export const TakeActionButton = ({onTakeActionHandler, hasPanelMember}) => {
  return (
    <View style={styles.takeActionContainer}>
      <QPButton
        testID="TakeActionButton"
        buttonColor={
          hasPanelMember ? Colors.accentLight : Colors.filterIconColor
        }
        style={buttonStyles.primaryButton}
        onPress={onTakeActionHandler}
        buttonText={translate('ticket_overview.take_action')}
        textStyle={buttonStyles.primaryButtonText}
      />
    </View>
  );
};

export const DescriptionHeader = ({text}) => {
  return (
    <TextLabel
      testID="description-header"
      style={{flex: 1}}
      text={text}
      baseTextStyle={baseTextStyles.largeMediumText}
      color={Colors.accent}
    />
  );
};
export const Title = ({value}) => {
  return (
    <Text
      testID="title-text"
      style={[
        styles.titleText,
        {paddingBottom: PaddingConstants.halfTab, flex: 2},
      ]}>
      {value}
    </Text>
  );
};

export const ShowTitleAndText = ({title, subText, isSubtextHighlighted}) => {
  return (
    <View testID="show-title-and-text" style={styles.titleTextContainer}>
      <TextLabel text={title} style={{flex: 2}} />
      {/* <Title value={title} /> */}
      <TextLabel
        text={subText}
        baseTextStyle={baseTextStyles.secondaryLightText}
        color={
          isSubtextHighlighted ? Colors.accentLight : Colors.filterIconColor
        }
        style={{flex: 3}}
      />
    </View>
  );
};

export const DescriptionView = ({ticket, showResponseButton}) => {
  const createdDate =
    ticket !== undefined
      ? moment(ticket.issueDate).format(FullMonthDateYearFormat)
      : '';
  return (
    <View testID="description-view" style={styles.ticketStatusContainer}>
      <View style={styles.rowContainer}>
        <DescriptionHeader text={'Details'} />
        <CopyTicketIdButton ticket={ticket} />
      </View>
      <ChildContainer style={{paddingHorizontal: 0}}>
        <ShowTitleAndText
          title={translate('close_loop.origin_segment')}
          subText={ticket?.originSegment?.name ?? ''}
        />
        <ShowTitleAndText
          title={translate('close_loop.current_segment')}
          subText={ticket?.currentSegment?.name ?? ''}
        />
        <ShowTitleAndText
          title={translate('close_loop.created_on')}
          subText={createdDate}
        />

        {!StringUtils.isEmptyOrNull(ticket?.npsScore) ? (
          <View style={styles.rowContainer}>
            <TextLabel text={'NPS:'} style={{flex: 2}} />
            <NPSScoreView text={ticket?.npsScore} />
          </View>
        ) : (
          <View />
        )}
      </ChildContainer>

      {ticket.responseId && showResponseButton ? (
        <ViewResponseDetailsButton />
      ) : (
        <View />
      )}
    </View>
  );
};

export const ContactView = ({
  panelMember,
  description,
  hasPanelMember,
  onTakeActionHandler,
}) => {
  return (
    <View testID="contact-view" style={[styles.ticketStatusContainer]}>
      <DescriptionHeader text={translate('ticket_overview.contact')} />
      <ChildContainer style={{paddingHorizontal: 0}}>
        <ShowTitleAndText
          title={`${'Name'}`}
          subText={
            panelMember?.name?.length > 0
              ? panelMember.name
              : translate('ticket_list.anonymous')
          }
        />
        {panelMember?.email?.length > 0 ? (
          <ShowTitleAndText
            title={`${translate('responses.email')}`}
            subText={panelMember?.email}
            isSubtextHighlighted={true}
          />
        ) : (
          <View />
        )}
        {panelMember?.phone?.length > 0 ? (
          <ShowTitleAndText
            title={`${translate('create_new_ticket.phone_number')}`}
            subText={panelMember?.phone}
            isSubtextHighlighted={true}
          />
        ) : (
          <View />
        )}
        {description?.length > 0 ? (
          <ShowTitleAndText
            title={`${translate('ticket_overview.description')}:`}
            subText={''}
          />
        ) : (
          <View />
        )}
        {description?.length > 0 ? <TextLabel text={description} /> : <View />}
      </ChildContainer>
      <TakeActionButton
        hasPanelMember={hasPanelMember}
        onTakeActionHandler={onTakeActionHandler}
      />
    </View>
  );
};

export const DeleteView = ({onPressDelete}) => {
  return (
    <QPButton
      testID="DeleteButtonAction"
      buttonColor={Colors.white}
      style={[
        buttonStyles.deleteButton,
        {borderRadius: 2, margin: MarginConstants.tab1},
      ]}
      onPress={onPressDelete}
      buttonText={translate('ticket_overview.delete_ticket')}
      textStyle={buttonStyles.deleteButtonText}
    />
  );
};
export const UnderLineText = ({text, type}) => {
  return (
    <View
      style={[
        {
          flex: 2,
          justifyContent: 'flex-start',
          flexDirection: 'row',
          padding: PaddingConstants.tab1,
        },
      ]}>
      <Text style={styles.underLineText}>{text}</Text>
    </View>
  );
};

export const ViewResponseDetailsButton = () => {
  const responseDetails = useSelector(
    state => state.response.responseDetailsByResponseDetails,
  );
  const {authToken} = useSelector(state => state.global);
  const navigation = useNavigation();
  const navigateToFeedbackDetails = () => {
    navigation.navigate(translate('responses.feedback_details'), {
      data: responseDetails,
      isFromFeedback: false,
      ticketStatus: {},
      token: authToken,
      // parentRoute: translate('responses.responses'),
    });
  };
  return (
    <View style={[styles.rowContainer]}>
      <QPButton
        testID="responseButtonTest"
        style={buttonStyles.textButton}
        onPress={navigateToFeedbackDetails}
        buttonText={`${translate('close_loop.view_response')}`}
        textStyle={[
          baseTextStyles.secondaryRegularText,
          {color: Colors.accentLight},
        ]}
      />

      {/* <TouchableWithoutFeedback onPress={navigateToFeedbackDetails}>
        <Text style={ styles.viewResponseDetailsText}>{`${translate(
          'close_loop.view_response',
        )} >>`}</Text>
      </TouchableWithoutFeedback> */}
    </View>
  );
};

function hasPanelMemberObj(obj) {
  return obj !== null && obj !== undefined && !isObjectEmpty(obj);
}

export default function TicketOverview(props) {
  const bottomSheetEnum = {
    status: 'status',
    priority: 'priority',
    owners: 'owners',
    segment: 'segment',
  };
  const isFromClosedLoopScreen =
    translate('dashboard.closed_loop') === props.route.params.prevScreen;

  const [showAssigneeModal, setAssigneeModal] = useState(false);
  const [showTicketDeleteModal, setTicketDeleteModal] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {authToken} = useSelector(state => state.global);
  const [currentBS, setCurrentBS] = useState(bottomSheetEnum.status);
  const {owners} = useSelector(state => state.dashboard.ownerDetails ?? []);
  const {ticketDeleteStatus} = useSelector(state => state.dashboard);
  const isLoading = useSelector(state => state.global.isTicketLoading);
  const ticketDetails = useSelector(state => state.dashboard.ticket);
  const hasPanelMember = hasPanelMemberObj(ticketDetails.panelMember);
  const {emailAddress, firstName, lastName, userID, feedbackApiKey} =
    useSelector(state => state.global.userInfo);
  // const [selectedSegment, setSelectedSegment] = useState();

  const [statusIndex, setStatusIndex] = useState(
    getStatusIndexById(ticketDetails.status ?? -1),
  );
  const [priorityIndex, setPriorityIndex] = useState(
    getPriorityIndexById(ticketDetails.priority ?? -1),
  );

  // const segments = useSelector(
  //   (state) => state.dashboard.segmentDetails.segments,
  // );
  console.log('TTTTT', ticketDetails ?? '');
  console.log({isLoading});
  const onPressDelete = () => {
    setTicketDeleteModal(true);
    console.log('DELETE');
  };

  const goBack = () => {
    props.navigation.goBack();
  };

  const [ticketOwnerIndex, setTicketOwnerIndex] = useState(
    getOwnerIndex(owners, ticketDetails.assignToId ?? 0),
  );

  useEffect(() => {
    if (
      ticketDeleteStatus.status &&
      ticketDeleteStatus.status.trim() === 'success'
    ) {
      // props.navigation.goBack();
      goBack();
      console.log('GO BACK!!!');
    }
  }, [ticketDeleteStatus]);

  const getTicketOwnerList = segmentId_ => {
    dispatch(
      getClosedLoopOwnerDetails(authToken, {
        segmentID: segmentId_,
      }),
    );
  };

  const updateTicket = params => {
    let body = {
      ...params,
      userName: `${firstName} ${lastName}`,
      userEmailAddress: `${emailAddress}`,
      userId: `${userID}`,
    };

    dispatch(
      updateClfTicket(authToken, body, ticketDetails.id, feedbackApiKey),
    );
  };
  const ticketEscalate = params => {
    let body = {
      ...params,
      userName: `${firstName} ${lastName}`,
      userEmailAddress: `${emailAddress}`,
      userId: `${userID}`,
    };

    dispatch(
      updateSetTicketEscalation(
        authToken,
        body,
        ticketDetails.id,
        feedbackApiKey,
      ),
    );
  };
  /// BOTTOM SHEET

  // variables for bottom sheet
  const actionBottomSheet = React.useRef();
  const statusBottomSheet = React.useRef();
  const actionBottomSheetSnapPoints = ['33%', '0%'];
  const statusBottomSheetSnapPoints = ['50', '0'];

  const fall = new Animated.Value(1);

  const opacity = Animated.interpolate(fall, {
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const colorTint = Animated.interpolate(fall, {
    inputRange: [0, 1],
    outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 0, 0, 0.3)'], // Adjust colors as needed
  });

  const onTakeActionHandler = () => {
    if (hasPanelMember) {
      actionBottomSheet.current.snapTo(0);
    }
    // setAssigneeModal(true);
    // else {
    //   showErrorFlashMessage('Actions disabled, customer details missing');
    // }
  };
  const handleStatusSelection = () => {
    setCurrentBS(bottomSheetEnum.status);
    statusBottomSheet.current.snapTo(0);
  };

  const handlePrioritySelection = () => {
    setCurrentBS(bottomSheetEnum.priority);
    statusBottomSheet.current.snapTo(0);
  };

  const handleSegmentSelection = () => {
    const pushAction = StackActions.push(translate('dashboard.segment'), {
      currentSegmentId: ticketDetails.segmentId,
      setSegmentSelection: setSegmentSelection,
    });
    navigation.dispatch(pushAction);
  };

  const setSegmentSelection = segment => {
    console.log('TICKET_OVERVIEW', JSON.stringify(segment));
    updateTicket({currentSegmentId: segment.segmentID});
    getTicketOwnerList(segment.segmentID);
  };

  const handleOwnerSelection = () => {
    setCurrentBS(bottomSheetEnum.owners);
    statusBottomSheet.current.snapTo(0);
  };

  const RenderStatusHeader = _title => {
    return (
      <BottomSheetHeader
        title={translate('ticket_overview.select_status')}
        onPressClose={closeBS}
      />
    );
  };

  const RenderStatusSelectContent = () => {
    return (
      <View style={styles.contentContainer}>
        <SelectStatus
          data={statusList}
          selectedIndex={statusIndex}
          handleOnPress={(item, index) => {
            if (item.id === 2) {
              // popup assign user bottom sheet and let him choose an assignee
              setAssigneeModal(true);
            } else {
              updateTicket({status: item.id});
            }
            setStatusIndex(index);

            // updateTicket({status: item.id});
          }}
        />
      </View>
    );
  };

  const RenderStatusBottomSheet = ({currentBS_}) => {
    let renderContent = RenderStatusSelectContent;
    let renderHeader = RenderStatusHeader;

    switch (currentBS_) {
      case bottomSheetEnum.priority:
        renderContent = RenderPrioritySelectContent;
        renderHeader = RenderPriorityHeader;
        break;

      case bottomSheetEnum.owners:
        renderContent = RenderOwnerSelectContent;
        renderHeader = RenderOwnerHeader;
        break;
    }
    console.log('SNAP', currentBS_);
    return (
      <BottomSheet
        ref={statusBottomSheet}
        snapPoints={statusBottomSheetSnapPoints}
        initialSnap={statusBottomSheetSnapPoints.length - 1}
        renderContent={renderContent}
        renderHeader={renderHeader}
        callbackNode={fall}
      />
    );
  };

  const RenderPriorityHeader = _title => {
    return (
      <BottomSheetHeader
        title={translate('ticket_overview.select_priority')}
        onPressClose={closeBS}
      />
    );
  };

  const RenderPrioritySelectContent = () => {
    return (
      <View style={styles.contentContainer}>
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

  const RenderOwnerHeader = _title => {
    return (
      <BottomSheetHeader
        title={translate('ticket_overview.select_ticket_owner')}
        onPressClose={closeBS}
      />
    );
  };

  const RenderOwnerSelectContent = () => {
    return (
      <View style={styles.contentContainer}>
        <SelectTicketOwner
          data={owners}
          selectedIndex={ticketOwnerIndex}
          handleOnPress={(item, index) => {
            setAssigneeModal(false);
            setTicketOwnerIndex(index);
            updateTicket({assignToId: item.ownerID});
          }}
        />
      </View>
    );
  };

  const RenderShowAssigneeModal = ({showAssigneeModal, id, currentSegment}) => {
    return (
      <Modal animationType="slide" visible={showAssigneeModal}>
        <View style={{height: '80%'}}>
          <View style={[styles.rowContainer, styles.modalHeader]}>
            <Text
              style={
                styles.modalHeaderText
              }>{`Assign user to ticket #${id}`}</Text>
            <TouchableWithoutFeedback onPress={() => setAssigneeModal(false)}>
              <IonIcons name="close" size={20} color={Colors.white} />
            </TouchableWithoutFeedback>
          </View>
          <View style={{marginVertical: MarginConstants.tab2}}>
            <DescriptionHeader
              testID="DescriptionHeader"
              text={`${translate('close_loop.current_segment')}: ${
                currentSegment?.name ?? ''
              }`}
            />
          </View>
          <View style={styles.contentContainer}>
            <SelectTicketOwner
              data={owners}
              selectedIndex={ticketOwnerIndex}
              handleOnPress={(item, index) => {
                setAssigneeModal(false);
                setTicketOwnerIndex(index);
                // updateTicketEscalation{{userName: }}
                ticketEscalate({assignToId: item.ownerID});
              }}
            />
          </View>
        </View>
      </Modal>
    );
  };

  const closeBS = () => {
    statusBottomSheet.current.snapTo(statusBottomSheetSnapPoints.length - 1);
  };

  let getNPSColor = sentiment => {
    switch (sentiment) {
      case 'Detractor':
        return Colors.detractor2;
      case 'Passive':
        return Colors.passive2;
      default:
        return Colors.promoter2;
    }
  };

  const departmentNameCell = ({item}) => {
    return (
      <View style={[{flex: 1}, styles.rowContainer]}>
        <Text style={styles.departmentNameText}>{item}</Text>
      </View>
    );
  };

  const TicketStatusPriorityView = ({ticket}) => {
    const isEscalated = ticket.status === 2;
    const segmentName = ticket?.currentSegment?.name ?? '';
    const statusName =
      ticket !== undefined
        ? getStatusById(ticket.status)
        : translate('close_loop.status');

    const priorityName =
      ticket !== undefined
        ? getPriorityById(ticket.priority)
        : translate('ticket_overview.select_priority');
    const ownerName =
      ticket !== undefined
        ? // ? ticketDetails.assignToId
          getOwnerNameById(owners, ticket.assignToId)
        : 'Select owner';

    return (
      <View style={styles.ticketStatusContainer}>
        <ShowTitleAndDropdown
          title={translate('close_loop.status')}
          currentItemName={statusName}
          onPress={handleStatusSelection}
          hasArrowDownIcon
          frontIcon={
            <RenderStatusIcon
              style={{margin: MarginConstants.halfTab}}
              title={statusName}
            />
          }
        />

        <ShowTitleAndDropdown
          title={translate('close_loop.priority')}
          currentItemName={priorityName}
          onPress={handlePrioritySelection}
          hasArrowDownIcon
          frontIcon={
            <RenderPriorityIcon
              style={{margin: MarginConstants.halfTab}}
              title={priorityName}
            />
          }
        />

        <ShowTitleAndDropdown
          title={translate('ticket_overview.assigned_to')}
          currentItemName={ownerName}
          onPress={isEscalated ? () => {} : handleOwnerSelection}
          hasArrowDownIcon={!isEscalated}
          isDisabled={isEscalated}
        />
      </View>
    );
  };

  const navigateToSendEmail = () => {
    actionBottomSheet.current.snapTo(actionBottomSheetSnapPoints.length - 1);
    props.navigation.navigate('sendEmail', {
      toEmail: ticketDetails?.panelMember?.email ?? '',
      ticketId: ticketDetails?.id,
    });
  };

  const promptCall = () => {
    console.log('call');
  };

  const promptSms = () => {
    console.log('SMS');
  };

  const deleteCurrentTickets = useCallback(text => {
    dispatch(deleteTickets(authToken, {ticketIds: [ticketDetails.id]}));
  }, []);

  const handleTicketAction = useCallback(item => {
    switch (item.id) {
      case 1:
        navigateToSendEmail();
        break;
      case 2:
        promptCall();
        break;
      case 3:
        promptSms();
        break;
      default:
        navigateToSendEmail();
        break;
    }
  }, []);

  const renderTicketTakeAction = () => {
    const data = [
      {
        id: 1,
        title: translate('action_email.respond_via_email'),
        icon: 'email',
      },
    ];

    return (
      <View style={styles.contentContainer}>
        <TicketTakeAction
          data={data}
          handleOnPress={item => handleTicketAction(item)}
        />
      </View>
    );
  };

  let renderDeleteAlert = () => {
    return Alert.alert(
      `Ticket No. #${ticketDetails.id}`,
      `Would you like to delete this ticket?`,
      [
        {
          text: 'Confirm',
          onPress: () => {
            // delete API call
            deleteCurrentTickets();
            setTicketDeleteModal(false);
          },
        },
        {
          text: 'Cancel',
          onPress: () => {
            setTicketDeleteModal(false);
          },
        },
      ],
      {cancelable: true},
    );
  };

  const renderHeader = () => {
    return (
      <BottomSheetHeader
        title={translate('ticket_overview.take_action')}
        onPressClose={() =>
          actionBottomSheet.current.snapTo(
            actionBottomSheetSnapPoints.length - 1,
          )
        }
      />
    );
  };

  return !isLoading ? (
    <View testID="ticket-overview" style={styles.container}>
      <Animated.ScrollView
        style={{
          opacity: Animated.add(0.3, Animated.multiply(fall, 1.0)),
        }}>
        <View style={styles.container}>
          {/* {ticketStatusPriorityView()} */}
          <TicketStatusPriorityView ticket={ticketDetails} />
          <DescriptionView
            ticket={ticketDetails}
            showResponseButton={isFromClosedLoopScreen}
          />

          <ContactView
            panelMember={ticketDetails?.panelMember}
            description={ticketDetails?.comment ? ticketDetails?.comment : ''}
            hasPanelMember={hasPanelMember}
            onTakeActionHandler={onTakeActionHandler}
          />
          <DeleteView onPressDelete={onPressDelete} />
          {/* <TakeActionButton
            hasPanelMember={hasPanelMember}
            onTakeActionHandler={onTakeActionHandler}
          /> */}
          <RenderShowAssigneeModal
            showAssigneeModal={showAssigneeModal}
            id={ticketDetails.id}
            currentSegment={ticketDetails.currentSegment}
          />
        </View>
      </Animated.ScrollView>
      {showTicketDeleteModal ? renderDeleteAlert() : <View />}
      <RenderStatusBottomSheet currentBS_={currentBS} />
      {/* <RenderPriorityBottomSheet />
      <RenderSegmentBottomSheet />
      <RenderOwnerBottomSheet /> */}
      <BottomSheet
        ref={actionBottomSheet}
        snapPoints={actionBottomSheetSnapPoints}
        initialSnap={actionBottomSheetSnapPoints.length - 1}
        renderContent={renderTicketTakeAction}
        renderHeader={renderHeader}
        callbackNode={fall}
        // onCloseEnd={() => setShadow(false)}
        // onOpenStart={() => setShadow(true)}
      />
    </View>
  ) : (
    <RenderSpinner />
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.white,
  },
  container: {
    margin: MarginConstants.halfTab,
    flex: 1,
  },
  ticketStatusContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: MarginConstants.tab1,
    marginTop: MarginConstants.tab1,
    marginBottom: MarginConstants.halfTab,
    padding: PaddingConstants.tab1_2x,
    borderRadius: 4,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleAndDropdownContainer: {},
  titleAndUnderlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: MarginConstants.halfTab,
  },
  descriptionTextContainer: {
    alignItems: 'flex-start',
    padding: PaddingConstants.halfTab,
  },
  columnContainer: {
    alignItems: 'flex-start',
    padding: PaddingConstants.tab1,
  },
  headerText: {
    ...baseTextStyles.largeMediumText,
    color: Colors.accent,
  },
  modalHeader: {
    justifyContent: 'space-between',
    backgroundColor: Colors.accent,
    borderTopStartRadius: 5,
    borderTopEndRadius: 5,
    paddingVertical: PaddingConstants.tab1,
  },
  modalHeaderText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.largeText,
    color: Colors.white,
  },
  titleText: {
    ...baseTextStyles.secondaryRegularText,
    color: Colors.filterIconColor,

    alignItems: 'flex-start',
  },

  departmentNameText: {
    backgroundColor: Colors.settingsBackground,
    padding: PaddingConstants.halfTab,
    color: Colors.filterIconColor,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
  },

  detailsText: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight._400,
    fontSize: TextSizes.primary,
    color: Colors.filterIconColor,
  },

  underLineText: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight._400,
    fontSize: TextSizes.secondary,
    color: Colors.accentLight,
    textDecorationLine: 'underline',
  },

  idText: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight._900,
    fontSize: 16,
    color: Colors.accentLight,
  },

  takeActionContainer: {
    paddingTop: PaddingConstants.tab1,
  },
  ticketIdView: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: PaddingConstants.halfTab,
  },
  ticketIdText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.primary,
    color: Colors.accentLight,
    padding: PaddingConstants.halfTab,
  },
  viewResponseDetailsText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
    textAlign: 'right',
    margin: MarginConstants.tab1,
  },
  contentContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: PaddingConstants.tab1,
    height: '100%',
  },
  dropdownContainer: {
    flex: 2,
    flexDirection: 'row',
    height: '100%',
    backgroundColor: Colors.white,
    borderColor: Colors.darkGrey,
    borderWidth: 1,
  },
  dropdownInnerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    paddingHorizontal: PaddingConstants.halfTab,
  },
  dropdownContainerText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.regular,
    marginVertical: MarginConstants.tab1,
    color: Colors.filterIconColor,
  },
});
