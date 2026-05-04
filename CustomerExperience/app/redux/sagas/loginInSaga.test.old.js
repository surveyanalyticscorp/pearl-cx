import {put} from 'redux-saga/effects';
import {runSaga} from 'redux-saga';
import {
  doAuthenticatePanel,
  doLoginApiCall,
  fetchClfAuth,
  getResetPasswordLink,
  validateResetPasswordLink,
  updatePasswordApiCall,
  doLogoutAction,
  watchAuthenticatePanel,
  watchDoLogin,
  watchClfAuth,
  watchForgotPasswordLink,
  watchValidatePasswordLink,
  watchUpdatePassword,
  watchLogout,
} from './loginInSaga';
import WebServiceHandler from '../../api/WebServiceHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AUTHENTICATE_PANEL_RESPONSE,
  API_ERROR,
  LOGIN_RESPONSE,
  GET_BEARER_TOKEN_RESPONSE,
  VALIDATE_RESET_PASSWORD_LINK_RESPONSE,
  UPDATE_PASSWORD_RESPONSE,
  LOGOUT_RESPONSE,
  RESET_PASSWORD_LINK_RESPONSE,
  GET_LOGIN,
  AUTHENTICATE_PANEL,
  GET_BEARER_TOKEN,
  GET_RESET_PASSWORD_LINK,
  VALIDATE_RESET_PASSWORD_LINK,
  UPDATE_PASSWORD,
  LOGOUT,
} from '../actions/login.actions';
import {showSuccessFlashMessage, showErrorFlashMessage} from '../../Utils/Utility';
import {takeLatest} from 'redux-saga/effects';
import {getClfUrl, getBearerTokenStatic} from '../../Utils/ApiCallUtils';
import {
  CLF_LOGIN,
  CX_GET_RESET_PASSWORD_LINK,
  CX_VALIDATE_PASSWORD_LINK,
  AUTH_UPDATE_PASSWORD,
  CX_LOGOUT,
  ASYNC_CLF_BASE_URL,
  IS_DEV_MODE,
  CLF_BASE_URL,
  ASYNC_BEARER_TOKEN,
  ASYNC_USER_CREDENTIALS,
  AUTH_LOGIN,
  CLF_GET_BASE_URL,
  CLF_LOGOUT,
} from '../../api/Constant';
import {CLEAR_API_ERROR, IS_LOADING} from '../actions';

jest.mock('../../api/WebServiceHandler');
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
}));
jest.mock('../../Utils/Utility', () => ({
  showErrorFlashMessage: jest.fn(),
  showSuccessFlashMessage: jest.fn(),
}));
jest.mock('../../Utils/ApiCallUtils', () => ({
  getBearerTokenStatic: jest.fn(),
  getClfUrl: jest.fn(url => url),
}));

