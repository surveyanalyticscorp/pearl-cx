import React from // {useEffect, useState}
'react';
import {
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  // Image,
  StyleSheet,
  // ScrollView,
  // Platform,
  // FlatList,
  // SafeAreaView,
  // TextInput,
  // LogBox,
} from 'react-native';
// import StringUtils from '../../Utils/StringUtils';
// import ArrayUtils from '../../Utils/ArrayUtils';
// import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {
  Colors,
  // statusColors
} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily} from '../../styles/font.constants';
// import {Sizes} from '../../styles/Size.constant';
// import moment from 'moment';
// import {translate} from '../../Utils/MultilinguaUtils';
// import QPButton from '../../widgets/Button';
// import ModalDropdown from '../../widgets/drop-down/ModalDropdown';
// import {backgroundColor} from '../../widgets/qp-calendar/style';
import {CloseButton} from '../../routes/CommonScreen';
import IonIcons from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
export default function TakeActionScreen(props) {
  const headerTitle = 'Take Action';

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

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <Text style={[styles.headerText, {flex: 1}]}>{'Take Action'}</Text>
        <CloseButton color={Colors.filterIconColor} />
      </View>

      <TouchableOpacity
        onPress={() => {}}
        style={[styles.rowContainer, styles.rowItem]}>
        {getMaterialIcon('chat-bubble')}
        <Text style={styles.buttonText}>{'Forward by Email'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    margin: MarginConstants.tab1,
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
  buttonText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.secondary,
    padding: PaddingConstants.tab1,
    color: Colors.filterIconColor,
  },
  rowItem: {
    margin: MarginConstants.tab2,
    alignItems: 'center',
    padding: PaddingConstants.halfTab,
  },
});
