import React from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {RootCauseNavigationButtons} from './RootCauseNavigationButtons';
import {AskWhy} from './AskWhy';
import {CustomRootCause} from './CustomeRootCause';

const TicketRootCause = props => {
  return (
    <SafeAreaView testID="root-cause-view" style={styles.rootContainer}>
      <RootCauseNavigationButtons />
      <AskWhy />
      <CustomRootCause />
    </SafeAreaView>
  );
};

export default TicketRootCause;

const styles = StyleSheet.create({
  rootContainer: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: Colors.white,
    padding: PaddingConstants.tab1,
  },
});
