/*
 * Datta Kunde created on 09/12/21
 */

//import {AsyncStorage} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    CX_PAYLOAD,
    CX_THEME_COLOR,
    CX_API_KEY,
    CX_SURVEY_HEADER,
    SURVEY_TYPE,
    CUSTOM_VAR_INDEX,
    qpString,
    getSurveyUrlApi,
    getCxTransactionSurveyApi
} from './utils/QpConstant';
import {postApiCall, getApiCall} from './api/ApiKit';
import GLOBAL from './utils/global.js';
import {makeEmailId} from './utils/qpUtils';
import {SurveyType} from './utils/QpConstant'

export const initQp = async payload => {
    console.log('Initialization payload: ' + JSON.stringify(payload));
    return new Promise(resolve => {
        try {
            AsyncStorage.clear().then(async () => {
                if (payload.hasOwnProperty('apiKey') || payload.apiKey) {
                    await AsyncStorage.setItem(CX_API_KEY, payload.apiKey);
                    delete payload.apiKey;
                } else {
                    console.error(`Error in initQp ${qpString.apiKeyRequired}`);
                    GLOBAL.initialized = false;
                    resolve(qpString.apiKeyRequired);
                }

                if (payload.hasOwnProperty('surveyType') || payload.surveyType) {
                    await AsyncStorage.setItem(SURVEY_TYPE, payload.surveyType);
                    delete payload.surveyType;
                } else {
                    console.error(`Error in initQp ${qpString.typeRequired}`);
                    GLOBAL.initialized = false;
                    resolve(qpString.typeRequired);
                }
          
                if (payload.hasOwnProperty('customVarIndex') || payload.customVarIndex) {
                    await AsyncStorage.setItem(CUSTOM_VAR_INDEX, payload.customVarIndex.toString());
                    delete payload.customVarIndex;
                }

                if (payload.hasOwnProperty('themeColorHex') || payload.themeColorHex) {
                    await AsyncStorage.setItem(CX_THEME_COLOR, payload.themeColorHex);
                    delete payload.themeColorHex;
                }

                if (payload.hasOwnProperty('surveyHeader') || payload.surveyHeader) {
                    await AsyncStorage.setItem(CX_SURVEY_HEADER, payload.surveyHeader);
                    delete payload.surveyHeader;
                }

                await AsyncStorage.setItem(CX_PAYLOAD, JSON.stringify(payload));
            });
        } catch (error) {
            console.error(`Error in initQp ${error}`);
        }
        GLOBAL.initialized = true;
        resolve('Success');
    });
};

export const getSurveyUrl = async surveyId => {
    let payloadStr = await AsyncStorage.getItem(CX_PAYLOAD);
    let customVarIndex = await AsyncStorage.getItem(CUSTOM_VAR_INDEX);

    let payload = JSON.parse(payloadStr);
    payload = {...payload, surveyID: surveyId};

    if (!payload.email) {
        payload.email = `${makeEmailId(15)}@questionpro.com`;
    }

    if(customVarIndex){
        let dynamic = 'custom' + customVarIndex;
        payload = {...payload, [dynamic] : surveyId};
    }

    let apiKey = await AsyncStorage.getItem(CX_API_KEY);
    let type = await AsyncStorage.getItem(SURVEY_TYPE);
    let apiResponse;
    if(type == SurveyType.Feedback){
        apiResponse = await postApiCall(getCxTransactionSurveyApi(apiKey), payload);
        if(apiResponse.response && apiResponse.response.surveyURL)
            return apiResponse.response.surveyURL;
        else
            return apiResponse;
    }else{
        apiResponse = await getApiCall(getSurveyUrlApi(apiKey, surveyId));
        if(apiResponse.response && apiResponse.response.surveyURL)
            return apiResponse.response.url;
        else
            return apiResponse;
    }
};

