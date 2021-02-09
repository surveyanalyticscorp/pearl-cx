export const GET_NOTIFICATION = 'GET_NOTIFICATION';
export const NOTIFICATION_RECEIVED = 'NOTIFICATION_RECEIVED';
export const CLEAR_NOTIFICATION = 'CLEAR_NOTIFICATION';

export const getNotification = (token) => ({
    type: GET_NOTIFICATION,
    token
});


export const clearNotification = (notification) => {
    return{
        type: CLEAR_NOTIFICATION,
        payload: notification,
    }
};
