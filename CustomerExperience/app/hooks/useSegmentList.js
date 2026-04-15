import {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getClosedLoopSegmentDetails} from '../redux/actions/dashboard.actions';

const useSegmentList = () => {
  const dispatch = useDispatch();
  const authToken = useSelector(state => state.global.authToken);
  const ownerID = useSelector(state => state.global.userInfo.userID);
  const segmentList = useSelector(state => state.dashboard.segmentList);

  const defaultParams = {
    pageOffset: 0,
    perPage: 100,
    segmentName: '',
    ownerID,
  };

  const [params, setParams] = useState(defaultParams);
  // Prevents onEndReached from triggering pagination before page 0 data arrives.
  // Reset to false on every new fetch; set to true only when data populates.
  const readyForMoreRef = useRef(false);

  useEffect(() => {
    readyForMoreRef.current = false;
    dispatch(
      getClosedLoopSegmentDetails(authToken, {
        pageOffset: `${params.pageOffset}`,
        perPage: `${params.perPage}`,
        segmentName: params.segmentName,
        ownerID: `${params.ownerID}`,
      }),
    );
  }, [params]);

  useEffect(() => {
    if (segmentList.length > 0) {
      readyForMoreRef.current = true;
    }
  }, [segmentList]);

  const loadMoreData = () => {
    if (!readyForMoreRef.current) {
      return;
    }
    setParams(p => ({...p, pageOffset: p.pageOffset + 1}));
  };

  const onSearchHandler = text =>
    setParams({...defaultParams, segmentName: text ?? ''});

  const refresh = () => setParams({...defaultParams});

  return {segmentList, loadMoreData, onSearchHandler, refresh};
};

export default useSegmentList;
