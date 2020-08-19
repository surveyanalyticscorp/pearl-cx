import globalReducer from '../redux/reducer/GlobalReducer';

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

      it('should handle "LOGIN_RESPONSE" action', () => {
        expect(globalReducer({}, {type: 'LOGIN_RESPONSE'})).toEqual({
          isLoading: false,
          userInfo: undefined,
        });
      });

    it('should handle "FORGOT_PSWD_OTP_RESPONSE" action', () => {
        expect(globalReducer({}, {type: 'FORGOT_PSWD_OTP_RESPONSE'})).toEqual({
            isLoading: false,
            userInfo: undefined,
        });
    });


    it('should handle "VALIDATE_USER_OTP_RESPONSE" action', () => {
        expect(globalReducer({}, {type: 'VALIDATE_USER_OTP_RESPONSE'})).toEqual({
            validateOtpResponse: undefined,
        });
    });

    it('should handle "UPDATE_PASSWORD_RESPONSE" action', () => {
        expect(globalReducer({}, {type: 'UPDATE_PASSWORD_RESPONSE'})).toEqual({
            isLoading: false,
            updatePasswordResponse: undefined,
        });
    });

    it('should handle "IS_LOADING" action', () => {
        expect(globalReducer({}, {type: 'IS_LOADING',payload:{isLoading: true}})).toEqual({
            isLoading: true,
        });
    });

    it('should handle "IS_LOGIN" action', () => {
        expect(globalReducer({}, {type: 'IS_LOGIN',payload:{isLogin: true}})).toEqual({
            isLogin: true,
        });
    });

    it('should handle "FILL_USER_INFO" action', () => {
        let mockResponse = {
            firstName: 'sa',
            lastName: 'sh',
            organizationName: 'Untitled - Company Name'
        };
        expect(globalReducer({}, {type: 'FILL_USER_INFO',payload:{userInfo: mockResponse}})).toEqual({
            userInfo: mockResponse,
        });
    });

    it('should handle "CLEAR_USER_INFO" action', () => {
        expect(globalReducer({}, {type: 'CLEAR_USER_INFO'})).toEqual({
            userInfo: {},
        });
    });

    it('should handle "API_ERROR" action', () => {
        const mockResponse = {
            errorAlert: "Invalid company code.",
            statusCode: 400,
            uniqueAPICallIdentifier: 0,
            validationErrors: []
        };
        expect(globalReducer({}, {type: 'API_ERROR',error: mockResponse})).toEqual({
            isError: true,
            errorMessage: mockResponse,
            isLoading: false,
        });
    });

    it('should handle "CLEAR_API_ERROR" action', () => {
        expect(globalReducer({}, {type: 'CLEAR_API_ERROR',payload:{isLoading: true}})).toEqual({
            isError: false,
            errorMessage: '',
            isLoading: true,
        });
    });



});
