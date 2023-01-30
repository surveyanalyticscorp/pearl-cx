import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  Image,
  StyleSheet,
  // ScrollView,
  Platform,
  FlatList,
  Pressable,
} from 'react-native';
// import StringUtils from '../../Utils/StringUtils';
// import ArrayUtils from '../../Utils/ArrayUtils';
// import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {
  Colors,
  statusColors,
  priorityColors,
} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily, FontWeight} from '../../styles/font.constants';
// import {Sizes} from '../../styles/Size.constant';
// import moment from 'moment';
// import {translate} from '../../Utils/MultilinguaUtils';
import IonIcons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import QPButton from '../../widgets/Button';
// import ModalDropdown from '../../widgets/drop-down/ModalDropdown';
import IconTextModalDropdown from '../../widgets/drop-down/IconTextModalDropdown';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import TicketTakeAction from './takeaction/TIcketTakeAction';
// import {TouchableOpacity} from 'react-native-gesture-handler';
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
  getSegmentBySegmentId,
  getSegmentIndex,
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
import SelectSegment from './takeaction/SelectSegment';
import SelectTicketOwner from './takeaction/SelectTicketOwner';
// import {element} from 'prop-types';
import {
  getDefaultEmailTemplate,
  getEmailTemplates,
} from '../../redux/actions/closedloop.actions';
import {EMAIL, PHONE} from '../../api/Constant';
import {StackActions, useNavigation} from '@react-navigation/native';
import {translate} from '../../Utils/MultilinguaUtils';

