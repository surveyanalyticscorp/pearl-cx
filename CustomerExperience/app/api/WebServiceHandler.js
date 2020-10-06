import {NetInfo, Platform} from 'react-native';

const NO_INTERNET = 'Unable to connect, Please check your connection settings.';
const HTTP_FAILED =
  'There was an error processing this request. Please try again.';
export default class WebServiceHandler {
  // HTTP Header Generator.
  static header(headerParam) {
    // console.log('Header Parameter:' + JSON.stringify(headerParam));
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
      //console.log('key:-' +key +'  value:-'+value);
      urlParameter = urlParameter + key + '=' + value + '&';
    });
    urlParameter = urlParameter.replace(/\&$/, '');
    //console.log('urlParameter: '+ urlParameter);
    return urlParameter;
  }

  // HTTP Get Request
  static get(url, headerParam, parameter, dispatch) {
    // console.log('WebServiceHandler:Initiating GET request');

    return new Promise(function(success, failed) {
      let URL = url + WebServiceHandler.parameter(parameter);
      // console.log('URL:-' + URL);
      fetch(URL, {
        method: 'get',
        headers: WebServiceHandler.header(headerParam),
      })
        .then(function(response) {
          // console.log(response.status);
          if (!response.ok) {
            throw {
              name: response.status,
              message: HTTP_FAILED,
              value: response.json(),
            };
          }
          return response.json();
        })
        .then(function(jsonResponse) {
          // console.log(
          //   '************************ HTTP GET Succes ************************ ',
          // );
          success(jsonResponse);
        })
        .catch(function(err) {
          // console.log(
          //   '************************ HTTP GET Failed **************************',
          // );
          failed(err);
        });
    });
  }

  // HTTP POST Request
  static post(url, headerParam, parameter) {
    // console.log('WebServiceHandler:Initiating POST request');

    return new Promise(function(success, failed) {
      // console.log('URL:-' + url);
      // console.log('Request Data:-' + JSON.stringify(parameter));
      fetch(url, {
        method: 'post',
        headers: WebServiceHandler.header(headerParam),
        body: JSON.stringify(parameter),
      })
        .then(function(response) {
          // console.log('Api response:' + response.status);
          if (!response.ok) {
            throw {
              name: response.status,
              message: HTTP_FAILED,
              value: response.json(),
            };
          }
          return response.json();
        })
        .then(function(jsonResponse) {
          // console.log(
          //   '************************ HTTP POST Success ************************ ',
          // );
          success(jsonResponse);
        })
        .catch(function(err) {
          // console.log('Failure Response- ' + JSON.stringify(err));
          // console.log(
          //   '************************ HTTP POST Failed **************************',
          // );
          failed(err);
        });
    });
  }

  static postNew(url, headerParam, parameter) {
    // console.log('WebServiceHandler:Initiating POST request');

    return new Promise(function(success, failed) {
      fetch(url, {
        method: 'post',
        headers: WebServiceHandler.header(headerParam),
          body: JSON.stringify(parameter),
      })
        .then(response => response.json())
        .then(response => {
          // console.log(
          //   '************************ HTTP POST Success ************************ ',
          // );
          if (response.statusCode === 200) {
            success(response);
          } else {
            failed(response);
          }
        })
        .catch(function(err) {
          // console.log('Failure Response- ' + JSON.stringify(err));
          // console.log(
          //   '************************ HTTP POST Failed **************************',
          // );
          failed(err);
        });
    });
  }

  static uploadFile(url, token, data) {
    // console.log('WebServiceHandler:Initiating POST request');

    return new Promise(function(success, failed) {
      let options = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Auth-Token': token,
        },
        method: 'POST',
      };

      options.body = new FormData();
      for (let key in data) {
        options.body.append(key, data[key]);
      }
      // console.log('URL:-' + url);
      fetch(url, options)
        .then(function(response) {
          // console.log(response.status);
          if (!response.ok) {
            throw {
              name: response.status,
              message: HTTP_FAILED,
              value: response.json(),
            };
          }
          return response.json();
        })
        .then(function(jsonResponse) {
          // console.log(
          //   '************************ HTTP POST Succes ************************ ',
          // );

          success(jsonResponse);
        })
        .catch(function(err) {
          // console.log('Failure Response- ' + JSON.stringify(err));
          // console.log(
          //   '************************ HTTP POST Failed **************************',
          // );
          failed(err);
        });
    });
  }

  static postV2API(url, headerParam, parameter) {
    // console.log('WebServiceHandler:Initiating POST request');

    return new Promise(function(success, failed) {
      fetch(url, {
        method: 'post',
        headers: WebServiceHandler.header(headerParam),
        body: JSON.stringify(parameter),
      })
          .then(response => response.json())
          .then(response => {
            // console.log(
            //   '************************ HTTP POST Success ************************ ',
            // );
            if (response.statusCode && response.statusCode !== 200) {
              failed(response);
            } else {
              success(response);
            }
          })
          .catch(function(err) {
            // console.log('Failure Response- ' + JSON.stringify(err));
            // console.log(
            //   '************************ HTTP POST Failed **************************',
            // );
            failed(err);
          });
    });
  }
}

