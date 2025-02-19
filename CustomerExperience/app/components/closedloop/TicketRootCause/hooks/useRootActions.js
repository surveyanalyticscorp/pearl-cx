import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {hasId} from '../TicketRootCause'; // Assuming hasId is exported correctly

const useRootActions = ticket => {
  const rootCauseActionList = useSelector(
    state => state.dashboard.rootCauseActionList,
  );

  const [rootCauseActions, setRootActions] = useState([]);

  useEffect(() => {
    const actions =
      rootCauseActionList.length > 0
        ? rootCauseActionList.map(value => ({
            ...value,
            title: value.actionName,
            isChecked: hasId(value.id, ticket.rootCauseActions),
          }))
        : [];
    setRootActions(actions);
  }, [rootCauseActionList, ticket.rootCauseActions]);

  return rootCauseActions;
};

export default useRootActions;