export default function TicketOverview(props) {
  const bottomSheetEnum = {
    status: 'status',
    priority: 'priority',
    owners: 'owners',
    segment: 'segment',
  };
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [currentBS, setCurrentBS] = useState(bottomSheetEnum.status);
  const {authToken} = useSelector((state) => state.global);
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
  // const getSegmentIndex = (segemntlist, segmentId) => {
  //   let index = 0;
  //   segemntlist.forEach((element, index_) => {
  //     if (element.currentSegmentID === segmentId) {
  //       index = index_;
  //     }
  //   });
  //   return index;
  // };

  // const getSegmentBySegmentId = (segmentlist, segmentId) => {
  //   let item = {};
  //   segmentlist.forEach((element) => {
  //     if (element.currentSegmentID === segmentId) {
  //       item = element;
  //     }
  //   });
  //   return item;
  // };

  // const getOwnerIndex = (ownerlist, ownnerId) => {
  //   let index_ = -1;
  //   ownerlist.forEach((element, index) => {
  //     if (element.ownerID === ownnerId) {
  //       index_ = index;
  //     }
  //   });
  //   return index_;
  // };

  const [currentSegment, setCurrentSegment] = useState(
    getSegmentBySegmentId(segments, ticketDetails.currentSegmentId ?? 0),
  );
  // const [segmentIndex, setSegmentIndex] = useState(
  //   getSegmentIndex(segments, currentSegment.currentSegmentID),
  // );

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
    // console.log('UPDATE_TICKET', body);

    dispatch(
      updateClfTicket(authToken, body, ticketDetails.id, feedbackApiKey),
    );
  };

  // useEffect(() => {
  // dispatch(
  //   getDefaultEmailTemplate(authToken, {subscriberId: global.subscriberId}),
  // );
  // dispatch(getEmailTemplates(authToken, {subscriberId: global.subscriberId}));
  // }, []);

  /// BOTTOM SHEET

  // variables for bottom sheet
  const actionBottomSheet = React.useRef();
  const statusBottomSheet = React.useRef();
  // const priorityBottomSheet = React.useRef();
  // const segmentBottomSheet = React.useRef();
  // const ownerBottomSheet = React.useRef();

  const actionBottomSheetSnapPoints = ['33%', '0%'];
  const statusBottomSheetSnapPoints = ['45', '0'];
  // const priorityBottomSheetSnapPoints = ['45', '0'];
  // const segmentBottomSheetSnapPoints = ['45', '0'];
  // const ownerBottomSheetSnapPoints = ['45', '0'];

  const fall = new Animated.Value(1);

  // const [shadow, setShadow] = useState(false);

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
    // priorityBottomSheet.current.snapTo(0);
  };

  const handleSegmentSelection = () => {
    // setCurrentBS(bottomSheetEnum.segment);
    // statusBottomSheet.current.snapTo(0);
    // segmentBottomSheet.current.snapTo(0);
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

    // ownerBottomSheet.current.snapTo(0);
  };

  const renderStatusHeader = (_title) => {
    return (
      <BottomSheetHeader
        title={'Select Status'}
        onPressClose={
          closeBS
          // () =>
          // statusBottomSheet.current.snapTo(
          //   statusBottomSheetSnapPoints.length - 1,
          // )
        }
      />
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
            // setTicketState((state) => ({...state, status: item.id}));
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

      // case bottomSheetEnum.segment:
      //   renderContent = renderSegmentSelectContent;
      //   renderHeader = renderSegmentHeader;
      //   break;

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
      <BottomSheetHeader
        title={'Select Priority'}
        onPressClose={
          closeBS
          // () =>
          // priorityBottomSheet.current.snapTo(
          //   priorityBottomSheetSnapPoints.length - 1,
          // )
        }
      />
    );
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
            updateTicket({priority: item.id});
            // setTicketState((state) => ({
            //   ...state,
            //   priority: item.id,
            // }));
          }}
        />
      </View>
    );
  };

  // const RenderPriorityBottomSheet = () => {
  //   return (
  //     <BottomSheet
  //       ref={priorityBottomSheet}
  //       snapPoints={priorityBottomSheetSnapPoints}
  //       initialSnap={priorityBottomSheetSnapPoints.length - 1}
  //       enabledGestureInteraction={true}
  //       renderContent={renderPrioritySelectContent}
  //       renderHeader={renderPriorityHeader}
  //       callbackNode={fall}
  //     />
  //   );
  // };

  const renderSegmentHeader = (_title) => {
    return (
      <BottomSheetHeader
        title={'Select Segment'}
        onPressClose={
          closeBS
          // () =>
          //   segmentBottomSheet.current.snapTo(
          //     segmentBottomSheetSnapPoints.length - 1,
          //   )
        }
      />
    );
  };

  // const renderSegmentSelectContent = () => {
  //   return (
  //     <View style={styles.contentContainer}>
  //       <SelectSegment
  //         data={segments}
  //         selectedIndex={segmentIndex}
  //         handleOnPress={(item, index) => {
  //           console.log('SEGMENT', JSON.stringify(item));
  //           // console.log(JSON.stringify(item));
  //           // setSegment(item.segmentName);
  //           setSegmentIndex(index);
  //           updateTicket({currentSegmentId: item.segmentID});
  //           getTicketOwnerList(item.segmentID);
  //           // setSegmentId((prev) => item.segmentID);

  //           //   setTicketState((state) => ({
  //           //     ...state,
  //           //     currentSegmentId: item.segmentID,
  //           //   }));
  //         }}
  //       />
  //     </View>
  //   );
  // };

  // const RenderSegmentBottomSheet = () => {
  //   return (
  //     <BottomSheet
  //       ref={segmentBottomSheet}
  //       snapPoints={segmentBottomSheetSnapPoints}
  //       initialSnap={segmentBottomSheetSnapPoints.length - 1}
  //       enabledGestureInteraction={true}
  //       renderContent={renderSegmentSelectContent}
  //       renderHeader={renderSegmentHeader}
  //       callbackNode={fall}
  //     />
  //   );
  // };

  const renderOwnerHeader = (_title) => {
    return (
      <BottomSheetHeader
        title={'Select Ticket Owner'}
        onPressClose={
          closeBS
          // () =>
          //   statusBottomSheet.current.snapTo(
          //     statusBottomSheetSnapPoints.length - 1,
          //   )
          // ownerBottomSheet.current.snapTo(ownerBottomSheetSnapPoints.length - 1)
        }
      />
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
            // setTicketOwner(item.ownerName);
            setTicketOwnerIndex(index);
            updateTicket({assignToId: item.ownerID});
            // setTicketState((state) => ({
            //   ...state,
            //   assignToId: item.ownerID,
            //   ownerId: item.ownerID,
            // }));
          }}
        />
      </View>
    );
  };

  // const RenderOwnerBottomSheet = () => {
  //   return (
  //     <BottomSheet
  //       ref={ownerBottomSheet}
  //       snapPoints={ownerBottomSheetSnapPoints}
  //       initialSnap={ownerBottomSheetSnapPoints.length - 1}
  //       enabledGestureInteraction={true}
  //       renderContent={renderOwnerSelectContent}
  //       renderHeader={renderOwnerHeader}
  //       callbackNode={fall}
  //     />
  //   );
  // };

  const closeBS = () => {
    statusBottomSheet.current.snapTo(statusBottomSheetSnapPoints.length - 1);
  };

  const departmentOptions = ['Sales', 'Client Services'];

  let sampleText =
    'The manager completely botched our loan application! We were there for more than four hours trying to resolve t...';
  let [isTapped, setTapped] = useState(false);

  const TicketID = ({children}) => {
    return <Text style={styles.idText}>{`ID ${children}`} </Text>;
  };

  let getNPSIcon = (sentiment) => {
    let icon;
    switch (sentiment) {
      case 'Detractor':
        icon = require('./../../../assets/images/detractor.png');
        break;
      case 'Passive':
        icon = require('./../../../assets/images/passive.png');
        break;
      default:
        icon = require('./../../../assets/images/promoter.png');
        break;
    }

    return <Image source={icon} style={{width: 16, height: 16}} />;
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

  let getNPSScore = (score, sentiment) => {
    let textColor = getNPSColor(sentiment);
    return (
      <Text
        style={{
          marginHorizontal: 12,
          fontSize: 16,
          fontWeight: 'bold',
          color: textColor,
        }}>
        {score}
      </Text>
    );
  };

  const getNPSAndTicketRow = () => {
    return (
      <View style={styles.rowContainer}>
        <View style={[{flex: 2}, styles.rowContainer]}>
          {getNPSIcon('Detractor')}
          {getNPSScore('2', 'Detractor')}
        </View>
        <View
          style={[{flex: 2, justifyContent: 'flex-end'}, styles.rowContainer]}>
          <TicketID>''</TicketID>
        </View>
      </View>
    );
  };

  const getNameANdDateRow = () => {
    return (
      <View style={styles.rowContainer}>
        <Text style={styles.userNameText}>Jessica Parker</Text>
        <Text style={styles.dateText}> · May 15, 2022</Text>
      </View>
    );
  };

  const getTicketDetails = () => {
    return (
      <View style={styles.rowContainer}>
        <Text style={styles.detailsText} numberOfLines={3} ellipsizeMode="tail">
          {sampleText}
        </Text>
      </View>
    );
  };

  const getStatusUI = () => {
    return (
      <View style={styles.rowContainer}>
        <View
          style={{
            width: 20,
            height: 20,

            borderRadius: 50,
            borderColor: statusColors.escalatedBorder,
            borderWidth: 1,
            backgroundColor: statusColors.escalatedFiller,
          }}
        />
        <Text style={[{marginHorizontal: 4}, styles.statusText]}>
          Escalated
        </Text>
      </View>
    );
  };

  const getPriorityUI = () => {
    return (
      <View style={styles.rowContainer}>
        <IonIcons name="flag" size={20} color={Colors.passive2} />
        <Text style={[{marginStart: 4}, styles.detailsText]}>Normal</Text>
      </View>
    );
  };

  const getUserPic = () => {
    return (
      <View>
        <Image
          style={{height: 24, width: 24, borderRadius: 50}}
          source={{
            uri: 'https://reactnative.dev/img/tiny_logo.png',
          }}
        />
      </View>
    );
  };

  const getStatusRow = () => {
    return (
      <View style={styles.statusContainer}>
        {getStatusUI()}
        {getPriorityUI()}
        {getUserPic()}
      </View>
    );
  };

  const takeActionButton = () => {
    // const buttonColor = ticketDetails.panelMember.email
    //   ? Colors.accentLight
    //   : Colors.filterIconColor;
    return (
      <View style={styles.takeActionContainer}>
        <QPButton
          testID="SignInButton"
          buttonColor={Colors.accentLight}
          style={styles.takeActionButton}
          onPress={onTakeActionHandler}
          buttonText={'Take Action'}
          textStyle={styles.takeActionText}
        />
      </View>
    );
  };

  function dropdownRenderRow(rowData, rowID, highlighted) {
    return (
      <View
        style={[
          styles.dropdownRow,
          {backgroundColor: highlighted ? Colors.overlay : Colors.white},
        ]}>
        <RenderRoundImageOrColor data={rowData} />
        <Text style={styles.dropdownText}>{rowData.title}</Text>
      </View>
    );
  }

  const DropDownView = (options, defaultText) => {
    return (
      <View style={[{flex: 2}, styles.rowContainer]}>
        <IconTextModalDropdown
          style={styles.modelDropdown}
          textStyle={styles.dropdownText}
          dropdownTextStyle={styles.dropdownText}
          arrowIconColor={Colors.secondary}
          options={options}
          defaultValue={defaultText}
          renderRow={dropdownRenderRow}
          onSelect={(i) => {
            // setDataOnSelection(header, options, i);
          }}
        />
      </View>
    );
  };

  const DescriptionHeader = (text) => {
    return (
      <View style={[{flex: 1}, styles.rowContainer]}>
        <Text style={styles.headerText}>{text}</Text>
      </View>
    );
  };

  const Title = ({value}) => {
    return (
      <View style={[{flex: 1}, styles.rowContainer]}>
        <Text style={styles.titleText}>{value}</Text>
      </View>
    );
  };

  const getText = (text) => {
    return (
      <View
        style={[{flex: 2, justifyContent: 'flex-start'}, styles.rowContainer]}>
        <Text style={styles.detailsText}>{text}</Text>
      </View>
    );
  };

  const getNPSScoreText = (text) => {
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
          <Text style={[styles.detailsText, {color: Colors.white}]}>
            {text}
          </Text>
        </View>
      </View>
    );
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

  const RenderStatusDropDownButton = ({text}) => {
    return (
      <View style={styles.dropdownContainer}>
        <TouchableWithoutFeedback onPress={handleStatusSelection}>
          <View style={styles.dropdownInnerContainer}>
            <View style={styles.dropdownInnerContainer}>
              <RenderStatusIcon
                style={{margin: MarginConstants.halfTab}}
                title={text}
              />
              <Text style={styles.dropdownContainerText}>{text}</Text>
            </View>
            {/* <Icon name={arrowIcon} size={15} color={arrowColor} /> */}

            <SimpleLineIcon
              name={'arrow-down'}
              size={15}
              color={Colors.evenDarkerGrey}
            />
          </View>

          {/* <IonIcons name="down-arrow" /> */}
        </TouchableWithoutFeedback>
      </View>
    );
  };

  const RenderPriorityDropDownButton = ({text}) => {
    return (
      <View style={styles.dropdownContainer}>
        <TouchableWithoutFeedback onPress={handlePrioritySelection}>
          <View style={styles.dropdownInnerContainer}>
            <View style={styles.dropdownInnerContainer}>
              <RenderPriorityIcon
                style={{margin: MarginConstants.halfTab}}
                title={text}
              />
              <Text style={styles.dropdownContainerText}>{text}</Text>
            </View>
            {/* <Icon name={arrowIcon} size={15} color={arrowColor} /> */}

            <SimpleLineIcon
              name={'arrow-down'}
              size={15}
              color={Colors.evenDarkerGrey}
            />
          </View>

          {/* <IonIcons name="down-arrow" /> */}
        </TouchableWithoutFeedback>
      </View>
    );
  };

  const RenderSegmentDropDownButton = ({text}) => {
    return (
      <View style={styles.dropdownContainer}>
        {/* <TouchableWithoutFeedback onPress={handleSegmentSelection}> */}
        <View style={styles.dropdownInnerContainer}>
          <View style={styles.dropdownInnerContainer}>
            {/* <RenderPriorityIcon
                style={{margin: MarginConstants.halfTab}}
                title={
                  ticketDetails !== undefined
                    ? getPriorityById(ticketDetails.priority)
                    : 'Select priority'
                }
              /> */}
            <Text style={styles.dropdownContainerText}>{text}</Text>
          </View>
          {/* <Icon name={arrowIcon} size={15} color={arrowColor} /> */}

          {/* <SimpleLineIcon
            name={'arrow-down'}
            size={15}
            color={Colors.evenDarkerGrey}
          /> */}
        </View>

        {/* <IonIcons name="down-arrow" /> */}
        {/* </TouchableWithoutFeedback> */}
      </View>
    );
  };

  const RenderOwnerDropDownButton = ({text}) => {
    return (
      <View style={styles.dropdownContainer}>
        <TouchableWithoutFeedback onPress={handleOwnerSelection}>
          <View style={styles.dropdownInnerContainer}>
            <View style={styles.dropdownInnerContainer}>
              {/* <RenderPriorityIcon
                style={{margin: MarginConstants.halfTab}}
                title={
                  ticketDetails !== undefined
                    ? getPriorityById(ticketDetails.priority)
                    : 'Select priority'
                }
              /> */}
              <Text style={styles.dropdownContainerText}>{text}</Text>
            </View>
            {/* <Icon name={arrowIcon} size={15} color={arrowColor} /> */}

            <SimpleLineIcon
              name={'arrow-down'}
              size={15}
              color={Colors.evenDarkerGrey}
            />
          </View>

          {/* <IonIcons name="down-arrow" /> */}
        </TouchableWithoutFeedback>
      </View>
    );
  };

  const ticketStatusPriorityView = () => {
    return (
      <View style={styles.ticketStatusContainer}>
        <View style={styles.rowContainer}>
          <Title value={'Current Segment'} />

          {/* {DropDownView(userOptions, 'Select Segement')} */}
          <RenderSegmentDropDownButton
            text={
              ticketDetails !== undefined
                ? getSegmentNameById(segments, ticketDetails.currentSegmentId)
                : 'Select segment'
            }
          />
        </View>
        <View style={styles.rowContainer}>
          <Title value={'Ticket Status'} />
          <RenderStatusDropDownButton
            text={
              ticketDetails !== undefined
                ? getStatusById(ticketDetails.status)
                : 'Select status'
            }
          />

          {/* {DropDownView(
            statusList,
            ticketDetails !== undefined
              ? getStatusById(ticketDetails.status)
              : 'Select status',
          )} */}
        </View>
        <View style={styles.rowContainer}>
          <Title value={'Priority'} />

          <RenderPriorityDropDownButton
            text={
              ticketDetails !== undefined
                ? getPriorityById(ticketDetails.priority)
                : 'Select priority'
            }
          />
          {/* {DropDownView(
            priorityList,
            ticketDetails !== undefined
              ? getPriorityById(ticketDetails.priority)
              : 'Select priority',
          )} */}
        </View>

        <View style={styles.rowContainer}>
          <Title value={'Assigned to'} />
          {/* {DropDownView(userOptions, 'Assign manager')} */}
          <RenderOwnerDropDownButton
            text={
              ticketDetails !== undefined
                ? // ? ticketDetails.assignToId
                  getOwnerNameById(owners, ticketDetails.assignToId)
                : 'Select owner'
            }
          />
        </View>
        {/* <View style={styles.rowContainer}>{Title('Department')}</View>
        <View style={styles.rowContainer}>
          <FlatList
            horizontal={true}
            data={departmentOptions}
            renderItem={departmentNameCell}
            keyExtractor={(item) => item}
          />
        </View> */}
      </View>
    );
  };

  const descriptionView = () => {
    return (
      <View style={styles.ticketStatusContainer}>
        <View style={styles.rowContainer}>
          {DescriptionHeader('Description')}
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

        <View style={styles.rowContainer}>
          <Title value={'Origin Segment'} />

          {getText(
            ticketDetails
              ? getSegmentNameById(segments, ticketDetails.originSegmentId)
              : 'Segment',
          )}
        </View>
        <View style={styles.rowContainer}>
          <Title value={'Created'} />

          {getText(
            ticketDetails !== undefined
              ? moment(ticketDetails.issueDate).format(FullMonthDateYearFormat)
              : '',
          )}
        </View>
        {ticketDetails.npsScore ? (
          <View style={styles.rowContainer}>
            <Title value={'NPS'} />

            {getNPSScoreText('3')}
          </View>
        ) : (
          <View />
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
    const data = [
      {id: 1, title: 'Respond via Email', icon: 'email'},
      // {id: 2, title: 'Respond via phone', icon: 'phone'},
      // {id: 3, title: 'Respond via SMS', icon: 'chat-bubble'},
      // {id: 4, title: 'Forward via Email', icon: 'exit-to-app'},
    ];

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

  // const TempUI = () => {
  //   return useCallback(() => <RenderTicketOverView />, [ticketDetails]);
  // };

  const RenderTicketOverView = () => (
    <View style={styles.container}>
      <Animated.ScrollView
        style={{
          opacity: Animated.add(0.3, Animated.multiply(fall, 1.0)),
        }}>
        <View style={styles.container}>
          {takeActionButton()}
          {ticketStatusPriorityView()}
          {descriptionView()}
          {console.log('RENDER')}
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
