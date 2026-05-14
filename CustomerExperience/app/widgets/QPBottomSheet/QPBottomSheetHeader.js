import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily, FontWeight} from '../../styles/font.constants';
import {IonIcon} from '../../Utils/IconUtils';
import {MarginConstants} from '../../styles/margin.constants';

const QPBottomSheetHeader = ({headerLabel, onClose}) => {
  return (
    <View style={styles.modalHeader}>
      <Text style={styles.modalHeaderText}>{headerLabel}</Text>
      <Pressable testID="close-button" onPress={onClose}>
        <IonIcon name="close" size={24} color={Colors.filterIconColor} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: PaddingConstants.tab1_2x,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  //   modalHeaderText: {
  //     color: Colors.filterIconColor,
  //     fontSize: TextSizes.largeText,
  //     fontFamily: FontFamily.medium,
  //   },

  modalHeaderText: {
    marginEnd: MarginConstants.tab2,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.largeText,
    fontWeight: FontWeight._500,
    marginVertical: MarginConstants.halfTab,
    color: Colors.filterIconColor,
  },
});

export default QPBottomSheetHeader;
