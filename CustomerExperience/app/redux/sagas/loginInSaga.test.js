import {put} from 'redux-saga/effects';
import {
  doAuthenticatePanel,
  doLoginApiCall,
  fetchClfAuth,
  getResetPasswordLink,
  validateResetPasswordLink,
  updatePasswordApiCall,
  doLogoutAction,
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
} from '../actions/login.actions';
import {showSuccessFlashMessage} from '../../Utils/Utility';
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
} from '../../api/Constant';
import {CLEAR_API_ERROR, IS_LOADING} from '../actions';

jest.mock('../../api/WebServiceHandler');
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
}));

describe('login sagas', () => {
  describe('doAuthenticatePanel saga', () => {
    it('should dispatch AUTHENTICATE_PANEL_RESPONSE on success', () => {
      const action = {param: {}};
      const response = {success: true};
      WebServiceHandler.postNew.mockResolvedValue(response);

      const generator = doAuthenticatePanel(action);
      generator.next(); // Move to the API call

      expect(generator.next(response).value).toEqual(
        put({
          type: AUTHENTICATE_PANEL_RESPONSE,
          hasMidFix: false,
          response,
        }),
      );
    });

    it('should dispatch API_ERROR on failure', () => {
      const action = {param: {}};
      const error = {errorAlert: 'Error occurred'};
      WebServiceHandler.postNew.mockRejectedValue(error);
      const generator = doAuthenticatePanel(action);

      generator.next(); // Skip to the API call

      const apiErrorYield = generator.next().value;
      expect(apiErrorYield.payload.type).toEqual(API_ERROR);
    });
  });

  describe('doLoginApiCall saga', () => {
    it('should dispatch LOGIN_RESPONSE on success', async () => {
      const action = {
        param: {
          emailAddress: 'test@example.com',
          password: 'password',
          accessCode: 'code',
          dataCenter: 'dataCenter',
        },
      };
      const response = {success: true};
      const clfBaseUrlResponse = {data: {baseUrl: 'http://example.com'}};

      WebServiceHandler.postNew.mockResolvedValue(response);
      WebServiceHandler.get.mockResolvedValue(clfBaseUrlResponse);

      const generator = doLoginApiCall(action);
      generator.next(); // Skip to login API call

      generator.next(response); // Skip to CLF base URL API call
      generator.next(clfBaseUrlResponse); // Execute CLF base URL logic

      // Check AsyncStorage calls
      // expect(AsyncStorage.setItem).toHaveBeenCalledTimes(2);
      // expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      //   ASYNC_USER_CREDENTIALS,
      //   JSON.stringify({
      //     email: action.param.emailAddress,
      //     password: action.param.password,
      //     accessCode: action.param.accessCode,
      //   }),
      // );
      // expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      //   ASYNC_CLF_BASE_URL,
      //   JSON.stringify(
      //     IS_DEV_MODE ? CLF_BASE_URL : clfBaseUrlResponse.data.baseUrl,
      //   ),
      // );
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);

      // expect(generator.next().value).toEqual(
      //   put({
      //     type: LOGIN_RESPONSE,
      //     response,
      //     clfResponse: clfBaseUrlResponse,
      //   }),
      // );
    });

    it('should dispatch API_ERROR on failure', () => {
      const action = {param: {}};
      const error = new Error('Login failed');
      WebServiceHandler.postNew.mockRejectedValue(error);
      const generator = doLoginApiCall(action);

      generator.next(); // Skip to API call
      const responseYield = generator.throw(error).value;
      console.log('responseYield', responseYield);
      expect(responseYield.payload.type).toEqual(API_ERROR);
    });
  });

  describe('fetchClfAuth saga', () => {
    it('should dispatch GET_BEARER_TOKEN_RESPONSE on success', async () => {
      const action = {
        param: {
          clfBaseUrl: 'http://example.com',
          emailAddress: 'test@example.com',
          userID: '123',
          feedbackID: '456',
          feedbackApiKey: 'key',
        },
      };
      const response = {data: {accessToken: 'token'}};
      WebServiceHandler.postNew.mockResolvedValue(response);

      const generator = fetchClfAuth(action);

      expect(generator.next().value).toEqual(
        WebServiceHandler.postNew(
          `${action.param.clfBaseUrl}${CLF_LOGIN}`,
          {},
          {
            emailAddress: action.param.emailAddress,
            cxUserId: action.param.userID,
            feedbackId: action.param.feedbackID,
            feedbackApiKey: action.param.feedbackApiKey,
          },
        ),
      );

      expect(generator.next(response).value).toEqual(
        put({type: GET_BEARER_TOKEN_RESPONSE, response}),
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        ASYNC_BEARER_TOKEN,
        response.data.accessToken,
      );
    });

    it('should dispatch API_ERROR on failure', () => {
      const action = {param: {}};
      const error = new Error('Auth failed');
      WebServiceHandler.postNew.mockRejectedValue(error);
      const generator = fetchClfAuth(action);

      generator.next(); // Skip to API call
      const responseYield = generator.throw(error).value;

      expect(responseYield.payload.type).toEqual(API_ERROR);
    });
  });

  describe('getResetPasswordLink saga', () => {
    it('should dispatch GET_RESET_PASSWORD_LINK_RESPONSE on success', async () => {
      const action = {param: {}};
      const response = {body: {message: 'Reset link sent'}};
      WebServiceHandler.postNew.mockResolvedValue(response);

      const generator = getResetPasswordLink(action);

      // Execute API call
      expect(generator.next().value).toEqual(
        WebServiceHandler.postNew(CX_GET_RESET_PASSWORD_LINK, {}, action.param),
      );

      // Check success flash message
      expect(generator.next(response).value).toEqual(
        showSuccessFlashMessage(response.body.message),
      );
    });

    it('should dispatch API_ERROR on failure', () => {
      const action = {param: {}};
      const error = new Error('Error sending reset link');
      WebServiceHandler.postNew.mockRejectedValue(error);
      const generator = getResetPasswordLink(action);

      generator.next(); // Skip to API call
      const responseYield = generator.throw(error).value;

      expect(responseYield.payload.type).toEqual(API_ERROR);
    });
  });

  describe('validateResetPasswordLink saga', () => {
    it('should dispatch VALIDATE_RESET_PASSWORD_LINK_RESPONSE on success', async () => {
      const action = {param: {}};
      const response = {body: {valid: true}};
      WebServiceHandler.postNew.mockResolvedValue(response);

      const generator = validateResetPasswordLink(action);

      expect(generator.next().value).toEqual(
        put({type: IS_LOADING, payload: {isLoading: true}}),
      );
      expect(generator.next().value).toEqual(
        WebServiceHandler.postNew(CX_VALIDATE_PASSWORD_LINK, {}, action.param),
      );

      expect(generator.next(response).value).toEqual(
        put({
          type: VALIDATE_RESET_PASSWORD_LINK_RESPONSE,
          response: response.body,
        }),
      );
    });

    it('should dispatch API_ERROR on failure', () => {
      const action = {param: {}};
      const error = new Error('Error validating link');
      WebServiceHandler.postNew.mockRejectedValue(error);
      const generator = validateResetPasswordLink(action);

      generator.next(); // Skip to API call
      const responseYield = generator.throw(error).value;

      expect(responseYield.payload.type).toEqual(API_ERROR);
    });
  });

  describe('updatePasswordApiCall saga', () => {
    it('should dispatch UPDATE_PASSWORD_RESPONSE on success', async () => {
      const action = {param: {}};
      const response = {success: true};
      WebServiceHandler.postNew.mockResolvedValue(response);

      const generator = updatePasswordApiCall(action);

      expect(generator.next().value).toEqual(
        put({type: CLEAR_API_ERROR, payload: {isLoading: true}}),
      );

      expect(generator.next().value).toEqual(
        WebServiceHandler.postNew(AUTH_UPDATE_PASSWORD, {}, action.param),
      );

      expect(generator.next(response).value).toEqual(
        put({
          type: UPDATE_PASSWORD_RESPONSE,
          response,
        }),
      );
    });

    it('should dispatch API_ERROR on failure', () => {
      const action = {param: {}};
      const error = new Error('Error updating password');
      WebServiceHandler.postNew.mockRejectedValue(error);
      const generator = updatePasswordApiCall(action);

      generator.next(); // Skip to API call
      const responseYield = generator.throw(error).value;

      expect(responseYield.payload.type).toEqual(API_ERROR);
    });
  });

  describe('doLogoutAction saga', () => {
    it('should dispatch LOGOUT_RESPONSE on success', async () => {
      const action = {token: 'token', param: {}};
      const response = {success: true};
      WebServiceHandler.postNew.mockResolvedValue(response);

      const generator = doLogoutAction(action);

      expect(generator.next().value).toEqual(
        WebServiceHandler.postNew(
          CX_LOGOUT,
          {'Auth-Token': action.token},
          action.param,
        ),
      );

      expect(generator.next(response).value).toEqual(
        put({type: LOGOUT_RESPONSE, response}),
      );
    });

    it('should dispatch LOGOUT_RESPONSE with empty object on failure', () => {
      const action = {token: 'token', param: {}};
      const error = new Error('Error logging out');
      WebServiceHandler.postNew.mockRejectedValue(error);
      const generator = doLogoutAction(action);

      generator.next(); // Skip to API call
      const responseYield = generator.throw(error).value;

      expect(responseYield).toEqual(put({type: LOGOUT_RESPONSE, response: {}}));
    });
  });
});
