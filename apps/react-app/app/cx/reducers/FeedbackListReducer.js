import * as types from '../../global/api/types';
import createReducer from '../../global/reducerLib/createReducer';

export const feedbackList = createReducer({}, {

        [types.CX_FEEDBACK_LIST](state, action) {
            if (action.data) {
                return {
                    allResponses: action.requestData.pageOffset === 0 ? action.data.body.allResponses : [...state.allResponses, ...action.data.body.allResponses],
                    lastAddedCount : action.data.body.allResponses ? action.data.body.allResponses.length : 0
                }
            }

            return state;
        },

        [types.CX_FEEDBACK_UPDATED](state, action) {
            if (action.data) {
                return {
                    ...state,
                    allResponses: state.allResponses.map((feedback) => {
                        if(feedback.responseSetID === action.requestData.responseSetID){
                            feedback.ticketStatus = action.requestData.status
                        }
                        return feedback;
                    })
                }
            }

            return state;
        }
    }

);

export const ticketStatuses = createReducer({},{
    [types.CX_FEEDBACK_LIST](state, action) {
        if (action.data) {
            return action.data.body.cxTicketStatusValues

        }

        return state;
    },
})
