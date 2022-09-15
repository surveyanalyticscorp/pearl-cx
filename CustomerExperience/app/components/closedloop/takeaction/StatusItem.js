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
import {RenderStatusIcon} from '../../../routes/CommonScreen';

const StatusItem = (props) => {
  const selectedIndex = props.selectedIndex;
  const index = props.item.index;
  const title = props.item.title;

  return (
    <TouchableWithoutFeedback
      onPress={props.onPressHandler}
      style={styles.container}>
      <View style={styles.container}>
        <RenderStatusIcon title={title} />
        <Text style={styles.title}>{title}</Text>
        {selectedIndex === index ? (
          <IonIcon
            style={{marginHorizontal: MarginConstants.halfTab}}
            name={'checkmark'}
            size={20}
            color={Colors.filterIconColor}
          />
        ) : (
          <View />
        )}
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
    marginHorizontal: MarginConstants.tab1,
    padding: MarginConstants.tab1,
  },
  title: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.secondary,
    marginStart: MarginConstants.halfTab,
    color: Colors.filterIconColor,
  },
  icon: {borderRadius: 50, borderWidth: 1},
});
