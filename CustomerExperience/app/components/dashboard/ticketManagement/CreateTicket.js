import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
// import SafeAreaView from 'react-native-safe-area-view';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Modal,
  SafeAreaView,
} from 'react-native';
import {
  Colors,
  // getPriorityFillerColor,
  // getPriorityBorderColor,
  getPriorityBorderColorbyId,
  // priorityColors,
  // getStatusBorderColor,
} from '../../../styles/color.constants';
import PhoneInput from 'react-native-phone-number-input';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import IonIcons from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  CloseButton,
  BottomSheetHeader,
  RenderStatusIcon,
} from '../../../routes/CommonScreen';

import QPButton from '../../../widgets/Button';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import SelectPriority from '../../closedloop/takeaction/SelectPriority';
import SelectStatus from '../../closedloop/takeaction/SelectStatus';
import {
  getPriorityById,
  getStatusById,
  priorityList,
  statusList,
} from '../../../Utils/TicketUtils';
import {useDispatch, useSelector} from 'react-redux';
import {
  createClfTicket,
  getClosedLoopOwnerDetails,
} from '../../../redux/actions/dashboard.actions';
import {showLoading} from '../../../redux/actions';
import SelectSegment from '../../closedloop/takeaction/SelectSegment';
import SelectTicketOwner from '../../closedloop/takeaction/SelectTicketOwner';
import SelectDate from '../../closedloop/takeaction/SelectDate';
import moment from 'moment';
import {
  DMYFORMAT,
  FullMonthDateYearFormat,
  // HalfMonthDateYearFormat,
  YMDFORMAT,
} from '../../../Utils/AppConstants';
import {FEEDBACK_API_KEY} from '../../../api/Constant';
import QPCalendar from '../../../widgets/QPCalendar';
import {
  isStringNullOrEmpty,
  showErrorFlashMessage,
} from '../../../Utils/Utility';

