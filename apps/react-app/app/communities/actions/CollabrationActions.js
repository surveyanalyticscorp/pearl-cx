import { apiHandler } from '../../global/api/APIHandler';

export function getPanelDiscussionsList(requestData) {
  return (dispatch, getState) => {
     return apiHandler.getPanelDiscussions(dispatch, requestData);
  }
}

export function getPanelIdeaCategories(requestData) {
    return (dispatch, getState) => {
        return apiHandler.getPanelIdeaCategories(dispatch, requestData);
    }
 }
 export function addPanelIdea(requestData){
     return (dispatch, getState) => {
         return apiHandler.addPanelIdea(dispatch, requestData);
     }
 }
export function editPanelIdea(requestData){
    return (dispatch, getState) => {
        return apiHandler.editPanelIdea(dispatch, requestData);
    }
}
 export function getPanelCampaignIdeas(requestData){
     return (dispatch, getState) => {
         return apiHandler.getPanelCampaignIdeas(dispatch, requestData);
     }
 }

 export function addUpdateIdeaVote(requestData) {
     return (dispatch, getState) => {
         return apiHandler.addUpdateIdeaVote(dispatch, requestData);
     }

 }

 export function addUpdateIdeaFavorite(requestData) {
     return (dispatch, getState)=>{
         return apiHandler.addUpdateIdeaFavorite(dispatch,requestData);
     }
 }
 export function getPanelIdeaComments(requestData) {
     return (dispatch, getState) => {
         return apiHandler.getPanelIdeaComments(dispatch, requestData);
     }

 }
export function addUpdateIdeaComment(requestData) {
    return (dispatch, getState) => {
        return apiHandler.addUpdateIdeaComment(dispatch, requestData);
    }

}
export function deleteIdea(requestData) {
    return (dispatch, getState) => {
        return apiHandler.deleteIdea(dispatch, requestData);
    }

}
export function deleteTopic(requestData) {
    return (dispatch, getState) => {
        return apiHandler.deleteTopic(dispatch, requestData);
    }

}
export function deleteIdeaComment(requestData) {
    return (dispatch, getState) => {
        return apiHandler.deleteIdeaComment(dispatch, requestData);
    }

}

export function getPanelTopicCategories(requestData) {
    return (dispatch, getState) => {
        return apiHandler.getPanelTopicCategories(dispatch, requestData);
    }
}
export function addPanelTopic(requestData){
    return (dispatch, getState) => {
        return apiHandler.addPanelDiscussionTopic(dispatch, requestData);
    }
}
export function editPanelTopic(requestData){
    return (dispatch, getState) => {
        return apiHandler.editPanelDiscussionTopic(dispatch, requestData);
    }
}
export function addUpdateTopicFavorite(requestData) {
    return (dispatch, getState)=>{
        return apiHandler.addUpdateTopicFavorite(dispatch,requestData);
    }
}
export function getPanelDiscussionTopics(requestData){
    return (dispatch, getState) => {
        return apiHandler.getPanelDiscussionTopics(dispatch, requestData);
    }
}

export function addUpdateTopicVote(requestData) {
    return (dispatch, getState) => {
        return apiHandler.addUpdateTopicVote(dispatch, requestData);
    }

}

export function getDiscussionTopicComments(requestData) {
    return (dispatch, getState) => {
        return apiHandler.getPanelTopicComments(dispatch, requestData);
    }

}
export function addUpdateTopicComment(requestData) {
    return (dispatch, getState) => {
        return apiHandler.addUpdateTopicComment(dispatch, requestData);
    }
}

export function deleteTopicComment(requestData) {
    return (dispatch, getState) => {
        return apiHandler.deleteTopicComment(dispatch, requestData);
    }

}

export function uploadFileForTopics(requestData) {
    return (dispatch, getState) => {
        return apiHandler.postUpdateDocumentInTheTopic(dispatch, requestData);
    }
}