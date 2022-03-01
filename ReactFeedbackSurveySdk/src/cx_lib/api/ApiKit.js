/*
 * Datta Kunde created on 12/11/21
 */

import axios from 'axios';

const httpClient = axios.create();
httpClient.defaults.timeout = 5000;

const getApiCall = async url => {
  return new Promise(resolve => {
    httpClient
      .get(url)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        resolve({errorMessage: error.message});
      });
  });
};

const postApiCall = async (url, body = {}, headers = {}) => {
  return new Promise(resolve => {
    httpClient
      .post(url, body, {headers})
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        resolve({errorMessage: error.message});
      });
  });
};

export {getApiCall, postApiCall};
