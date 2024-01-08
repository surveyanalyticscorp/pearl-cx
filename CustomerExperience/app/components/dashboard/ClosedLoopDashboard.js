import React, {useState} from 'react';
import {
  useWindowDimensions,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Switch,
  Platform,
} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {FontFamily, FontWeight} from '../../styles/font.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {PaddingConstants} from '../../styles/padding.constants';
import DeviceInfo from 'react-native-device-info';
import {VictoryPie} from 'victory-native';
import {StackActions, useNavigation} from '@react-navigation/native';
import {translate} from '../../Utils/MultilinguaUtils';
import {setStatusFilterById} from '../../redux/actions/closedloop.actions';
import {useDispatch} from 'react-redux';
import QPButton from '../../widgets/Button';
import {buttonStyles} from '../../styles/button.styles';
import {textStyles} from '../../styles/text.styles';
import DropDownPicker from 'react-native-dropdown-picker';
import ModalDropdown from '../../widgets/drop-down/ModalDropdown';
import IconTextModalDropdown from '../../widgets/drop-down/IconTextModalDropdown';
import {
  getDashboardStatusList,
  getDashboardStatusListForBottomList,
  statusListDashboardClosedLoopFilter,
} from '../../Utils/TicketUtils';
import {
  BottomSheetHeader,
  IconButton,
  RenderSegmentTitle,
  RenderStatusIcon,
} from '../../routes/CommonScreen';
import BottomSheet from 'reanimated-bottom-sheet';
import SelectStatus from '../closedloop/takeaction/SelectStatus';
import Animated from 'react-native-reanimated';

const RenderDonutChart = ({count, showPercentageCount}) => {
  // let count = getCount(props.route.params.ticketCount);

  let victoryPieColorScale =
    count.totalTickets > 0
      ? [Colors.low2, Colors.medium2, Colors.high2, Colors.critical2]
      : [Colors.darkGrey];
  let dataScale =
    count.totalTickets > 0
      ? [
          {y: count.low, x: ''},
          {y: count.medium, x: ''},
          {y: count.high, x: ''},
          {y: count.critical, x: ''},
        ]
      : [{y: 100, x: ''}];
  return (
    <View style={styles.chartContainer}>
      <RenderDonutInfoViewContainer
        priorities={count}
        showPercentageCount={showPercentageCount}
      />
      <View style={styles.donut}>
        <VictoryPie
          data={dataScale}
          width={5 * MarginConstants.tab4}
          height={6 * MarginConstants.tab4}
          innerRadius={2.2 * MarginConstants.tab4}
          radius={1.8 * MarginConstants.tab4}
          style={{
            labels: {
              fill: 'transparent',
            },
          }}
          colorScale={victoryPieColorScale}
        />
        {/* <View style={styles.npsView}>
          <Text style={[styles.npsPercentText]}>{count.totalTickets}</Text>
          <Text style={[styles.npsText]}>CX</Text>
          <Text style={[styles.npsText]}>{translate('dashboard.tickets')}</Text>
        </View> */}
      </View>
    </View>
  );
};

let RenderDonutInfoViewContainer = ({priorities, showPercentageCount}) => {
  // let priorities = getCount(props.route.params.ticketCount);
  return (
    <View>
      <RenderTicketTotalView totalCount={priorities.totalTickets} />
      <RenderTicketView
        totalTickets={priorities.totalTickets}
        count={priorities.critical}
        bgColor={Colors.critical2}
        status={translate('dashboard.critical')}
        textColor={Colors.white}
        showPercentageCount={showPercentageCount}
      />
      <RenderTicketView
        totalTickets={priorities.totalTickets}
        count={priorities.high}
        bgColor={Colors.high2}
        status={translate('dashboard.high')}
        textColor={Colors.white}
        showPercentageCount={showPercentageCount}
      />
      <RenderTicketView
        totalTickets={priorities.totalTickets}
        count={priorities.medium}
        bgColor={Colors.medium2}
        status={translate('dashboard.medium')}
        textColor={Colors.white}
        showPercentageCount={showPercentageCount}
      />
      <RenderTicketView
        totalTickets={priorities.totalTickets}
        count={priorities.low}
        bgColor={Colors.low2}
        status={translate('dashboard.low')}
        textColor={Colors.white}
        showPercentageCount={showPercentageCount}
      />

      {/* {renderTicketView(
        priorities.totalTickets,
        priorities.critical,
        Colors.critical2,
        translate('dashboard.critical'),
        Colors.white,
      )}
      {renderTicketView(
        priorities.totalTickets,
        priorities.high,
        Colors.high2,
        translate('dashboard.high'),
        Colors.white,
      )}
      {renderTicketView(
        priorities.totalTickets,
        priorities.medium,
        Colors.medium2,
        translate('dashboard.medium'),
        Colors.primary,
      )}
      {renderTicketView(
        priorities.totalTickets,
        priorities.low,
        Colors.low2,
        translate('dashboard.low'),
        Colors.white,
      )} */}
    </View>
  );
};

