import {BASE_URL} from './types';
import WebServiceHandler from './WebServiceHandler';

class ApiHandler {
  callAPIInternal(token, url, data, successCallback, errorCallback) {
    return WebServiceHandler.post(url, {'Auth-Token': token}, data)
      .then(response => {
        //this.updateActionBar(JSON.stringify(response));
        successCallback(response);
      })
      .catch(error => {
        errorCallback(error);
      });
  }

  login(data, successCallback, errorCallback = () => {}) {
    return this.callAPIInternal(
      '',
      BASE_URL + 'a/nativehtml/cx.auth.CXLogin',
      data,
      successCallback,
      errorCallback,
    );
  }

  forgotPassword(data, successCallback, errorCallback = () => {}) {
    return this.callAPIInternal(
      '',
      BASE_URL + 'a/nativehtml/cx.auth.CXForgotPasswordOTP',
      data,
      successCallback,
      errorCallback,
    );
  }

  getCXDashBoard(token, successCallback, data = {}, errorCallback = () => {}) {
    return this.callAPIInternal(
      token,
      BASE_URL + 'a/nativehtml/cx.CXHome',
      data,
      successCallback,
      errorCallback,
    );
  }

  getSurveyDashboard(
    token,
    data = {},
    successCallback,
    errorCallback = () => {},
  ) {
    return this.callAPIInternal(
      token,
      BASE_URL + 'a/nativehtml/survey.dashboard.SurveyDashboard',
      successCallback,
      data,
      errorCallback,
    );
  }
}

export let apiHandler = new ApiHandler();
