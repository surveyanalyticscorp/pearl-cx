import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
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
import {
  BottomSheetHeader,
  FabAddButton,
  SearchIcon,
} from '../../routes/CommonScreen';
import style from '../../widgets/qp-calendar/calendar/header/style';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import TicketOverview from './TicketOverview';
import TicketDetails from './TicketDetails';
import TicketComments from './TicketComments';
import TicketActivity from './TicketActivity';
import CreateTicket from '../dashboard/ticketManagement/CreateTicket';
import SendEmail from './takeaction/SendEmail';
import TakeActionScreen from './TakeActionScreen';
import TicketTakeAction from './takeaction/TicketTakeAction';
import FilterTicket from './takeaction/FilterTickets';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';

// const ClosedLoopTab = createMaterialTopTabNavigator();

export default function ClosedLoop(props) {
  const sampleFilterData = {
    priority: [
      {title: 'Critical', isChecked: false},
      {title: 'High', isChecked: false},
      {title: 'Normal', isChecked: false},
      {title: 'Low', isChecked: false},
      {title: 'Unassigned', isChecked: false},
    ],
    status: [
      {title: 'New', isChecked: false},
      {title: 'Open', isChecked: false},
      {title: 'Escalated', isChecked: false},
      {title: 'Overdue', isChecked: false},
      {title: 'Resolved', isChecked: false},
      {title: 'Closed', isChecked: false},
    ],
    managers: [
      {
        value: 'Dummy 1',
        url: 'https://picsum.photos/id/237/200',
        isAssigned: false,
      },
      {
        value: 'Dummy 2',
        url: 'https://picsum.photos/id/327/200',
        isAssigned: false,
      },
      {
        value: 'Dummy 3',
        url: 'https://picsum.photos/id/247/200',
        isAssigned: false,
      },
    ],
  };

  const [filterData, setFilterData] = useState(sampleFilterData);
  const sampleData = {
    dateRageText: 'Nov 14, 2017 -Mar 14, 2018',
  };
  const getSearchIcon = () => {
    return <IonIcons name="search" size={20} color={Colors.lightBlack} />;
  };

  const getFilterIcon = () => {
    return (
      <TouchableOpacity onPress={() => openFilter()}>
        <IonIcons name="funnel" size={20} color={Colors.lightBlack} />
      </TouchableOpacity>
    );
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
    props.navigation.navigate('TicketDetails');
  };

  const onFabHandler = () => {
    props.navigation.navigate('New Ticket');
  };

  const renderFilterContent = () => {
    return (
      <View style={styles.contentContainer}>
        <FilterTicket
          data={filterData}
          onPressHandler={(item, action) => handleAction(item, action)}
        />
      </View>
    );
  };

  const handleAction = (item, action) => {
    switch (action) {
      case 'apply':
        applyFilter(item);
        break;
      default:
        closeFilter();
    }
  };
  const closeFilter = () => {
    bs.current.snapTo(bsSnapPoints.length - 1);
  };
  const openFilter = () => {
    bs.current.snapTo(0);
  };

  const applyFilter = (item) => {
    setFilterData(item);
    console.log('Apply filter');
    closeFilter();
  };

  const renderFilterHeader = () => {
    return (
      <BottomSheetHeader
        title={'Ticket Filter'}
        onPressClose={() => closeFilter()}
      />
    );
  };

  // variables for bottom sheet
  const bs = React.useRef(null);
  const fall = new Animated.Value(1);
  const bsSnapPoints = ['75%', '95%', '0%'];
  const [shadow, setShadow] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={{
          opacity: Animated.add(0.3, Animated.multiply(fall, 1.0)),
          color: shadow ? Colors.accent : Colors.borderColor,
          flex: 1,
        }}>
        <HeaderFilter />
        <ClosedLoopCell onPressHandler={onPressHandler} />
        <FabAddButton onPress={onFabHandler} />

        {/* <TicketTakeAction /> */}
        {/* <TicketDetails /> */}
        {/* <TicketOverview /> */}
        {/* <TicketComments /> */}
        {/* <TicketActivity /> */}
        {/* <CreateTicket /> */}
        {/* <SendEmail /> */}
        {/* <TakeActionScreen /> */}
        {/* <FilterTicket /> */}
      </Animated.View>
      <BottomSheet
        ref={bs}
        snapPoints={bsSnapPoints}
        initialSnap={bsSnapPoints.length - 1}
        enabledGestureInteraction={true}
        renderContent={renderFilterContent}
        renderHeader={renderFilterHeader}
        callbackNode={fall}
        onCloseEnd={() => setShadow(false)}
        onOpenStart={() => setShadow(true)}
      />
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
  contentContainer: {backgroundColor: Colors.white, height: '100%'},
});
