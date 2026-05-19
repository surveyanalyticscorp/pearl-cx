import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import CheckSvg from '../../../../assets/images/check.svg';
import {MaterialIcons} from '../../../Utils/IconUtils';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {TextSizes} from '../../../styles/textsize.constants';

const EmailSentOverlay = ({isSuccess}) => {
  return (
    <View style={styles.container}>
      {isSuccess ? (
        <CheckSvg width={28} height={28} />
      ) : (
        <MaterialIcons name="close" size={28} color={Colors.detractor3} />
      )}
      <Text style={[styles.message, !isSuccess && styles.errorText]}>
        {isSuccess ? 'Email sent successfully' : 'Email sending failed'}
      </Text>
    </View>
  );
};

export default EmailSentOverlay;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  message: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
    marginTop: 8,
  },
  errorText: {
    color: Colors.detractor3,
  },
});
