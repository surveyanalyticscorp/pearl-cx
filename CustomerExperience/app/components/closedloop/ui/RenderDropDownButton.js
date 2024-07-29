import React from 'react';
import {View, TouchableWithoutFeedback, Text, StyleSheet} from 'react-native';
import ArrowDownIcon from './ArrowDown';
import {PaddingConstants} from '../../../styles/padding.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {FontFamily} from '../../../styles/font.constants';
import {Colors} from '../../../styles/color.constants';

const RenderDropDownButton = ({
  text,
  frontIcon,
  handleOnPress,
  hasArrowDownIcon = false,
  isDisabled = false,
}) => {
  return (
    <View style={[styles.dropdownContainer, {opacity: isDisabled ? 0.6 : 1}]}>
      <TouchableWithoutFeedback onPress={handleOnPress}>
        <View style={styles.dropdownInnerContainer}>
          {frontIcon}
          <View style={styles.dropdownInnerContainer}>
            <Text style={styles.dropdownContainerText}>{text}</Text>
          </View>
          {hasArrowDownIcon ? <ArrowDownIcon /> : <View />}
        </View>

        {/* <IonIcons name="down-arrow" /> */}
      </TouchableWithoutFeedback>
    </View>
  );
};

export default RenderDropDownButton;

const styles = StyleSheet.create({
  dropdownContainer: {
    flex: 2,
    flexDirection: 'row',
    height: '100%',
    backgroundColor: Colors.white,
    borderColor: Colors.darkGrey,
    borderWidth: 1,
  },
  dropdownInnerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    paddingHorizontal: PaddingConstants.halfTab,
  },
  dropdownContainerText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.regular,
    marginVertical: MarginConstants.tab1,
    color: Colors.filterIconColor,
  },
});
