import createReducer from '../../global/reducerLib/createReducer';
import * as types from '../../global/api/types';

export const reviewCategoryItems = createReducer({}, {
  [types.REVIEW_CATEGORY_ITEMS](state, action) {
        if (action.payload) {
            return action.payload;
        }
        return [];
    },

});
