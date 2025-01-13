import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import ArrowDownIcon from '../components/ArrowDown';
import {PaddingConstants} from '../../../../styles/padding.constants';
import {TextSizes} from '../../../../styles/textsize.constants';
import {MarginConstants} from '../../../../styles/margin.constants';
import {FontFamily} from '../../../../styles/font.constants';
import {Colors} from '../../../../styles/color.constants';
import StartAlignedView from '../../../../routes/commonUI/StartAlignedView';
import EndAlignedView from '../../../../routes/commonUI/EndAlignedView';
import {baseTextStyles} from '../../../../styles/text.styles';

const RenderDropDownButton = ({
  text,
  frontIcon,
  handleOnPress,
  hasArrowDownIcon = false,
  isDisabled = false,
}) => {
  const rootContainerStyle = {
    opacity: isDisabled ? 0.6 : 1,
    ...styles.rootContainer,
  };
  return (
    <Pressable
      style={rootContainerStyle}
      testID={`${text}-dropdown`}
      onPress={handleOnPress}>
      <View style={styles.container}>
        <StartAlignedView>
          {frontIcon}
          <Text style={styles.dropdownContainerText}>{text}</Text>
        </StartAlignedView>
        <EndAlignedView>
          {hasArrowDownIcon ? <ArrowDownIcon /> : <View />}
        </EndAlignedView>
      </View>
    </Pressable>
  );
};

export default RenderDropDownButton;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    flexDirection: 'row',
    maxHeight: MarginConstants.tab1_5x,
    backgroundColor: Colors.white,
    borderColor: Colors.darkGrey,
    borderWidth: 1,
  },

  container: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.tab1,
  },

  dropdownContainerText: {
    ...baseTextStyles.regularText,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.regular,
    marginVertical: MarginConstants.tab1,
  },
});
