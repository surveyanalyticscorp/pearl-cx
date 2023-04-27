import Notification from '../components/Notification';
// import CreateTicket from '../components/dashboard/components/CreateTicket';
import CreateTicket from '../components/dashboard/ticketManagement/CreateTicket';
import {Dimensions, StyleSheet, Text, Pressable, View} from 'react-native';
import {
  // DrawerActions,
  useNavigation,
  // useNavigationState,
} from '@react-navigation/native';
import TicketFilter from '../components/dashboard/components/TicketFilter';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import CxDashboard from '../components/dashboard/CxDashboard';
import SearchTicket from '../components/dashboard/components/SearchTicket';
import {TextSizes} from '../styles/textsize.constants';
import {Colors} from '../styles/color.constants';
import {PaddingConstants} from '../styles/padding.constants';
import DetractorScenes from '../components/dashboard/components/DetractorScenes';
import {Sizes} from '../styles/Size.constant';
import {MarginConstants} from '../styles/margin.constants';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import {FontFamily} from '../styles/font.constants';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import CommonScreens, {
  CloseButton,
  HeaderBackLeft,
  MenuIcon,
  SearchIcon,
} from './CommonScreen';

const DetractorStack = createStackNavigator();
const DetractorTicketsTab = createMaterialTopTabNavigator();

let {width} = Dimensions.get('window');

let notificationCount = 2;

const DashboardStack = ({navigation, route}) => {
  const NotificationIcon = () => {
    let navigation = useNavigation();
    return (
      <View
        style={[
          styles.rightHeaderButton,
          {marginHorizontal: MarginConstants.tab2},
        ]}>
        <Pressable
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          onPress={() => {
            //alert('open notification screen')
            navigation.navigate('Notifications');
          }}>
          <FontIcon
            name={'bell'}
            size={1.1 * Sizes.icons}
            color={Colors.white}
          />
        </Pressable>
        {/** show unread/badge icon when notification read/unread status comes*/}
        {notificationCount > 0 ? renderNotificationBadge() : <View />}
      </View>
    );
  };

  let renderNotificationBadge = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: -7,
          right: -7,
          width: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: 'red',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: TextSizes.primary, color: 'white'}}>
          {' '}
          {notificationCount}{' '}
        </Text>
      </View>
    );
  };

  const ClearAllButton = props => {
    return (
      <View
        style={[
          styles.rightHeaderButton,
          {marginHorizontal: 1.5 * MarginConstants.tab1},
        ]}>
        <Pressable
          onPress={() => {
            props.route.params.clearAllNotifications();
          }}>
          <Text style={styles.saveText}> Clear All </Text>
        </Pressable>
      </View>
    );
  };

  const CloseLoopTicketsTab = props => (
    <DetractorTicketsTab.Navigator
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
      <DetractorTicketsTab.Screen
        name="New"
        component={DetractorScenes}
        initialParams={{dataCount: 0}}
      />
      <DetractorTicketsTab.Screen
        name="Open"
        component={DetractorScenes}
        initialParams={{dataCount: 1}}
      />
      <DetractorTicketsTab.Screen
        name="Escalated"
        component={DetractorScenes}
        initialParams={{dataCount: 3}}
      />
      <DetractorTicketsTab.Screen
        name="Resolved"
        component={DetractorScenes}
        initialParams={{dataCount: 2}}
      />
    </DetractorTicketsTab.Navigator>
  );

  const dashboardStack = props => (
    <DetractorStack.Navigator>
      <DetractorStack.Screen
        name="Dashboard"
        component={CxDashboard}
        options={({navigation, route}) => ({
          headerLeft: props => <MenuIcon />,
          headerRight: props => <NotificationIcon />,
        })}
      />
      <DetractorStack.Screen
        name="Closed Loop"
        component={CloseLoopTicketsTab}
        options={({navigation, route}) => ({
          headerLeft: props => <HeaderBackLeft {...props} route={route} />,
          headerRight: props => <SearchIcon route={'Dashboard'} />,
        })}
      />
      <DetractorStack.Screen
        name="Search Ticket"
        component={SearchTicket}
        options={({navigation, route}) => ({
          headerShown: false,
          headerLeft: props => <HeaderBackLeft {...props} route={route} />,
        })}
      />
      {CommonScreens(DetractorStack)}
    </DetractorStack.Navigator>
  );

  return (
    <DetractorStack.Navigator mode="modal">
      <DetractorStack.Screen
        name="Dashboard"
        component={dashboardStack}
        options={({navigation, route}) => ({headerShown: false})}
      />
      <DetractorStack.Screen
        key={'Notifications'}
        name="Notifications"
        component={Notification}
        options={({navigation, route}) => ({
          headerLeft: props => <HeaderBackLeft />,
          headerRight: props => <ClearAllButton {...props} route={route} />,
        })}
      />
      <DetractorStack.Screen
        name="New Ticket"
        component={CreateTicket}
        options={({navigation, route}) => ({
          headerLeft: props => <View />,
          headerRight: props => <CloseButton />,
        })}
      />
      <DetractorStack.Screen
        name="Filter By"
        component={TicketFilter}
        options={({navigation, route}) => ({
          headerLeft: props => <View />,
          headerRight: props => <CloseButton />,
        })}
      />
    </DetractorStack.Navigator>
  );
};

export default DashboardStack;

const styles = StyleSheet.create({
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
