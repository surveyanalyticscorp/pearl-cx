export default class TimeOutUtil {

    static addTimeOut(action, delayInMillis = 2000) {
        return setTimeout(() => {
            action();
        }, delayInMillis);
    }
}
