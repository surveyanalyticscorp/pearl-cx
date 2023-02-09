export default class TimeOutUtil {
  static addTimeOut(action, delayInMillis = 2000) {
    return setTimeout(() => {
      action();
    }, delayInMillis);
  }
}

export function debounce(cb, delay = 1000) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}
