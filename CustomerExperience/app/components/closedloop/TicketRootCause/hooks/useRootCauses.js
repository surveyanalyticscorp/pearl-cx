import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {hasId} from '../TicketRootCause'; // Assuming hasId is exported correctly

const useRootCauses = ticket => {
  const rootCauseList = useSelector(state => state.dashboard.rootCauseList);

  const [rootCauses, setRootCauses] = useState([]);

  useEffect(() => {
    const causes =
      rootCauseList.length > 0
        ? rootCauseList.map(value => ({
            ...value,
            isChecked: hasId(value.id, ticket.rootCauses),
          }))
        : [];
    setRootCauses(causes);
  }, [rootCauseList, ticket.rootCauses]);

  return rootCauses;
};

export default useRootCauses;
