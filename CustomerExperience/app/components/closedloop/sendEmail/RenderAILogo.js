import React from 'react';
import {View, StyleSheet} from 'react-native';
import StartAlignedView from '../../../routes/commonUI/StartAlignedView';
import QPAIIcon from '../../../../assets/images/qp_ai.svg';
import {MarginConstants} from '../../../styles/margin.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {Colors} from '../../../styles/color.constants';
const RenderAILogo = () => {
  return (
    <StartAlignedView>
      <View style={styles.aiLogoContainer}>
        <QPAIIcon />
      </View>
    </StartAlignedView>
  );
};

export default RenderAILogo;
const styles = StyleSheet.create({
  aiLogoContainer: {
    marginVertical: MarginConstants.tab1,
    padding: PaddingConstants.tab1,
    backgroundColor: Colors.settingsBackground,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
