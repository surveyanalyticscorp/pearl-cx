import React, {useEffect, useState} from 'react';
import {Platform, StyleSheet, TextInput, View, Image} from 'react-native';
import {
  Colors,
  getPriorityBorderColorbyId,
} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RenderStatusIcon} from '../../../routes/commonUI/CommonUI';
import BottomSheetHeader from '../../../routes/commonUI/BottomSheetHeader';
import QPSpinner from '../../../widgets/QPSpinner';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import SelectPriority from '../../closedloop/takeaction/SelectPriority';
import SelectStatus from '../../closedloop/takeaction/SelectStatus';
import {
  getPriorityById,
  getStatusById,
  priorityList,
  statusListForCreateTicket,
} from '../../../Utils/TicketUtils';
import {useDispatch, useSelector} from 'react-redux';
import {
  createClfTicket,
  getClosedLoopOwnerDetails,
  resetCreateTicketResponse,
} from '../../../redux/actions/dashboard.actions';
import SelectSegment from '../../closedloop/takeaction/SelectSegment';
import SelectTicketOwner from '../../closedloop/takeaction/SelectTicketOwner';
import moment from 'moment';
import {
  DMYFORMAT,
  FullMonthDateYearFormat,
  YMDFORMAT,
} from '../../../Utils/AppConstants';
import {
  showErrorFlashMessage,
  showSuccessFlashMessage,
  validateEmail,
} from '../../../Utils/Utility';
import {StackActions, useNavigation} from '@react-navigation/native';
import {translate} from '../../../Utils/MultilinguaUtils';
import {VerticalSpaceBox} from '../../../widgets/SpaceBox';
import ShowTitleAndDropdown from '../../closedloop/ui/ShowTitleAndDropdown';
import DateFilterIcon from '../../../widgets/IconWidget/DateFilterIcon';
import PersonIcon from '../../../widgets/IconWidget/PersonIcon';
import IconAndTitleText from '../../closedloop/ui/IconAndTitleText';
import StatusIcon from '../../../widgets/IconWidget/StatusIcon';
import RenderPhoneInput from '../../closedloop/ui/RenderPhoneInput';
import RenderCreateTicketButton from './RenderCreateTicketButton';
import {IonIcon, MaterialIcons} from '../../../Utils/IconUtils';
import RenderDatePickerModal from '../../RenderDatePickerModal';
import {ANALYTICS_EVENTS} from '../../../Utils/Analytic.constants';
import {sendAnalyticsEvent} from '../../../Utils/AnalyticLogs';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ShowInputError from '../../../routes/commonUI/ShowInputError';
import {get} from 'lodash';

const INPUTTYPES = {
  EMAIL: 'EMAIL',
  PHONE: 'PHONE',
  NAME: 'NAME',
  DATE: 'DATE',
  SEGMENT: 'SEGMENT',
  PRIORITY: 'PRIORITY',
  STATUS: 'STATUS',
  DESCRIPTION: 'DESCRIPTION',
  OWNER: 'OWNER',
};

const checkValidation = ticketState => {
  // convert errorInputTypes to map
  const errorInputTypes = new Map();

  let isValid = true;

  if (!ticketState.firstName) {
    errorInputTypes.set(INPUTTYPES.NAME, translate('enter_customer_name'));
    isValid = false;
  }

  if (!ticketState.emailAddress) {
    errorInputTypes.set(INPUTTYPES.EMAIL, translate('enter_an_email'));
    isValid = false;
  }

  if (ticketState.emailAddress && !validateEmail(ticketState.emailAddress)) {
    errorInputTypes.set(INPUTTYPES.EMAIL, translate('enter_an_valid_email'));
    isValid = false;
  }

  if (!ticketState.currentSegmentId) {
    errorInputTypes.set(INPUTTYPES.SEGMENT, translate('segment_not_selected'));
    isValid = false;
  }

  if (!ticketState.issueDate) {
    errorInputTypes.set(INPUTTYPES.DATE, translate('issue_date_not_selected'));
    isValid = false;
  }

  if (ticketState.priority === null || ticketState.priority === undefined) {
    errorInputTypes.set(
      INPUTTYPES.PRIORITY,
      translate('priority_not_selected'),
    );
    isValid = false;
  }

  if (ticketState.status === null || ticketState.status === undefined) {
    errorInputTypes.set(INPUTTYPES.STATUS, translate('status_not_selected'));
    isValid = false;
  }

  if (!ticketState.assignToId) {
    errorInputTypes.set(INPUTTYPES.OWNER, translate('select_a_ticket_owner'));
    isValid = false;
  }

  if (!ticketState.comment) {
    errorInputTypes.set(INPUTTYPES.DESCRIPTION, translate('add_description'));
    isValid = false;
  }

  return {isValid: isValid, errorInputTypes: errorInputTypes};
};

