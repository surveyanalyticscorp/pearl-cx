import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {translate} from '../../Utils/MultilinguaUtils';
import {MarginConstants} from '../../styles/margin.constants';
import TextLabel from '../../widgets/TextLabel/TextLabel';

const NoResponsesFound = ({text}) => {
  return (
    <View style={styles.emptyView}>
      <TextLabel>{text}</TextLabel>
      {/* {translate('responses.no_feedback_received')} */}
    </View>
  );
};

export default NoResponsesFound;

const styles = StyleSheet.create({
  emptyView: {
    flex: 1,
    marginTop: MarginConstants.tab1_2x,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