const getParcentage = (total, count) =>
  Number((total === 0 ? 0 : (100 * count) / total).toFixed(2));

const RenderTicketView = ({
  totalTickets,
  count,
  bgColor,
  status,
  textColor,
  showPercentageCount,
}) => {
  const ticketCount = showPercentageCount
    ? `${getParcentage(totalTickets, count)}%`
    : `${count}`;

  return (
    // <View style={styles.donutInfoContainer}>
    //   <Text style={styles.ticketText}>{count}</Text>
    //   <View style={[styles.ticketStatusView, {backgroundColor: bgColor}]}>
    //     <Text style={[styles.ticketStatusText, {color: textColor}]}>
    //       {status}
    //     </Text>
    //   </View>
    // </View>

    <View style={styles.donutInfoContainer}>
      <View
        style={[styles.ticketStatusIndicatorView, {backgroundColor: bgColor}]}
      />
      <Text style={styles.ticketText}>{ticketCount}</Text>
      <View style={[styles.ticketStatusView]}>
        <Text style={[styles.ticketStatusText]}>{status}</Text>
      </View>
    </View>
  );
};

const RenderTicketTotalView = ({totalCount}) => {
  return (
    <View style={styles.donutInfoContainer}>
      <Text style={[styles.ticketTotalText]}>{`${totalCount} in total`}</Text>
    </View>
  );
};

