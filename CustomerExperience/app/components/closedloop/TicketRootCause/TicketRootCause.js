import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {FontFamily, FontWeight} from '../../../styles/font.constants';
import QPButton from '../../../widgets/Button';

const TicketRootCause = props => {
  return (
    <View testID="root-cause-view" style={styles.rootContainer}>
      <ScrollView style={styles.container}>
        <RenderRootCauseItem
          title={ROOT_CAUSES}
          data={rootCauses}
          onClickCheckBox={onClickCheckBox}
        />
        <RenderRootCauseItem
          title={ACTIONS}
          data={rootCauseActions}
          onClickCheckBox={onClickCheckBox}
        />
      </ScrollView>

      <View style={styles.buttonView}>
        <QPButton
          textStyle={{
            ...styles.buttonText,
            ...styles.centralizedButtonTextColor,
          }}
          style={{...styles.buttonStyle, ...styles.centralizedButtonColor}}
          buttonText="Centralized"
        />
        <QPButton
          textStyle={{
            ...styles.buttonText,
            ...styles.olodRootCauseButtonTextColor,
          }}
          style={{...styles.buttonStyle, ...styles.oldRootCauseButtonColor}}
          buttonText="Previous root cause"
        />
      </View>
    </View>
  );
};

export default TicketRootCause;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    flexDirection: 'column',

    backgroundColor: Colors.white,
    padding: PaddingConstants.tab1,
  },

  rowContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: PaddingConstants.tab1,
  },

  container: {
    margin: MarginConstants.tab1,
    flex: 1,
  },

  ticketStatusContainer: {
    backgroundColor: Colors.white,
    margin: MarginConstants.tab1,
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
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight._700,
    fontSize: TextSizes.primary,
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

  resetButton: {color: Colors.accentLight},
  updatetButton: {color: Colors.white},
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

  buttonView: {
    margin: MarginConstants.tab2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  buttonText: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight._400,
    fontSize: TextSizes.secondary,
  },

  centralizedButtonTextColor: {
    color: Colors.white,
  },
  olodRootCauseButtonTextColor: {
    color: Colors.filterIconColor,
  },

  buttonStyle: {
    alignItems: 'center',
    margin: MarginConstants.tab1,
    paddingVertical: PaddingConstants.tab1_2x,
    paddingHorizontal: PaddingConstants.tab1,
    borderRadius: 5,
    maxWidth: '50%',
  },

  centralizedButtonColor: {
    backgroundColor: Colors.accentLight,
  },
  oldRootCauseButtonColor: {
    backgroundColor: Colors.negativePromter,
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
