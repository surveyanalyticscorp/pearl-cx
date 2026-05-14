import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {IonIcon} from '../../../Utils/IconUtils';
import {useDispatch} from 'react-redux';
import {setTemplateBottomSheetState} from '../../../redux/actions/email.actions';

const TemplateIcon = ({onPressTemplate}) => {
  return (
    <Pressable onPress={onPressTemplate} style={styles.optionIcon}>
      <IonIcon name={'ios-reader'} size={24} color={Colors.filterIconColor} />
    </Pressable>
  );
};

export default TemplateIcon;

const styles = StyleSheet.create({
  optionIcon: {
    margin: MarginConstants.tab1,
  },
});
