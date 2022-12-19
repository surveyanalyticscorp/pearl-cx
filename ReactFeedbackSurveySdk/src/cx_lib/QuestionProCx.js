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
    qpString,
    surveyUrl,
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

    let payload = JSON.parse(payloadStr);
    payload = {...payload, surveyID: surveyId};

    if (!payload.email) {
        payload.email = `${makeEmailId(15)}@questionpro.com`;
    }

    let apiKey = await AsyncStorage.getItem(CX_API_KEY);
    let type = await AsyncStorage.getItem(SURVEY_TYPE);
    let apiResponse;
    if(type == SurveyType.Feedback){
        apiResponse = await postApiCall(surveyUrl(apiKey, type, surveyId), payload);
        console.log('api response: ' + JSON.stringify(apiResponse));
        return apiResponse.response.SurveyURL;
    }else{
        apiResponse = await getApiCall(surveyUrl(apiKey, type, surveyId));
        console.log('Survey api response: ' + JSON.stringify(apiResponse));
        return apiResponse.response.url;
    }
};

