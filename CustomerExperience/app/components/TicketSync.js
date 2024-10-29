import React, {useCallback, useEffect} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {syncTickets} from '../redux/actions/closedloop.actions';
import StringUtils from '../Utils/StringUtils';

const TicketSync = () => {
  console.log('TicketSync Rendered');
  const authToken = useSelector(state => state.global.authToken);
  const ticketSync = useSelector(state => state.dashboard.ticketSync);
  const {feedbackApiKey, feedbackID} = useSelector(
    state => state.global.userInfo,
  );
  const dispatch = useDispatch();

  const callTicketSync = useCallback(() => {
    console.log('GET_TICKET_LIST_SYNC_RECEIVED: ', 'dispatched');
    dispatch(
      syncTickets({
        authToken,
        feedbackApiKey,
        feedbackID,
        subscriberId: global.subscriberId,
      }),
    );
  }, [authToken, feedbackApiKey, feedbackID, dispatch]);

  useEffect(() => {
    if (
      ticketSync &&
      !StringUtils.isEmptyOrNull(global.subscriberId) &&
      !StringUtils.isEmptyOrNull(feedbackApiKey) &&
      !StringUtils.isEmptyOrNull(feedbackID)
    ) {
      callTicketSync();
    }
  }, [callTicketSync, feedbackApiKey, feedbackID, ticketSync]);
  return <View testID="ticket-sync-view" />;
};
export default TicketSync;
