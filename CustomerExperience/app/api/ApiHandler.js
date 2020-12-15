import {CX_DETRACTOR_TICKETS, CX_GET_ALL_RESPONSE, CX_GET_NOTIFICATION_LIST} from './Constant';
import WebServiceHandler from './WebServiceHandler';

class ApiHandler {
  callAPIInternal(token, url, data, successCallback, errorCallback) {
    return WebServiceHandler.postNew(url, {'Auth-Token': token}, data)
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

  getNotificationData(header,successCallback, errorCallback = () => {}){
    return WebServiceHandler.get(CX_GET_NOTIFICATION_LIST, header, {}).then(response => {
        if(response && response.statusCode === 200) {
            successCallback(response.body);
        }
    })
        .catch(error => {
          errorCallback(error);
        });
  }

}

export let apiHandler = new ApiHandler();
