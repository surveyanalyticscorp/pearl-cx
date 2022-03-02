/*
 * Datta Kunde created on 12/11/21
 */

import axios from 'axios';

const httpClient = axios.create();
httpClient.defaults.timeout = 500;

const getQp = async url => {
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

const postQp = async (url, body = {}, headers = {}) => {
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

export {getQp, postQp};
