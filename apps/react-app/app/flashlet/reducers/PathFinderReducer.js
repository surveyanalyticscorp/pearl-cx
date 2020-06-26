import createReducer from '../../global/reducerLib/createReducer';
import * as types from '../../global/api/types';

export const pathFinderQuestionData = createReducer({}, {
    [types.PATH_FINDER](state, action) {
        if (action.data) {
            if(action.data.body)
            return action.data.body.pathFinder;
            else return {}
        }
        return state;
    },

});

export const pathFinderResultsData = createReducer({},{
    [types.PATH_FINDER_RESULTS] (state, action) {
        if(action.data){
            if(action.data.body)
            return action.data.body.pathFinderResults;
            else return []
        }
        return state;
    }
 })

