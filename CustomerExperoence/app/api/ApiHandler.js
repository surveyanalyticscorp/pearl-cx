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

  login(data, token, successCallback, errorCallback = () => {}) {
    return this.callAPIInternal(
      token,
      BASE_URL + 'a/nativehtml/cx.auth.CXLogin',
      data,
      successCallback,
      errorCallback,
    );
  }

  getCXDashBoard(successCallback, data, errorCallback = () => {}) {
    return this.callAPI(
      BASE_URL + 'a/nativehtml/cx.CXHome',
      successCallback,
      data,
      errorCallback,
    );
  }
}

export let apiHandler = new ApiHandler();
