import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {baseTextStyles} from '../../../styles/text.styles';
import TopRowIcon from './TopRowIcon';

const TopRow = ({email, hasPanelMember, ticketId}) => (
  <View style={styles.topRow}>
    <View style={styles.emailContainer}>
      <TopRowIcon hasPanelMember={hasPanelMember} />
      <Text
        style={[baseTextStyles.secondaryRegularText, styles.emailText]}
        numberOfLines={1}>
        {email}
      </Text>
    </View>
    <Text
      style={[baseTextStyles.primaryRegularText, {color: Colors.accentLight}]}>
      {`#${ticketId}`}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: MarginConstants.tab1,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginEnd: MarginConstants.tab1,
  },
  emailText: {
    color: Colors.evenDarkerGrey,
    marginStart: MarginConstants.halfTab,
    flex: 1,
  },
});

export default TopRow;
