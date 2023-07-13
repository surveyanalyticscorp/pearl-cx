import moment from 'moment';
import {DMY_AT_TIME_FORMAT} from './AppConstants';
import {isStringNullOrEmpty} from './Utility';

function convertToDateTime(date) {
  return moment(date).local().format(DMY_AT_TIME_FORMAT);
}

export function convertDateTimeAgo(dateStr) {
  if (isStringNullOrEmpty(dateStr)) {
    return 'N/A';
  }
  return getDateTimeAgo(moment.utc(dateStr).toDate());
}

export const getDateTimeAgo = date => {
  const ONE_MINUTE = 60 * 1000;
  const ONE_HOUR = 60 * ONE_MINUTE;
  const ONE_DAY = 24 * ONE_HOUR;

  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < ONE_MINUTE) {
    return 'just now';
  } else if (diff < ONE_HOUR) {
    const minutes = Math.floor(diff / ONE_MINUTE);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diff < ONE_DAY) {
    const hours = Math.floor(diff / ONE_HOUR);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diff < 2 * ONE_DAY) {
    return 'yesterday';
  } else {
    return convertToDateTime(date);
  }
};
