import createReducer from '../../global/reducerLib/createReducer';
import * as types from '../actions/types';

export const reviewSelectedCategories = createReducer({}, {
  [types.SET_SELECTED_REVIEW_CATEGORIES](state, action) {
    if (action.data) {
      //   return Object.entries(Object.assign({}, ...state, action.data)).map(([key, value]) => ({ [key]: value }));
      if (state.length) {
        let index = state.findIndex(obj => obj.id === action.data.id);
        if (state[index]) {
          state[index] = action.data;
          return state;
        }
      }

      return [...state, action.data];
    }
    return [];
  }
});
