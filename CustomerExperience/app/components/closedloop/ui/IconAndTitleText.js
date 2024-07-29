import React from 'react';
import {StyleSheet, View} from 'react-native';
import TextLabel from '../../../widgets/TextLabel/TextLabel';
import {PaddingConstants} from '../../../styles/padding.constants';

const IconAndTitleText = ({icon, title, children}) => {
  return (
    <View style={styles.iconAndTextContainer}>
      {icon}
      <TextLabel text={title} />
      {children}
    </View>
  );
};

export default IconAndTitleText;

const styles = StyleSheet.create({
  iconAndTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: PaddingConstants.tab1,
  },
});
