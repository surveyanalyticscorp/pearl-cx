import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';
import {Colors, getPriorityBorderColor} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {baseTextStyles} from '../../../styles/text.styles';
import {RadioButtonCheckbox} from '../../../routes/commonUI/CommonUI';
import CheckmarkIcon from '../../../routes/commonUI/CheckmarkIcon';

const PriorityIcon = ({item}) => {
  const {title} = item;
  const borderColor = getPriorityBorderColor(title.toLowerCase());

  return (
    <IonIcon
      style={{marginHorizontal: MarginConstants.halfTab}}
      name={'flag'}
      size={20}
      color={borderColor}
    />
  );
};

const PriorityItem = ({index, item, selectedIndex, onPressHandler}) => {
  const {title} = item;
  const isChecked = selectedIndex === index;
  return (
    <Pressable
      style={styles.row}
      testID="priority-row"
      onPress={onPressHandler}>
      <PriorityIcon item={item} />
      <Text style={styles.title}>{title}</Text>
      <RadioButtonCheckbox size={26} isChecked={isChecked} />
    </Pressable>
  );
};

export default PriorityItem;
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: MarginConstants.tab1,

    paddingVertical: MarginConstants.tab1,
  },
  title: {
    flex: 1,
    ...baseTextStyles.primaryRegularText,
    marginStart: MarginConstants.halfTab,
    color: Colors.filterIconColor,
  },
});
