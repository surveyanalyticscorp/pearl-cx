import {useCallback, useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
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
import {
  clearTagFilter,
  clearTicketFilterData,
  saveTicketFilterData,
} from '../../../redux/actions/closedloop.actions';

const ITEMS_PER_PAGE = 100;

const useTicketFilter = () => {
  const dispatch = useDispatch();
  const {feedbackApiKey, userID} = useSelector(state => state.global.userInfo);
  const {range} = useSelector(state => state.global);
  const owners = useSelector(state => state.dashboard.ownerDetails.owners);
  const statusId = useSelector(state => state.global.statusId);
  const savedFilterData = useSelector(state => state.dashboard.ticketFilter);
  const ticketTags = useSelector(state => state.dashboard.ticketTags);

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
  const [filterState, setFilterState] = useState(() => {
    if (savedFilterData) {
      const restored = createFilterState(
        {...savedFilterData, tags: ticketTags ?? []},
        getIds,
      );
      return {...initialFilterState, ...restored};
    }
    return initialFilterState;
  });
  const [filterData, setFilterData] = useState(() => {
    if (savedFilterData) {
      return {
        ...sampleFilterData(),
        status: savedFilterData.status,
        priority: savedFilterData.priority,
        type: savedFilterData.type,
        assignToId: savedFilterData.assignToId,
      };
    }
    return sampleFilterData();
  });

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
    dispatch(saveTicketFilterData({
      status: item.status,
      priority: item.priority,
      type: item.type,
      assignToId: item.assignToId,
    }));
  }, [dispatch]);

  const resetFilter = useCallback((range_) => {
    const freshState = {
      ...initialFilterState,
      ...(range_ ? {
        fromDate: convertDateToYMDFORMAT(range_.startDate),
        toDate: convertDateToYMDFORMAT(range_.endDate),
      } : {}),
    };
    setFilterState(freshState);
    setFilterData(sampleFilterData());
    setSearchText('');
    dispatch(clearTicketFilterData());
    dispatch(clearTagFilter());
  }, [initialFilterState, sampleFilterData, dispatch]);

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
