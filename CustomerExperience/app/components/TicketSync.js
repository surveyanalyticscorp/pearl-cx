import React, {useEffect} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {syncTickets} from '../redux/actions/closedloop.actions';
import StringUtils from '../Utils/StringUtils';

const TicketSync = () => {
  const authToken = useSelector(state => state.global.authToken);

  const {feedbackApiKey, feedbackID} = useSelector(
    state => state.global.userInfo,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (
      !StringUtils.isEmptyOrNull(global.subscriberId) &&
      !StringUtils.isEmptyOrNull(feedbackApiKey) &&
      !StringUtils.isEmptyOrNull(feedbackID)
    ) {
      console.log('GET_TICKET_LIST_SYNC_RECEIVED: ', 'dispatched');

      dispatch(
        syncTickets(
          authToken,
          {subscriberId: global.subscriberId, feedbackApiKey: feedbackApiKey},
          feedbackID,
        ),
      );
    }
  }, [dispatch, authToken, feedbackApiKey, feedbackID]);
  return <View />;
};
export default TicketSync;
