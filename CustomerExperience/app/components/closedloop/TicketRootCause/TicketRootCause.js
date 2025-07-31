import React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {RootCauseNavigationButtons} from './RootCauseNavigationButtons';
import {AskWhy} from './AskWhy';
import {CustomRootCause} from './CustomeRootCause';

const TicketRootCause = props => {
  return (
    <ScrollView testID="root-cause-view" style={styles.rootContainer}>
      <RootCauseNavigationButtons />
      <AskWhy />
      <CustomRootCause />
    </ScrollView>
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
