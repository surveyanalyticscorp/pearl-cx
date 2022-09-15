import React from 'react';
import {
  // ScrollView,
  StyleSheet,
  View,
  // SafeAreaView,
  Text,
  // TextInput,
  // TouchableWithoutFeedback,
  Platform,
} from 'react-native';

import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {Colors} from '../../styles/color.constants';
import {TextSizes} from '../../styles/textsize.constants';
// import {FontFamily} from '../../styles/font.constants';
// import {translate} from '../../Utils/MultilinguaUtils';
// import StringUtils from '../../Utils/StringUtils';
import ModalDropdown from '../../widgets/drop-down/ModalDropdown';

// let MainDropDown = (header, options, defaultText, onSelection) => {
let MainDropDown = (props, header, options, defaultText, onSelection) => {
  function dropdownRenderRow(rowData, rowID, highlighted) {
    return (
      <View
        style={[
          styles.dropdownRow,
          {backgroundColor: highlighted ? Colors.overlay : Colors.white},
        ]}>
        <Text style={styles.dropdownText}>{rowData}</Text>
      </View>
    );
  }

  let renderDropDown = (header, options, defaultText, onSelection) => {
    return (
      <View>
        <ModalDropdown
          style={styles.modelDropdown}
          textStyle={styles.dropdownHeaderText}
          dropdownStyle={styles.dropdownStyle}
          dropdownTextStyle={styles.dropdownText}
          arrowIconColor={Colors.white}
          options={options}
          defaultValue={defaultText}
          renderRow={dropdownRenderRow}
          onSelect={(i) => {
            onSelection(i);
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.row}>
      <Text style={styles.rowText}> {props.header} </Text>
      <View style={styles.dropdownContainer}>
        {renderDropDown(
          props.header,
          props.options,
          props.defaultText,
          props.onSelection,
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    backgroundColor: Colors.accent,
    height: 2 * PaddingConstants.tab3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.tab1,
    marginBottom: 1,
  },
  rowText: {
    color: Colors.primary,
    fontSize: TextSizes.secondary,
  },
  modelDropdown: {
    minHeight: MarginConstants.tab3,
    justifyContent: 'flex-end',
    marginRight: MarginConstants.tab1,
    width: '50%',
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
    borderColor: Colors.darkerGrey,
  },
  dropdownHeaderText: {
    flex: 1,
    color: Colors.white,
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
    borderColor: Colors.darkerGrey,
  },
  dropdownRow: {
    flexDirection: 'row',
    minHeight: MarginConstants.tab4,
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.halfTab,
    backgroundColor: Colors.accent,
  },
  dropdownContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    right: 10,
  },
});

export default MainDropDown;
