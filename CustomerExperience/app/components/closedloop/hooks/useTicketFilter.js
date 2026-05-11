import {useCallback, useEffect, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {
  clearAssignToIdFilter,
  clearPriorityFilter,
  clearStatusFilter,
  clearTypeFilter,
  convertDateToYMDFORMAT,
  createFilterState,
  getIds,
  priorityList,
  statusList,
  ticketTypeList,
} from '../../../Utils/TicketUtils';

const ITEMS_PER_PAGE = 100;

const useTicketFilter = () => {
  const {feedbackApiKey, userID} = useSelector(state => state.global.userInfo);
  const {range} = useSelector(state => state.global);
  const owners = useSelector(state => state.dashboard.ownerDetails.owners);
  const statusId = useSelector(state => state.global.statusId);

  const initialFilterState = useMemo(
    () => ({
      feedbackApiKey,
      status: '',
      priority: '',
      assignToId: JSON.stringify(userID),
      userId: JSON.stringify(userID),
      pageNumber: 1,
      perPage: ITEMS_PER_PAGE,
      fromDate: convertDateToYMDFORMAT(range.startDate),
      toDate: convertDateToYMDFORMAT(range.endDate),
      type: '',
      search: '',
    }),
    [],
  );

  const sampleFilterData = useCallback(
    () => ({
      priority: priorityList.map(v => ({...v, isChecked: false})),
      status: statusList.map(v => ({...v, isChecked: false})),
      managers: [],
      type: ticketTypeList.map(v => ({...v, isChecked: false})),
      assignToId: JSON.stringify(userID),
      userId: JSON.stringify(userID),
    }),
    [userID],
  );

  const [pageNumber, setPageNumber] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [filterState, setFilterState] = useState(initialFilterState);
  const [filterData, setFilterData] = useState(() => sampleFilterData());

  const resetFilterState = useCallback(range_ => {
    setPageNumber(1);
    setFilterState(state => ({
      ...state,
      pageNumber: 1,
      fromDate: convertDateToYMDFORMAT(range_.startDate),
      toDate: convertDateToYMDFORMAT(range_.endDate),
    }));
  }, []);

  const filterByStatus = useCallback(
    statusId_ => {
      const tempStatusData = filterData.status.map(value => ({
        ...value,
        isChecked: value.id === parseInt(statusId_),
      }));
      setFilterState(state => ({...state, status: statusId_}));
      setFilterData(state => ({...state, status: tempStatusData}));
    },
    [filterData.status],
  );

  useEffect(() => {
    if (statusId) {
      filterByStatus(statusId);
    }
  }, [statusId]);

  useEffect(() => {
    if (owners && owners.length > 0) {
      setFilterData(state => ({
        ...state,
        managers: owners.map(value => ({...value, isChecked: false})),
      }));
    } else {
      setFilterData(state => ({...state, managers: []}));
    }
  }, [owners]);

  const applyFilter = useCallback(item => {
    setFilterData(item);
    const newFilterState = createFilterState(item, getIds);
    setFilterState(state => ({...state, ...newFilterState}));
  }, []);

  const resetFilter = useCallback(() => {
    setFilterState(initialFilterState);
    setFilterData(sampleFilterData());
    setSearchText('');
  }, [initialFilterState, sampleFilterData]);

  const onResetSearch = useCallback(() => {
    setSearchText('');
    setFilterState(prev => ({...prev, search: ''}));
  }, []);

  const submitQuery = useCallback(text => {
    setSearchText(text);
    setFilterState(prev => ({...prev, search: text}));
  }, []);

  const clearFilterData = useCallback(item => {
    switch (item) {
      case 'priority':
        return clearPriorityFilter();
      case 'status':
        return clearStatusFilter();
      case 'type':
        return clearTypeFilter();
      case 'assignToId':
        return clearAssignToIdFilter();
      default:
        return [];
    }
  }, []);

  const getOwnerIds = useCallback(
    items =>
      items
        .filter(item => item.isChecked === true)
        .map(owner => owner.ownerID)
        .toString(),
    [],
  );

  return {
    filterState,
    setFilterState,
    filterData,
    pageNumber,
    setPageNumber,
    searchText,
    resetFilterState,
    applyFilter,
    resetFilter,
    onResetSearch,
    submitQuery,
    clearFilterData,
    getOwnerIds,
  };
};

export default useTicketFilter;
