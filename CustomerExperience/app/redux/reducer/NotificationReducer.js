import {
  CLEAR_NOTIFICATION,
  NOTIFICATION_RECEIVED,
} from '../actions/notification.actions';

const initialState = {
  notificationLogs: [],
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case NOTIFICATION_RECEIVED: {
      return {
        ...state,
        notificationLogs: action.response.body.notificationLogs,
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

    default: {
      return state;
    }
  }
};

export default notificationReducer;