const CreateTicketContainer = ({children}) => {
  const {isError, errorMessage} = useSelector(state => state.global);
  let getApiValidationErrorMessage = errorMessage => {
    console.log(
      'getApiValidationErrorMessage createTicket',
      JSON.stringify(errorMessage),
    );
    if (errorMessage.errorAlert) {
      return errorMessage?.errorAlert
        ? errorMessage?.errorAlert
        : errorMessage?.validationErrors[0]?.error;
    }

    if (errorMessage.message) {
      return errorMessage?.message;
    }
    return 'Error';
  };

  useEffect(() => {
    if (isError) {
      showErrorFlashMessage(getApiValidationErrorMessage(errorMessage));
    }
  }, [isError, errorMessage]);

  return (
    <View
      forceInset={{bottom: 'never', top: 'never'}}
      style={styles.rootContainer}>
      {children}
    </View>
  );
};
const RenderMaterialIcon = ({iconName}) => (
  <MaterialIcon name={iconName} size={14} color={Colors.lightBlack} />
);

const SegmentIcon = () => {
  const segmentIcon = './../../../../assets/images/segment_icon.png';

  return (
    <Image
      // source={require('./../../../assets/images/segment_icon.png')}
      source={require(segmentIcon)}
      style={styles.image}
    />
  );
};

const RenderMateriaCommunityIcon = ({iconName}) => (
  <MaterialCommunityIcon name={iconName} size={14} color={Colors.lightBlack} />
);
const RenderTextInput = ({
  multiline = false,
  defaultValue = '',
  keyboardType,
  setValue,
  isError = false,
}) => {
  return (
    <TextInput
      placeholderTextColor={Colors.borderColor}
      multiline={multiline}
      defaultValue={defaultValue ?? ''}
      keyboardType={keyboardType ?? 'default'}
      style={{
        ...(multiline ? styles.descriptionInputText : styles.textInputText),
        backgroundColor: Colors.settingsBackground,
        borderBottomWidth: 1,
        borderBottomColor: isError ? Colors.error : Colors.borderColor,
      }}
      onEndEditing={value => {
        console.log('TEXT_INPUT', value.nativeEvent.text);
        setValue(value.nativeEvent.text);
      }}
      onChangeText={value => {
        console.log('TEXT_INPUT', value);
        setValue(value);
      }}
    />
  );
};
const RenderEmailAddressInput = ({
  defaultValue,
  setTicketState,
  isError = false,
  errorMessage = '',
}) => {
  const setEmailAddress = text => {
    setTicketState(state => ({
      ...state,
      emailAddress: text,
    }));
  };
  return (
    <View>
      <IconAndTitleText
        icon={
          <IonIcon name={'mail'} size={14} color={Colors.filterIconColor} />
        }
        title={'Email'}
      />
      <RenderTextInput
        defaultValue={defaultValue}
        placeholder={'Email'}
        keyboardType={'email-address'}
        setValue={setEmailAddress}
        isError={isError}
      />
      <ShowInputError isError={isError} errorMessage={errorMessage} />
    </View>
  );
};
const RenderDescriptionInput = ({
  defaultValue,
  setTicketState,
  isError = false,
  errorMessage = '',
}) => {
  const setDescription = text => {
    setTicketState(state => ({
      ...state,
      comment: text,
    }));
  };
  return (
    <View>
      <IconAndTitleText
        icon={
          <MaterialIcons
            name={'chat-bubble'}
            size={14}
            color={Colors.filterIconColor}
          />
        }
        title={translate('ticket_overview.description')}
      />

      <RenderTextInput
        defaultValue={defaultValue}
        multiline={true}
        setValue={setDescription}
        keyboardType={'default'}
        isError={isError}
      />
      <ShowInputError isError={isError} errorMessage={errorMessage} />
    </View>
  );
};

