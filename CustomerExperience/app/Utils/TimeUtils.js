import moment from 'moment';
import {DMY_AT_TIME_FORMAT, HalfMonthDateYearFormat} from './AppConstants';
import {isStringNullOrEmpty} from './Utility';
import {TOKEN_VALIDATION_DURATION} from '../api/Constant';

function convertToDateTime(date) {
  // return moment(date).local().format(DMY_AT_TIME_FORMAT);
  return moment(date).local().format(HalfMonthDateYearFormat);
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

export function getExpireDate() {
  let today = new Date();
  let nextExpireDate = new Date(today);
  nextExpireDate.setDate(nextExpireDate.getDate() + TOKEN_VALIDATION_DURATION);
  console.log(
    'LOGIN EXPIRE DATE',
    JSON.stringify(today),
    JSON.stringify(nextExpireDate),
  );
  return nextExpireDate.toISOString();
}
export function msToHMS(ms) {
  // 1- Convert to seconds:
  let seconds = ms / 1000;
  // 2- Extract hours:
  const hours = parseInt(seconds / 3600); // 3,600 seconds in 1 hour
  seconds = seconds % 3600; // seconds remaining after extracting hours
  // 3- Extract minutes:
  const minutes = parseInt(seconds / 60); // 60 seconds in 1 minute
  // 4- Keep only seconds not extracted to minutes:
  seconds = seconds % 60;
  return `${hours}:${minutes}:${Math.floor(seconds)}`;
}
