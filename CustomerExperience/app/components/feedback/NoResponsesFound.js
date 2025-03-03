import React from 'react';
import {StyleSheet, View} from 'react-native';
import {MarginConstants} from '../../styles/margin.constants';
import TextLabel from '../../widgets/TextLabel/TextLabel';

const NoResponsesFound = ({text}) => {
  return (
    <View testID="no-responses-found-view" style={styles.emptyView}>
      <TextLabel testID="text-label">{text}</TextLabel>
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
