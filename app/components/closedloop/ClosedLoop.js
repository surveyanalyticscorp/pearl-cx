import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import ClosedLoopCell from './ClosedloopCell';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../styles/color.constants';
import {translate} from '../../Utils/MultilinguaUtils';

import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {SearchIcon} from '../../routes/CommonScreen';
import style from '../../widgets/qp-calendar/calendar/header/style';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import TicketOverview from './TicketOverview';
import TicketDetails from './TicketDetails';
import TicketComments from './TicketComments';
import TicketActivity from './TicketActivity';
import CreateTicket from '../dashboard/ticketManagement/CreateTicket';
import SendEmail from '../dashboard/components/SendEmail';

// const ClosedLoopTab = createMaterialTopTabNavigator();

export default function ClosedLoop(props) {
  const sampleData = {
    dateRageText: 'Nov 14, 2017 -Mar 14, 2018',
  };
  const getSearchIcon = () => {
    return <IonIcons name="search" size={20} color={Colors.lightBlack} />;
  };

  const getFilterIcon = () => {
    return <IonIcons name="funnel" size={20} color={Colors.lightBlack} />;
  };

  const HeaderFilter = () => {
    return (
      <View style={styles.filterAndSearchBox}>
        {getFilterIcon()}
        {getFilterDateBox()}
        <View
          style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
          {getSearchIcon()}
        </View>
      </View>
    );
  };
  const getDateText = () => {
    return (
      <Text style={{margin: MarginConstants.halfTab, color: Colors.lightBlack}}>
        {sampleData.dateRageText}
      </Text>
    );
  };

  const getDateIcon = () => {
    return (
      <IonIcons
        style={{margin: MarginConstants.halfTab}}
        name="calendar"
        size={20}
        color={Colors.lightBlack}
      />
    );
  };
  const getFilterDateBox = () => {
    return (
      <View style={styles.filterBox}>
        {getDateText()}
        {getDateIcon()}
      </View>
    );
  };

  const onPressHandler = () => {
    props.navigation.navigate('closedLoopTicketDetails');
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {<HeaderFilter />}

      <ClosedLoopCell onPressHandler={onPressHandler} />

      {/* <TicketDetails /> */}
      {/* <TicketOverview /> */}
      {/* <TicketComments /> */}
      {/* <TicketActivity /> */}
      {/* <CreateTicket /> */}
      {/* <SendEmail /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},

  filterAndSearchBox: {
    flexDirection: 'row',

    alignItems: 'center',
    padding: PaddingConstants.halfTab,
    marginHorizontal: MarginConstants.tab1,
    backgroundColor: Colors.white,
  },

  filterBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    padding: PaddingConstants.tab1,
    margin: MarginConstants.tab1,
  },
});
