import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {MaterialIcons} from '../../../../Utils/IconUtils';
import {PaddingConstants} from '../../../../styles/padding.constants';
import {Colors} from '../../../../styles/color.constants';

const AiDraftButton = ({onPress}) => {
  return (
    <Pressable style={styles.generateButton} onPress={onPress}>
      <MaterialIcons
        size={22}
        name={'auto-fix-high'}
        color={Colors.filterIconColor}
        style={{paddingRight: PaddingConstants.halfTab}}
      />
    </Pressable>
  );
};

export default AiDraftButton;
const styles = StyleSheet.create({
  generateButton: {
    padding: PaddingConstants.halfTab,
    borderRadius: 5,
  },
});
