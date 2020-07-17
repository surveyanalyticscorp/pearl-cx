import {DASHBOARD_RECEIVED} from '../actions';

const initialState = {
  dashboardData: {},
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case DASHBOARD_RECEIVED: {
      return {
        ...state,
        dashboardData: action.response,
      };
    }
    default: {
      return state;
    }
  }
};
export default dashboardReducer;
