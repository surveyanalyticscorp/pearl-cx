import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FeedbackDetails from '../components/feedback/FeedbackDetails';
import {
  DrawerActions,
  useNavigation,
  useNavigationState,
} from '@react-navigation/native';
import UpdateTicket from '../components/dashboard/ticketManagement/UpdateTicket';
import React from 'react';
import {Colors} from '../styles/color.constants';
import {TextSizes} from '../styles/textsize.constants';
import {PaddingConstants} from '../styles/padding.constants';
import DashboardDateFilter from '../components/dashboard/components/DashboardDateFilter';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import TicketOverview from '../components/dashboard/ticketManagement/TicketOverview';
import TicketComments from '../components/dashboard/ticketManagement/TicketComments';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {Sizes} from '../styles/Size.constant';
import {MarginConstants} from '../styles/margin.constants';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {FontFamily} from '../styles/font.constants';
import DetractorScenes from '../components/dashboard/components/DetractorScenes';
import {translate} from '../Utils/MultilinguaUtils';

const DateRangeTab = createMaterialTopTabNavigator();
const TicketLogTab = createMaterialTopTabNavigator();
const CloseLoopTicketsTab = createMaterialTopTabNavigator();

let {width} = Dimensions.get('window');

export const MenuIcon = () => {
  let navigation = useNavigation();
  return (
    <View style={styles.rightHeaderButton}>
      <TouchableOpacity
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
        onPress={() => {
          navigation.dispatch(DrawerActions.toggleDrawer());
        }}>
        <Icon name="menu" size={Sizes.icons} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export const HeaderBackLeft = (props) => {
  const navigation = useNavigation();
  return (
    <View style={styles.leftHeaderButton}>
      <TouchableOpacity
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
        onPress={() => {
          if (
            props &&
            props.route &&
            props.route.params &&
            props.route.params.onBackPress
          ) {
            props.route.params.onBackPress();
            navigation.goBack();
          } else {
            navigation.goBack();
          }
        }}>
        <Icon name="arrow-left" size={Sizes.icons} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
};

export const CloseButton = () => {
  let navigation = useNavigation();
  return (
    <View
      style={[
        styles.rightHeaderButton,
        {marginHorizontal: MarginConstants.tab2},
      ]}>
      <TouchableOpacity
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        onPress={() => {
          navigation.goBack();
        }}>
        <MaterialIcon
          name={'close'}
          size={1.1 * Sizes.filterIcon}
          color={Colors.white}
        />
      </TouchableOpacity>
    </View>
  );
};

export const SearchIcon = (props) => {
  let navigation = useNavigation();
  return (
    <View
      style={[
        styles.rightHeaderButton,
        {marginHorizontal: MarginConstants.tab2},
      ]}>
      <TouchableOpacity
        onPress={() => {
          props.route === 'Dashboard'
            ? navigation.navigate('Search Ticket')
            : navigation.navigate('Search Response');
        }}>
        <Icon name={'magnifier'} size={Sizes.icons} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
};

export const SaveDashboardDate = (props) => {
  return (
    <View
      style={[
        styles.rightHeaderButton,
        {marginHorizontal: 1.5 * MarginConstants.tab1},
      ]}>
      <TouchableOpacity
        onPress={() => {
          props.route.params.saveRange();
        }}>
        <Text style={styles.saveText}> {translate('date_filter.save')} </Text>
      </TouchableOpacity>
    </View>
  );
};

const EditTicket = () => {
  let navigation = useNavigation();
  const state = useNavigationState((state) => state);
  return (
    <View
      style={[
        styles.rightHeaderButton,
        {marginHorizontal: 1.5 * MarginConstants.tab1},
      ]}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(translate('close_loop.update_ticket'), {
            parentRoute: state.routeNames[0],
          });
        }}>
        <MaterialIcon
          name={'edit'}
          size={Sizes.filterIcon}
          color={Colors.white}
        />
      </TouchableOpacity>
    </View>
  );
};

export const CloseLoopTicketsTabs = (props) => (
  <CloseLoopTicketsTab.Navigator
    tabBarOptions={{
      labelStyle: {width: width / 3, fontSize: TextSizes.secondary},
      indicatorStyle: {backgroundColor: Colors.accent},
      style: {backgroundColor: Colors.white, width: '100%'},
      initialLayout: {width: Dimensions.get('window').width},
      tabStyle: {height: 1.5 * PaddingConstants.tab4},
      activeTintColor: Colors.accent,
      inactiveTintColor: Colors.primary,
    }}
    lazy
    keyboardDismissMode={'auto'}>
    <CloseLoopTicketsTab.Screen
      name={translate('dashboard.new')}
      component={DetractorScenes}
      initialParams={{dataCount: 0}}
    />
    <CloseLoopTicketsTab.Screen
      name={translate('dashboard.open')}
      component={DetractorScenes}
      initialParams={{dataCount: 1}}
    />
    <CloseLoopTicketsTab.Screen
      name={translate('dashboard.escalated')}
      component={DetractorScenes}
      initialParams={{dataCount: 3}}
    />
    <CloseLoopTicketsTab.Screen
      name={translate('dashboard.resolved')}
      component={DetractorScenes}
      initialParams={{dataCount: 2}}
    />
  </CloseLoopTicketsTab.Navigator>
);

export const DateRangeTabStack = (props) => (
  <DateRangeTab.Navigator
    tabBarOptions={{
      labelStyle: {
        color: Colors.primary,
        width: width / 2,
        fontSize: TextSizes.secondary,
      },
      indicatorStyle: {backgroundColor: Colors.accent},
      style: {backgroundColor: Colors.white, width: '100%'},
      initialLayout: {width: Dimensions.get('window').width},
      tabStyle: {height: 1.3 * PaddingConstants.tab4},
    }}
    lazy
    keyboardDismissMode={'auto'}>
    <DateRangeTab.Screen
      name={translate('date_filter.month')}
      component={DashboardDateFilter}
      initialParams={{
        range: props.route.params.range,
        setRange: props.route.params.setRange,
      }}
    />
    <DateRangeTab.Screen
      name={translate('date_filter.custom')}
      component={DashboardDateFilter}
      initialParams={{
        range: props.route.params.range,
        setRange: props.route.params.setRange,
      }}
    />
  </DateRangeTab.Navigator>
);

export const TicketLogTabStack = (props) => (
  <TicketLogTab.Navigator
    tabBarOptions={{
      labelStyle: {width: width / 3, fontSize: TextSizes.semiSecondary},
      indicatorStyle: {backgroundColor: Colors.accent},
      style: {backgroundColor: Colors.white, width: '100%'},
      initialLayout: {width: Dimensions.get('window').width},
      tabStyle: {height: 1.5 * PaddingConstants.tab4},
      activeTintColor: Colors.accent,
      inactiveTintColor: Colors.primary,
    }}
    lazy
    keyboardDismissMode={'auto'}>
    <TicketLogTab.Screen
      name={translate('close_loop.overview')}
      component={TicketOverview}
      initialParams={{
        ticketID: props.route.params.ticketID,
        parentRoute: props.route.params.parentRoute,
      }}
    />
    <TicketLogTab.Screen
      name={translate('close_loop.comments')}
      component={TicketComments}
      initialParams={{
        ticketID: props.route.params.ticketID,
        parentRoute: props.route.params.parentRoute,
      }}
    />
    <TicketLogTab.Screen
      name={translate('close_loop.logs')}
      component={TicketComments}
      initialParams={{
        ticketID: props.route.params.ticketID,
        parentRoute: props.route.params.parentRoute,
      }}
    />
  </TicketLogTab.Navigator>
);

const CommonScreens = (RootStack) => {
  return [
    <RootStack.Screen
      key={'Date Range'}
      name={translate('date_filter.date_range')}
      component={DateRangeTabStack}
      options={({navigation, route}) => ({
        headerLeft: (props) => <HeaderBackLeft />,
        headerRight: (props) => <SaveDashboardDate {...props} route={route} />,
      })}
    />,
    <RootStack.Screen
      key={'Ticket Details'}
      name={translate('close_loop.ticket_details')}
      component={TicketLogTabStack}
      options={({navigation, route}) => ({
        headerLeft: (props) => <HeaderBackLeft {...props} route={route} />,
        headerRight: (props) =>
          route.state && route.state.index !== 0 ? <View /> : <EditTicket />,
      })}
    />,
    <RootStack.Screen
      name={translate('responses.feedback_details')}
      key={'Feedback Details'}
      component={FeedbackDetails}
      options={({navigation, route}) => ({
        headerLeft: (props) => <HeaderBackLeft {...props} route={route} />,
      })}
    />,
    <RootStack.Screen
      key={'Update Ticket'}
      name={translate('close_loop.update_ticket')}
      component={UpdateTicket}
      options={({navigation, route}) => ({
        headerLeft: (props) => <HeaderBackLeft {...props} route={route} />,
      })}
    />,
  ];
};

export default CommonScreens;

const styles = StyleSheet.create({
  leftHeaderButton: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  rightHeaderButton: {
    flexDirection: 'row',
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: {
    color: Colors.white,
    textAlignVertical: 'center',
    fontSize: TextSizes.primary,
    fontFamily: FontFamily.regular,
    paddingTop: 5,
    paddingLeft: 5,
  },
});
