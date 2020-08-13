import globalReducer from './GlobalReducer';

describe('globalReducer', () => {
  it('should return the initial state', () => {
    expect(
      globalReducer(
        {
          isLoading: false,
          isLogin: false,
          isError: false,
          errorMessage: '',
          userInfo: {},
          forgotPasswordResponse: {},
          validateOtpResponse: {},
          updatePasswordResponse: {},
        },
        {},
      ),
    ).toEqual({
      isLoading: false,
      isLogin: false,
      isError: false,
      errorMessage: '',
      userInfo: {},
      forgotPasswordResponse: {},
      validateOtpResponse: {},
      updatePasswordResponse: {},
    });
  });

  it('should handle "GET_NEWS" action', () => {
    expect(globalReducer({}, {type: 'LOGIN_RESPONSE'})).toEqual({
      isLoading: false,
      userInfo: undefined,
    });
  });

});
