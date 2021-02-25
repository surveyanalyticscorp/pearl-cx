import {
    FILL_USER_INFO,
    IS_LOADING,
    API_ERROR,
    CLEAR_API_ERROR,
    CLEAR_USER_INFO,
    SET_AUTH_TOKEN,
    SET_RANGE_FILTER,
    SET_USER_DETAILS_FOR_RESET_PASSWORD,
    SET_DYNAMIC_LINK, WANT_TO_RELOAD_DASHBOARD,
} from '../actions';
import {
    AUTHENTICATE_PANEL_RESPONSE,
    LOGIN_RESPONSE,
    LOGOUT_RESPONSE,
    UPDATE_PASSWORD_RESPONSE,
    VALIDATE_RESET_PASSWORD_LINK_RESPONSE,
} from '../actions/login.actions';

const initialState = {
    range:{
        type: 1,
        startDate: '',
        endDate: ''
    },
    isLoading: false,
    wantToReloadDashboard: true,
    isError: false,
    baseUrl: '',
    userInfo: {},
    authToken:'',
    errorMessage: '',
    dynamicLink:'',
    userDetailsForResetPassword:{},
    validatePasswordLinkResponse:{},
    updatePasswordResponse: {},
    pushToken:'',
    logoutResponse:{}
};

const globalReducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE_PANEL_RESPONSE: {
            return{
                ...state,
                baseUrl: action.response.body.mobileAPIURL,
            }
        }
        case LOGIN_RESPONSE: {
            return {
                ...state,
                authToken:action.response.authToken,
                userInfo: action.response.body,
                isLoading: false,
            };
        }
        case SET_DYNAMIC_LINK: {
            return {
                ...state,
                dynamicLink: action.payload
            }
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
            }
        }
        case UPDATE_PASSWORD_RESPONSE: {
            return {
                ...state,
                userDetailsForResetPassword: {},
                updatePasswordResponse: action.response,
                isLoading: false,
            };
        }
        case IS_LOADING: {
            return {...state, isLoading: action.payload.isLoading};
        }
        case WANT_TO_RELOAD_DASHBOARD: {
            return {...state, wantToReloadDashboard: action.payload.wantToReload};
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
                authToken: action.payload.authToken
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
            };
        }
        default: {
            return state;
        }
    }
};

export default globalReducer;
