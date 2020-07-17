import {LOGIN_RESPONSE} from '../actions';

const initialState = {
  userInfo: {},
};

const globalReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_RESPONSE: {
      return {
        ...state,
        userInfo: action.response,
      };
    }
    default: {
      return state;
    }
  }
};
export default globalReducer;
