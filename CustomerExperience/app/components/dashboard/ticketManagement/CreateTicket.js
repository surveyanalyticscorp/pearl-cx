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
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
// import ModalDropdown from '../../../widgets/drop-down/ModalDropdown';
// import {connect} from 'react-redux';
// import {
//   clearDetractorTicketDetails,
//   getClosedLoopOwnerDetails,
//   getClosedLoopSegmentDetails,
//   updateTicket,
// } from '../../../redux/actions/dashboard.actions';
// import ArrayUtils from '../../../Utils/ArrayUtils';
// import StringUtils from '../../../Utils/StringUtils';
// import {updateClosedLoopTicket} from '../../../redux/sagas/ClosedLoopSaga';
// import QPSpinner from '../../../widgets/QPSpinner';
// import {showErrorFlashMessage} from '../../../Utils/Utility';
// import {wantToReloadDashboard} from '../../../redux/actions';
// import {translate} from '../../../Utils/MultilinguaUtils';
import IonIcons from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {CloseButton} from '../../../routes/CommonScreen';

import QPButton from '../../../widgets/Button';

export default function CreateTicket(props) {
  const [headerTitle, setHeaderTitle] = useState('Create Ticket');
  const [ticket, setTicket] = useState({});

  const getIonIcon = (iconName) => (
    <IonIcons name={iconName} size={18} color={Colors.lightBlack} />
  );

  const getMaterialIcon = (iconName) => (
    <MaterialIcon name={iconName} size={18} color={Colors.lightBlack} />
  );

  const getMateriaCommunityIcon = (iconName) => (
    <MaterialCommunityIcon
      name={iconName}
      size={18}
      color={Colors.lightBlack}
    />
  );

  const handlePrioritySelection = () => {
    // open priority selection bottom sheet
  };

  return (
    // <BottomSheet>
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={[styles.rowContainer, {justifyContent: 'space-between'}]}>
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
            <IonIcons name="flag" size={20} color={Colors.lightBlack} />
            <TextInput placeholder="Priority" style={styles.titleText} />
          </View>
        </TouchableOpacity>
        <View style={[styles.rowContainer, styles.rowItem]}>
          <IonIcons name="search" size={20} color={Colors.lightBlack} />
          <TextInput placeholder="Status" style={styles.titleText} />
        </View>
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
            buttonColor={Colors.accentLight}
            buttonText={'Create Ticket'}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
    // </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
    marginHorizontal: MarginConstants.tab1,
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
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.secondary,
    padding: PaddingConstants.tab1,
    color: Colors.filterIconColor,
  },
  rowItem: {
    margin: MarginConstants.tab2,
    alignItems: 'center',
    padding: PaddingConstants.halfTab,
    borderBottomColor: Colors.filterIconColor,
    borderBottomWidth: 1,
  },
  rowButton: {
    marginHorizontal: MarginConstants.tab2,
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.halfTab,
  },
});