const RenderCustomerNameInput = ({
  defaultValue,
  setTicketState,
  isError = false,
  errorMessage = '',
}) => {
  const setCustomerName = text => {
    setTicketState(state => ({
      ...state,
      firstName: text,
    }));
  };
  return (
    <View>
      <IconAndTitleText
        icon={<PersonIcon size={12} />}
        title={'Customer name'}
      />
      <RenderTextInput
        defaultValue={defaultValue}
        placeholder={translate('create_new_ticket.customer_name')}
        setValue={setCustomerName}
        isError={isError}
      />
      <ShowInputError isError={isError} errorMessage={errorMessage} />
    </View>
  );
};

const CreateTicketButton = ({showLoading, onPress}) => {
  return (
    <View>
      {showLoading ? (
        <View
          style={[
            styles.buttonStyle,
            {
              backgroundColor: Colors.accentLight,
            },
          ]}>
          <QPSpinner spinnerColor={Colors.white} />
        </View>
      ) : (
        <RenderCreateTicketButton handleCreateTicket={onPress} />
      )}
    </View>
  );
};

const CreateTicketForm = ({children, fall}) => {
  return (
    <Animated.ScrollView
      style={[
        styles.container,
        {
          opacity: Animated.add(0.3, Animated.multiply(fall, 1.0)),
          marginHorizontal: MarginConstants.tab1_2x,
        },
      ]}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        contentContainerStyle={styles.innerContainer}>
        {children}
      </KeyboardAwareScrollView>
    </Animated.ScrollView>
  );
};

const VerticalSpace = () => (
  <VerticalSpaceBox marginVertical={MarginConstants.halfTab} />
);

