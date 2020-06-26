/**
 * Created by Jignesh on 04/07/17.
 */
import * as types from '../../global/api/types'
import { apiHandler } from '../../global/api/APIHandler';

export function getPanelLanguageList(requestData) {
    return (dispatch, getState) => {
        console.log("API is called- " + JSON.stringify(requestData));
        return apiHandler.getPanelLanguageList(dispatch, requestData);
    }
}

export function updatePanelPreferedLanguage(requestData){
  return (dispatch, getState) => {
     return apiHandler.updatePanelPreferedLanguage(dispatch, requestData);
  }
}

export function changeLanguage (language){
  return (dispatch, getState) => {
      let uploadData = {languageID : language.languageID};
      return apiHandler.updatePanelPreferedLanguage(dispatch,uploadData);

  }
}
