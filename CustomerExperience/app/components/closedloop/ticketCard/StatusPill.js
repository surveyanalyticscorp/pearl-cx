import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {Colors, getStatusBorderColor} from '../../../styles/color.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {baseTextStyles} from '../../../styles/text.styles';
import {getStatusById} from '../../../Utils/TicketUtils';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';

const isSmallScreen = Dimensions.get('window').width <= 375;

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
      <Text
        style={[
          styles.statusPillText,
          {color: textColor},
          isSmallScreen && {fontSize: TextSizes.semiSecondary},
        ]}>
        {statusText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statusPill: {
    borderRadius: 20,
    paddingHorizontal: PaddingConstants.halfTab,
    paddingVertical: PaddingConstants.halfTab,
    width: MarginConstants.tab1_7x + MarginConstants.tab3,
  },
  statusPillText: {
    ...baseTextStyles.secondaryRegularText,
    marginHorizontal: 0,
    textAlign: 'center',
  },
});

export default StatusPill;
