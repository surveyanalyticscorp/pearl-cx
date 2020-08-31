import {
  BASE_URL,
  CX_HOME,
  CX_DETRACTOR_TICKETS,
  CX_FEEDBACK_LIST,
} from './Constant';
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

  callAPIInternallyWithSuccessAndError(
    token,
    url,
    data,
    successCallback,
    errorCallback,
  ) {
    return WebServiceHandler.postNew(url, {'Auth-Token': token}, data)
      .then(response => {
        //this.updateActionBar(JSON.stringify(response));
        successCallback(response);
      })
      .catch(error => {
        errorCallback(error);
      });
  }

  callAPIInternalWithDispatch(type, token, url, data) {
    return WebServiceHandler.post(url, {'Auth-Token': token}, data)
      .then(response => {
        return response;
      })
      .catch(error => {
        // console.log('ERror- ' + error.message);
        return error;
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

  getCXFeedbackList(token, data, isLoadingTail) {
    if (!isLoadingTail) {
      return this.callAPIInternalWithDispatch(
        CX_FEEDBACK_LIST,
        token,
        BASE_URL + 'a/nativehtml/cx.CXGetAllResponses',
        data,
      );
    } /*else {
      return this.postThroughApiSilently(
        dispatch,
        CX_FEEDBACK_LIST,
        BASE_URL + 'a/nativehtml/cx.CXGetAllResponses',
        data,
      );
    }*/
  }

  getCXDashBoard(token, data = {}, successCallback, errorCallback = () => {}) {
    return this.callAPIInternallyWithSuccessAndError(
      token,
      CX_HOME,
      data,
      successCallback,
      errorCallback,
    );
  }

  getCXDetractorTicket(
    token,
    data = {},
    successCallback,
    errorCallback = () => {},
  ) {
    return this.callAPIInternal(
      token,
      CX_DETRACTOR_TICKETS,
      data,
      successCallback,
      errorCallback,
    );
  }
}

export let apiHandler = new ApiHandler();
