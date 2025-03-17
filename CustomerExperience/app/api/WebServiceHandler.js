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
  static headerFormData(headerParam) {
    let headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
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

  static makeApiCall(apiMethod, url, headerParam, queryParam, body) {
    return new Promise(function (success, failed) {
      let URL =
        url + (queryParam ? WebServiceHandler.parameter(queryParam) : '');
      fetch(URL, {
        method: apiMethod,
        headers: headerParam ? WebServiceHandler.header(headerParam) : {},
        body: body,
      })
        .then(response => {
          if (response.status === 404) {
            failed(response);
            return new Error('API Not found');
          }
          return response.json();
        })
        .then(response => {
          console.log(
            `URL: ${url}`,
            `Response Data: ${JSON.stringify(response)}`,
          );
          if (response.statusCode === 200 || response.status === SUCCESS || response.error == null) {
            success(response);
          } else {
            console.log('API CALL ERROR', JSON.stringify(response));
            failed(response);
          }
        })
        .catch(function (err) {
          failed(err);
        });
    });
  }

  // HTTP Get Request
  static get(url, headerParam, parameter) {
    let fullUrl = url.includes('http') ? url : global.baseUrl + url;
    console.log(`GET REQUEST Url: ${fullUrl}`);
    console.log(`HeaderParams: ${JSON.stringify(headerParam)}`);
    console.log(`Parameter: ${JSON.stringify(parameter)}`);
    return this.makeApiCall('GET', fullUrl, headerParam, parameter, null);
  }

  static postNew(url, headerParam, parameter, queryParam) {
    let fullUrl = url.includes('http') ? url : global.baseUrl + url;
    // fullUrl = queryParam
    //   ? fullUrl + WebServiceHandler.parameter(queryParam)
    //   : fullUrl;
    console.log(`POST REQUEST Url: ${fullUrl}`);
    console.log(`HeaderParams: ${JSON.stringify(headerParam)}`);
    console.log(`Parameter: ${JSON.stringify(parameter)}`);

    return this.makeApiCall(
      'POST',
      fullUrl,
      headerParam,
      queryParam,
      JSON.stringify(parameter),
    );
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
        .then(response => response.json())
        .then(response => {
          console.log(
            `URL: ${fullUrl}`,
            `Response Data: ${JSON.stringify(response)}`,
          );
          if (response.statusCode === 200 || response.status === SUCCESS) {
            success(response);
          } else {
            console.log('ERROR', JSON.stringify(response));

            failed(response);
          }
        })
        .catch(function (err) {
          // console.log('ERROR', JSON.stringify(err));
        });
    });
  }
  static postUploadFile(url, headerParam, formData, queryParam) {
    let fullUrl = url.includes('http') ? url : global.baseUrl + url;
    let headers = WebServiceHandler.headerFormData(headerParam);
    fullUrl = queryParam
      ? fullUrl + WebServiceHandler.parameter(queryParam)
      : fullUrl;
    console.log(`POST REQUEST Url: ${fullUrl}`);
    console.log(`HeaderParams: ${JSON.stringify(headers)}`);
    console.log(`Parameter: ${JSON.stringify(formData)}`);

    return new Promise(function (success, failed) {
      fetch(fullUrl, {
        method: 'post',
        headers: headers,
        body: formData,
      })
        .then(response => response.json())
        .then(response => {
          console.log(
            `URL: ${fullUrl}`,
            `Response Data: ${JSON.stringify(response)}`,
          );
          if (response.statusCode === 200 || response.status === SUCCESS) {
            success(response);
          } else {
            console.log('ERROR', JSON.stringify(response));

            failed(response);
          }
        })
        .catch(function (err) {
          // console.log('ERROR', JSON.stringify(err));

          failed(err);
        });
    });
  }
  static delete(url, headerParam, parameter) {
    let fullUrl = url.includes('http') ? url : global.baseUrl + url;
    console.log(`POST REQUEST Url: ${fullUrl}`);
    console.log(`HeaderParams: ${JSON.stringify(headerParam)}`);
    console.log(`Parameter: ${JSON.stringify(parameter)}`);

    return new Promise(function (success, failed) {
      fetch(fullUrl, {
        method: 'DELETE',
        headers: WebServiceHandler.header(headerParam),
        body: JSON.stringify(parameter),
      })
        .then(response => response.json())
        .then(response => {
          console.log(
            `URL: ${fullUrl}`,
            `Response Data: ${JSON.stringify(response)}`,
          );
          if (response.statusCode === 200 || response.status === SUCCESS) {
            success(response);
          } else {
            console.log('ERROR', JSON.stringify(response));

            failed(response);
          }
        })
        .catch(function (err) {
          // console.log('ERROR', JSON.stringify(err));
          failed(err);
        });
    });
  }
}
