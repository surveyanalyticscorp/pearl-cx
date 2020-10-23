import {CX_DETRACTOR_TICKETS, CX_GET_ALL_RESPONSE} from './Constant';
import WebServiceHandler from './WebServiceHandler';

class ApiHandler {
  callAPIInternal(token, url, data, successCallback, errorCallback) {
    return WebServiceHandler.post(url, {'Auth-Token': token}, data)
        .then(response => {
          successCallback(response);
        })
        .catch(error => {
          errorCallback(error);
        });
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

  getFeedbackResponseList(token,
                          data = {},
                          successCallback,
                          errorCallback = () => {}) {
    return this.callAPIInternal(
        token,
        CX_GET_ALL_RESPONSE,
        data,
        successCallback,
        errorCallback,
    );
  }
}

export let apiHandler = new ApiHandler();
