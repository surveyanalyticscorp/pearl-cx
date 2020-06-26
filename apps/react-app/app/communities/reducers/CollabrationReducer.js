import createReducer from '../../global/reducerLib/createReducer';
import * as types from '../../global/api/types';

export const panelDiscussionData = createReducer({}, {
    [types.COMMUNITIES_PANEL_DISCUSSION_LIST](state, action) {
        if (action.data) {
            return action.data;
        }
        return state;
    },
});
export const panelIdeaCategories = createReducer({}, {
    [types.COMMUNITIES_IDEA_CATEGORY_LIST](state, action) {
        if (action.data) {
            return action.data;
        }
        return state;
    },
    [types.COMMUNITIES_ADD_IDEA] (state, action) {
        //Updating the count in categories for data consistency.
        if (action.data) {
            return {
                ...state,
                body: {
                    ...state.body,
                    ideaCampaigns: state.body.ideaCampaigns.map(category =>
                        category.ID === action.data.body.campaignID ?
                            {...category, ideasCount: category.ideasCount + 1}
                            : category)
                }
            };
        }
        return state;
    },
    [types.COMMUNITIES_DELETE_IDEA] (state, action) {
        //Updating the count in categories for data consistency.
        if (action.requestData) {
            return {
                ...state,
                body: {
                    ...state.body,
                    ideaCampaigns: state.body.ideaCampaigns.map(category =>
                        category.ID === action.requestData.campaignID ?
                            {...category, ideasCount: category.ideasCount - 1}
                            : category)
                }
            };
        }
        return state;
    },
    [types.COMMUNITIES_APPEND_IDEA_CATEGORIES] (state, action) {
        if (action.data) {
            return {
                body: {
                    ...state.body,
                    ideaCampaigns: state.body.ideaCampaigns.concat(action.data.body.ideaCampaigns)
                }
            }
        }
        return state;
    }
});
export const panelTopicCategories = createReducer({}, {
    [types.COMMUNITIES_TOPIC_CATEGORY_LIST](state, action) {
        if (action.data) {
            return action.data;
        }
        return state;
    },
    [types.COMMUNITIES_ADD_TOPIC] (state, action) {
        //Updating the count in categories for data consistency.
        if (action.data) {
            return {
                ...state,
                body: {
                    ...state.body,
                    categories: state.body.categories.map(category =>
                        category.ID === action.data.body.discussionID ?
                            {...category, topicCount: category.topicCount + 1}
                            : category)
                }
            };
        }
        return state;
    },
    [types.COMMUNITIES_APPEND_TOPIC_CATEGORIES] (state, action) {
        if (action.data) {
            return {
                body: {
                    ...state.body,
                    categories: state.body.categories.concat(action.data.body.categories)
                }
            }
        }
        return state;
    }
});
