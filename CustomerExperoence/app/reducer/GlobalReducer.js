import {
  FILL_USER_INFO,
  IS_LOADING,
  IS_LOGIN,
  LOGIN_RESPONSE,
  API_ERROR,
  CLEAR_API_ERROR,
  FORGOT_PSWD_OTP_RESPONSE,
  VALIDATE_USER_OTP_RESPONSE,
} from '../actions';

const initialState = {
  isLoading: false,
  isLogin: false,
  isError: false,
  errorMessage: '',
  userInfo: {},
  forgotPasswordResponse: {},
  validateOtpResponse: {},
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
    case FORGOT_PSWD_OTP_RESPONSE: {
      return {
        ...state,
        forgotPasswordResponse: action.response,
        isLoading: false,
      };
    }

    case VALIDATE_USER_OTP_RESPONSE: {
      return {
        ...state,
        validateOtpResponse: action.response,
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
    case API_ERROR: {
      return {
        ...state,
        isError: true,
        errorMessage: action.error,
        isLoading: false,
      };
    }
    case CLEAR_API_ERROR: {
      return {
        ...state,
        isError: false,
        errorMessage: '',
        isLoading: action.payload.isLoading,
      };
    }
    default: {
      return state;
    }
  }
};

export default globalReducer;
