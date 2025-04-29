import {
  CLEAR_NOTIFICATION,
  NOTIFICATION_RECEIVED,
  READ_NOTIFICATION_RECIEVED,
  readNotification,
} from '../actions/notification.actions';

const initialState = {
  notificationLogs: [],
  readNotification: {},
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case NOTIFICATION_RECEIVED: {
      return {
        ...state,
        notificationLogs: action.response,
      };
    }

    case CLEAR_NOTIFICATION: {
      let list = [...state.notificationLogs];
      let filteredList = [];
      if (action.payload) {
        filteredList = list.filter(function (item) {
          return item.id !== action.payload.id;
        });
      }
      return {
        ...state,
        notificationLogs: filteredList,
      };
    }

    case READ_NOTIFICATION_RECIEVED: {
      return {
        ...state,
        readNotification: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};

export default notificationReducer;
