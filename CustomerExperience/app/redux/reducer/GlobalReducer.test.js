import globalReducer from './GlobalReducer';
import {
  IS_DEV_MODE,
  DEV_BASE_URL,
  CLF_BASE_URL,
  BASE_URL_MID_FIX,
  BASE_URL_NEW_MID_FIX,
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
  SET_IS_FIRST_TIME,
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
  isFirstTime: true,
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

// write testcases for the globalReducer.js file
describe('Global Reducer', () => {
  it('should return the initial state', () => {
    expect(globalReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle AUTHENTICATE_PANEL_RESPONSE', () => {
    expect(
      globalReducer(initialState, {
        type: AUTHENTICATE_PANEL_RESPONSE,
        response: {
          body: {
            userID: 'userID',
            mobileAPIURL: 'mobileAPIURL',
            dataCenter: 'dataCenter',
            accessCode: 'accessCode',
          },
        },
      }),
    ).toEqual({
      ...initialState,
      baseUrl: IS_DEV_MODE
        ? DEV_BASE_URL
        : 'mobileAPIURL' + BASE_URL_NEW_MID_FIX,
      subscriberId: JSON.stringify('userID'),
      dataCenter: 'dataCenter',
      accessCode: 'accessCode',
    });
  });

  it('should handle UPDATE_BASE_URL', () => {
    expect(
      globalReducer(
        {...initialState, baseUrl: 'baseUrl'},
        {
          type: UPDATE_BASE_URL,
          baseUrl: 'baseUrl',
        },
      ),
    ).toEqual({
      ...initialState,
      baseUrl: 'baseUrl',
    });
  });

  it('should handle SET_BASE_URL', () => {
    expect(
      globalReducer(initialState, {
        type: SET_BASE_URL,
        baseUrl: 'baseUrl',
      }),
    ).toEqual({
      ...initialState,
      baseUrl: 'baseUrl',
    });
  });

  it('should handle SET_ACCESS_CODE', () => {
    expect(
      globalReducer(initialState, {
        type: SET_ACCESS_CODE,
        accessCode: 'accessCode',
      }),
    ).toEqual({
      ...initialState,
      accessCode: 'accessCode',
    });
  });

  it('should handle UPDATE_BASE_CLF_URL', () => {
    expect(
      globalReducer(initialState, {
        type: UPDATE_BASE_CLF_URL,
        clfBaseUrl: 'clfBaseUrl',
      }),
    ).toEqual({
      ...initialState,
      clfBaseUrl: 'clfBaseUrl',
    });
  });

  it('should handle SET_IS_FIRST_TIME', () => {
    expect(
      globalReducer(initialState, {
        type: SET_IS_FIRST_TIME,
        isFirstTime: true,
      }),
    ).toEqual({
      ...initialState,
      isFirstTime: true,
    });
  });

  it('should handle LOGIN_RESPONSE', () => {
    expect(
      globalReducer(initialState, {
        type: LOGIN_RESPONSE,
        response: {
          authToken: 'authToken',
          body: {
            languageCode: 'languageCode',
          },
        },
        clfResponse: {
          data: {
            baseUrl: 'https://clf-backend.questionpro.com/api',
          },
        },
      }),
    ).toEqual({
      ...initialState,
      authToken: 'authToken',
      userInfo: {
        languageCode: 'languageCode',
      },
      isLoading: false,
      clfBaseUrl: 'https://clf-backend.questionpro.com/api',
    });
  });

  it('should handle SET_LANGUAGE_INFO', () => {
    expect(
      globalReducer(initialState, {
        type: SET_LANGUAGE_INFO,
        payload: {
          languageInfo: {
            languageCode: 'languageCode',
          },
        },
      }),
    ).toEqual({
      ...initialState,
      languageCode: 'languageCode',
    });
  });

  it('should handle SET_DYNAMIC_LINK', () => {
    expect(
      globalReducer(initialState, {
        type: SET_DYNAMIC_LINK,
        payload: 'dynamicLink',
      }),
    ).toEqual({
      ...initialState,
      dynamicLink: 'dynamicLink',
    });
  });

  it('should handle SET_USER_DETAILS_FOR_RESET_PASSWORD', () => {
    expect(
      globalReducer(initialState, {
        type: SET_USER_DETAILS_FOR_RESET_PASSWORD,
        payload: 'userDetailsForResetPassword',
      }),
    ).toEqual({
      ...initialState,
      userDetailsForResetPassword: 'userDetailsForResetPassword',
    });
  });

  it('should handle VALIDATE_RESET_PASSWORD_LINK_RESPONSE', () => {
    expect(
      globalReducer(initialState, {
        type: VALIDATE_RESET_PASSWORD_LINK_RESPONSE,
        response: 'data',
      }),
    ).toEqual({
      ...initialState,
      validatePasswordLinkResponse: 'data',
      isLoading: false,
    });
  });

  it('should handle UPDATE_PASSWORD_RESPONSE', () => {
    expect(
      globalReducer(initialState, {
        type: UPDATE_PASSWORD_RESPONSE,
        response: 'data',
      }),
    ).toEqual({
      ...initialState,
      userDetailsForResetPassword: {},
      updatePasswordResponse: 'data',
      isLoading: false,
      baseUrl: '',
    });
  });

  it('should handle IS_LOADING', () => {
    expect(
      globalReducer(initialState, {
        type: IS_LOADING,
        payload: {
          isLoading: true,
        },
      }),
    ).toEqual({
      ...initialState,
      isLoading: true,
    });
  });

  it('should handle IS_RESPONSE_LOADING', () => {
    expect(
      globalReducer(initialState, {
        type: IS_RESPONSE_LOADING,
        payload: {
          isLoading: true,
        },
      }),
    ).toEqual({
      ...initialState,
      isResponseLoading: true,
    });
  });

  it('should handle IS_TICKET_LOADING', () => {
    expect(
      globalReducer(initialState, {
        type: IS_TICKET_LOADING,
        payload: {
          isLoading: true,
        },
      }),
    ).toEqual({
      ...initialState,
      isTicketLoading: true,
    });
  });

  it('should handle IS_SEGMENT_LOADING', () => {
    expect(
      globalReducer(initialState, {
        type: IS_SEGMENT_LOADING,
        payload: {
          isLoading: true,
        },
      }),
    ).toEqual({
      ...initialState,
      isSegmentLoading: true,
    });
  });

  it('should handle IS_PAGINATION', () => {
    expect(
      globalReducer(initialState, {
        type: IS_PAGINATION,
        payload: {
          isPagination: true,
        },
      }),
    ).toEqual({
      ...initialState,
      isPagination: true,
    });
  });

  it('should handle SET_TICKET_FILTER_BY_STATUS_ID', () => {
    expect(
      globalReducer(initialState, {
        type: SET_TICKET_FILTER_BY_STATUS_ID,
        statusId: 'statusId',
      }),
    ).toEqual({
      ...initialState,
      statusId: 'statusId',
    });
  });

  it('should handle WANT_TO_RELOAD_DASHBOARD', () => {
    expect(
      globalReducer(initialState, {
        type: WANT_TO_RELOAD_DASHBOARD,
        payload: {
          wantToReload: true,
        },
      }),
    ).toEqual({
      ...initialState,
      wantToReloadDashboard: true,
    });
  });

  it('should handle FILL_USER_INFO', () => {
    expect(
      globalReducer(initialState, {
        type: FILL_USER_INFO,
        payload: {
          userInfo: 'userInfo',
        },
      }),
    ).toEqual({
      ...initialState,
      userInfo: 'userInfo',
    });
  });

  it('should handle CLEAR_USER_INFO', () => {
    expect(
      globalReducer(initialState, {
        type: CLEAR_USER_INFO,
      }),
    ).toEqual({
      ...initialState,
      userInfo: {},
    });
  });

  it('should handle API_ERROR', () => {
    expect(
      globalReducer(initialState, {
        type: API_ERROR,
        error: 'error',
      }),
    ).toEqual({
      ...initialState,
      isError: true,
      errorMessage: 'error',
      isLoading: false,
    });
  });

  it('should handle CLEAR_API_ERROR', () => {
    expect(
      globalReducer(initialState, {
        type: CLEAR_API_ERROR,
        payload: {
          isLoading: true,
        },
      }),
    ).toEqual({
      ...initialState,
      isError: false,
      errorMessage: '',
      isLoading: true,
    });
  });

  it('should handle SET_AUTH_TOKEN', () => {
    expect(
      globalReducer(initialState, {
        type: SET_AUTH_TOKEN,
        payload: {
          authToken: 'authToken',
        },
      }),
    ).toEqual({
      ...initialState,
      authToken: 'authToken',
    });
  });

  it('should handle SET_BEARER_TOKEN', () => {
    expect(
      globalReducer(initialState, {
        type: SET_BEARER_TOKEN,
        payload: {
          bearerToken: 'bearerToken',
        },
      }),
    ).toEqual({
      ...initialState,
      bearerToken: 'bearerToken',
    });
  });

  it('should handle SET_RANGE_FILTER', () => {
    expect(
      globalReducer(initialState, {
        type: SET_RANGE_FILTER,
        range: 'range',
      }),
    ).toEqual({
      ...initialState,
      range: 'range',
    });
  });

  it('should handle LOGOUT_RESPONSE', () => {
    expect(
      globalReducer(initialState, {
        type: LOGOUT_RESPONSE,
        response: 'data',
      }),
    ).toEqual({
      ...initialState,
      logoutResponse: 'data',
      baseUrl: '',
      clfBaseUrl: '',
      subscriberId: '',
      accessCode: '',
      bearerToken: '',
      authToken: '',
    });
  });

  it('should handle GET_BEARER_TOKEN_RESPONSE', () => {
    expect(
      globalReducer(initialState, {
        type: GET_BEARER_TOKEN_RESPONSE,
        response: {
          data: {
            accessToken: 'accessToken',
          },
        },
      }),
    ).toEqual({
      ...initialState,
      bearerToken: 'accessToken',
    });
  });

  it('should handle IS_ERROR', () => {
    expect(
      globalReducer(initialState, {
        type: IS_ERROR,
        payload: {
          isError: true,
        },
      }),
    ).toEqual({
      ...initialState,
      isError: true,
    });
  });
});
