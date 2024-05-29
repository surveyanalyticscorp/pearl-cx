import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {translate} from '../../Utils/MultilinguaUtils';
import {MarginConstants} from '../../styles/margin.constants';

const NoResponsesFound = () => {
  return (
    <View style={styles.emptyView}>
      <Text style={styles.emptyText}>
        {/* {translate('responses.no_feedback_received')} */}
        {'No responses found'}
      </Text>
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
