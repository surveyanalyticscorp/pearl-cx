import React, {useState} from 'react';
import SafeAreaView from 'react-native-safe-area-view';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Colors,
  getPriorityFillerColor,
  getPriorityBorderColor,
  priorityColors,
  getStatusBorderColor,
} from '../../../styles/color.constants';
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

export default function CreateTicket(props) {
  const [headerTitle, setHeaderTitle] = useState('Create New Ticket');
  const [ticket, setTicket] = useState({});

  const [priority, setPriority] = useState('Unassigned');
  const [priorityIndex, setPriorityIndex] = useState(4);

  const [bottomSheet, setBottomSheet] = useState('priority');

  const [status, setStatus] = useState('New');
  const [statusIndex, setStatusIndex] = useState(0);

  // variables for bottom sheet
  const priorityBottomSheet = React.useRef(null);
  const statusBottomSheet = React.useRef(null);
  const segmentBottomSheet = React.useRef(null);

  const fall = new Animated.Value(1);
  const priorityBottomSheetSnapPoints = ['45%', '0%'];
  const statusBottomSheetSnapPoints = ['45%', '0%'];
  const segmentBottomSheetSnapPoints = ['33%', '0%'];

  const [shadow, setShadow] = useState(false);

  const getIonIcon = (iconName, iconColor) => (
    <IonIcons
      name={iconName}
      size={14}
      color={iconColor ?? Colors.lightBlack}
    />
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
    // closeAllBottomSheet();
    priorityBottomSheet.current.snapTo(0);
  };

  const handleSegmentSelection = () => {
    // open segment selection bottom sheet
  };

  const handleCreateTicket = () => {
    props.navigation.goBack();
  };

  const renderPrioritySelectContent = () => {
    const data = [
      {id: 1, title: 'Critical', icon: 'flag'},
      {id: 2, title: 'High', icon: 'flag'},
      {id: 3, title: 'Normal', icon: 'flag'},
      {id: 4, title: 'Low', icon: 'flag'},
      {id: 5, title: 'Unassigned', icon: 'flag'},
    ];

    return (
      <View style={styles.contentContainer}>
        <SelectPriority
          data={data}
          selectedIndex={priorityIndex}
          handleOnPress={(item, index) => {
            console.log(JSON.stringify(item));
            setPriority(item.title);
            setPriorityIndex(index);
          }}
        />
      </View>
    );
  };

  const renderStatusSelectContent = () => {
    const data = [
      {id: 1, title: 'New'},
      {id: 2, title: 'Open'},
      {id: 3, title: 'Escalated'},
      {id: 4, title: 'Overdue'},
      {id: 5, title: 'Resolved'},
      {id: 5, title: 'Closed'},
    ];

    return (
      <View style={styles.contentContainer}>
        <SelectStatus
          data={data}
          selectedIndex={statusIndex}
          handleOnPress={(item, index) => {
            console.log(JSON.stringify(item));
            setStatus(item.title);
            setStatusIndex(index);
          }}
        />
      </View>
    );
  };

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
        onCloseEnd={() => setShadow(false)}
        onOpenStart={() => setShadow(true)}
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
        onCloseEnd={() => setShadow(false)}
        onOpenStart={() => setShadow(true)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.rootContainer}>
      <View style={styles.container}>
        <ScrollView style={styles.container}>
          <View
            style={[styles.rowContainer, {justifyContent: 'space-between'}]}>
            <Text style={styles.headerText}>{headerTitle}</Text>
            <CloseButton color={Colors.filterIconColor} />
          </View>
          <View style={[styles.rowContainer, styles.rowItem]}>
            {getIonIcon('star')}
            <TextInput placeholder="Segment" style={styles.titleText} />
          </View>
          <View style={[styles.rowContainer, styles.rowItem]}>
            {getMaterialIcon('date-range')}
            <TextInput placeholder="Date" style={styles.titleText} />
          </View>
          <View style={[styles.rowContainer, styles.rowItem]}>
            {getIonIcon('person')}
            <TextInput placeholder="Customer Name" style={styles.titleText} />
          </View>
          <View style={[styles.rowContainer, styles.rowItem]}>
            {getIonIcon('call')}
            <TextInput placeholder="Phone" style={styles.titleText} />
          </View>

          <View style={[styles.rowContainer, styles.rowItem]}>
            {getIonIcon('mail')}
            <TextInput placeholder="Email" style={styles.titleText} />
          </View>

          <TouchableOpacity onPress={handlePrioritySelection}>
            <View style={[styles.rowContainer, styles.rowItem]}>
              {getIonIcon('flag', getPriorityBorderColor(priority))}
              <Text style={styles.titleText}>{`${
                priority ?? 'Unassigned'
              } Priority`}</Text>
              {/* <TextInput placeholder="Priority" style={styles.titleText} /> */}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleStatusSelection}>
            <View style={[styles.rowContainer, styles.rowItem]}>
              {/* {getIonIcon('search')} */}
              {/* <TextInput placeholder="Status" style={styles.titleText} /> */}
              <RenderStatusIcon title={status ?? 'New'} size={14} />
              <Text style={styles.titleText}>{`${
                status ?? 'New'
              } Status`}</Text>
            </View>
          </TouchableOpacity>
          <View style={[styles.rowContainer, styles.rowItem]}>
            {getIonIcon('eye')}
            {/* {getIonIcon('eye-off')} */}
            <TextInput placeholder="Watching" style={styles.titleText} />
          </View>
          <View style={[styles.rowContainer, styles.rowItem]}>
            {getMateriaCommunityIcon('shield-account')}
            <TextInput placeholder="Ticket Owner" style={styles.titleText} />
          </View>
          <View style={[styles.rowContainer, styles.rowItem]}>
            {getMaterialIcon('chat-bubble')}
            <TextInput placeholder="Add Comments" style={styles.titleText} />
          </View>
          <View style={[styles.rowContainer, styles.rowButton]}>
            <QPButton
              onPress={handleCreateTicket}
              buttonColor={Colors.accentLight}
              buttonText={'Create Ticket'}
              textStyle={{
                fontFamily: FontFamily.light,
                fontSize: TextSizes.primary,
                color: Colors.white,
              }}
              style={styles.buttonStyle}
            />
          </View>
        </ScrollView>
      </View>
      <RenderPriorityBottomSheet />
      <RenderStatusBottomSheet />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
    marginHorizontal: MarginConstants.tab1,
    marginTop: MarginConstants.tab1,
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
});
