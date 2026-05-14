import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {FontFamily} from '../../../styles/font.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {Colors} from '../../../styles/color.constants';
import {translate} from '../../../Utils/MultilinguaUtils';
import {PaddingConstants} from '../../../styles/padding.constants';

export const SendEmailTo = () => {
  const toEmail = useSelector(
    state => state.dashboard?.ticket?.panelMember?.email ?? '',
  );

  return (
    <View>
      <View style={styles.rowContainerCenterAlign}>
        <Text style={styles.titleText}>{translate('action_email.to')}</Text>
        <Text style={styles.textInputEmail}>{toEmail}</Text>
      </View>
      <View style={styles.devider} />
    </View>
  );
};

export default SendEmailTo;

const styles = StyleSheet.create({
  titleText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    padding: PaddingConstants.tab1,
    color: Colors.filterIconColor,
  },
  textInputEmail: {
    flex: 1,
    color: Colors.accentLight,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
  },
  devider: {
    height: 1,
    flex: 1,
    backgroundColor: Colors.darkGrey,
  },
  rowContainerCenterAlign: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
