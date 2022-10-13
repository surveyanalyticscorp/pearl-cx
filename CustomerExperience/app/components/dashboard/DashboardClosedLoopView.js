import React, {useState} from 'react';
import {
  useWindowDimensions,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Switch,
} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {FontFamily} from '../../styles/font.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {PaddingConstants} from '../../styles/padding.constants';
import DeviceInfo from 'react-native-device-info';
import {VictoryPie} from 'victory-native';
import {StackActions} from '@react-navigation/native';
import {translate} from '../../Utils/MultilinguaUtils';

export const DashboardClosedLoopView = (props) => {
  return <TicketTabStack {...props} />;
};

const TicketTab = createMaterialTopTabNavigator();

const TicketTabStack = (props) => (
  <TicketTab.Navigator
    tabBarOptions={{
      labelStyle: {
        width: useWindowDimensions().width / 4,
        fontSize: TextSizes.secondary,
        fontFamily: FontFamily.regular,
      },
      indicatorStyle: {backgroundColor: Colors.accentLight},
      style: {backgroundColor: Colors.white, width: '100%'},
      // initialLayout: {width: useWindowDimensions().width},
      tabStyle: {height: 1.5 * PaddingConstants.tab4},
      activeTintColor: Colors.accentLight,
      inactiveTintColor: Colors.primary,
    }}
    lazy
    keyboardDismissMode={'auto'}>
    <TicketTab.Screen
      name={translate('dashboard.new')}
      component={RenderScene}
      initialParams={{
        index: 1,
        ticketCount: props.ticketCount,
      }}
    />
    <TicketTab.Screen
      name={translate('dashboard.open')}
      component={RenderScene}
      initialParams={{index: 2, ticketCount: props.ticketCount}}
    />
    <TicketTab.Screen
      name={translate('dashboard.escalated')}
      component={RenderScene}
      initialParams={{index: 3, ticketCount: props.ticketCount}}
    />
    {/* <TicketTab.Screen name= {translate("dashboard.resolved")} component={renderScene} initialParams={{index : 4, ticketCount: props.ticketCount}}/> */}
    <TicketTab.Screen
      name={'OVERDUE'}
      component={RenderScene}
      initialParams={{index: 4, ticketCount: props.ticketCount}}
    />
  </TicketTab.Navigator>
);

const RenderScene = (props) => {
  const [showPercentageCount, setShowPercentageCount] = useState(false);

  console.log(
    `Ticket Count: ${JSON.stringify(props.route.params.ticketCount)}`,
  );

  let renderDonutChart = () => {
    let count = getCount(props.route.params.ticketCount);
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
        <View style={styles.donut}>
          <VictoryPie
            data={dataScale}
            width={5 * MarginConstants.tab4}
            height={6 * MarginConstants.tab4}
            innerRadius={2.3 * MarginConstants.tab4}
            radius={2.1 * MarginConstants.tab4}
            style={{
              labels: {
                fill: 'transparent',
              },
            }}
            colorScale={victoryPieColorScale}
          />
          <View style={styles.npsView}>
            {/* <Text style={[styles.npsPercentText]}>{count.totalTickets}</Text> */}
            <Text style={[styles.npsText]}>CX</Text>

            <Text style={[styles.npsText]}>
              {translate('dashboard.tickets')}
            </Text>
          </View>
        </View>
        {renderDonutInfoViewContainer()}
      </View>
    );
  };

  let getCount = (object) => {
    //let name = props.route.name.toLowerCase();
    let index = props.route.params.index;
    // console.log(`index: ${index}`);
    switch (index) {
      case 1:
        return object.new;
      case 2:
        return object.open;
      case 3:
        return object.escalated;
      case 4:
        return object.resolved;
    }
  };

  let getParcentage = (total, count) =>
    Number((total === 0 ? 0 : (100 * count) / total).toFixed(2));

  let RenderCountContainer = () => {
    const toggleSwitch = () =>
      setShowPercentageCount((previousState) => !previousState);
    const count = getCount(props.route.params.ticketCount);
    return (
      <View style={[styles.viewCountContainer]}>
        <View
          style={{
            flex: 2,
            height: MarginConstants.tab4,
            justifyContent: 'center',
          }}>
          <Text style={styles.countText}>{`${count.totalTickets} total`}</Text>
        </View>
        <View
          style={{
            flex: 2,
            height: MarginConstants.tab4,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          <Text style={styles.countText}>Percentage</Text>
          <Switch
            trackColor={{true: Colors.accent, false: Colors.darkGrey}}
            thumbColor={Colors.white}
            ios_backgroundColor={Colors.filterIconColor}
            onValueChange={toggleSwitch}
            value={showPercentageCount}
            style={styles.switch}
          />
          <Text style={styles.countText}>Count</Text>
        </View>
      </View>
    );
  };

  let RenderViewTicketsContainer = () => {
    return (
      <View style={styles.viewTicketsContainer}>
        <TouchableWithoutFeedback
          onPress={() => {
            // const pushAction = StackActions.push(
            //   translate('close_loop.close_loop'),
            //   {
            //     screen: props.route.name,
            //   },
            // );
            // props.navigation.dispatch(pushAction);
            props.navigation.navigate('ClosedLoop');
          }}>
          <Text style={styles.viewTicketsText}>
            {translate('dashboard.view_tickets')}
          </Text>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  let renderDonutInfoViewContainer = () => {
    let priorities = getCount(props.route.params.ticketCount);
    return (
      <View style={{paddingTop: 2 * PaddingConstants.tab4}}>
        {renderTicketView(
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
        )}
      </View>
    );
  };

  let renderTicketView = (totalTickets, count, bgColor, status, textColor) => {
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
        <View style={[styles.ticketStatusView]}>
          <Text style={[styles.ticketStatusText]}>{status}</Text>
        </View>
        <Text style={styles.ticketText}>{ticketCount}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderDonutChart()}
      <RenderCountContainer />
      <RenderViewTicketsContainer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    height: DeviceInfo.isTablet()
      ? MarginConstants.tab4 * 10
      : MarginConstants.tab4 * 9,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  chartContainer: {
    backgroundColor: Colors.white,
    height: DeviceInfo.isTablet()
      ? MarginConstants.tab4 * 6
      : MarginConstants.tab4 * 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  donut: {
    marginTop: MarginConstants.tab4,
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
    marginTop: MarginConstants.halfTab,
    // backgroundColor: Colors.accentLight,
  },
  viewCountContainer: {
    flexDirection: 'row',
    width: '80%',
    marginHorizontal: MarginConstants.tab3,
    marginTop: MarginConstants.tab3,
    // backgroundColor: Colors.accentLight,
    paddingVertical: MarginConstants.halfTab,
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
    color: Colors.primary,
    fontSize: TextSizes.secondary,
    fontFamily: FontFamily.semiBold,
    textAlign: 'center',
    marginBottom: 2,
  },
  ticketStatusView: {
    width: 2 * MarginConstants.tab4,
    paddingVertical: 2,
    alignItems: 'flex-start',
    marginHorizontal: MarginConstants.halfTab,
  },
  ticketStatusIndicatorView: {
    width: MarginConstants.tab2,
    height: MarginConstants.tab2,

    borderRadius: 5,
    alignItems: 'center',
  },
  ticketStatusText: {
    color: Colors.filterIconColor,
    fontSize: TextSizes.secondary,
    fontFamily: FontFamily.regular,
  },
  countText: {
    fontFamily: FontFamily.medium,
    color: Colors.filterIconColor,
  },
  switch: {
    marginHorizontal: MarginConstants.tab1,
    maxHeight: MarginConstants.tab4,
  },
});
