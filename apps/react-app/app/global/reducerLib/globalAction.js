import * as types from '../api/types';



export function updateLoadingStatus(isLoading){
    return (dispatch, getState) => {
        dispatch({
            type: types.LOADING_PROGRESS,
            isLoading : isLoading
        })
    }
}

export function clearError(){
    return (dispatch, getState) =>{
        dispatch({
            type: types.LOADING_ERROR,
            error: {error: false}
        })
    }
}

export function updateLanguage(language){
    return(dispatch, getState) =>{
        dispatch({
            type: types.UPDATE_LANGUAGE,
            language: {language: language}
        })
    }
}