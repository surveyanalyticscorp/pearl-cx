import React from 'react';
import {StyleSheet, View, Text, Platform} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {FontFamily, FontWeight} from '../../styles/font.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import DeviceInfo from 'react-native-device-info';
import {VictoryPie} from 'victory-native';
import {useNavigation} from '@react-navigation/native';
import {translate} from '../../Utils/MultilinguaUtils';
import {setStatusFilterById} from '../../redux/actions/closedloop.actions';
import {useDispatch, useSelector} from 'react-redux';
import QPButton from '../../widgets/Button';
import {buttonStyles} from '../../styles/button.styles';
import {getDashboardStatusListForBottomList} from '../../Utils/TicketUtils';
import {RenderStatusIcon} from '../../routes/commonUI/CommonUI';
import BottomSheetHeader from '../../routes/commonUI/BottomSheetHeader';
import IconButton from '../../routes/commonUI/IconButton';
import BottomSheet from 'reanimated-bottom-sheet';
import SelectStatus from '../closedloop/takeaction/SelectStatus';
import {setStatusIndex} from '../../redux/actions/dashboard.actions';
import DashboardWidgetTitle from '../../widgets/dashboardWidget/RenderSegmentTitle';

export const RenderDonutChart = ({count, showPercentageCount}) => {
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
    <View testID="render-donut-chart" style={styles.chartContainer}>
      <RenderDonutInfoViewContainer
        priorities={count}
        showPercentageCount={showPercentageCount}
      />
      <View testID="render-donut" style={styles.donut}>
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
      </View>
    </View>
  );
};

let RenderDonutInfoViewContainer = ({priorities, showPercentageCount}) => {
  return (
    <View testID="render-donut-info-view-container">
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
    </View>
  );
};

export const getParcentage = (total, count) =>
  Number((total === 0 ? 0 : (100 * count) / total).toFixed(2));

export const RenderTicketView = ({
  totalTickets,
  count,
  bgColor,
  status,
  showPercentageCount,
}) => {
  const ticketCount = showPercentageCount
    ? `${getParcentage(totalTickets, count)}%`
    : `${count}`;

  return (
    <View testID="render-ticket-view" style={styles.donutInfoContainer}>
      <View
        style={[styles.ticketStatusIndicatorView, {backgroundColor: bgColor}]}
      />
      <Text testID="render-ticket-text" style={styles.ticketText}>
        {ticketCount}
      </Text>
      <View
        testID="render-ticket-status-view"
        style={[styles.ticketStatusView]}>
        <Text
          testID="render-ticket-status-text"
          style={[styles.ticketStatusText]}>
          {status}
        </Text>
      </View>
    </View>
  );
};

export const RenderTicketTotalView = ({totalCount}) => {
  return (
    <View testID="render-ticket-total-view" style={styles.donutInfoContainer}>
      <Text testID="render-ticket-total-text" style={[styles.ticketTotalText]}>
        {`${totalCount} in total`}
      </Text>
    </View>
  );
};

export const ViewTicketsButton = ({statusIndex}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const navigateToCLosedLoop = () => {
    dispatch(
      setStatusFilterById(
        statusIndex === 0 ? '' : JSON.stringify(statusIndex - 1),
      ),
    );

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

export const RenderStatusFilterButton = ({currentStatus, onPress}) => {
  console.log('ABUL', JSON.stringify(currentStatus));
  return (
    <IconButton
      buttonStyle={styles.iconButton}
      onPress={onPress}
      leftIcon={
        <RenderStatusIcon
          testID="render-status-icon"
          title={currentStatus.title.toLowerCase()}
        />
      }
      buttonText={currentStatus.title}
      textStyle={{
        ...buttonStyles.outlinePrimaryButtonMediumText,
        marginHorizontal: MarginConstants.halfTab,
      }}
    />
  );
};

export const StatusDashboardBottomSheet = React.forwardRef(
  ({snapPoints, fall, ticketCount}, ref) => {
    const dispatch = useDispatch();

    const statusList = getDashboardStatusListForBottomList(ticketCount);
    const statusIndex = useSelector(
      state => state.dashboard.currentStatusIndexForFilter,
    );

    const closeStatusSelection = () => {
      // close status selection bottom sheet
      ref.current.snapTo(snapPoints.length - 1);
    };

    const renderStatusSelectContent = () => {
      return (
        <View style={styles.contentContainer}>
          <SelectStatus
            data={statusList}
            selectedIndex={statusIndex}
            handleOnPress={(item, index) => {
              dispatch(setStatusIndex(index));
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
          onPressClose={() => ref.current.snapTo(snapPoints.length - 1)}
        />
      );
    };
    return (
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        initialSnap={snapPoints.length - 1}
        enabledGestureInteraction={true}
        renderContent={renderStatusSelectContent}
        renderHeader={renderStatusHeader}
        callbackNode={fall}
      />
    );
  },
);

export const ClosedLoopDashboard = ({openStatusBS}) => {
  const statusIndex = useSelector(
    state => state.dashboard.currentStatusIndexForFilter,
  );
  const ticketCount = useSelector(
    state => state.dashboard.dashBoardTicketCount,
  );
  const statusList = getDashboardStatusListForBottomList(ticketCount ?? []);
  console.log(`Ticket Count: ${JSON.stringify(statusList)}`);
  console.log(`Ticket Count: ${JSON.stringify(statusIndex)}`);

  return (
    <View style={styles.container}>
      <DashboardWidgetTitle text={'Closedloop'}>
        <ViewTicketsButton statusIndex={statusIndex} />
      </DashboardWidgetTitle>
      <RenderStatusFilterButton
        currentStatus={statusList[statusIndex]}
        onPress={openStatusBS}
      />
      <RenderDonutChart
        count={statusList[statusIndex].count}
        showPercentageCount={false}
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
  contentContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    height: '100%',
  },
  iconButton: {
    ...buttonStyles.outlinePrimaryButtonMedium,
    marginHorizontal: MarginConstants.tab2,
    maxWidth: MarginConstants.tab4 * 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
