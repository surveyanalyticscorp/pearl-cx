import {
    FILL_USER_INFO,
    IS_LOADING,
    LOGIN_RESPONSE,
    API_ERROR,
    CLEAR_API_ERROR,
    FORGOT_PSWD_OTP_RESPONSE,
    VALIDATE_USER_OTP_RESPONSE,
    UPDATE_PASSWORD_RESPONSE,
    CLEAR_USER_INFO, SET_AUTH_TOKEN, SET_RANGE_FILTER,
} from '../actions/index';

const initialState = {
    range:{
        type: 1,
        startDate: '',
        endDate: ''
    },
    isLoading: false,
    isError: false,
    userInfo: {},
    authToken:'',
    errorMessage: '',
    forgotPasswordResponse: {},
    validateOtpResponse: {},
    updatePasswordResponse: {},
};

const globalReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_RESPONSE: {
            return {
                ...state,
                authToken:action.response.authToken,
                userInfo: action.response.body,
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

        case UPDATE_PASSWORD_RESPONSE: {
            return {
                ...state,
                updatePasswordResponse: action.response,
                isLoading: false,
            };
        }

        case IS_LOADING: {
            return {...state, isLoading: action.payload.isLoading};
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
        default: {
            return state;
        }
    }
};

export default globalReducer;
