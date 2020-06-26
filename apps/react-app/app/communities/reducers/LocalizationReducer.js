/**
 * Created by Jignesh on 04/07/17.
 */
import createReducer from '../../global/reducerLib/createReducer';
import * as types from '../../global/api/types';
import Immutable from 'seamless-immutable';
import I18n from 'react-native-i18n';
export const panelLanguageData = createReducer({}, {
    [types.COMMUNITIES_LANGUAGE_LIST](state, action) {
        if (action.data) {
            return action.data;
        }
        return state;
    },
});

export const INITIAL_LANGUAGE_STATE = Immutable(
     I18n.locale.substr(0,2)
)

export const language = createReducer({googleCode:INITIAL_LANGUAGE_STATE},{
    [types.COMMUNITIES_CHANGE_LANGUAGE] (state,action){
        if(action.data){
            return {googleCode:action.data.body.updatedLanguage.googleCode};
        }
        return state;
    }
});