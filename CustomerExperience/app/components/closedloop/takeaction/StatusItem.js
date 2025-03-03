import React from 'react';
import {StyleSheet, Pressable, View} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {RadioButtonCheckbox} from '../../../routes/commonUI/CommonUI';
import {RenderStatusIcon} from '../../../routes/commonUI/CommonUI';
import TextLabel from '../../../widgets/TextLabel/TextLabel';
import {baseTextStyles} from '../../../styles/text.styles';
import StartAlignedView from '../../../routes/commonUI/StartAlignedView';
import EndAlignedView from '../../../routes/commonUI/EndAlignedView';

const StatusItem = ({index, item, selectedIndex, onPressHandler}) => {
  const {title} = item;

  return (
    <Pressable
      testID="status-item-button"
      onPress={onPressHandler}
      style={styles.container}>
      <StartAlignedView>
        <RenderStatusIcon size={18} title={title} />
        <TextLabel text={title} style={styles.title} />
      </StartAlignedView>
      <EndAlignedView>
        <RadioButtonCheckbox size={26} isChecked={index === selectedIndex} />
      </EndAlignedView>
    </Pressable>
  );
};

export default StatusItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: MarginConstants.tab1_2x,
    marginTop: MarginConstants.tab1_2x,
  },
  title: {
    ...baseTextStyles.primaryRegularText,
    marginStart: MarginConstants.tab1_2x,
  },
  icon: {
    flex: 1,
    borderRadius: 50,
    borderWidth: 1,
    backgroundColor: Colors.accent,
  },
});
