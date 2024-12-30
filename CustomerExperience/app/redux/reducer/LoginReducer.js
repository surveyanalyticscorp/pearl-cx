import {
  LOGIN_EMAIL,
  LOGIN_PASSWORD,
  LOGIN_ACCESS_CODE,
  LOGIN_USER,
  CLEAR_LOGIN_USER,
} from '../actions/login.action';

const initialState = {
  email: '',
  password: '',
  accessCode: '',
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_EMAIL: {
      return {
        ...state,
        email: action.payload,
      };
    }
    case LOGIN_PASSWORD: {
      return {
        ...state,
        password: action.payload,
      };
    }
    case LOGIN_ACCESS_CODE: {
      return {
        ...state,
        accessCode: action.payload,
      };
    }
    case LOGIN_USER: {
      return {
        email: action.payload?.email,
        password: action.payload?.password,
        accessCode: action.payload?.accessCode,
      };
    }
    case CLEAR_LOGIN_USER: {
      return {
        ...state,
        password: '',
        email: '',
        accessCode: '',
      };
    }
    default: {
      return state;
    }
  }
};

export default loginReducer;
