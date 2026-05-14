import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {translate} from '../../../Utils/MultilinguaUtils';

const EmailSubject = ({body, onChangeSubject}) => {
  return (
    <View>
      <View style={styles.rowContainerCenterAlign}>
        <Text style={styles.titleText}>{`${translate(
          'action_email.subject',
        )}:`}</Text>
        <TextInput
          multiline={false}
          placeholder="Email subject"
          placeholderTextColor={Colors.borderColor}
          defaultValue={body.subject ?? ''}
          style={styles.textInput}
          onChangeText={onChangeSubject}
        />
      </View>
      <View style={styles.devider} />
    </View>
  );
};

export default EmailSubject;

const styles = StyleSheet.create({
  rowContainerCenterAlign: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    padding: PaddingConstants.tab1,
    color: Colors.filterIconColor,
  },
  textInput: {
    flex: 1,
    color: Colors.filterIconColor,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
  },
  devider: {
    height: 1,
    flex: 1,
    backgroundColor: Colors.darkGrey,
  },
});
