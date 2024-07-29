import {StyleSheet, View} from 'react-native';
import React from 'react';
import RenderDropDownButton from './RenderDropDownButton';
import TextLabel from '../../../widgets/TextLabel/TextLabel';
import {PaddingConstants} from '../../../styles/padding.constants';
import {MarginConstants} from '../../../styles/margin.constants';

const ShowTitleAndDropdown = ({
  title,
  titleIcon,
  currentItemName,
  onPress,
  hasArrowDownIcon = false,
  frontIcon,
  isDisabled = false,
}) => {
  return (
    <View style={styles.titleAndDropdownContainer}>
      <View style={styles.titleContainer}>
        {titleIcon}
        <TextLabel text={title} />
      </View>
      <RenderDropDownButton
        text={currentItemName}
        handleOnPress={onPress}
        hasArrowDownIcon={hasArrowDownIcon}
        frontIcon={frontIcon}
      />
    </View>
  );
};

export default ShowTitleAndDropdown;
const styles = StyleSheet.create({
  titleAndDropdownContainer: {
    flexDirection: 'column',
    marginBottom: MarginConstants.tab1_2x,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: MarginConstants.tab1,
  },
  textStyle: {paddingBottom: PaddingConstants.halfTab},
});
