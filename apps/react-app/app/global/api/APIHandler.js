/*jshint esversion:6*/
import * as types from './types';
import {
    AuthenticationModule,
    ActionBarModule
} from '../native-modules/NativeModules';
import WebServiceHanlder from './WebServiceHandler';

import {setting} from './Setting';
import {urlConstants} from './URLConstants';


class APIHandler {

    callAPI(url, successCallback, data = {}, errorCallback = () => {
    }) {
        var promise = new Promise((resolve, reject) => {
            AuthenticationModule.getAuthToken((token) => {
                resolve(this.callAPIInternal(token, url, data, successCallback, errorCallback));
            }, (error) => {
                reject(error)
            });
        });
        return promise;
    }

    postThroughApi(dispatch, type, url, data = {}) {
        dispatch({type: types.LOADING_PROGRESS, isLoading: true});
        var promise = new Promise((resolve, reject) => {
            AuthenticationModule.getAuthToken((token) => {
                this.callAPIInternalWithDispatch(dispatch, type, token, url, data, resolve, reject);
            }, (error) => {
                dispatch({type: types.LOADING_ERROR, error: error});
                dispatch({type: types.LOADING_PROGRESS, isLoading: false});
            });
        });
        return promise;
    }

    getFromApi(dispatch, type, url, data = {}) {
        dispatch({type: types.LOADING_PROGRESS, isLoading: true});
        var promise = new Promise((resolve, reject) => {
            AuthenticationModule.getAuthToken((token) => {

                resolve(this.callAPIInternalWithDispatch(dispatch, type, token, url, data, resolve, reject));
            }, (error) => {

                dispatch({type: types.LOADING_ERROR, error: error});
                dispatch({type: types.LOADING_PROGRESS, isLoading: false});
            });
        });
        return promise;
    }

    postThroughApi(dispatch, type, url, data = {}) {
        dispatch({type: types.LOADING_PROGRESS, isLoading: true});
        var promise = new Promise((resolve, reject) => {
            AuthenticationModule.getAuthToken((token) => {
                this.callAPIInternalWithDispatch(dispatch, type, token, url, data, resolve, reject);
            }, (error) => {
                dispatch({type: types.LOADING_ERROR, error: error});
                dispatch({type: types.LOADING_PROGRESS, isLoading: false});
            });
        });
        return promise;
    }

    postThroughApiSilently(dispatch, type, url, data = {}) {
        var promise = new Promise((resolve, reject) => {
            AuthenticationModule.getAuthToken((token) => {
                this.callAPIInternalWithDispatch(dispatch, type, token, url, data, resolve, reject);
            }, (error) => {
                dispatch({type: types.LOADING_ERROR, error: error});
                dispatch({type: types.LOADING_PROGRESS, isLoading: false});
            });
        });
        return promise;
    }

    refreshAuthToken(token = '', url, data, successCallback, errorCallback) {
        AuthenticationModule.refreshAuthToken((token) => {
            this.callAPIInternal(token, url, data, successCallback, errorCallback);
        });
    }

    updateActionBar(data) {
        ActionBarModule.updateTitleAndMenu(data);
    }

    callAPIInternal(token, url, data, successCallback, errorCallback) {
        return WebServiceHanlder.post(url, {'Auth-Token': token}, data)
            .then((response) => {
                this.updateActionBar(JSON.stringify(response));
                successCallback(response)
            }).catch(error => {
                errorCallback(error);
            });

    }

    callAPIInternalWithDispatch(dispatch, type, token, url, data, resolve = undefined, reject = undefined) {
        return WebServiceHanlder.post(url, {'Auth-Token': token}, data, dispatch)
            .then((response) => {
                // console.log('Response- '+JSON.stringify(response));

                if (resolve) {
                    resolve(response);
                }
                dispatch({type: type, data: response, requestData: data});
                dispatch({type: types.LOADING_PROGRESS, isLoading: false});
                dispatch({type: types.LOADING_ERROR, error: false});
            }).catch(error => {
                console.log("ERror- " + error.message);
                if (reject) {
                    reject(error);
                }
                dispatch({type: types.LOADING_PROGRESS, isLoading: false});
                dispatch({type: types.LOADING_ERROR, error: error});
                dispatch({type: type});
            });

    }

    handleApiError(responseJson, errorCallback) {
        let errorMessage = "There was an error completing this request!";

        if (responseJson.validationErrors && responseJson.validationErrors[0]) {
            errorMessage = responseJson.validationErrors[0].error;
            if (errorMessage == "Invalid Authentication Token") {
                this.refreshAuthToken('', url, data, successCallback, errorCallback);
                return;
            }

        }
        if (responseJson.statusCode == 500) {
            errorMessage = responseJson.errorAlert;
        }

        errorCallback(errorMessage);
    }

