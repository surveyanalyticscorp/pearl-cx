import createReducer from './createReducer';
import * as types from '../api/types';
export const isLoading = createReducer({},{
    [types.LOADING_PROGRESS](state,action){
        return action.isLoading;
    },
    ["REACT_NATIVE_ROUTER_FLUX_REPLACE"](state, action){
        return false;
    },
});

export const error = createReducer({},{
    [types.LOADING_ERROR](state,action){
        return action.error;
    }
});
