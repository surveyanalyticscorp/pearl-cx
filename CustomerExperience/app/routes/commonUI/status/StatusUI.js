import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {baseTextStyles} from '../../../styles/text.styles';
import {getStatusById} from '../../../Utils/TicketUtils';
import {RenderStatusIcon} from './RenderStatusIcon';

export const StatusUI = ({style, status}) => {
  return (
    <View style={[styles.statusContainer, {...style}]}>
      <RenderStatusIcon size={16} title={getStatusById(status)} />
      <Text style={styles.statusText}>{getStatusById(status)}</Text>
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