    callInternalGetAPI(dispatch, url, token, data, type, resolve, reject) {
        WebServiceHanlder.get(url, {'Auth-Token': token}, data, dispatch).then((response) => {
            // console.log('Response- '+JSON.stringify(response));

            if (resolve) {
                resolve(response);
            }
            dispatch({type: type, data: response, requestData: data});
            dispatch({type: types.LOADING_PROGRESS, isLoading: false});
            dispatch({type: types.LOADING_ERROR, error: false});
        }).catch(error => {
            console.log("ERror- " + error.message);
            if (reject) {
                reject(error);
            }
            dispatch({type: types.LOADING_PROGRESS, isLoading: false});
            dispatch({type: types.LOADING_ERROR, error: error});
            dispatch({type: type});
        });

    }

    getApi(dispatch, url, data, type) {
        dispatch({type: types.LOADING_PROGRESS, isLoading: true});
        var promise = new Promise((resolve, reject) => {
            AuthenticationModule.getAuthToken((token) => {
                this.callInternalGetAPI(dispatch, url, token, data, type, resolve, reject);
            }, (error) => {
                dispatch({type: types.LOADING_ERROR, error: error});
                dispatch({type: types.LOADING_PROGRESS, isLoading: false});
            });
        });
        return promise;
    }

    sendRequestForFileUpload(dispatch, url, data, type) {
        dispatch({type: types.LOADING_PROGRESS, isLoading: true});
        var promise = new Promise((resolve, reject) => {
            AuthenticationModule.getAuthToken((token) => {
                this.callAPIForFileUpload(dispatch, url, token, data, type, resolve, reject);
            }, (error) => {
                dispatch({type: types.LOADING_ERROR, error: error});
                dispatch({type: types.LOADING_PROGRESS, isLoading: false});
            });
        });
        return promise;
    }


    callAPIForFileUpload(dispatch, url, token, data, type, resolve, reject) {
        WebServiceHanlder.uploadFile(url, token, data, dispatch).then((response) => {
            if (resolve) {
                resolve(response);
            }
            dispatch({type: type, data: response, requestData: data});
            dispatch({type: types.LOADING_PROGRESS, isLoading: false});
            dispatch({type: types.LOADING_ERROR, error: false});
        }).catch(error => {
            console.log("ERror- " + error.message);
            if (reject) {
                reject(error);
            }
            dispatch({type: types.LOADING_PROGRESS, isLoading: false});
            dispatch({type: types.LOADING_ERROR, error: error});
            dispatch({type: type});
        });

    }


    getSurveys(successCallback, data = {}, errorCallback = () => {
    }) {
        return this.callAPI(global.BASE_URL + 'a/nativehtml/survey.SurveyList',
            successCallback, data, errorCallback);
    }

    getSurveyDashboard(successCallback, data = {}, errorCallback = () => {
    }) {
        return this.callAPI(global.BASE_URL + 'a/nativehtml/survey.dashboard.SurveyDashboard',
            successCallback, data, errorCallback);
    }

    getCXDashBoard(successCallback, data = {}, errorCallback = () => {
    }) {
        return this.callAPI(global.BASE_URL + 'a/nativehtml/cx.CXHome', successCallback, data, errorCallback);
    }

    getDetractorTickets(successCallback, data = {}, errorCallback = () => {
    }) {
        return this.callAPI(global.BASE_URL + 'a/nativehtml/cx.CXDetractorTicket', successCallback, data, errorCallback);
    }

    getCXFeedbackList(dispatch, data = {}, isLoadingTail) {
        if (!isLoadingTail) {
            return this.getFromApi(dispatch, types.CX_FEEDBACK_LIST, global.BASE_URL + 'a/nativehtml/cx.CXGetAllResponses', data);
        } else {
            return this.postThroughApiSilently(dispatch, types.CX_FEEDBACK_LIST, global.BASE_URL + 'a/nativehtml/cx.CXGetAllResponses', data)
        }
    }

    updateCXFeedbackStatus(dispatch, data) {
        return this.postThroughApi(dispatch, types.CX_FEEDBACK_UPDATED, global.BASE_URL + 'a/nativehtml/cx.CXAddOrUpdateTicket', data);
    }

    callLogoutAPI(successCallback) {
        return this.callAPI(global.BASE_URL + 'a/nativehtml/panel.auth.PanelLogout', successCallback);
    }

    getCXDashBoard(successCallback, data = {}, errorCallback = () => {
    }) {
        return this.callAPI(global.BASE_URL + 'a/nativehtml/cx.CXHome', successCallback, data, errorCallback);
    }

    getDetractorTickets(successCallback, data = {}, errorCallback = () => {
    }) {
        return this.callAPI(global.BASE_URL + 'a/nativehtml/cx.CXDetractorTicket', successCallback, data, errorCallback);
    }


    getPushTokenRegisterRoute(appName) {
        switch (appName) {
            case "HealthTrust":
            case "Communities":
            case "Energizer Idea Lab":
                return "panel.notification.PanelRegisterPushToken";
            case "Workforce":
            case "Pulse":
                return "flashlet.general.FlashLetRegisterPushToken";
            default:
                return "panel.notification.PanelRegisterPushToken";
        }

    }


}

export let apiHandler = new APIHandler();
