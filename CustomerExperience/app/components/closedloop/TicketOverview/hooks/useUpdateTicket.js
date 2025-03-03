import {useDispatch, useSelector} from 'react-redux';
import {updateClfTicket} from '../../../../redux/actions/dashboard.actions';
import {sendAnalyticsEvent} from '../../../../Utils/AnalyticLogs';
import {ANALYTICS_EVENTS} from '../../../../Utils/Analytic.constants';

const useUpdateTicket = () => {
  const dispatch = useDispatch();
  const authToken = useSelector(state => state.global.authToken);
  const {emailAddress, firstName, lastName, userID, feedbackApiKey} =
    useSelector(state => state.global.userInfo);
  const {id} = useSelector(state => state.dashboard.ticket);

  return params => {
    let body = {
      ...params,
      userName: `${firstName} ${lastName}`,
      userEmailAddress: `${emailAddress}`,
      userId: `${userID}`,
    };
    sendAnalyticsEvent(ANALYTICS_EVENTS.UPDATE_TICKET, {
      ticketId: id,
      ...body,
    });
    dispatch(updateClfTicket(authToken, body, id, feedbackApiKey));
  };
};

export default useUpdateTicket;
