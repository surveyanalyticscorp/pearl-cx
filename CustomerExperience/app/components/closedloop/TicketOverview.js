import React, {useState} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import {Colors, statusColors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily, FontWeight} from '../../styles/font.constants';

import IonIcons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import QPButton from '../../widgets/Button';
import IconTextModalDropdown from '../../widgets/drop-down/IconTextModalDropdown';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import TicketTakeAction from './takeaction/TIcketTakeAction';
import {
  BottomSheetHeader,
  RenderPriorityIcon,
  RenderRoundImageOrColor,
  RenderSpinner,
  RenderStatusIcon,
} from '../../routes/CommonScreen';
import {useDispatch, useSelector} from 'react-redux';
import {
  getOwnerIndex,
  getOwnerNameById,
  getPriorityById,
  getPriorityIndexById,
  getSegmentNameById,
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
import {EMAIL, PHONE} from '../../api/Constant';
import {StackActions, useNavigation} from '@react-navigation/native';
import {translate} from '../../Utils/MultilinguaUtils';

const NPSScoreText = ({text}) => {
  return (
    <View
      style={[{flex: 2, justifyContent: 'flex-start'}, styles.rowContainer]}>
      <Image
        style={{width: 16, height: 16}}
        source={require('./../../../assets/images/nps_meter.png')}
      />
      <View
        style={{
          marginStart: MarginConstants.halfTab,
          padding: PaddingConstants.tab1,
          backgroundColor: Colors.critical2,
          borderRadius: 50,
          height: MarginConstants.tab3,
          width: MarginConstants.tab3,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={[styles.detailsText, {color: Colors.white}]}>{text}</Text>
      </View>
    </View>
  );
};

const ArrowDownIcon = () => (
  <SimpleLineIcon name={'arrow-down'} size={15} color={Colors.evenDarkerGrey} />
);

const Title = ({value}) => {
  return (
    <View style={[{flex: 1}, styles.rowContainer]}>
      <Text style={styles.titleText}>{value}</Text>
    </View>
  );
};

const TicketID = ({children}) => {
  return <Text style={styles.idText}>{`ID ${children}`} </Text>;
};

const TakeActionButton = ({onTakeActionHandler}) => {
  return (
    <View style={styles.takeActionContainer}>
      <QPButton
        testID="TakeActionButton"
        buttonColor={Colors.accentLight}
        style={styles.takeActionButton}
        onPress={onTakeActionHandler}
        buttonText={'Take Action'}
        textStyle={styles.takeActionText}
      />
    </View>
  );
};

const DescriptionHeader = ({text}) => {
  return (
    <View style={[{flex: 1}, styles.rowContainer]}>
      <Text style={styles.headerText}>{text}</Text>
    </View>
  );
};

const ShowText = ({text}) => {
  return (
    <View
      style={[{flex: 2, justifyContent: 'flex-start'}, styles.rowContainer]}>
      <Text style={styles.detailsText}>{text}</Text>
    </View>
  );
};

const ShowTitleAndText = ({title, subText}) => {
  return (
    <View style={styles.rowContainer}>
      <Title value={title} />
      <ShowText text={subText} />
    </View>
  );
};

const RenderDropDownButton = ({
  text,
  frontIcon,
  handleOnPress,
  hasArrowDownIcon = false,
}) => {
  return (
    <View style={styles.dropdownContainer}>
      <TouchableWithoutFeedback onPress={handleOnPress}>
        <View style={styles.dropdownInnerContainer}>
          {frontIcon}
          <View style={styles.dropdownInnerContainer}>
            <Text style={styles.dropdownContainerText}>{text}</Text>
          </View>
          {hasArrowDownIcon && <ArrowDownIcon />}
        </View>

        {/* <IonIcons name="down-arrow" /> */}
      </TouchableWithoutFeedback>
    </View>
  );
};
const DescriptionView = ({segments, ticketDetails, npsScore}) => {
  const originSegmentName =
    ticketDetails !== undefined
      ? getSegmentNameById(segments, ticketDetails.originSegmentId)
      : 'Segment';

  const createdDate =
    ticketDetails !== undefined
      ? moment(ticketDetails.issueDate).format(FullMonthDateYearFormat)
      : '';
  return (
    <View style={styles.ticketStatusContainer}>
      <View style={styles.rowContainer}>
        <DescriptionHeader text={'Description'} />
        <TouchableWithoutFeedback>
          <View style={styles.ticketIdView}>
            <Text style={styles.ticketIdText}>
              {`Ticket ID #${
                ticketDetails !== undefined ? ticketDetails.id : ''
              }`}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <ShowTitleAndText title={'Origin Segment'} subText={originSegmentName} />
      <ShowTitleAndText title={'Created'} subText={createdDate} />

      {ticketDetails.npsScore && (
        <View style={styles.rowContainer}>
          <Title value={'NPS'} />
          <NPSScoreText text={ticketDetails.npsScore} />
        </View>
      )}
      <View style={styles.columnContainer}>
        <Title value={'Description'} />
        <Text
          style={{
            margin: MarginConstants.halfTab,
            paddingHorizontal: PaddingConstants.halfTab,
          }}>
          {ticketDetails ? ticketDetails.comment : ''}
        </Text>
      </View>
      {ticketDetails.responseId && <ViewResponseDetailsButton />}
    </View>
  );
};

const ViewResponseDetailsButton = () => {
  const responseDetails = useSelector(
    (state) => state.response.responseDetailsByResponseDetails,
  );
  const {authToken} = useSelector((state) => state.global);
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
    <View style={[styles.rowContainer, {flexDirection: 'row-reverse'}]}>
      <TouchableWithoutFeedback onPress={navigateToFeedbackDetails}>
        <Text style={styles.viewResponseDetailsText}>{`View Response >>`}</Text>
      </TouchableWithoutFeedback>
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
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {authToken} = useSelector((state) => state.global);
  const [currentBS, setCurrentBS] = useState(bottomSheetEnum.status);
  const {owners} = useSelector((state) => state.dashboard.ownerDetails ?? []);
  const isLoading = useSelector((state) => state.global.isLoading);
  const ticketDetails = useSelector((state) => state.dashboard.ticket);

  const {
    emailAddress,
    firstName,
    lastName,
    userID,
    feedbackApiKey,
  } = useSelector((state) => state.global.userInfo);
  // const [selectedSegment, setSelectedSegment] = useState();
  const [statusIndex, setStatusIndex] = useState(
    getStatusIndexById(ticketDetails.status ?? -1),
  );
  const [priorityIndex, setPriorityIndex] = useState(
    getPriorityIndexById(ticketDetails.priority ?? -1),
  );

  const segments = useSelector(
    (state) => state.dashboard.segmentDetails.segments,
  );
  console.log('TTTTT', ticketDetails ?? '');
  console.log({isLoading});

  const [ticketOwnerIndex, setTicketOwnerIndex] = useState(
    getOwnerIndex(owners, ticketDetails.assignToId ?? 0),
  );

  const getTicketOwnerList = (segmentId_) => {
    dispatch(
      getClosedLoopOwnerDetails(authToken, {
        segmentID: segmentId_,
      }),
    );
  };

  const updateTicket = (params) => {
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

  /// BOTTOM SHEET

  // variables for bottom sheet
  const actionBottomSheet = React.useRef();
  const statusBottomSheet = React.useRef();
  const actionBottomSheetSnapPoints = ['33%', '0%'];
  const statusBottomSheetSnapPoints = ['45', '0'];

  const fall = new Animated.Value(1);

  const onTakeActionHandler = () => {
    // if (ticketDetails?.panelMember?.email) {
    actionBottomSheet.current.snapTo(0);
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

  const setSegmentSelection = (segment) => {
    console.log('TICKET_OVERVIEW', JSON.stringify(segment));
    updateTicket({currentSegmentId: segment.segmentID});
    getTicketOwnerList(segment.segmentID);
  };

  const handleOwnerSelection = () => {
    setCurrentBS(bottomSheetEnum.owners);
    statusBottomSheet.current.snapTo(0);
  };

  const renderStatusHeader = (_title) => {
    return <BottomSheetHeader title={'Select Status'} onPressClose={closeBS} />;
  };

  const renderStatusSelectContent = () => {
    return (
      <View style={styles.contentContainer}>
        <SelectStatus
          data={statusList}
          selectedIndex={statusIndex}
          handleOnPress={(item, index) => {
            updateTicket({status: item.id});
            setStatusIndex(index);
          }}
        />
      </View>
    );
  };

  const RenderStatusBottomSheet = ({currentBS_}) => {
    let renderContent = renderStatusSelectContent;
    let renderHeader = renderStatusHeader;

    switch (currentBS_) {
      case bottomSheetEnum.priority:
        renderContent = renderPrioritySelectContent;
        renderHeader = renderPriorityHeader;
        break;

      case bottomSheetEnum.owners:
        renderContent = renderOwnerSelectContent;
        renderHeader = renderOwnerHeader;
        break;
    }
    console.log('SNAP', currentBS_);
    return (
      <BottomSheet
        ref={statusBottomSheet}
        snapPoints={statusBottomSheetSnapPoints}
        initialSnap={statusBottomSheetSnapPoints.length - 1}
        enabledGestureInteraction={true}
        renderContent={renderContent}
        renderHeader={renderHeader}
        callbackNode={fall}
      />
    );
  };

  const renderPriorityHeader = (_title) => {
    return (
      <BottomSheetHeader title={'Select Priority'} onPressClose={closeBS} />
    );
  };

  const renderPrioritySelectContent = () => {
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

  const renderOwnerHeader = (_title) => {
    return (
      <BottomSheetHeader title={'Select Ticket Owner'} onPressClose={closeBS} />
    );
  };

  const renderOwnerSelectContent = () => {
    return (
      <View style={styles.contentContainer}>
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

  const closeBS = () => {
    statusBottomSheet.current.snapTo(statusBottomSheetSnapPoints.length - 1);
  };

  let getNPSColor = (sentiment) => {
    switch (sentiment) {
      case 'Detractor':
        return Colors.detractor2;
      case 'Passive':
        return Colors.passive2;
      default:
        return Colors.promoter2;
    }
  };

  const getUnderLineText = (text, type) => {
    return (
      <TouchableWithoutFeedback
      // onPress={() => {
      //   console.log(text);

      //   switch (type) {
      //     case PHONE:
      //       promptCall();
      //       break;
      //     default:
      //       navigateToSendEmail();
      //       break;
      //   }
      // }}
      >
        <View
          style={[
            {flex: 2, justifyContent: 'flex-start'},
            styles.rowContainer,
          ]}>
          <Text style={styles.underLineText}>{text}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const departmentNameCell = ({item}) => {
    return (
      <View style={[{flex: 1}, styles.rowContainer]}>
        <Text style={styles.departmentNameText}>{item}</Text>
      </View>
    );
  };

  const TicketStatusPriorityView = ({ticket}) => {
    const segmentName =
      ticket !== undefined
        ? getSegmentNameById(segments, ticket.currentSegmentId)
        : 'Select segment';

    const statusName =
      ticket !== undefined ? getStatusById(ticket.status) : 'Select status';

    const priorityName =
      ticket !== undefined
        ? getPriorityById(ticket.priority)
        : 'Select priority';
    const ownerName =
      ticket !== undefined
        ? // ? ticketDetails.assignToId
          getOwnerNameById(owners, ticket.assignToId)
        : 'Select owner';
    return (
      <View style={styles.ticketStatusContainer}>
        <View style={styles.rowContainer}>
          <Title value={'Current Segment'} />
          <RenderDropDownButton text={segmentName} />
        </View>

        <View style={styles.rowContainer}>
          <Title value={'Ticket Status'} />
          <RenderDropDownButton
            text={statusName}
            handleOnPress={handleStatusSelection}
            hasArrowDownIcon={true}
            frontIcon={
              <RenderStatusIcon
                style={{margin: MarginConstants.halfTab}}
                title={statusName}
              />
            }
          />
        </View>

        <View style={styles.rowContainer}>
          <Title value={'Priority'} />
          <RenderDropDownButton
            text={priorityName}
            handleOnPress={handlePrioritySelection}
            hasArrowDownIcon={true}
            frontIcon={
              <RenderPriorityIcon
                style={{margin: MarginConstants.halfTab}}
                title={priorityName}
              />
            }
          />
        </View>

        <View style={styles.rowContainer}>
          <Title value={'Assigned to'} />
          <RenderDropDownButton
            text={ownerName}
            handleOnPress={handleOwnerSelection}
            hasArrowDownIcon={true}
          />
        </View>
      </View>
    );
  };

  const ContactView = () => {
    return (
      <View style={styles.ticketStatusContainer}>
        {DescriptionHeader('Contact')}
        <View style={styles.rowContainer}>
          {ticketDetails.panelMember.name ? (
            <Text
              style={{
                color: Colors.accent,
                fontSize: TextSizes.largeText,
                fontWeight: 'bold',
              }}>
              {ticketDetails.panelMember.name}
            </Text>
          ) : (
            <View />
          )}
        </View>
        {ticketDetails.panelMember.email ? (
          <View style={styles.rowContainer}>
            <Title value={'Email'} />
            {getUnderLineText(ticketDetails.panelMember.email, EMAIL)}
          </View>
        ) : (
          <View />
        )}
        {ticketDetails.panelMember.phone ? (
          <View style={styles.rowContainer}>
            <Title value={'Phone'} />

            {getUnderLineText(ticketDetails.panelMember.phone, PHONE)}
          </View>
        ) : (
          <View />
        )}
        {/* <View style={styles.rowContainer}>
          {Title('Phone')}
          {getUnderLineText('+140002031')}
        </View> */}
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
  const handleTicketAction = (item) => {
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
  };

  const renderTicketTakeAction = () => {
    const data = [{id: 1, title: 'Respond via Email', icon: 'email'}];

    return (
      <View style={styles.contentContainer}>
        <TicketTakeAction
          data={data}
          handleOnPress={(item) => handleTicketAction(item)}
        />
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <BottomSheetHeader
        title={'Take Action'}
        onPressClose={() =>
          actionBottomSheet.current.snapTo(
            actionBottomSheetSnapPoints.length - 1,
          )
        }
      />
    );
  };

  const RenderTicketOverView = () => (
    <View style={styles.container}>
      <Animated.ScrollView
        style={{
          opacity: Animated.add(0.3, Animated.multiply(fall, 1.0)),
        }}>
        <View style={styles.container}>
          <TakeActionButton onTakeActionHandler={onTakeActionHandler} />
          {/* {ticketStatusPriorityView()} */}
          <TicketStatusPriorityView ticket={ticketDetails} />
          <DescriptionView ticketDetails={ticketDetails} segments={segments} />

          {ticketDetails.panelMember !== undefined ? <ContactView /> : <View />}
        </View>
      </Animated.ScrollView>
      <RenderStatusBottomSheet currentBS_={currentBS} />
      {/* <RenderPriorityBottomSheet />
      <RenderSegmentBottomSheet />
      <RenderOwnerBottomSheet /> */}
      <BottomSheet
        ref={actionBottomSheet}
        snapPoints={actionBottomSheetSnapPoints}
        initialSnap={actionBottomSheetSnapPoints.length - 1}
        enabledGestureInteraction={true}
        renderContent={renderTicketTakeAction}
        renderHeader={renderHeader}
        callbackNode={fall}
        // onCloseEnd={() => setShadow(false)}
        // onOpenStart={() => setShadow(true)}
      />
    </View>
  );

  return isLoading ? <RenderSpinner /> : <RenderTicketOverView />;

  // return <RenderTicketOverView />;
  // return isLoading ? <RenderSpinner /> : <TempUI />;
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
    // borderColor: Colors.evenDarkerGrey,
    // borderWidth: 1,
    // borderRadius: 4,
  },

  ticketStatusContainer: {
    backgroundColor: Colors.white,
    margin: MarginConstants.tab1,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    padding: PaddingConstants.tab1,
  },
  columnContainer: {
    alignItems: 'flex-start',
    padding: PaddingConstants.tab1,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: PaddingConstants.tab1,
  },

  headerText: {
    fontFamily: FontFamily.light,

    fontSize: TextSizes.largeText,
    color: Colors.filterIconColor,
  },

  titleText: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight._500,
    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
  },

  departmentNameText: {
    backgroundColor: Colors.settingsBackground,
    padding: PaddingConstants.halfTab,
    color: Colors.filterIconColor,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
  },
  dateText: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight._400,
    fontSize: 16,
    color: Colors.primary,
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
    fontSize: TextSizes.primary,
    color: Colors.accentLight,
    textDecorationLine: 'underline',
  },

  idText: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight._900,
    fontSize: 16,
    color: Colors.accentLight,
  },

  statusText: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight._900,
    fontSize: 16,
    color: Colors.lightBlack,
  },
  takeActionContainer: {
    padding: PaddingConstants.tab1,
    margin: MarginConstants.tab1,
  },
  takeActionButton: {
    height: MarginConstants.tab4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accentLight,
    marginBottom: MarginConstants.tab2,
  },
  ticketIdView: {
    borderColor: Colors.accentLight,
    borderRadius: 4,
    borderWidth: 1,
    padding: PaddingConstants.halfTab,
  },
  ticketIdText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.primary,
    color: Colors.accentLight,
  },
  viewResponseDetailsText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
    textAlign: 'right',
    margin: MarginConstants.tab1,
  },
  takeActionText: {
    color: Colors.white,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.largeText,
  },
  rowText: {
    color: Colors.primary,
    fontSize: TextSizes.secondary,
  },
  modelDropdown: {
    minHeight: MarginConstants.tab3,

    marginHorizontal: MarginConstants.tab1,
    paddingHorizontal: PaddingConstants.halfTab,
    borderColor: Colors.evenDarkerGrey,
    borderWidth: 1,
    borderRadius: 4,
    width: '100%',
  },
  dropdownText: {
    flex: 1,
    color: Colors.secondary,
    marginVertical: MarginConstants.tab1,
    marginHorizontal: MarginConstants.halfTab,
    fontSize: Platform.isPad
      ? TextSizes.primary
      : Platform.OS === 'android'
      ? TextSizes.primary
      : TextSizes.secondary,
    textAlign: 'left',
    paddingLeft: MarginConstants.halfTab,
    paddingRight: MarginConstants.tab3,
    textAlignVertical: 'center',
    alignSelf: 'center',
    borderColor: Colors.darkerGrey,
  },
  dropdownRow: {
    flexDirection: 'row',
    minHeight: MarginConstants.tab4,
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.halfTab,
    backgroundColor: Colors.accent,
  },

  panelHeaderContainer: {
    flex: 1,

    padding: MarginConstants.tab2,
    backgroundColor: Colors.white,
    borderTopStartRadius: 5,
    borderTopEndRadius: 5,
  },
  panelHandleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: MarginConstants.tab2,
  },
  panelHandle: {
    height: 4,
    width: 80,
    backgroundColor: Colors.filterIconColor,
  },
  header: {
    marginHorizontal: MarginConstants.tab2,
    fontFamily: FontFamily.bold,
    fontSize: TextSizes.largeText,
    marginVertical: MarginConstants.tab1,
    color: Colors.filterIconColor,
  },
  contentContainer: {backgroundColor: Colors.white, height: '100%'},
  dropdownContainer: {
    flex: 2,
    flexDirection: 'row',

    height: '100%',
    backgroundColor: Colors.white,
    borderColor: Colors.evenDarkerGrey,

    borderWidth: 1,
    borderRadius: 3,
  },

  dropdownInnerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    paddingHorizontal: PaddingConstants.halfTab,
  },
  SegmentDropDownInnerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',

    paddingHorizontal: PaddingConstants.tab1,
  },

  // dropdownIconTextContainer: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'flex-start',
  //   height: '100%',
  // },

  dropdownContainerText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.regular,
    marginVertical: MarginConstants.tab1,
    color: Colors.filterIconColor,
  },
});
