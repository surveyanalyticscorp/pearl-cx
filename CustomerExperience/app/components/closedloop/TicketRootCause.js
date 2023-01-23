import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  Image,
  StyleSheet,
  // ScrollView,
  Platform,
  FlatList,
  Pressable,
  ScrollView,
} from 'react-native';
// import StringUtils from '../../Utils/StringUtils';
// import ArrayUtils from '../../Utils/ArrayUtils';
// import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {
  Colors,
  statusColors,
  priorityColors,
} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily, FontWeight} from '../../styles/font.constants';
// import {Sizes} from '../../styles/Size.constant';
// import moment from 'moment';
// import {translate} from '../../Utils/MultilinguaUtils';
import IonIcons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import QPButton from '../../widgets/Button';
// import ModalDropdown from '../../widgets/drop-down/ModalDropdown';
import IconTextModalDropdown from '../../widgets/drop-down/IconTextModalDropdown';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import TicketTakeAction from './takeaction/TIcketTakeAction';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  BottomSheetHeader,
  RenderPriorityIcon,
  RenderRoundImageOrColor,
  RenderSpinner,
  RenderStatusIcon,
} from '../../routes/CommonScreen';
import {useDispatch, useSelector} from 'react-redux';
import {
  getOwnerIndex,
  getOwnerNameById,
  getPriorityById,
  getPriorityIndexById,
  getSegmentBySegmentId,
  getSegmentIndex,
  getSegmentNameById,
  getStatusById,
  getStatusIndexById,
  priorityList,
  statusList,
} from '../../Utils/TicketUtils';
import moment from 'moment';
import {FullMonthDateYearFormat} from '../../Utils/AppConstants';
import {
  getClosedLoopOwnerDetails,
  updateClfTicket,
} from '../../redux/actions/dashboard.actions';
import SelectStatus from './takeaction/SelectStatus';
import SelectPriority from './takeaction/SelectPriority';
import SelectSegment from './takeaction/SelectSegment';
import SelectTicketOwner from './takeaction/SelectTicketOwner';
// import {element} from 'prop-types';
import {
  getDefaultEmailTemplate,
  getEmailTemplates,
} from '../../redux/actions/closedloop.actions';
import {EMAIL, PHONE} from '../../api/Constant';
import {StackActions, useNavigation} from '@react-navigation/native';
import {translate} from '../../Utils/MultilinguaUtils';

export default function TicketRootCause(props) {
  const ROOT_CAUSES = 'Root Causes';
  const ACTIONS = 'Actions';

  const RenderRootCauseItem = ({title, data}) => {
    return (
      <View>
        <Text style={styles.titleText}>{title}</Text>
        <FlatList
          data={data}
          keyExtractor={(item, index) => item.toString()}
          numColumns={3}
          renderItem={({item, index}) => (
            <CheckBoxItem
              textStyle={styles.optionText}
              item={item}
              index={index}
              onPress={() => {
                console.log(item);
              }}
            />
          )}
        />
      </View>
    );
  };

  const RenderTicketOverView = () => (
    <View style={styles.container}>
      <ScrollView>
        <RenderRootCauseItem />
        <RenderRootCauseItem />
      </ScrollView>
    </View>
  );

  return <RenderTicketOverView />;

  // return <RenderTicketOverView />;
  // return isLoading ? <RenderSpinner /> : <TempUI />;
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.white,
  },

  container: {
    margin: MarginConstants.halfTab,
    flex: 1,
    // borderColor: Colors.evenDarkerGrey,
    // borderWidth: 1,
    // borderRadius: 4,
  },

  ticketStatusContainer: {
    backgroundColor: Colors.white,
    margin: MarginConstants.tab1,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    padding: PaddingConstants.tab1,
  },
  columnContainer: {
    alignItems: 'flex-start',
    padding: PaddingConstants.tab1,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: PaddingConstants.tab1,
  },

  headerText: {
    fontFamily: FontFamily.light,

    fontSize: TextSizes.largeText,
    color: Colors.filterIconColor,
  },

  titleText: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight._500,
    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
  },

  optionText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    marginHorizontal: MarginConstants.halfTab,
    color: Colors.filterIconColor,
  },

  departmentNameText: {
    backgroundColor: Colors.settingsBackground,
    padding: PaddingConstants.halfTab,
    color: Colors.filterIconColor,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
  },
  dateText: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight._400,
    fontSize: 16,
    color: Colors.primary,
  },

  detailsText: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight._400,
    fontSize: TextSizes.primary,
    color: Colors.filterIconColor,
  },

  underLineText: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight._400,
    fontSize: TextSizes.primary,
    color: Colors.accentLight,
    textDecorationLine: 'underline',
  },

  idText: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight._900,
    fontSize: 16,
    color: Colors.accentLight,
  },

  statusText: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight._900,
    fontSize: 16,
    color: Colors.lightBlack,
  },
  takeActionContainer: {
    padding: PaddingConstants.tab1,
    margin: MarginConstants.tab1,
  },
  takeActionButton: {
    height: MarginConstants.tab4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accentLight,
    marginBottom: MarginConstants.tab2,
  },

  takeActionText: {
    color: Colors.white,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.largeText,
  },
  rowText: {
    color: Colors.primary,
    fontSize: TextSizes.secondary,
  },
  modelDropdown: {
    minHeight: MarginConstants.tab3,

    marginHorizontal: MarginConstants.tab1,
    paddingHorizontal: PaddingConstants.halfTab,
    borderColor: Colors.evenDarkerGrey,
    borderWidth: 1,
    borderRadius: 4,
    width: '100%',
  },
  dropdownText: {
    flex: 1,
    color: Colors.secondary,
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
    alignSelf: 'center',
    borderColor: Colors.darkerGrey,
  },
  dropdownRow: {
    flexDirection: 'row',
    minHeight: MarginConstants.tab4,
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.halfTab,
    backgroundColor: Colors.accent,
  },

  panelHeaderContainer: {
    flex: 1,

    padding: MarginConstants.tab2,
    backgroundColor: Colors.white,
    borderTopStartRadius: 5,
    borderTopEndRadius: 5,
  },
  panelHandleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: MarginConstants.tab2,
  },
  panelHandle: {
    height: 4,
    width: 80,
    backgroundColor: Colors.filterIconColor,
  },
  header: {
    marginHorizontal: MarginConstants.tab2,
    fontFamily: FontFamily.bold,
    fontSize: TextSizes.largeText,
    marginVertical: MarginConstants.tab1,
    color: Colors.filterIconColor,
  },
  contentContainer: {backgroundColor: Colors.white, height: '100%'},
  dropdownContainer: {
    flex: 2,
    flexDirection: 'row',

    height: '100%',
    backgroundColor: Colors.white,
    borderColor: Colors.evenDarkerGrey,

    borderWidth: 1,
    borderRadius: 3,
  },

  dropdownInnerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    paddingHorizontal: PaddingConstants.halfTab,
  },

  // dropdownIconTextContainer: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'flex-start',
  //   height: '100%',
  // },

  dropdownContainerText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.regular,
    marginVertical: MarginConstants.tab1,
    color: Colors.filterIconColor,
  },
});
