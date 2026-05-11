import React from 'react';
import {Pressable, Text} from 'react-native';
import {MarginConstants} from '../../styles/margin.constants';
import {buttonStyles} from '../../styles/button.styles';

export const SaveDashboardDate = ({saveRange}) => {
  return (
    <Pressable
      style={[
        buttonStyles.primaryButton,
        {marginHorizontal: MarginConstants.tab1},
      ]}
      onPress={saveRange}>
      <Text style={buttonStyles.primaryButtonText}>{`Apply`}</Text>
    </Pressable>
  );
};