export default function CreateTicket(props) {
  const responseId = props.route?.params?.responseId ?? null;
  const customerName = props.route?.params?.customerName ?? '';
  const customerEmail = props.route?.params?.customerEmail ?? '';
  const surveyId = props.route?.params?.surveyId ?? null;

  const segmentDetails = useSelector(state => state.dashboard.segmentDetails);
  const {authToken} = useSelector(state => state.global);
  const {owners} = useSelector(state => state.dashboard.ownerDetails);
  const {feedbackApiKey, emailAddress, firstName, lastName} = useSelector(
    state => state.global.userInfo,
  );
  // const [priority, setPriority] = useState('Select');
  const [priorityIndex, setPriorityIndex] = useState(0);
  const [segment, setSegment] = useState(
    translate('select_segment.select_segment'),
  );
  const [segmentIndex, setSegmentIndex] = useState(-1);
  const [segmentId, setSegmentId] = useState(segmentDetails.currentSegmentID);
  const [ticketOwner, setTicketOwner] = useState(
    translate('ticket_overview.select_ticket_owner'),
  );
  const [ticketOwnerIndex, setTIcketOwnerIndex] = useState(-1);
  // const [status, setStatus] = useState('Select');
  const [statusIndex, setStatusIndex] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment().format(DMYFORMAT));
  const navigation = useNavigation();
  // let userInfo = {
  //   emailAddress: '',
  //   firstName: '',
  //   mobileNumber: '',
  //   comment: '',
  // };

  // const [issueDate, setIssueDate] = useState(
  // );
  // const [bottomSheet, setBottomSheet] = useState('priority');

  // console.log('DETAILS_OF_PROPS', JSON.stringify(props.route.params));
  // variables for bottom sheet
  const priorityBottomSheet = React.useRef();
  const statusBottomSheet = React.useRef();
  const segmentBottomSheet = React.useRef();
  const ownerBottomSheet = React.useRef();
  // const calendarBottomSheet = React.useRef();

  const fall = new Animated.Value(1);
  const priorityBottomSheetSnapPoints = [
    Platform.OS === 'ios' ? '50%' : '55%',
    '0%',
  ];
  const statusBottomSheetSnapPoints = [
    Platform.OS === 'ios' ? '55%' : '50%',
    '0%',
  ];
  const segmentBottomSheetSnapPoints = ['45%', '0%'];
  const ownerBottomSheetSnapPoints = ['45%', '0%'];
  // const calenderBottomSheetSnapPoints = ['45%', '0%'];

  // const [shadow, setShadow] = useState(false);
  const createTicketResponse = useSelector(
    state => state.dashboard.createTicketResponse,
  );

  const dispatch = useDispatch();
  const [showLoading, setLoading] = useState(false);
  const [errorInputType, setErrorInputType] = useState(new Map());
  const [ticketState, setTicketState] = useState({
    userName: `${firstName} ${lastName}`,
    userEmailAddress: `${emailAddress}`,
    subscriberId: global.subscriberId,
    responseId: responseId,
    surveyId: surveyId,
    // ownerId: ,
    emailAddress: customerEmail ?? '',
    firstName: customerName ?? '',
    // mobileNumber: '',
    feedbackId: segmentDetails.feedbackID,
    originSegmentId: segmentDetails.currentSegmentID,
    // currentSegmentId: 0,
    priority: 0,
    status: 0,
    type: 0,
    source: 1,
    // assignToId: 0,
    // comment: '',
    issueDate: moment().format(YMDFORMAT),
  });

  const getTicketOwnerList = segmentId_ => {
    dispatch(
      getClosedLoopOwnerDetails(authToken, {
        segmentID: segmentId_,
      }),
    );
  };

  useEffect(() => {
    getTicketOwnerList(segmentId);
  }, [segmentId]);

  const closeAllBottomSheet = () => {
    priorityBottomSheet.current.snapTo(
      priorityBottomSheetSnapPoints.length - 1,
    );
    statusBottomSheet.current.snapTo(statusBottomSheetSnapPoints.length - 1);
  };

  const handleStatusSelection = () => {
    priorityBottomSheet.current.snapTo(
      priorityBottomSheetSnapPoints.length - 1,
    );
    // open status selection bottom sheet
    statusBottomSheet.current.snapTo(0);
  };

  const handlePrioritySelection = () => {
    // closeAllBottomSheet();
    statusBottomSheet.current.snapTo(statusBottomSheetSnapPoints.length - 1);

    // open priority selection bottom sheet
    priorityBottomSheet.current.snapTo(0);
  };

  const handleSegmentSelection = () => {
    // open segment selection bottom sheet
    // segmentBottomSheet.current.snapTo(0);

    const pushAction = StackActions.push(translate('dashboard.segment'), {
      currentSegmentId: segmentId,
      setSegmentSelection: setSegmentSelection,
    });
    navigation.dispatch(pushAction);
  };

  const handleOwnerSelection = () => {
    closeAllBottomSheet();
    // open owner selection bottom sheet
    ownerBottomSheet.current.snapTo(0);
  };

  const handleDateSelection = () => {
    // open owner selection bottom sheet
    // calendarBottomSheet.current.snapTo(0);
    setShowCalendar(true);
  };

  const setSegmentSelection = segment_ => {
    setSegment(segment_.segmentName);
    setSegmentIndex(0);
    setSegmentId(prev => segment_.segmentID);

    setTicketState(state => ({
      ...state,
      currentSegmentId: segment_.segmentID,
    }));
  };

  const handleCreateTicket = () => {
    const validation = checkValidation(ticketState);
    if (validation.isValid) {
      setLoading(true);
      sendAnalyticsEvent(ANALYTICS_EVENTS.CREATE_TICKET, {
        ...ticketState,
      });
      dispatch(createClfTicket(ticketState, feedbackApiKey));
    } else {
      setErrorInputType(validation.errorInputTypes);
    }
  };

  useEffect(() => {
    handleCreateTicketResponse(createTicketResponse);
  }, [createTicketResponse]);

  const handleCreateTicketResponse = response => {
    if (response?.status === 'success') {
      setLoading(false);
      showSuccessFlashMessage(response.message);
      setTimeout(() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
        dispatch(resetCreateTicketResponse());
      }, 1000);
    }
    console.log('createTicketResponse', JSON.stringify(response));
  };

  const renderPrioritySelectContent = () => {
    return (
      <View style={styles.contentContainer}>
        <SelectPriority
          data={priorityList}
          selectedIndex={priorityIndex}
          screenName={'CreateTicket'}
          handleOnPress={(item, index) => {
            setTicketState(state => ({
              ...state,
              priority: item.id,
            }));
            setPriorityIndex(index);
          }}
        />
      </View>
    );
  };

  const renderSegmentSelectContent = () => {
    return (
      <View style={styles.contentContainer}>
        <SelectSegment
          data={segmentDetails.segments}
          selectedIndex={segmentIndex}
          handleOnPress={(item, index) => {
            // console.log(JSON.stringify(item));
            setSegment(item.segmentName);
            setSegmentIndex(index);
            setSegmentId(prev => item.segmentID);

            setTicketState(state => ({
              ...state,
              currentSegmentId: item.segmentID,
            }));
          }}
        />
      </View>
    );
  };

  const renderStatusSelectContent = () => {
    return (
      <View style={styles.contentContainer}>
        <SelectStatus
          data={statusListForCreateTicket}
          screenName={'CreateTicket'}
          selectedIndex={statusIndex}
          handleOnPress={(item, index) => {
            // console.log(JSON.stringify(item));
            // setStatus(item.title);
            setTicketState(state => ({...state, status: item.id}));
            setStatusIndex(index);
          }}
        />
      </View>
    );
  };

  const renderOwnerSelectContent = () => {
    return (
      <View style={styles.contentContainer}>
        <SelectTicketOwner
          data={owners}
          selectedIndex={ticketOwnerIndex}
          handleOnPress={(item, index) => {
            // console.log(JSON.stringify(item));
            setTicketOwner(item.ownerName);
            setTIcketOwnerIndex(index);
            setTicketState(state => ({
              ...state,
              assignToId: item.ownerID,
              ownerId: item.ownerID,
            }));
          }}
        />
      </View>
    );
  };

  const renderPriorityHeader = _title => {
    return (
      <BottomSheetHeader
        title={'Priority'}
        onPressClose={() =>
          priorityBottomSheet.current.snapTo(
            priorityBottomSheetSnapPoints.length - 1,
          )
        }
      />
    );
  };

  const renderStatusHeader = _title => {
    return (
      <BottomSheetHeader
        title={'Status'}
        onPressClose={() =>
          statusBottomSheet.current.snapTo(
            statusBottomSheetSnapPoints.length - 1,
          )
        }
      />
    );
  };

  const renderSegmentHeader = _title => {
    return (
      <BottomSheetHeader
        title={translate('select_segment.select_segment')}
        onPressClose={() =>
          segmentBottomSheet.current.snapTo(
            segmentBottomSheetSnapPoints.length - 1,
          )
        }
      />
    );
  };

  const renderOwnerHeader = _title => {
    return (
      <BottomSheetHeader
        title={translate('ticket_overview.select_ticket_owner')}
        onPressClose={() =>
          ownerBottomSheet.current.snapTo(ownerBottomSheetSnapPoints.length - 1)
        }
      />
    );
  };

  const RenderPriorityBottomSheet = () => {
    return (
      <BottomSheet
        ref={priorityBottomSheet}
        snapPoints={priorityBottomSheetSnapPoints}
        initialSnap={priorityBottomSheetSnapPoints.length - 1}
        enabledGestureInteraction={true}
        renderContent={renderPrioritySelectContent}
        renderHeader={renderPriorityHeader}
        callbackNode={fall}
      />
    );
  };

  const RenderStatusBottomSheet = () => {
    return (
      <BottomSheet
        ref={statusBottomSheet}
        snapPoints={statusBottomSheetSnapPoints}
        initialSnap={statusBottomSheetSnapPoints.length - 1}
        enabledGestureInteraction={true}
        renderContent={renderStatusSelectContent}
        renderHeader={renderStatusHeader}
        callbackNode={fall}
      />
    );
  };

  const RenderSegmentBottomSheet = () => {
    return (
      <BottomSheet
        ref={segmentBottomSheet}
        snapPoints={segmentBottomSheetSnapPoints}
        initialSnap={segmentBottomSheetSnapPoints.length - 1}
        enabledGestureInteraction={true}
        renderContent={renderSegmentSelectContent}
        renderHeader={renderSegmentHeader}
        callbackNode={fall}
      />
    );
  };

  const RenderOwnerBottomSheet = () => {
    return (
      <BottomSheet
        ref={ownerBottomSheet}
        snapPoints={ownerBottomSheetSnapPoints}
        initialSnap={ownerBottomSheetSnapPoints.length - 1}
        enabledGestureInteraction={true}
        renderContent={renderOwnerSelectContent}
        renderHeader={renderOwnerHeader}
        callbackNode={fall}
      />
    );
  };

  let setCalendarDate = (isStartDate = false, date) => {
    console.log('setCalendarDate', date);

    // let tempDate = moment(date, 'YYYY-MM-DD').format(DMYFORMAT);
    setSelectedDate(moment(date).format(DMYFORMAT));
    setTicketState(state => ({
      ...state,
      issueDate: moment(date).format(YMDFORMAT),
    }));
  };

  return (
    <CreateTicketContainer>
      <CreateTicketForm fall={fall}>
        <VerticalSpaceBox multiplyBy={2} />
        <RenderCustomerNameInput
          defaultValue={customerName}
          setTicketState={setTicketState}
          isError={errorInputType.has(INPUTTYPES.NAME)}
          errorMessage={errorInputType.get(INPUTTYPES.NAME)}
        />
        <VerticalSpaceBox multiplyBy={2} />

        <RenderPhoneInput setTicketState={setTicketState} />
        <VerticalSpaceBox multiplyBy={4} />
        <RenderEmailAddressInput
          defaultValue={customerEmail}
          setTicketState={setTicketState}
          isError={errorInputType.has(INPUTTYPES.EMAIL)}
          errorMessage={errorInputType.get(INPUTTYPES.EMAIL)}
        />

        <VerticalSpaceBox multiplyBy={2} />
        <ShowTitleAndDropdown
          titleIcon={<SegmentIcon />}
          title={'Segment'}
          currentItemName={segment}
          onPress={handleSegmentSelection}
          hasArrowDownIcon
          isError={errorInputType.has(INPUTTYPES.SEGMENT)}
          errorMessage={errorInputType.get(INPUTTYPES.SEGMENT)}
        />

        <VerticalSpaceBox multiplyBy={2} />
        <ShowTitleAndDropdown
          titleIcon={<DateFilterIcon size={12} />}
          title={'Date'}
          currentItemName={moment(selectedDate, DMYFORMAT).format(
            FullMonthDateYearFormat,
          )}
          onPress={handleDateSelection}
          hasArrowDownIcon={false}
          isError={errorInputType.has(INPUTTYPES.DATE)}
          errorMessage={errorInputType.get(INPUTTYPES.DATE)}
        />

        <VerticalSpaceBox multiplyBy={2} />

        <ShowTitleAndDropdown
          titleIcon={
            <IonIcon name={'flag'} size={14} color={Colors.filterIconColor} />
          }
          title={'Priority'}
          currentItemName={`${
            getPriorityById(ticketState.priority) ?? 'Unassigned'
          }`}
          onPress={handlePrioritySelection}
          frontIcon={
            <IonIcon
              name={'flag'}
              size={14}
              color={getPriorityBorderColorbyId(ticketState.priority)}
            />
          }
          hasArrowDownIcon
          isError={errorInputType.has(INPUTTYPES.PRIORITY)}
          errorMessage={errorInputType.get(INPUTTYPES.PRIORITY)}
        />

        <VerticalSpaceBox multiplyBy={2} />

        <ShowTitleAndDropdown
          titleIcon={<StatusIcon size={12} />}
          title={'Status'}
          currentItemName={`${getStatusById(ticketState.status) ?? 'New'}`}
          onPress={handleStatusSelection}
          frontIcon={
            <RenderStatusIcon
              title={getStatusById(ticketState.status) ?? 'New'}
              size={14}
            />
          }
          hasArrowDownIcon
          isError={errorInputType.has(INPUTTYPES.STATUS)}
          errorMessage={errorInputType.get(INPUTTYPES.STATUS)}
        />
        <VerticalSpaceBox multiplyBy={2} />

        <ShowTitleAndDropdown
          titleIcon={<RenderMateriaCommunityIcon iconName={'shield-account'} />}
          title={'Ticket owner'}
          currentItemName={`${ticketOwner ?? ''}`}
          onPress={handleOwnerSelection}
          hasArrowDownIcon
          isError={errorInputType.has(INPUTTYPES.OWNER)}
          errorMessage={errorInputType.get(INPUTTYPES.OWNER)}
        />

        <VerticalSpaceBox multiplyBy={2} />

        <RenderDescriptionInput
          setTicketState={setTicketState}
          isError={errorInputType.has(INPUTTYPES.DESCRIPTION)}
          errorMessage={errorInputType.get(INPUTTYPES.DESCRIPTION)}
        />

        <VerticalSpaceBox multiplyBy={4} />
        <CreateTicketButton
          onPress={handleCreateTicket}
          showLoading={showLoading}
        />
        <VerticalSpace />
      </CreateTicketForm>

      <RenderPriorityBottomSheet />
      <RenderStatusBottomSheet />
      <RenderSegmentBottomSheet />
      <RenderOwnerBottomSheet />
      <RenderDatePickerModal
        isOpen={showCalendar}
        setOpen={setShowCalendar}
        currentDate={selectedDate}
        setDate={setCalendarDate}
        isStartDate={true}
      />
      {/* <RenderCalenderBottomSheet /> */}
      {/* {showCalendar ? renderCalendarViewOnModal() : <View />} */}
    </CreateTicketContainer>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,

    height: '80%',
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
    paddingHorizontal: 0,
    paddingTop: Platform.OS === 'ios' ? PaddingConstants.tab1 : 0,
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: Colors.white,
    paddingHorizontal: PaddingConstants.tab1_2x,
    paddingVertical: PaddingConstants.tab1,
    marginVertical: MarginConstants.tab1_2x,
  },

  rowContainer: {
    flex: 1,
    flexDirection: 'row',
  },

  headerText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.largeText,
    padding: PaddingConstants.tab1,
    color: Colors.filterIconColor,
  },
  titleText: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    padding: PaddingConstants.tab1,
    color: Colors.filterIconColor,
    height: MarginConstants.tab1_4x,
  },
  descriptionInputText: {
    flex: 1,
    textAlignVertical: 'top',
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    padding: PaddingConstants.tab1,
    height: MarginConstants.tab1_16x,
    paddingHorizontal: PaddingConstants.tab1,

    color: Colors.filterIconColor,
  },
  textInputText: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    padding: PaddingConstants.tab1,
    maxHeight: MarginConstants.tab1_5x,
    paddingHorizontal: PaddingConstants.tab1,

    color: Colors.filterIconColor,
  },
  palceholderText: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    padding: PaddingConstants.tab1,
    color: Colors.borderColor,
  },
  rowItem: {
    margin: MarginConstants.tab1,
    alignItems: 'center',
    padding: PaddingConstants.halfTab,
    borderBottomColor: Colors.darkGrey,
    borderBottomWidth: 1,
  },
  rowButton: {
    marginHorizontal: MarginConstants.tab2,
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.halfTab,
  },
  buttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: MarginConstants.tab1,
    paddingVertical: MarginConstants.tab1,
    flex: 1,
    borderRadius: 2,
  },
  contentContainer: {
    backgroundColor: Colors.white,
    height: '100%',
  },
  image: {width: 14, height: 14},

  qpButtonTextStyles: {
    fontFamily: FontFamily.light,
    fontSize: TextSizes.primary,
    color: Colors.white,
  },
  calendarContainer: {
    flex: 1,
    marginHorizontal: MarginConstants.tab1,
    marginTop: 6 * MarginConstants.tab4,
  },
  calendarBox: {
    backgroundColor: Colors.white,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  calendarFooter: {
    justifyContent: 'flex-end',
    backgroundColor: Colors.white,
    flexDirection: 'row',
  },
  cancelButton: {
    minWidth: PaddingConstants.tab4,
    height: PaddingConstants.tab3,
    justifyContent: 'center',
    alignItems: 'center',
    margin: MarginConstants.tab1,
    paddingHorizontal: PaddingConstants.tab1,
  },
  okButton: {
    minWidth: PaddingConstants.tab4 + PaddingConstants.tab1,
    height: PaddingConstants.tab3,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: MarginConstants.tab1,
  },
  buttonText: {
    color: Colors.accent,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    textAlign: 'center',
  },
  createTicketButtonStyle: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    marginVertical: MarginConstants.tab3,
    marginHorizontal: MarginConstants.tab1,
  },
});
