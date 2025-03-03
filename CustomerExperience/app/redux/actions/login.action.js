export const LOGIN_EMAIL = 'LOGIN_EMAIL';
export const LOGIN_PASSWORD = 'LOGIN_PASSWORD';
export const LOGIN_ACCESS_CODE = 'LOGIN_ACCESS_CODE';
export const LOGIN_USER = 'LOGIN_USER';
export const CLEAR_LOGIN_USER = 'CLEAR_LOGIN_USER';
export const setLoginEmail = email => {
  return {
    type: LOGIN_EMAIL,
    payload: email,
  };
};

export const setLoginPassword = password => {
  return {
    type: LOGIN_PASSWORD,
    payload: password,
  };
};

export const setLoginAccessCode = accessCode => {
  return {
    type: LOGIN_ACCESS_CODE,
    payload: accessCode,
  };
};

export const setLoginUser = user => {
  return {
    type: LOGIN_USER,
    payload: user,
  };
};

export const clearLoginUser = () => {
  return {
    type: CLEAR_LOGIN_USER,
  };
};
