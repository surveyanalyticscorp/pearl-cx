import {useEffect, useRef, useState} from 'react';
import AsyncStorageData from '../AsyncUtil';
import {ASYNC_RESPONSES_WITH_CX_MANAGER} from '../../api/Constant';

export default function useStorage(key) {
  const [data, setData] = useState(null);
  const storageService = new AsyncStorageData(key);
  const isMounted = useRef(true);
  const fetchData = async () => {
    const storedData = await storageService.getData();
    console.log(
      ASYNC_RESPONSES_WITH_CX_MANAGER,
      'useStorage',
      JSON.stringify(storedData),
    );
    if (isMounted) {
      setData(storedData);
    }
    return storedData;
  };
  useEffect(() => {
    // isMounted.current = true;
    fetchData();
    return () => {
      isMounted.current = false; // Cleanup function sets the flag to false
    };
  }, [key]);

  const saveData = async newData => {
    await storageService.setData(newData);
    if (isMounted.current) {
      setData(newData);
    }
  };

  const clearData = async () => {
    await storageService.removeData();
    if (isMounted.current) {
      setData(null);
    }
  };

  const saveDataAsString = async newData => {
    await storageService.setDataAsString(JSON.stringify(newData));
    if (isMounted.current) {
      setData(JSON.stringify(newData));
    }
  };

  return {
    data,
    saveData,
    saveDataAsString,
    clearData,
  };
}
