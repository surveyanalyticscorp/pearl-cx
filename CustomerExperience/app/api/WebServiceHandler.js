import {SUCCESS} from './Constant';

const HTTP_FAILED =
  'There was an error processing this request. Please try again.';

export default class WebServiceHandler {
  static header(headerParam) {
    let headers = new Headers();
    headers.append('Accept', 'application/json, text/plain, */*');
    headers.append('Content-Type', 'application/json');
    Object.keys(headerParam).forEach(function (key) {
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
    Object.keys(parameter).forEach(function (key) {
      let value = parameter[key];
      urlParameter = urlParameter + key + '=' + value + '&';
    });
    urlParameter = urlParameter.replace(/\&$/, '');
    return urlParameter;
  }

  // HTTP Get Request
  static get(url, headerParam, parameter) {
    let fullUrl = url.includes('http') ? url : global.baseUrl + url;
    console.log(`GET REQUEST Url: ${fullUrl}`);
    console.log(`HeaderParams: ${JSON.stringify(headerParam)}`);
    console.log(`Parameter: ${JSON.stringify(parameter)}`);
    return new Promise(function (success, failed) {
      let URL = url + WebServiceHandler.parameter(parameter);
      fetch(URL, {
        method: 'GET',
        headers: WebServiceHandler.header(headerParam),
      })
        .then((response) => response.json())
        .then((response) => {
          console.log(`Response Data: ${JSON.stringify(response)}`);
          if (response.statusCode === 200 || response.status === SUCCESS) {
            success(response);
          } else {
            failed(response);
          }
        })
        .catch(function (err) {
          failed(err);
        });
    });
  }

  static postNew(url, headerParam, parameter, queryParam = null) {
    let fullUrl = url.includes('http') ? url : global.baseUrl + url;
    fullUrl = queryParam
      ? fullUrl.WebServiceHandler.parameter(queryParam)
      : fullUrl;
    console.log(`POST REQUEST Url: ${fullUrl}`);
    console.log(`HeaderParams: ${JSON.stringify(headerParam)}`);
    console.log(`Parameter: ${JSON.stringify(parameter)}`);

    return new Promise(function (success, failed) {
      fetch(fullUrl, {
        method: 'POST',
        headers: WebServiceHandler.header(headerParam),
        body: JSON.stringify(parameter),
      })
        .then((response) => response.json())
        .then((response) => {
          console.log(
            `URL: ${fullUrl}`,
            `Response Data: ${JSON.stringify(response)}`,
          );
          if (response.statusCode === 200 || response.status === SUCCESS) {
            success(response);
          } else {
            failed(response);
          }
        })
        .catch(function (err) {
          failed(err);
        });
    });
  }

  static patch(url, headerParam, parameter) {
    let fullUrl = url.includes('http') ? url : global.baseUrl + url;
    console.log(`POST REQUEST Url: ${fullUrl}`);
    console.log(`HeaderParams: ${JSON.stringify(headerParam)}`);
    console.log(`Parameter: ${JSON.stringify(parameter)}`);

    return new Promise(function (success, failed) {
      fetch(fullUrl, {
        method: 'PATCH',
        headers: WebServiceHandler.header(headerParam),
        body: JSON.stringify(parameter),
      })
        .then((response) => response.json())
        .then((response) => {
          console.log(`Response Data: ${JSON.stringify(response)}`);
          if (response.statusCode === 200 || response.status === SUCCESS) {
            success(response);
          } else {
            failed(response);
          }
        })
        .catch(function (err) {
          failed(err);
        });
    });
  }
}