describe('login sagas', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('doAuthenticatePanel saga', () => {
    it('should dispatch AUTHENTICATE_PANEL_RESPONSE on success with mobileAPIURL', async () => {
      const dispatched = [];
      const mockResponse = {body: {mobileAPIURL: 'https://example.com'}};

      WebServiceHandler.postNew.mockResolvedValue(mockResponse);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        doAuthenticatePanel,
        {
          param: {accessCode: '123'},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {
          type: AUTHENTICATE_PANEL_RESPONSE,
          hasMidFix: false,
          response: mockResponse,
        },
      ]);
    });

    it('should dispatch API_ERROR when no mobileAPIURL in response', async () => {
      const dispatched = [];
      const mockResponse = {body: {}};

      WebServiceHandler.postNew.mockResolvedValue(mockResponse);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        doAuthenticatePanel,
        {
          param: {accessCode: '123'},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {
          type: API_ERROR,
          error: mockResponse,
        },
      ]);
    });

    it('should dispatch API_ERROR on failure', async () => {
      const dispatched = [];
      const mockError = {errorAlert: 'Error occurred'};

      WebServiceHandler.postNew.mockRejectedValue(mockError);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        doAuthenticatePanel,
        {
          param: {accessCode: '123'},
        },
      ).toPromise();

      expect(dispatched).toEqual([
        {
          type: API_ERROR,
          error: mockError,
        },
      ]);
      expect(showErrorFlashMessage).toHaveBeenCalledWith(mockError.errorAlert);
    });
  });

  describe('doLoginApiCall saga', () => {
    it('should dispatch LOGIN_RESPONSE on success', async () => {
      const dispatched = [];
      const action = {
        param: {
          emailAddress: 'test@example.com',
          password: 'password',
          accessCode: 'code',
          dataCenter: 'dataCenter',
        },
      };
      const mockLoginResponse = {statusCode: 200};
      const mockClfResponse = {data: {baseUrl: 'http://example.com'}};

      WebServiceHandler.postNew.mockResolvedValue(mockLoginResponse);
      WebServiceHandler.get.mockResolvedValue(mockClfResponse);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        doLoginApiCall,
        action,
      ).toPromise();

      expect(dispatched).toEqual([
        {
          type: LOGIN_RESPONSE,
          response: mockLoginResponse,
          clfResponse: mockClfResponse,
        },
      ]);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        ASYNC_USER_CREDENTIALS,
        JSON.stringify({
          email: action.param.emailAddress,
          password: action.param.password,
          accessCode: action.param.accessCode,
        }),
      );
    });

    it('should dispatch API_ERROR when statusCode is not 200', async () => {
      const dispatched = [];
      const action = {
        param: {
          emailAddress: 'test@example.com',
          password: 'password',
          accessCode: 'code',
          dataCenter: 'dataCenter',
        },
      };
      const mockLoginResponse = {statusCode: 401};
      const mockClfResponse = {data: {baseUrl: 'http://example.com'}};

      WebServiceHandler.postNew.mockResolvedValue(mockLoginResponse);
      WebServiceHandler.get.mockResolvedValue(mockClfResponse);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        doLoginApiCall,
        action,
      ).toPromise();

      expect(dispatched).toEqual([
        {
          type: API_ERROR,
          error: mockLoginResponse,
        },
      ]);
    });

    it('should dispatch API_ERROR on failure', async () => {
      const dispatched = [];
      const action = {
        param: {
          emailAddress: 'test@example.com',
          password: 'password',
          accessCode: 'code',
          dataCenter: 'dataCenter',
        },
      };
      const mockError = {message: 'Login failed'};

      WebServiceHandler.postNew.mockRejectedValue(mockError);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        doLoginApiCall,
        action,
      ).toPromise();

      expect(dispatched).toEqual([
        {
          type: API_ERROR,
          error: mockError,
        },
        {
          type: AUTHENTICATE_PANEL_RESPONSE,
          response: {body: {mobileAPIURL: ''}},
        },
      ]);
    });
  });

  describe('fetchClfAuth saga', () => {
    it('should dispatch GET_BEARER_TOKEN_RESPONSE on success', async () => {
      const dispatched = [];
      const action = {
        param: {
          clfBaseUrl: 'http://example.com',
          emailAddress: 'test@example.com',
          userID: '123',
          feedbackID: '456',
          feedbackApiKey: 'key',
          pushToken: 'push123',
          deviceType: 'ios',
        },
      };
      const mockResponse = {data: {accessToken: 'token123'}};

      WebServiceHandler.postNew.mockResolvedValue(mockResponse);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        fetchClfAuth,
        action,
      ).toPromise();

      expect(dispatched).toEqual([
        {type: GET_BEARER_TOKEN_RESPONSE, response: mockResponse},
      ]);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        ASYNC_BEARER_TOKEN,
        mockResponse.data.accessToken,
      );
    });

    it('should dispatch API_ERROR on failure', async () => {
      const dispatched = [];
      const action = {
        param: {
          clfBaseUrl: 'http://example.com',
          emailAddress: 'test@example.com',
          userID: '123',
          feedbackID: '456',
          feedbackApiKey: 'key',
        },
      };
      const mockError = {message: 'Auth failed'};

      WebServiceHandler.postNew.mockRejectedValue(mockError);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        fetchClfAuth,
        action,
      ).toPromise();

      expect(dispatched).toEqual([
        {
          type: API_ERROR,
          error: mockError,
        },
      ]);
    });
  });

  describe('getResetPasswordLink saga', () => {
    it('should dispatch RESET_PASSWORD_LINK_RESPONSE on success', async () => {
      const dispatched = [];
      const action = {param: {accessCode: '123'}};
      const mockAuthResponse = {body: {mobileAPIURL: 'https://example.com'}};
      const mockResetResponse = {body: {message: 'Reset link sent'}};

      WebServiceHandler.postNew
        .mockResolvedValueOnce(mockAuthResponse)
        .mockResolvedValueOnce(mockResetResponse);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        getResetPasswordLink,
        action,
      ).toPromise();

      expect(dispatched).toEqual([
        {type: IS_LOADING, payload: {isLoading: true}},
        {
          type: RESET_PASSWORD_LINK_RESPONSE,
          response: mockResetResponse.body,
        },
      ]);
    });

    it('should dispatch API_ERROR on failure', async () => {
      const dispatched = [];
      const action = {param: {accessCode: '123'}};
      const mockError = {message: 'Error sending reset link'};

      WebServiceHandler.postNew.mockRejectedValue(mockError);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        getResetPasswordLink,
        action,
      ).toPromise();

      expect(dispatched).toEqual([
        {type: IS_LOADING, payload: {isLoading: true}},
        {
          type: API_ERROR,
          error: mockError,
        },
      ]);
    });
  });

  describe('validateResetPasswordLink saga', () => {
    it('should dispatch VALIDATE_RESET_PASSWORD_LINK_RESPONSE on success', async () => {
      const dispatched = [];
      const action = {param: {token: 'reset-token'}};
      const mockResponse = {body: {valid: true}};

      WebServiceHandler.postNew.mockResolvedValue(mockResponse);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        validateResetPasswordLink,
        action,
      ).toPromise();

      expect(dispatched).toEqual([
        {type: IS_LOADING, payload: {isLoading: true}},
        {
          type: VALIDATE_RESET_PASSWORD_LINK_RESPONSE,
          response: mockResponse.body,
        },
      ]);
    });

    it('should dispatch API_ERROR on failure', async () => {
      const dispatched = [];
      const action = {param: {token: 'reset-token'}};
      const mockError = {message: 'Error validating link'};

      WebServiceHandler.postNew.mockRejectedValue(mockError);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        validateResetPasswordLink,
        action,
      ).toPromise();

      expect(dispatched).toEqual([
        {type: IS_LOADING, payload: {isLoading: true}},
        {
          type: API_ERROR,
          error: mockError,
        },
      ]);
    });
  });

  describe('updatePasswordApiCall saga', () => {
    it('should dispatch UPDATE_PASSWORD_RESPONSE on success', async () => {
      const dispatched = [];
      const action = {param: {password: 'newPassword'}};
      const mockResponse = {success: true};

      WebServiceHandler.postNew.mockResolvedValue(mockResponse);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        updatePasswordApiCall,
        action,
      ).toPromise();

      expect(dispatched).toEqual([
        {type: CLEAR_API_ERROR, payload: {isLoading: true}},
        {
          type: UPDATE_PASSWORD_RESPONSE,
          response: mockResponse,
        },
      ]);
    });

    it('should dispatch API_ERROR on failure', async () => {
      const dispatched = [];
      const action = {param: {password: 'newPassword'}};
      const mockError = {message: 'Error updating password'};

      WebServiceHandler.postNew.mockRejectedValue(mockError);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        updatePasswordApiCall,
        action,
      ).toPromise();

      expect(dispatched).toEqual([
        {type: CLEAR_API_ERROR, payload: {isLoading: true}},
        {
          type: API_ERROR,
          error: mockError,
        },
      ]);
    });
  });

  describe('doLogoutAction saga', () => {
    it('should dispatch LOGOUT_RESPONSE on success', async () => {
      const dispatched = [];
      const action = {token: 'token123', param: {pushToken: 'push123'}};
      const mockCxResponse = {success: true};
      const mockClfResponse = {success: true};

      WebServiceHandler.postNew
        .mockResolvedValueOnce(mockCxResponse)
        .mockResolvedValueOnce(mockClfResponse);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        doLogoutAction,
        action,
      ).toPromise();

      expect(dispatched).toEqual([
        {
          type: LOGOUT_RESPONSE,
          response: mockCxResponse,
          clfResponse: mockClfResponse,
        },
      ]);
    });

    it('should handle errors gracefully without dispatching API_ERROR', async () => {
      const dispatched = [];
      const action = {token: 'token123', param: {pushToken: 'push123'}};
      const mockError = {message: 'Error logging out'};

      WebServiceHandler.postNew.mockRejectedValue(mockError);

      await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        doLogoutAction,
        action,
      ).toPromise();

      expect(dispatched).toEqual([]);
    });
  });

  describe('Watcher Functions', () => {
    describe('watchAuthenticatePanel', () => {
      it('should watch AUTHENTICATE_PANEL and call doAuthenticatePanel', () => {
        const generator = watchAuthenticatePanel();
        expect(generator.next().value).toEqual(
          takeLatest(AUTHENTICATE_PANEL, doAuthenticatePanel),
        );
      });
    });

    describe('watchDoLogin', () => {
      it('should watch GET_LOGIN and call doLoginApiCall', () => {
        const generator = watchDoLogin();
        expect(generator.next().value).toEqual(
          takeLatest(GET_LOGIN, doLoginApiCall),
        );
      });
    });

    describe('watchClfAuth', () => {
      it('should watch GET_BEARER_TOKEN and call fetchClfAuth', () => {
        const generator = watchClfAuth();
        expect(generator.next().value).toEqual(
          takeLatest(GET_BEARER_TOKEN, fetchClfAuth),
        );
      });
    });

    describe('watchForgotPasswordLink', () => {
      it('should watch GET_RESET_PASSWORD_LINK and call getResetPasswordLink', () => {
        const generator = watchForgotPasswordLink();
        expect(generator.next().value).toEqual(
          takeLatest(GET_RESET_PASSWORD_LINK, getResetPasswordLink),
        );
      });
    });

    describe('watchValidatePasswordLink', () => {
      it('should watch VALIDATE_RESET_PASSWORD_LINK and call validateResetPasswordLink', () => {
        const generator = watchValidatePasswordLink();
        expect(generator.next().value).toEqual(
          takeLatest(VALIDATE_RESET_PASSWORD_LINK, validateResetPasswordLink),
        );
      });
    });

    describe('watchUpdatePassword', () => {
      it('should watch UPDATE_PASSWORD and call updatePasswordApiCall', () => {
        const generator = watchUpdatePassword();
        expect(generator.next().value).toEqual(
          takeLatest(UPDATE_PASSWORD, updatePasswordApiCall),
        );
      });
    });

    describe('watchLogout', () => {
      it('should watch LOGOUT and call doLogoutAction', () => {
        const generator = watchLogout();
        expect(generator.next().value).toEqual(
          takeLatest(LOGOUT, doLogoutAction),
        );
      });
    });
  });
  });
});
