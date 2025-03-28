import React from 'react';
import {StyleSheet} from 'react-native';
import TextLabel from '../../widgets/TextLabel/TextLabel';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {Colors} from '../../styles/color.constants';
import {FontFamily, FontWeight} from '../../styles/font.constants';
import {TextSizes} from '../../styles/textsize.constants';

const ShowInputError = ({isError, errorMessage = ''}) =>
  isError && <TextLabel text={errorMessage} style={styles.errorLabelRed} />;

export default ShowInputError;

const styles = StyleSheet.create({
  errorLabelRed: {
    marginBottom: MarginConstants.tab1,
    alignItems: 'center',
    marginStart: 0,
    paddingVertical: PaddingConstants.halfTab,
    color: Colors.deleteButtonText,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    fontWeight: FontWeight._300,
  },
});
