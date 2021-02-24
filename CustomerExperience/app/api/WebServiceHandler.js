const HTTP_FAILED =
  'There was an error processing this request. Please try again.';

export default class WebServiceHandler {
  static header(headerParam) {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    Object.keys(headerParam).forEach(function(key) {
      headers.append(key, headerParam[key]);
    });
    return headers;
  }

  // HTTP request parameter Generator.
  static parameter(parameter) {
    if (!parameter) {
      return '';
    }
    let urlParameter = '?';
    Object.keys(parameter).forEach(function(key) {
      let value = parameter[key];
      urlParameter = urlParameter + key + '=' + value + '&';
    });
    urlParameter = urlParameter.replace(/\&$/, '');
    return urlParameter;
  }

  // HTTP Get Request
  static get(url, headerParam, parameter) {
    return new Promise(function(success, failed) {
      let URL = url + WebServiceHandler.parameter(parameter);
      fetch(URL, {
        method: 'GET',
        headers: WebServiceHandler.header(headerParam),
      }).then(response => response.json()).then(response => {
        if (response.statusCode === 200) {
          success(response);
        } else {
          failed(response);
        }
      })
        .catch(function(err) {
          failed(err);
        });
    });
  }

  static postNew(url, headerParam, parameter) {

    return new Promise(function(success, failed) {
      fetch(global.baseUrl + url, {
        method: 'post',
        headers: WebServiceHandler.header(headerParam),
          body: JSON.stringify(parameter),
      })
        .then(response => response.json())
        .then(response => {
          if (response.statusCode === 200) {
            success(response);
          } else {
            failed(response);
          }
        })
        .catch(function(err) {
          failed(err);
        });
    });
  }
}

