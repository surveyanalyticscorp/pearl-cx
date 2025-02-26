import React from 'react';
import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../styles/color.constants';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {PaddingConstants} from '../../styles/padding.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {FontFamily, FontWeight} from '../../styles/font.constants';
import {TextSizes} from '../../styles/textsize.constants';
import TextLabel from '../../widgets/TextLabel/TextLabel';

let {width} = Dimensions.get('window');

const PanelHandler = () => {
  return (
    <View testID="panelHandler" style={styles.panelHandleContainer}>
      <View style={styles.panelHandle} />
    </View>
  );
};
const BottomSheetHeader = ({title, onPressClose}) => {
  return (
    <View testID="bottomSheetHeader" style={styles.panelHeaderContainer}>
      <PanelHandler />
      <View style={styles.panelTitleContainer}>
        <TextLabel text={title} style={styles.header} />
        {/* <Text style={styles.header}>{title}</Text> */}
        <Pressable onPress={onPressClose}>
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
    zIndex: 10,
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
    fontWeight: FontWeight._400,
    marginVertical: MarginConstants.halfTab,
    color: Colors.filterIconColor,
  },
});
export default BottomSheetHeader;
