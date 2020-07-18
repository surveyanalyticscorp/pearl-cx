import {FILL_USER_INFO, IS_LOADING, IS_LOGIN, LOGIN_RESPONSE} from '../actions';

const initialState = {
  isLoading: false,
  isLogin: false,
  userInfo: {},
};

const globalReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_RESPONSE: {
      return {
        ...state,
        userInfo: action.response,
        isLoading: false,
      };
    }
    case IS_LOADING: {
      return {...state, isLoading: action.payload.isLoading};
    }
    case IS_LOGIN: {
      return {...state, isLogin: action.payload.isLogin};
    }
    case FILL_USER_INFO: {
      return {
        ...state,
        userInfo: action.payload.userInfo,
      };
    }
    default: {
      return state;
    }
  }
};

export default globalReducer;