const RenderCountContainer = ({
  count,
  setShowPercentageCount,
  showPercentageCount,
}) => {
  console.log(`COUNT: ${JSON.stringify(count)}`);
  const toggleSwitch = () => setShowPercentageCount(!showPercentageCount);
  // const count = getCount(props.route.params.ticketCount);
  return (
    <View style={[styles.viewCountContainer]}>
      <View
        style={{
          height: MarginConstants.tab4,
          justifyContent: 'center',
        }}>
        <Text style={textStyles.secondaryText}>{`${
          count.totalTickets ?? 0
        } ${translate('dashboard.total')}`}</Text>
      </View>
      <View
        style={{
          height: MarginConstants.tab4,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={textStyles.secondaryText}>Count</Text>
        <Switch
          trackColor={{true: Colors.accent, false: Colors.darkGrey}}
          thumbColor={Colors.white}
          ios_backgroundColor={Colors.filterIconColor}
          onValueChange={toggleSwitch}
          value={showPercentageCount}
          style={styles.switch}
        />
        <Text style={textStyles.secondaryText}>Percentage</Text>
      </View>
    </View>
  );
};

let RenderViewTicketsContainer = ({statusId}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const navigateToCLosedLoop = () => {
    if (statusId) {
      dispatch(setStatusFilterById(statusId));
    }

    // props.navigation.navigate('ClosedLoop');
    navigation.navigate('dashboard_to_closed_loop');
  };
  return (
    <View style={styles.viewTicketsContainer}>
      {/* <TouchableWithoutFeedback
          onPress={navigateToCLosedLoop}
          // () => {
          // const pushAction = StackActions.push(
          //   translate('close_loop.close_loop'),
          //   {
          //     screen: props.route.name,
          //   },
          // );
          // props.navigation.dispatch(pushAction);
          // props.navigation.navigate('ClosedLoop', {
          //   screen: 'Closed Loop',
          //   params: {index: JSON.stringify(props.route.params.index - 1)},
          // });
          // dispatch(
          //   setStatusFilterById(JSON.stringify(props.route.params.index - 1)),
          // );
          // props.navigation.navigate('ClosedLoop');
          // }
          // }
        >
          <Text style={styles.viewTicketsText}>
            {translate('dashboard.view_tickets')}
          </Text>
        </TouchableWithoutFeedback> */}
      <QPButton
        testID="ViewTicketsButton"
        style={buttonStyles.textButton}
        onPress={navigateToCLosedLoop}
        buttonText={`${translate('dashboard.view_tickets')}`}
        textStyle={buttonStyles.textButtonText}
      />
    </View>
  );
};

const ViewTicketsButton = ({statusIndex}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const navigateToCLosedLoop = () => {
    if (statusIndex === 0) {
      dispatch(setStatusFilterById(''));
    } else {
      dispatch(setStatusFilterById(JSON.stringify(statusIndex - 1)));
    }

    // props.navigation.navigate('ClosedLoop');
    navigation.navigate('dashboard_to_closed_loop');
  };

  return (
    <QPButton
      testID="ViewTicketsButton"
      style={buttonStyles.textButton}
      onPress={navigateToCLosedLoop}
      buttonText={`${translate('dashboard.view_tickets')}`}
      textStyle={buttonStyles.textButtonText}
    />
  );
};

const RenderStatusFilterButton = ({currentStatus, onPress}) => {
  console.log('ABUL', JSON.stringify(currentStatus));
  // <QPButton
  //   testID="StatusFilterButton"
  //   style={{
  //     ...buttonStyles.outlinePrimaryButtonMedium,
  //     marginHorizontal: MarginConstants.tab2,
  //     maxWidth: MarginConstants.tab4 * 4,
  //   }}
  //   onPress={() => {}}
  //   buttonText={`${translate('dashboard.view_tickets')}`}
  //   textStyle={buttonStyles.outlinePrimaryButtonMediumText}
  // />
  return (
    <IconButton
      buttonStyle={{
        ...buttonStyles.outlinePrimaryButtonMedium,
        marginHorizontal: MarginConstants.tab2,
        maxWidth: MarginConstants.tab4 * 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={onPress}
      leftIcon={<RenderStatusIcon title={currentStatus.title.toLowerCase()} />}
      buttonText={currentStatus.title}
      textStyle={{
        ...buttonStyles.outlinePrimaryButtonMediumText,
        marginHorizontal: MarginConstants.halfTab,
      }}
    />
  );
};
export const RenderDropDown = ({
  currentStatus,
  setCurrentStatus,
  statusList,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isOpen, setOpen] = useState(false);

  const [currentValue, setCurrentValue] = useState(currentStatus.value);
  const [statusIndex, setStatusIndex] = useState(0);
  console.log('CUreent status', JSON.stringify(currentStatus));
  const setDropdownValue = item => {
    console.log('DROPDOWN VALUE: ', item);
    setCurrentStatus(item);
    console.log(
      'Index',
      statusList.findIndex(obj => obj.value === item.value),
    );
    setStatusIndex(statusList.findIndex(obj => obj.value === item.value));
  };

  // function getIndexFromStatusList( statusValue, statusList){
  //  return statusList.findIndex( (obj) => (s === statusValue) return index});
  // }

  const navigateToCLosedLoop = () => {
    if (statusIndex !== statusList.length - 1) {
      dispatch(setStatusFilterById(statusIndex.toString()));
    } else {
      dispatch(setStatusFilterById(''));
    }

    // props.navigation.navigate('ClosedLoop');
    navigation.navigate('dashboard_to_closed_loop');
    return (
      <QPButton
        testID="ViewTicketsButton"
        style={buttonStyles.outlinePrimaryButtonMedium}
        onPress={navigateToCLosedLoop}
        buttonText={`${translate('dashboard.view_tickets')}`}
        textStyle={buttonStyles.outlinePrimaryButtonMediumText}
      />
    );
  };

  // function dropdownRenderRow(rowData, rowID, highlighted) {
  //   return (
  //     <View>
  //       <Text style={styles.dropdownText}>{rowData.label}</Text>
  //     </View>
  //   );
  // }

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginHorizontal: MarginConstants.tab2,
        marginTop: MarginConstants.tab1,
        zIndex: 100,
      }}>
      <View
        style={{
          flex: 1,
        }}>
        <DropDownPicker
          style={{
            borderColor: Colors.transparent,
            maxWidth: MarginConstants.tab4 * 4,
            borderBottomColor: Colors.darkGrey,
            borderRadius: 0,
            position: 'relative',
          }}
          items={statusList}
          open={isOpen}
          setOpen={() => setOpen(!isOpen)}
          searchable={false}
          showTickIcon
          onSelectItem={setDropdownValue}
          setValue={setCurrentValue}
          labelStyle={{color: Colors.accentLight}}
          listItemLabelStyle={{color: Colors.filterIconColor}}
          value={currentValue}
        />
      </View>

      {/* <QPButton
        testID="ViewTicketsButton"
        style={buttonStyles.outlinePrimaryButtonMedium}
        onPress={navigateToCLosedLoop}
        buttonText={`${translate('dashboard.view_tickets')}`}
        textStyle={buttonStyles.outlinePrimaryButtonMediumText}
      /> */}
      {/* <RenderViewTicketsContainer /> */}
    </View>
  );
};

// <View
//   style={{
//     margin: MarginConstants.tab2,
//     maxWidth: MarginConstants.tab4 * 8,
//   }}>
{
  /* <DropDownPicker
      items={items}
      open={isOpen}
      setOpen={() => setOpen(!isOpen)}
      maxHeight={100}
      searchable={false}
      autoscroll
      showTickIcon
      setValue={v => setCurrentValue(v)}
      value={currentValue}
    /> */
}
{
  // <IconTextModalDropdown
  //     style={styles.modelDropdown}
  //     textStyle={styles.dropdownText}
  //     dropdownTextStyle={styles.dropdownText}
  //     arrowIconColor={Colors.secondary}
  //     options={items}
  //     defaultValue={currentValue}
  //     renderRow={dropdownRenderRow}
  //     onSelect={_index => {
  //       setCurrentValue(items[_index].value);
  //       // setAssigneeManager(list[_index], true);
  //       // setSelectedManager((state) => [...state, managerlist[_index]]);
  //       // setManagerList((state) =>
  //       //   state.filter((item) => item.ownerID !== state[_index].ownerID),
  //       // );
  //     }}
  //   />
}

{
  /* <ModalDropdown
      options={items}
      defaultValue={currentValue.label}
      renderRow={dropdownRenderRow}
      onSelect={i => {
        setCurrentValue(i);
      }}
    /> */
}
{
  /* </View> */
}

export const StatusDashboardBottomSheet = ({fall}) => {
  const statusBottomSheetRef = React.useRef();
  const statusBottomSheetSnapPoints = ['75%', '0%'];
  const statusList = getDashboardStatusListForBottomList(props.ticketCount);
  const [statusIndex, setStatusIndex] = useState(0);
  const [selectedCurrentStatus, setCurrentStatus] = useState(statusList[0]);

  const handleStatusSelection = () => {
    // open status selection bottom sheet
    statusBottomSheetRef.current.snapTo(0);
  };
  const closeStatusSelection = () => {
    // open status selection bottom sheet
    statusBottomSheetRef.current.snapTo(statusBottomSheetSnapPoints.length - 1);
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
            setStatusIndex(index);
            setCurrentStatus(item);
            closeStatusSelection();
          }}
        />
      </View>
    );
  };

  const renderStatusHeader = _title => {
    return (
      <BottomSheetHeader
        title={translate('ticket_overview.select_status')}
        onPressClose={() =>
          statusBottomSheetRef.current.snapTo(
            statusBottomSheetSnapPoints.length - 1,
          )
        }
      />
    );
  };
  return (
    <BottomSheet
      ref={statusBottomSheetRef}
      snapPoints={statusBottomSheetSnapPoints}
      initialSnap={statusBottomSheetSnapPoints.length - 1}
      enabledGestureInteraction={true}
      renderContent={renderStatusSelectContent}
      renderHeader={renderStatusHeader}
      callbackNode={fall}
    />
  );
};