export default function CreateTicket(props) {
  const segmentDetails = useSelector((state) => state.dashboard.segmentDetails);
  const {authToken} = useSelector((state) => state.global);
  const {owners} = useSelector((state) => state.dashboard.ownerDetails);
  const [headerTitle, setHeaderTitle] = useState('Create New Ticket');
  const subscriberId = useSelector((state) => state.global.subscriberId);
  const {feedbackApiKey} = useSelector((state) => state.global.userInfo);
  // const [priority, setPriority] = useState('Select');
  const [priorityIndex, setPriorityIndex] = useState(-1);
  const [segment, setSegment] = useState('Select Segment');
  const [segmentIndex, setSegmentIndex] = useState(-1);
  const [segmentId, setSegmentId] = useState(segmentDetails.currentSegmentID);
  const [ticketOwner, setTicketOwner] = useState('Select Ticket Owner');
  const [ticketOwnerIndex, setTIcketOwnerIndex] = useState(-1);
  const [status, setStatus] = useState('Select');
  const [statusIndex, setStatusIndex] = useState(-1);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment().format(DMYFORMAT));
  let userInfo = {
    emailAddress: '',
    firstName: '',
    mobileNumber: '',
    comment: '',
  };

  // const [issueDate, setIssueDate] = useState(
  // );
  // const [bottomSheet, setBottomSheet] = useState('priority');

  const segmentIcon = './../../../../assets/images/segment_icon.png';
  // variables for bottom sheet
  const priorityBottomSheet = React.useRef();
  const statusBottomSheet = React.useRef();
  const segmentBottomSheet = React.useRef();
  const ownerBottomSheet = React.useRef();
  // const calendarBottomSheet = React.useRef();
  const phoneInput = React.useRef();

  const fall = new Animated.Value(1);
  const priorityBottomSheetSnapPoints = ['45%', '0%'];
  const statusBottomSheetSnapPoints = ['45%', '0%'];
  const segmentBottomSheetSnapPoints = ['45%', '0%'];
  const ownerBottomSheetSnapPoints = ['45%', '0%'];
  // const calenderBottomSheetSnapPoints = ['45%', '0%'];

  const [shadow, setShadow] = useState(false);
  const dispatch = useDispatch();
  const [validation, setValidation] = useState('');

  const [ticketState, setTicketState] = useState({
    subscriberId: global.subscriberId,
    // ownerId: ,
    // emailAddress: '',
    // firstName: '',
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

  const getTicketOwnerList = (segmentId_) => {
    dispatch(
      getClosedLoopOwnerDetails(authToken, {
        segmentID: segmentId_,
      }),
    );
  };

  // console.log('OWNERS:', JSON.stringify(owners));

  useEffect(() => {
    getTicketOwnerList(segmentId);
  }, [segmentId]);

  const getIonIcon = (iconName, iconColor) => (
    <IonIcons
      name={iconName}
      size={14}
      color={iconColor ?? Colors.lightBlack}
    />
  );

  const getSegmentIcon = () => (
    <Image
      // source={require('./../../../assets/images/segment_icon.png')}
      source={require(segmentIcon)}
      style={styles.image}
    />
    // <IonIcons
    //   name={iconName}
    //   size={14}
    //   color={iconColor ?? Colors.lightBlack}
    // />
  );

  const getMaterialIcon = (iconName) => (
    <MaterialIcon name={iconName} size={14} color={Colors.lightBlack} />
  );

  const getMateriaCommunityIcon = (iconName) => (
    <MaterialCommunityIcon
      name={iconName}
      size={14}
      color={Colors.lightBlack}
    />
  );

  const closeAllBottomSheet = () => {
    priorityBottomSheet.current.snapTo(
      priorityBottomSheetSnapPoints.length - 1,
    );
    statusBottomSheet.current.snapTo(statusBottomSheetSnapPoints.length - 1);
  };

  const handleStatusSelection = () => {
    // open status selection bottom sheet
    statusBottomSheet.current.snapTo(0);
  };

  const handlePrioritySelection = () => {
    // open priority selection bottom sheet
    priorityBottomSheet.current.snapTo(0);
  };

  const handleSegmentSelection = () => {
    // open segment selection bottom sheet
    segmentBottomSheet.current.snapTo(0);
  };

  const handleOwnerSelection = () => {
    // open owner selection bottom sheet
    ownerBottomSheet.current.snapTo(0);
  };

  const handleDateSelection = () => {
    // open owner selection bottom sheet
    // calendarBottomSheet.current.snapTo(0);
    setShowCalendar(true);
  };

  useEffect(() => {
    if (!isStringNullOrEmpty(validation)) {
      showErrorFlashMessage(validation);
      setValidation('');
    }
  }, [validation, props.error]);

  const handleCreateTicket = () => {
    if (isValid(ticketState)) {
      setValidation('');
      dispatch(createClfTicket(authToken, ticketState, feedbackApiKey));
      props.navigation.goBack();
      // console.log(JSON.stringify(ticketState));
    }
  };

  const isValid = (ticketState_) => {
    if (!ticketState_.currentSegmentId) {
      setValidation('Segment not selected');
      return false;
    }
    if (!ticketState_.issueDate) {
      setValidation('Issue date not selected');
      return false;
    }
    if (!ticketState_.firstName) {
      setValidation('Enter customer name');
      return false;
    }
    if (!ticketState_.firstName) {
      setValidation('Enter an email');
      return false;
    }
    if (!ticketState_.priority) {
      setValidation('Priority not selected');
      return false;
    }
    if (!ticketState_.status) {
      setValidation('Status not selected');
      return false;
    }

    if (!ticketState_.assignToId) {
      setValidation('Select a ticket owner');
      return false;
    }

    if (!ticketState_.comment) {
      setValidation('Add description');
      return false;
    }
    return true;
  };

  const renderPrioritySelectContent = () => {
    return (
      <View style={styles.contentContainer}>
        <SelectPriority
          data={priorityList}
          selectedIndex={priorityIndex}
          handleOnPress={(item, index) => {
            // console.log(JSON.stringify(item));
            // setPriority(item.title);
            setPriorityIndex(index);
            setTicketState((state) => ({
              ...state,
              priority: item.id,
            }));
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
            setSegmentId((prev) => item.segmentID);

            setTicketState((state) => ({
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
          data={statusList}
          selectedIndex={statusIndex}
          handleOnPress={(item, index) => {
            // console.log(JSON.stringify(item));
            // setStatus(item.title);
            setTicketState((state) => ({...state, status: item.id}));
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
            setTicketState((state) => ({
              ...state,
              assignToId: item.ownerID,
              ownerId: item.ownerID,
            }));
          }}
        />
      </View>
    );
  };

  // const renderDateSelectContent = () => {
  //   return (
  //     <View style={styles.contentContainer}>
  //       <SelectDate
  //         data={owners}
  //         selectedIndex={ticketOwnerIndex}
  //         handleOnPress={(item, index) => {
  //           // console.log(JSON.stringify(item));
  //           setIssueDate(moment().format(HalfMonthDateYearFormat));
  //           // setTIcketOwnerIndex(index);
  //         }}
  //       />
  //     </View>
  //   );
  // };

  const renderPriorityHeader = (_title) => {
    return (
      <BottomSheetHeader
        title={'Select Priority'}
        onPressClose={() =>
          priorityBottomSheet.current.snapTo(
            priorityBottomSheetSnapPoints.length - 1,
          )
        }
      />
    );
  };

  const renderStatusHeader = (_title) => {
    return (
      <BottomSheetHeader
        title={'Select Status'}
        onPressClose={() =>
          statusBottomSheet.current.snapTo(
            statusBottomSheetSnapPoints.length - 1,
          )
        }
      />
    );
  };

  const renderSegmentHeader = (_title) => {
    return (
      <BottomSheetHeader
        title={'Select Segment'}
        onPressClose={() =>
          segmentBottomSheet.current.snapTo(
            segmentBottomSheetSnapPoints.length - 1,
          )
        }
      />
    );
  };

  const renderOwnerHeader = (_title) => {
    return (
      <BottomSheetHeader
        title={'Select Ticket Owner'}
        onPressClose={() =>
          ownerBottomSheet.current.snapTo(ownerBottomSheetSnapPoints.length - 1)
        }
      />
    );
  };

  // const renderCalenderHeader = (_title) => {
  //   return (
  //     <BottomSheetHeader
  //       title={'Select Issue date'}
  //       onPressClose={() =>
  //         calendarBottomSheet.current.snapTo(
  //           calenderBottomSheetSnapPoints.length - 1,
  //         )
  //       }
  //     />
  //   );
  // };

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

  // const RenderCalenderBottomSheet = () => {
  //   return (
  //     <BottomSheet
  //       ref={calendarBottomSheet}
  //       snapPoints={calenderBottomSheetSnapPoints}
  //       initialSnap={calenderBottomSheetSnapPoints.length - 1}
  //       enabledGestureInteraction={false}
  //       renderContent={renderDateSelectContent}
  //       renderHeader={renderCalenderHeader}
  //       callbackNode={fall}
  //     />
  //   );
  // };

  let renderCancelButton = () => {
    return (
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => {
          setShowCalendar(false);
        }}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    );
  };

  let renderOkButton = () => {
    return (
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => {
          console.log('DATE_', JSON.stringify(selectedDate));
          setTicketState((state) => ({
            ...state,
            issueDate: moment(selectedDate, DMYFORMAT).format(YMDFORMAT),
          }));
          //save date
          // if (startDateSelected) {
          //   setSelectedRange({
          //     ...selectedRange,
          //     type: 6,
          //     startDate: customDate,
          //   });
          // } else {
          //   setSelectedRange({...selectedRange, type: 6, endDate: customDate});
          // }
          setShowCalendar(false);
        }}>
        <Text style={styles.buttonText}>Ok</Text>
      </TouchableOpacity>
    );
  };

  let renderCalendarFooter = () => {
    return (
      <View style={styles.calendarFooter}>
        {renderCancelButton()}
        {renderOkButton()}
      </View>
    );
  };

  let setCalendarDate = (date) => {
    let tempDate = moment(date, 'YYYY-MM-DD').format(DMYFORMAT);
    setSelectedDate(tempDate);
  };

  let renderCalendar = () => {
    // let date = startDateSelected
    //   ? selectedRange.startDate
    //   : selectedRange.endDate;
    // let selectedDate = moment(date, DMYFORMAT).format('YYYY-MM-DD');
    let currentDate = moment().format('YYYY-MM-DD');
    let currentYear = moment().year();
    let minYear = parseInt(currentYear) - 4;
    return (
      <View style={styles.calendarContainer}>
        <View style={styles.calendarBox}>
          <QPCalendar
            {...props}
            selectDate={setCalendarDate}
            selectedDate={currentDate}
            minimumDate={minYear + '-01-01'}
            maximumDate={currentDate}
            minYear={minYear}
            maxYear={currentYear}
          />
        </View>
        {renderCalendarFooter()}
      </View>
    );
  };

  let renderCalendarViewOnModal = () => {
    return (
      <Modal
        animationType={'fade'}
        transparent={true}
        onRequestClose={() => {}}
        visible={showCalendar}
        supportedOrientations={['portrait']}>
        <View style={styles.modalContainer}>
          <SafeAreaView style={{flex: 1}}>
            <ScrollView style={styles.scrollContainer}>
              {renderCalendar()}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.rootContainer}>
      <Animated.View
        style={[
          styles.container,
          {
            opacity: Animated.add(0.3, Animated.multiply(fall, 1.0)),
          },
        ]}>
        <ScrollView style={styles.container}>
          <View
            style={[styles.rowContainer, {justifyContent: 'space-between'}]}>
            <Text style={styles.headerText}>{headerTitle}</Text>
            <CloseButton color={Colors.filterIconColor} />
          </View>
          <TouchableOpacity onPress={handleSegmentSelection}>
            <View style={[styles.rowContainer, styles.rowItem]}>
              {/* {getIonIcon('star')} */}
              {getSegmentIcon()}
              {/* <TextInput placeholder="Segment" style={styles.titleText} /> */}
              <Text style={styles.titleText}>{segment}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDateSelection}>
            <View style={[styles.rowContainer, styles.rowItem]}>
              {getMaterialIcon('date-range')}
              {/* <TextInput placeholder="Date" style={styles.titleText} /> */}
              <Text style={styles.titleText}>
                {console.log('SELECTED_DATE', selectedDate)}
                {moment(selectedDate, DMYFORMAT).format(
                  FullMonthDateYearFormat,
                )}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={[styles.rowContainer, styles.rowItem]}>
            {getIonIcon('person')}
            <TextInput
              placeholder="Customer Name"
              style={styles.titleText}
              onChangeText={(text) => {
                console.log(text);
                // userInfo.firstName = text;
                setTicketState((state) => ({...state, firstName: text}));
              }}
            />
          </View>
          <View style={[styles.rowContainer, styles.rowItem]}>
            {getIonIcon('call')}
            {/* <TextInput placeholder="Phone" style={styles.titleText} /> */}
            <PhoneInput
              containerStyle={styles.phoneInputContainer}
              codeTextStyle={styles.phoneInputCodeText}
              textContainerStyle={styles.phoneInputTextContainer}
              textInputStyle={styles.phoneInputTextInputStyle}
              ref={phoneInput}
              // defaultValue={value}
              defaultCode="US"
              layout="first"
              onChangeText={(text) => {
                // setValue(text);
                // console.log('PHONE:', text);
              }}
              onChangeFormattedText={(text) => {
                // setFormattedValue(text);
                console.log('FORMATTED PHONE:', text);

                setTicketState((state) => ({...state, mobileNumber: text}));
                // userInfo.mobileNumber = text;
              }}
            />
          </View>

          <View style={[styles.rowContainer, styles.rowItem]}>
            {getIonIcon('mail')}
            <TextInput
              placeholder="Email"
              style={styles.titleText}
              onChangeText={(text) => {
                console.log(text);
                // userInfo.emailAddress = text;
                setTicketState((state) => ({...state, emailAddress: text}));
              }}
            />
          </View>

          <TouchableOpacity onPress={handlePrioritySelection}>
            <View style={[styles.rowContainer, styles.rowItem]}>
              {getIonIcon(
                'flag',
                getPriorityBorderColorbyId(ticketState.priority),
              )}
              <Text style={styles.titleText}>{`${
                getPriorityById(ticketState.priority) ?? 'Unassigned'
              } Priority`}</Text>
              {/* <TextInput placeholder="Priority" style={styles.titleText} /> */}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleStatusSelection}>
            <View style={[styles.rowContainer, styles.rowItem]}>
              {/* {getIonIcon('search')} */}
              {/* <TextInput placeholder="Status" style={styles.titleText} /> */}
              <RenderStatusIcon
                title={getStatusById(ticketState.status) ?? 'New'}
                size={14}
              />
              <Text style={styles.titleText}>{`${
                getStatusById(ticketState.status) ?? 'New'
              } Status`}</Text>
            </View>
          </TouchableOpacity>
          {/* <View style={[styles.rowContainer, styles.rowItem]}> */}
          {/* {getIonIcon('eye')} */}
          {/* {getIonIcon('eye-off')} */}
          {/* <TextInput placeholder="Watching" style={styles.titleText} /> */}
          {/* </View> */}
          <TouchableOpacity onPress={handleOwnerSelection}>
            <View style={[styles.rowContainer, styles.rowItem]}>
              {getMateriaCommunityIcon('shield-account')}
              {/* <TextInput placeholder="Ticket Owner" style={styles.titleText} /> */}
              <Text style={styles.titleText}>{`${ticketOwner ?? ''} `}</Text>
            </View>
          </TouchableOpacity>
          <View style={[styles.rowContainer, styles.rowItem]}>
            {getMaterialIcon('chat-bubble')}
            <TextInput
              multiline
              placeholder="Description"
              style={styles.titleText}
              onChangeText={(text) => {
                console.log(text);
                // userInfo.emailAddress = text;
                setTicketState((state) => ({...state, comment: text}));
              }}
            />
          </View>
          <View style={[styles.rowContainer, styles.rowButton]}>
            <QPButton
              onPress={handleCreateTicket}
              buttonColor={Colors.accentLight}
              buttonText={'Create Ticket'}
              textStyle={styles.qpButtonTextStyles}
              style={styles.buttonStyle}
            />
          </View>
        </ScrollView>
      </Animated.View>
      <RenderPriorityBottomSheet />
      <RenderStatusBottomSheet />
      <RenderSegmentBottomSheet />
      <RenderOwnerBottomSheet />
      {/* <RenderCalenderBottomSheet /> */}
      {showCalendar && renderCalendarViewOnModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
    marginHorizontal: MarginConstants.tab1,
    marginTop:
      Platform.OS === 'ios' ? MarginConstants.tab4 : MarginConstants.tab1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,

    marginTop: MarginConstants.tab1,
  },

  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    // backgroundColor: Colors.accentLight,
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
    marginVertical: MarginConstants.tab2,
    padding: MarginConstants.tab1,
    flex: 1,
    borderRadius: 2,
  },
  contentContainer: {backgroundColor: Colors.white, height: '100%'},

  phoneInputContainer: {height: MarginConstants.tab4},
  phoneInputCodeText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
  },
  phoneInputTextContainer: {
    backgroundColor: Colors.white,
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
  },
  phoneInputTextInputStyle: {
    height: MarginConstants.tab4,
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    padding: PaddingConstants.tab1,
    color: Colors.filterIconColor,
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
});
