import {
  BASE_URL,
  LOADING_PROGRESS,
  LOADING_ERROR,
  CX_FEEDBACK_LIST,
} from './types';
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

  callAPIInternalWithDispatch(type, token, url, data) {
    return WebServiceHandler.post(url, {'Auth-Token': token}, data)
      .then(response => {
        //dispatch({type: type, data: response, requestData: data});
        //dispatch({type: LOADING_PROGRESS, isLoading: false});
        //dispatch({type: LOADING_ERROR, error: false});
        return response;
      })
      .catch(error => {
        console.log('ERror- ' + error.message);
        //dispatch({type: LOADING_PROGRESS, isLoading: false});
        //dispatch({type: LOADING_ERROR, error: error});
        //dispatch({type: type});
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

  getCXDashBoard(token, successCallback, data = {}, errorCallback = () => {}) {
    return this.callAPIInternal(
      token,
      BASE_URL + 'a/nativehtml/cx.CXHome',
      data,
      successCallback,
      errorCallback,
    );
  }
}

export let apiHandler = new ApiHandler();
