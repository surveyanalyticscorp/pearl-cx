import React from 'react';
import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../styles/color.constants';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {PaddingConstants} from '../../styles/padding.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {FontFamily, FontWeight} from '../../styles/font.constants';
import {TextSizes} from '../../styles/textsize.constants';

let {width} = Dimensions.get('window');

const BottomSheetHeader = props => {
  return (
    <View style={styles.panelHeaderContainer}>
      <View style={styles.panelHandleContainer}>
        <View style={styles.panelHandle} />
      </View>
      <View style={styles.panelTitleContainer}>
        <Text style={styles.header}>{props.title}</Text>
        <Pressable onPress={props.onPressClose}>
          <IonIcons name="close" size={20} color={Colors.filterIconColor} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  panelHeaderContainer: {
    flex: 1,
    paddingVertical: PaddingConstants.tab1_2x,
    paddingHorizontal: PaddingConstants.tab1_3x,
    backgroundColor: Colors.white,
    borderTopStartRadius: MarginConstants.tab1,
    borderTopEndRadius: MarginConstants.tab1,
  },
  panelHandleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  panelTitleContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingVertical: PaddingConstants.tab1,
  },
  panelHandle: {
    height: 4,
    width: width / 5,
    backgroundColor: Colors.darkGrey,
  },
  header: {
    marginEnd: MarginConstants.tab2,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.largeText,
    fontWeight: FontWeight.bold,
    marginVertical: MarginConstants.halfTab,
    color: Colors.filterIconColor,
  },
});
export default BottomSheetHeader;
