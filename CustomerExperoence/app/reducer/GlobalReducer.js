import {IS_LOADING, LOGIN_RESPONSE} from '../actions';

const initialState = {
  isLoading: false,
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
    default: {
      return state;
    }
  }
};

export default globalReducer;
