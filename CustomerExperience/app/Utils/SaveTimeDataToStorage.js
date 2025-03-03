import {ASYNC_APP_USAGE_TIME_TRACK_DATA} from '../api/Constant';
import AsyncStorageData from './AsyncUtil';

function SaveTimeDataToStorage(ms) {
  const asyncStorage = new AsyncStorageData(ASYNC_APP_USAGE_TIME_TRACK_DATA);
  asyncStorage.getData(ASYNC_APP_USAGE_TIME_TRACK_DATA).then(data => {
    if (data) {
      const newData = JSON.parse(data);
      console.log('Time and usage data', newData);
      asyncStorage.setDataAsString(ASYNC_APP_USAGE_TIME_TRACK_DATA, [
        ...newData,
        ms,
      ]);
    } else {
      asyncStorage.setData(ASYNC_APP_USAGE_TIME_TRACK_DATA, [ms]);
    }
  });
}

export default SaveTimeDataToStorage;
