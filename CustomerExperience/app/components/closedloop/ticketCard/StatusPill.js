import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors, getStatusBorderColor} from '../../../styles/color.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {baseTextStyles} from '../../../styles/text.styles';
import {getStatusById} from '../../../Utils/TicketUtils';

const StatusPill = ({status}) => {
  const statusText = getStatusById(status);
  const isNew = statusText === 'New';
  const pillStyle = isNew
    ? {
        backgroundColor: Colors.white,
        borderStyle: 'dotted',
        borderWidth: 1,
        borderColor: Colors.filterIconColor,
      }
    : {backgroundColor: getStatusBorderColor(statusText.toLowerCase())};
  const textColor = isNew ? Colors.filterIconColor : Colors.white;
  return (
    <View style={[styles.statusPill, pillStyle]}>
      <Text style={[styles.statusPillText, {color: textColor}]}>
        {statusText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statusPill: {
    borderRadius: 20,
    paddingHorizontal: PaddingConstants.tab1_2x,
    paddingVertical: PaddingConstants.halfTab,
  },
  statusPillText: {
    ...baseTextStyles.secondaryRegularText,
    marginHorizontal: 0,
  },
});

export default StatusPill;
