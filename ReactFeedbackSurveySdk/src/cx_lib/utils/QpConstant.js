/*
 * Datta Kunde created on 09/12/21
 */

const CX_PAYLOAD = 'cx_payload';
const CX_THEME_COLOR = 'cx_theme_color';
const CX_API_KEY = 'cx_api_key';
const CX_SURVEY_HEADER = 'cx_survey_header';
const GET_SURVEY_URL =
    'https://api.questionpro.com/a/api/questionpro.cx.getSurveyURL?apiKey=';
const GET_SURVEY_URL_V2 =
    'https://api.questionpro.com/a/api/v2/cx/transactions/survey-url?apiKey=';
const surveyUrl = apiKey => {
    return GET_SURVEY_URL + apiKey;
};

export {CX_PAYLOAD, CX_THEME_COLOR, CX_API_KEY, CX_SURVEY_HEADER, surveyUrl};

export const qpColor = {
    headerText: '#ffffff',
    defaultTheme: '#007bff',
};

export const qpDimension = {
    headerHeight: 40,
};

export const qpString = {
    survey_exit_confirmation_message: 'Are you survey you want to terminate the Survey?',
    yes: 'Yes',
    no: 'No',
    apiKeyRequired: "[FAILED] 'apiKey' is required in initQp payload!",
    survey_exit_web_view_title: 'Free Online Survey Software and Tools | QuestionPro',
};

export const qpErrorMsg = {
    init: 'QuestionPro SDK has not been initialized properly. Please do it properly',
};
