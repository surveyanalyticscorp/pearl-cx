import {useDispatch, useSelector} from 'react-redux';
import {updateSetTicketEscalation} from '../../../../redux/actions/closedloop.actions';

const useUpdateTicket = () => {
  const dispatch = useDispatch();
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

    dispatch(updateSetTicketEscalation(body, id, feedbackApiKey));
  };
};

export default useUpdateTicket;
