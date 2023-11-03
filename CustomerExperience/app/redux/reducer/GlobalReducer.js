import {
  IS_DEV_MODE,
  DEV_BASE_URL,
  CLF_BASE_URL,
  BASE_URL_MID_FIX,
} from '../../api/Constant';
import {
  FILL_USER_INFO,
  IS_LOADING,
  API_ERROR,
  CLEAR_API_ERROR,
  CLEAR_USER_INFO,
  SET_AUTH_TOKEN,
  SET_RANGE_FILTER,
  SET_USER_DETAILS_FOR_RESET_PASSWORD,
  SET_DYNAMIC_LINK,
  WANT_TO_RELOAD_DASHBOARD,
  IS_ERROR,
  SET_LANGUAGE_INFO,
  IS_PAGINATION,
  IS_RESPONSE_LOADING,
  IS_TICKET_LOADING,
  IS_SEGMENT_LOADING,
  SET_BEARER_TOKEN,
} from '../actions';
import {SET_TICKET_FILTER_BY_STATUS_ID} from '../actions/closedloop.actions';
import {
  AUTHENTICATE_PANEL_RESPONSE,
  GET_BEARER_TOKEN_RESPONSE,
  LOGIN_RESPONSE,
  LOGOUT_RESPONSE,
  SET_ACCESS_CODE,
  SET_BASE_URL,
  UPDATE_BASE_CLF_URL,
  UPDATE_BASE_URL,
  UPDATE_PASSWORD_RESPONSE,
  VALIDATE_RESET_PASSWORD_LINK_RESPONSE,
} from '../actions/login.actions';

const initialState = {
  range: {
    type: 1,
    startDate: '',
    endDate: '',
  },
  isLoading: false,
  isResponseLoading: false,
  isTicketLoading: false,
  isSegmentLoading: false,
  isPagination: false,
  statusId: '',
  wantToReloadDashboard: true,
  isError: false,
  baseUrl: '',
  clfBaseUrl: '',
  accessCode: '',
  subscriberId: '',
  userInfo: {},
  languageCode: '',
  authToken: '',
  bearerToken: '',
  errorMessage: '',
  dynamicLink: '',
  dataCenter: '',
  userDetailsForResetPassword: {},
  validatePasswordLinkResponse: {},
  updatePasswordResponse: {},
  pushToken: '',
  logoutResponse: {},
};

const globalReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE_PANEL_RESPONSE: {
      return {
        ...state,
        baseUrl:
          (IS_DEV_MODE ? DEV_BASE_URL : action.response.body.mobileAPIURL) +
          (action.hasMidFix ? BASE_URL_MID_FIX : ''),
        subscriberId: JSON.stringify(action.response.body.userID),
        dataCenter: action.response.body.dataCenter,
        accessCode: action.response.body.accessCode,
      };
    }
    case UPDATE_BASE_URL: {
      console.log('UPDATE_BASE_URL', JSON.stringify(action));
      return {
        ...state,
        baseUrl: action.hasMidFix
          ? state.baseUrl + BASE_URL_MID_FIX
          : state.baseUrl,
      };
    }
    case SET_BASE_URL: {
      console.log('SET_BASE_URL', JSON.stringify(action));
      return {
        ...state,
        baseUrl: action.baseUrl,
      };
    }

    case SET_ACCESS_CODE: {
      console.log('SET_ACCESS_CODE', JSON.stringify(action));
      return {
        ...state,
        accessCode: action.accessCode,
      };
    }
    case UPDATE_BASE_CLF_URL: {
      return {
        ...state,
        clfBaseUrl: action.clfBaseUrl,
      };
    }
    case LOGIN_RESPONSE: {
      console.log(
        'LOGIN_RESPONSE, CLF BASE URL',
        JSON.stringify(action),
        JSON.stringify(action.clfResponse.data.baseUrl),
      );
      return {
        ...state,
        authToken: action.response.authToken,
        userInfo: action.response.body,
        //languageCode: action.response.body.languageCode,
        isLoading: false,
        clfBaseUrl: IS_DEV_MODE
          ? CLF_BASE_URL
          : action.clfResponse.data.baseUrl,
      };
    }
    case SET_LANGUAGE_INFO: {
      return {
        ...state,
        languageCode: action.payload.languageInfo.languageCode,
      };
    }
    case SET_DYNAMIC_LINK: {
      return {
        ...state,
        dynamicLink: action.payload,
      };
    }
    case SET_USER_DETAILS_FOR_RESET_PASSWORD: {
      return {
        ...state,
        userDetailsForResetPassword: action.payload,
      };
    }
    case VALIDATE_RESET_PASSWORD_LINK_RESPONSE: {
      return {
        ...state,
        validatePasswordLinkResponse: action.response,
        isLoading: false,
      };
    }
    case UPDATE_PASSWORD_RESPONSE: {
      return {
        ...state,
        userDetailsForResetPassword: {},
        updatePasswordResponse: action.response,
        isLoading: false,
        baseUrl: '',
      };
    }
    case IS_LOADING: {
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };
    }

    case IS_RESPONSE_LOADING: {
      return {
        ...state,
        isResponseLoading: action.payload.isLoading,
      };
    }

    case IS_TICKET_LOADING: {
      return {
        ...state,
        isTicketLoading: action.payload.isLoading,
      };
    }

    case IS_SEGMENT_LOADING: {
      return {
        ...state,
        isSegmentLoading: action.payload.isLoading,
      };
    }

    case IS_PAGINATION: {
      return {
        ...state,
        isPagination: action.payload.isPagination,
      };
    }

    case SET_TICKET_FILTER_BY_STATUS_ID: {
      return {
        ...state,
        statusId: action.statusId,
      };
    }
    case WANT_TO_RELOAD_DASHBOARD: {
      return {
        ...state,
        wantToReloadDashboard: action.payload.wantToReload,
      };
    }
    case FILL_USER_INFO: {
      return {
        ...state,
        userInfo: action.payload.userInfo,
      };
    }
    case CLEAR_USER_INFO: {
      return {
        ...state,
        userInfo: {},
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
    case SET_AUTH_TOKEN: {
      return {
        ...state,
        authToken: action.payload.authToken,
      };
    }

    case SET_BEARER_TOKEN: {
      return {
        ...state,
        bearerToken: action.payload.bearerToken,
      };
    }
    case SET_RANGE_FILTER: {
      return {
        ...state,
        range: action.range,
      };
    }
    case LOGOUT_RESPONSE: {
      return {
        ...state,
        logoutResponse: action.response,
        baseUrl: '',
        subscriberId: '',
        accessCode: '',
        bearerToken: '',
        authToken: '',
      };
    }
    case GET_BEARER_TOKEN_RESPONSE: {
      return {
        ...state,
        bearerToken: action.response.data.accessToken,
      };
    }
    case IS_ERROR: {
      return {
        ...state,
        isError: action.payload.isError,
      };
    }
    default: {
      return state;
    }
  }
};

export default globalReducer;
