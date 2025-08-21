import React, {useCallback, useState} from 'react';
import {StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from '../../../styles/color.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {RootCauseNavigationButtons} from './RootCauseNavigationButtons';
import {CustomRootCause} from './CustomeRootCause';
import {getClosedLoopTicketItem} from '../../../redux/actions/dashboard.actions';

const TicketRootCause = props => {
  const dispatch = useDispatch();
  const ticketId = useSelector(state => state.dashboard.ticket.id);
  const feedbackApiKey = useSelector(
    state => state.global.userInfo.feedbackApiKey,
  );
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    dispatch(getClosedLoopTicketItem('', ticketId, feedbackApiKey));

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [dispatch, feedbackApiKey, ticketId]);
  return (
    <ScrollView
      testID="root-cause-view"
      style={styles.rootContainer}
      refreshControl={
        <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
      }>
      <RootCauseNavigationButtons />
      {/* <AskWhy /> */}
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
