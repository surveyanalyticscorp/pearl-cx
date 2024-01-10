import React from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {
  Colors,
  // getStatusBorderColor,
  // getStatusFillerColor,
  // textColors,
} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {
  CheckBox,
  CheckBoxItem,
  RadioButtonCheckbox,
  RenderStatusIcon,
} from '../../../routes/CommonScreen';

const StatusItem = ({index, item, selectedIndex, onPressHandler}) => {
  const title = item.title;

  return (
    <TouchableWithoutFeedback onPress={onPressHandler} style={styles.container}>
      <View style={styles.container}>
        <RadioButtonCheckbox size={18} isChecked={index === selectedIndex} />
        {/* {props.selectedIndex === index ? (
          <IonIcon
            style={{marginHorizontal: MarginConstants.halfTab}}
            name={'checkmark'}
            size={20}
            color={Colors.filterIconColor}
          />
        ) : (
          <View />
        )} */}

        <Text style={styles.title}>{title}</Text>
        <RenderStatusIcon size={18} title={title} />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default StatusItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: MarginConstants.tab1,
    marginTop: MarginConstants.tab2,
  },
  title: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.primary,
    marginStart: MarginConstants.halfTab,
    color: Colors.filterIconColor,
  },
  icon: {
    flex: 1,
    borderRadius: 50,
    borderWidth: 1,
    backgroundColor: Colors.accent,
  },
});
