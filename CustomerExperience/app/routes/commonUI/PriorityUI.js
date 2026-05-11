import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {Colors, getPriorityBorderColorbyId} from '../../styles/color.constants';
import {getPriorityById} from '../../Utils/TicketUtils';
import {PaddingConstants} from '../../styles/padding.constants';
import {baseTextStyles} from '../../styles/text.styles';

export const PriorityUI = ({style, priority}) => {
  const priorityColor = getPriorityBorderColorbyId(priority);
  const priorityText = getPriorityById(priority);
  return (
    <View style={[styles.statusContainer, {...style}]}>
      <IonIcons name="flag" size={20} color={priorityColor} />
      <Text style={styles.statusText}>{priorityText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: PaddingConstants.tab1,
    paddingVertical: PaddingConstants.halfTab,
  },
  statusText: {
    ...baseTextStyles.secondaryRegularText,
    color: Colors.filterIconColor,
  },
});