export const ClosedLoopDashboard = props => {
  const [showPercentageCount, setShowPercentageCount] = useState(false);
  console.log(`Ticket Count: ${JSON.stringify(props.ticketCount)}`);
  const statusBottomSheetRef = React.useRef();
  const statusBottomSheetSnapPoints = ['75%', '0%'];
  const statusList = getDashboardStatusListForBottomList(props.ticketCount);
  const [statusIndex, setStatusIndex] = useState(0);
  const [selectedCurrentStatus, setCurrentStatus] = useState(statusList[0]);

  const fall = new Animated.Value(1);
  const handleStatusSelection = () => {
    // open status selection bottom sheet
    statusBottomSheetRef.current.snapTo(0);
  };
  const closeStatusSelection = () => {
    // open status selection bottom sheet
    statusBottomSheetRef.current.snapTo(statusBottomSheetSnapPoints.length - 1);
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
            setStatusIndex(index);
            setCurrentStatus(item);
            closeStatusSelection();
          }}
        />
      </View>
    );
  };

  const renderStatusHeader = _title => {
    return (
      <BottomSheetHeader
        title={translate('ticket_overview.select_status')}
        onPressClose={() =>
          statusBottomSheetRef.current.snapTo(
            statusBottomSheetSnapPoints.length - 1,
          )
        }
      />
    );
  };

  // const items = [
  //   {label: 'New', value: 'new', count: ticketCount.NEW ?? ticketCount.new},
  //   {label: 'Open', value: 'open', count: ticketCount.OPEN ?? ticketCount.open},
  //   {
  //     label: 'Escalated',
  //     value: 'escalated',
  //     count: ticketCount.ESCALATED ?? ticketCount.escalated,
  //   },
  //   {
  //     label: 'Resolved',
  //     value: 'resolved',
  //     count: ticketCount.RESOLVED ?? ticketCount.resolved,
  //   },
  //   {label: 'All', value: 'all', count: getAllTicketCount(ticketCount)},
  // ];

  // const screenName = props.route.name ?? '';
  // console.log(`Ticket Count: ${JSON.stringify(ticketCount.ticketCount)}`);

  // let getCount = object => {
  //   //let name = props.route.name.toLowerCase();
  //   let index = props.route.params.index;
  //   // console.log(`index: ${index}`);
  //   switch (index) {
  //     case 1:
  //       return object.NEW ?? object.new;
  //     case 2:
  //       return object.OPEN ?? object.open;
  //     case 3:
  //       return object.ESCALATED ?? object.escalated;
  //     // case 4:
  //     //   return object.OVERDUE ?? object.resolved;
  //     case 4:
  //       return object.RESOLVED ?? object.resolved;
  //   }
  // };

  return (
    <View style={styles.container}>
      <RenderSegmentTitle
        text={translate('dashboard.closed_loop')}
        child={<ViewTicketsButton statusIndex={statusIndex} />}
      />

      <RenderStatusFilterButton
        currentStatus={selectedCurrentStatus}
        onPress={handleStatusSelection}
      />
      {/* <RenderDropDown
        currentStatus={selectedCurrentStatus}
        setCurrentStatus={setCurrentStatus}
        statusList={statusList}
      /> */}
      {/* <RenderCountContainer
        count={selectedCurrentStatus.count}
        setShowPercentageCount={setShowPercentageCount}
        showPercentageCount={showPercentageCount}
      /> */}
      <RenderDonutChart
        count={selectedCurrentStatus.count}
        showPercentageCount={showPercentageCount}
      />
      {/* {renderDonutChart()} */}
      {/* <RenderViewTicketsContainer /> */}

      <BottomSheet
        ref={statusBottomSheetRef}
        snapPoints={statusBottomSheetSnapPoints}
        initialSnap={statusBottomSheetSnapPoints.length - 1}
        enabledGestureInteraction={true}
        renderContent={renderStatusSelectContent}
        renderHeader={renderStatusHeader}
        callbackNode={fall}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: MarginConstants.tab2,
    width: '100%',
    backgroundColor: Colors.white,
    height: DeviceInfo.isTablet()
      ? MarginConstants.tab4 * 11
      : MarginConstants.tab4 * 10,
    justifyContent: 'flex-start',
    borderRadius: 5,
  },
  chartContainer: {
    flex: 7,
    backgroundColor: Colors.white,
    height: DeviceInfo.isTablet()
      ? MarginConstants.tab4 * 6
      : MarginConstants.tab4 * 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: MarginConstants.tab2,
  },
  donut: {
    marginTop: 0,
    backgroundColor: Colors.white,
  },
  donutInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: MarginConstants.tab1,
    paddingVertical: PaddingConstants.tab1,
  },
  viewTicketsContainer: {
    flexDirection: 'row',
    width: '80%',
    marginHorizontal: MarginConstants.tab3,
    marginTop: MarginConstants.tab3,
    // backgroundColor: Colors.accentLight,
  },
  viewCountContainer: {
    flexDirection: 'row',
    width: '80%',
    marginHorizontal: MarginConstants.tab3,
    marginTop: MarginConstants.tab3,
    // backgroundColor: Colors.accentLight,
    paddingVertical: MarginConstants.halfTab,
    justifyContent: 'space-between',
  },
  viewTicketsText: {
    color: Colors.accentLight,
    padding: 2,
    fontFamily: FontFamily.regular,
  },
  npsView: {
    position: 'absolute',
    left: '20%',

    justifyContent: 'center',
    alignItems: 'center',
    top: DeviceInfo.isTablet() ? '50%' : '55%',
    width: 3 * MarginConstants.tab4,
    paddingHorizontal: PaddingConstants.halfTab,
  },
  npsPercentText: {
    color: Colors.primary,
    fontSize: 1.3 * TextSizes.donutPercentText,
    fontFamily: FontFamily.bold,
    textAlign: 'center',
  },
  npsText: {
    color: Colors.primary,
    fontSize: TextSizes.primary,
    fontFamily: FontFamily.medium,
    textAlign: 'center',
  },
  ticketText: {
    color: Colors.filterIconColor,
    fontSize: TextSizes.secondary,
    fontFamily: FontFamily.secondary,
    fontWeight: FontWeight._400,
    textAlign: 'center',
    marginBottom: 2,
    maxWidth: MarginConstants.tab3 * 2,
    minWidth: MarginConstants.tab4,
    marginHorizontal: MarginConstants.halfTab,
  },
  ticketStatusView: {
    width: 2 * MarginConstants.tab3,
    paddingVertical: 2,
    alignItems: 'flex-start',
  },
  ticketStatusIndicatorView: {
    width: MarginConstants.tab2,
    height: MarginConstants.tab2,

    borderRadius: 5,
    alignItems: 'center',
  },
  ticketStatusText: {
    fontFamily: FontFamily.semiBold,
    fontSize: TextSizes.secondary,
    fontWeight: FontWeight._600,
    color: Colors.filterIconColor,
  },
  ticketTotalText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.primary,
    fontWeight: FontWeight._800,
    color: Colors.filterIconColor,
  },
  countText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    fontWeight: FontWeight.bold,
    color: Colors.filterIconColor,
  },
  switch: {
    marginHorizontal: MarginConstants.tab1,
    maxHeight: MarginConstants.tab4,
  },
  modelDropdown: {
    marginTop: MarginConstants.tab2,
    flex: 1,
    width: '80%',
    minHeight: MarginConstants.tab3,
    justifyContent: 'space-around',
    marginHorizontal: MarginConstants.tab1,
    paddingHorizontal: PaddingConstants.halfTab,
    borderColor: Colors.evenDarkerGrey,
    borderWidth: 1,
    borderRadius: 4,
  },
  dropdownText: {
    flex: 1,
    color: Colors.primary,
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

    borderColor: Colors.darkerGrey,
  },
  dropdownRow: {
    flexDirection: 'row',
    minHeight: MarginConstants.tab4,
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.halfTab,
    backgroundColor: Colors.accent,
  },
  contentContainer: {backgroundColor: Colors.white, height: '100%'},
});
