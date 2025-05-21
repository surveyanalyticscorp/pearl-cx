import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {MaterialIcons} from '../../../../Utils/IconUtils';
import {PaddingConstants} from '../../../../styles/padding.constants';
import {Colors} from '../../../../styles/color.constants';
import QPAIIcon from '../../../../../assets/images/qp_ai.svg';

const AiDraftButton = ({onPress}) => {
  return (
    <Pressable style={styles.generateButton} onPress={onPress}>
      <QPAIIcon />
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
