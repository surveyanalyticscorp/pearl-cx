/*jshint esversion:6*/
import * as types from './types';
import {
    AuthenticationModule,
    ActionBarModule
} from '../native-modules/NativeModules';
import WebServiceHanlder from './WebServiceHandler';

import { setting } from './Setting';
import { urlConstants } from './URLConstants';


class APIHandler {

    callAPI(url, successCallback, data = {}, errorCallback = () => {}) {
        var promise = new Promise((resolve, reject) => {
            AuthenticationModule.getAuthToken((token) => {
                resolve(this.callAPIInternal(token, url, data, successCallback, errorCallback));
            }, (error) => {
                reject(error)
            });
        });
        return promise;
    }

  // callAPI(url, successCallback, data = {}, errorCallback = () => { }) {
  //   var promise = new Promise((resolve, reject) => {
  //     AuthenticationModule.getAuthToken((token) => {
  //       resolve(this.callAPIInternal(token, url, data, successCallback, errorCallback));
  //     }, (error) => { reject(error) });
  //   });
  //   return promise;
  //
  // }

  getFromApi(dispatch, type, url, data = {}) {
    dispatch({ type: types.LOADING_PROGRESS, isLoading: true });
    var promise = new Promise((resolve, reject) => {
      AuthenticationModule.getAuthToken((token) => {
        resolve(this.callAPIInternalWithDispatch(dispatch, type, token, url, data, resolve, reject));
      }, (error) => {
        dispatch({ type: types.LOADING_ERROR, error: error });
        dispatch({ type: types.LOADING_PROGRESS, isLoading: false });
      });
    });
    return promise;
  }

  postThroughApi(dispatch, type, url, data = {}) {
    dispatch({ type: types.LOADING_PROGRESS, isLoading: true });
    var promise = new Promise((resolve, reject) => {
      AuthenticationModule.getAuthToken((token) => {
        this.callAPIInternalWithDispatch(dispatch, type, token, url, data, resolve, reject);
      }, (error) => {
          dispatch({type: types.LOADING_ERROR, error: error});
          dispatch({type: types.LOADING_PROGRESS, isLoading: false});
      } );
    });
      return promise;
    }

    getFromApi(dispatch, type, url, data = {}) {
        dispatch({type: types.LOADING_PROGRESS, isLoading: true});
        var promise = new Promise((resolve, reject) => {
            AuthenticationModule.getAuthToken((token) => {

                resolve(this.callAPIInternalWithDispatch(dispatch, type, token, url, data, resolve, reject));
            }, (error) => {

                dispatch({type: types.LOADING_ERROR, error: error});
                dispatch({type: types.LOADING_PROGRESS, isLoading: false});
            });
        });
        return promise;
    }

    getFromApiSilently(dispatch, type, url, data = {}) {

        var promise = new Promise((resolve, reject) => {
            AuthenticationModule.getAuthToken((token) => {
                this.callAPIInternalWithDispatch(dispatch, type, token, url, data, resolve, reject);
            }, (error) => {
                dispatch({type: types.LOADING_ERROR, error: error});
                dispatch({type: types.LOADING_PROGRESS, isLoading: false});
            });
        });
        return promise;
    }

    postThroughApi(dispatch, type, url, data = {}) {
        dispatch({type: types.LOADING_PROGRESS, isLoading: true});
        var promise = new Promise((resolve, reject) => {
            AuthenticationModule.getAuthToken((token) => {
                this.callAPIInternalWithDispatch(dispatch, type, token, url, data, resolve, reject);
            }, (error) => {
                dispatch({type: types.LOADING_ERROR, error: error});
                dispatch({type: types.LOADING_PROGRESS, isLoading: false});
            });
        });
        return promise;
    }

    postThroughApiSilently(dispatch, type, url, data = {}) {
        var promise = new Promise((resolve, reject) => {
            AuthenticationModule.getAuthToken((token) => {
                this.callAPIInternalWithDispatch(dispatch, type, token, url, data, resolve, reject);
            }, (error) => {
                dispatch({type: types.LOADING_ERROR, error: error});
                dispatch({type: types.LOADING_PROGRESS, isLoading: false});
            });
        });
        return promise;
    }

    refreshAuthToken(token = '', url, data, successCallback, errorCallback) {
        AuthenticationModule.refreshAuthToken((token) => {
            this.callAPIInternal(token, url, data, successCallback, errorCallback);
        });
    }

    updateActionBar(data) {
        ActionBarModule.updateTitleAndMenu(data);
    }

    callAPIInternal(token, url, data, successCallback, errorCallback) {
        return WebServiceHanlder.post(url, {'Auth-Token': token}, data)
            .then((response) => {
                this.updateActionBar(JSON.stringify(response));
                successCallback(response)
            }).catch(error => {
                errorCallback(error);
            });

    }

    callAPIInternalWithDispatch(dispatch, type, token, url, data, resolve = undefined, reject = undefined) {
        return WebServiceHanlder.post(url, {'Auth-Token': token}, data, dispatch)
            .then((response) => {
                // console.log('Response- '+JSON.stringify(response));

                if (resolve) {
                    resolve(response);
                }
                dispatch({type: type, data: response, requestData: data});
                dispatch({type: types.LOADING_PROGRESS, isLoading: false});
                dispatch({type: types.LOADING_ERROR, error: false});
            }).catch(error => {
                console.log("ERror- " + error.message);
                if (reject) {
                    reject(error);
                }
                dispatch({type: types.LOADING_PROGRESS, isLoading: false});
                dispatch({type: types.LOADING_ERROR, error: error});
                dispatch({type: type});
            });

    }

    handleApiError(responseJson, errorCallback) {
        let errorMessage = "There was an error completing this request!";

        if (responseJson.validationErrors && responseJson.validationErrors[0]) {
            errorMessage = responseJson.validationErrors[0].error;
            if (errorMessage == "Invalid Authentication Token") {
                this.refreshAuthToken('', url, data, successCallback, errorCallback);
                return;
            }

        }
		if (responseJson.statusCode == 500) {
      		errorMessage = responseJson.errorAlert;
        }

        errorCallback(errorMessage);
    }

    callInternalGetAPI(dispatch,url,token, data, type,resolve, reject) {
        WebServiceHanlder.get(url, {'Auth-Token': token},data, dispatch).then((response) => {
            // console.log('Response- '+JSON.stringify(response));

            if (resolve) {
                resolve(response);
            }
            dispatch({type: type, data: response, requestData: data});
            dispatch({type: types.LOADING_PROGRESS, isLoading: false});
            dispatch({type: types.LOADING_ERROR, error: false});
        }).catch(error => {
            console.log("ERror- " + error.message);
            if (reject) {
                reject(error);
            }
            dispatch({type: types.LOADING_PROGRESS, isLoading: false});
            dispatch({type: types.LOADING_ERROR, error: error});
            dispatch({type: type});
        });

    }

    getApi(dispatch,url, data, type) {
        dispatch({type: types.LOADING_PROGRESS, isLoading: true});
        var promise = new Promise((resolve, reject) => {
            AuthenticationModule.getAuthToken((token) => {
                this.callInternalGetAPI(dispatch,url, token, data, type,resolve, reject);
            }, (error) => {
                dispatch({type: types.LOADING_ERROR, error: error});
                dispatch({type: types.LOADING_PROGRESS, isLoading: false});
            });
        });
        return promise;
    }

    sendRequestForFileUpload(dispatch,url, data, type) {
        dispatch({type: types.LOADING_PROGRESS, isLoading: true});
        var promise = new Promise((resolve, reject) => {
            AuthenticationModule.getAuthToken((token) => {
                this.callAPIForFileUpload(dispatch,url, token, data, type,resolve, reject);
            }, (error) => {
                dispatch({type: types.LOADING_ERROR, error: error});
                dispatch({type: types.LOADING_PROGRESS, isLoading: false});
            });
        });
        return promise;
    }


    callAPIForFileUpload(dispatch,url,token, data, type,resolve, reject) {
        WebServiceHanlder.uploadFile(url,token,data, dispatch).then((response) => {
            if (resolve) {
                resolve(response);
            }
            dispatch({type: type, data: response, requestData: data});
            dispatch({type: types.LOADING_PROGRESS, isLoading: false});
            dispatch({type: types.LOADING_ERROR, error: false});
        }).catch(error => {
            console.log("ERror- " + error.message);
            if (reject) {
                reject(error);
            }
            dispatch({type: types.LOADING_PROGRESS, isLoading: false});
            dispatch({type: types.LOADING_ERROR, error: error});
            dispatch({type: type});
        });

    }

    postUpdateDocumentInTheTopic(dispatch, data = {}) {
        return this.sendRequestForFileUpload(dispatch,  global.BASE_URL  + "a/nativehtml/panel.topic.DiscusssionTopicFileUpload", data ,types.COMMUNITIES_ADD_TOPIC_DOCUMENT  )
    }

    postUpdateMemberDocuments(dispatch, data = {}) {
        return this.postThroughApi(dispatch, types.COMMUNITIES_UPDATE_MEMBER_DOCUMENTS, global.BASE_URL  + 'a/nativehtml/panel.member.PanelMemberUpdateDocument', data)

    }

    postUpdateMemberReadDocuments(dispatch, data = {}) {
        return this.postThroughApi(dispatch, types.COMMUNITIES_UPDATE_MEMBER_DOCUMENTS, global.BASE_URL  + 'a/nativehtml/panel.member.PanelMemberUpdateDocument', data)

    }

    getPanelEvents(dispatch, data = {}) {
        return this.getApi(dispatch,global.BASE_URL  + 'a/nativehtml/panel.event.PanelEvent',data, types.COMMUNITIES_PANEL_EVENTS);

    }

    getMemberDocuments(dispatch, data = {}) {
        return this.getApi(dispatch,global.BASE_URL  + 'a/nativehtml/panel.member.PanelMemberDocuments',data, types.COMMUNITIES_PANEL_MEMBER_DOCUMENTS);

    }

    getPanelMemberSurvey(dispatch, data = {}) {
        return this.getApi(dispatch,global.BASE_URL + 'a/nativehtml/panel.member.PanelMemberSurveys',data, types.COMMUNITIES_PANEL_MEMBER_SURVEYS);
    }

    getSurveys(successCallback, data = {}, errorCallback = () => {}) {
        return this.callAPI(global.BASE_URL + 'a/nativehtml/survey.SurveyList',
            successCallback, data, errorCallback);
    }

    getSurveyDashboard(successCallback, data = {}, errorCallback = () => {}) {
        return this.callAPI(global.BASE_URL + 'a/nativehtml/survey.dashboard.SurveyDashboard',
            successCallback, data, errorCallback);
    }

    getFlashLetPulse(dispatch, data = {}) {
        return this.getFromApi(dispatch, types.GET_PULSE, global.BASE_URL + 'a/nativehtml/flashlet.FlashLetHome',
            data);
    }

    submitFlashletPulseResponse(dispatch, data = {}) {
        return this.getFromApi(dispatch, types.PULSE_RESPONSE_COLLECT, global.BASE_URL + 'a/nativehtml/flashlet.pulse.FlashLetPulseCollectResponse', data);
    }

    getFlashLetMemberProfile(dispatch, data = {}) {
        return this.getFromApi(dispatch, types.PULSE_PROFILE, global.BASE_URL + 'a/nativehtml/flashlet.general.FlashLetMemberProfile', data)
    }

    getFlashLetPanelMember(successCallback, data = {}, errorCallback = () => {
    }) {
        return this.callAPI(global.BASE_URL + 'a/nativehtml/flashlet.general.FlashLetGetPanelMember', successCallback, data, errorCallback);
    }

    updateFlashLetMemberProfile(dispatch, data = {}) {
        return this.postThroughApi(dispatch, types.PULSE_PROFILE, global.BASE_URL + 'a/nativehtml/flashlet.general.FlashLetMemberProfile', data);
    }


    getFlashletPulseDashboard(dispatch, data = {}) {
        return this.getFromApi(dispatch, types.PULSE_DASHBOARD, global.BASE_URL + 'a/nativehtml/flashlet.pulse.Dashboard', data);
    }

   	getFlashletOrgViewData(dispatch, data = {}) {
   		 return this.getFromApi(dispatch, types.PULSE_ORG_VIEW, global.BASE_URL + 'a/nativehtml/flashlet.general.FlashLetOrgView', data);
  	}

	getFlashLetReviewCompetencies(dispatch, data = {}) {
        return this.getFromApi(dispatch, types.REVIEW_CATEGORIES, setting.COMPETENCY_URL,
            data);
    }

    getFlashLetReviewCompetencyItems(dispatch, data = {}) {
        return this.getFromApi(dispatch, types.REVIEW_ITEMS, setting.COMPETENCY_ATTRIBUTES_URL,
            data);
    }

    getFlashLetReviewEmployeeList(dispatch, data = {}) {
        return this.getFromApi(dispatch, types.REVIEW_EMPLOYEE, setting.EMPLOYEE_URL,
            data);
    }

    getFlashLetPathFinder(dispatch, data = {}) {
        return this.getFromApi(dispatch, types.PATH_FINDER, global.BASE_URL + 'a/nativehtml/flashlet.pathfinder.FlashLetGetPathFinder', data);
    }

    getFlashLetPathFinderResults(dispatch, data = {}) {
        return this.getFromApi(dispatch, types.PATH_FINDER_RESULTS, global.BASE_URL + 'a/nativehtml/flashlet.pathfinder.FlashLetGetPathFinderResultsForEmployee', data);
    }

    submitPathFinderResponse(dispatch, response) {
        return this.postThroughApi(dispatch, types.PATH_FINDER_RESPONSE, global.BASE_URL + 'a/nativehtml/flashlet.pathfinder.FlashLetCollectPathfinderResponse', response);
    }

    getCXDashBoard(successCallback, data = {}, errorCallback = () => {}) {
        return this.callAPI(global.BASE_URL + 'a/nativehtml/cx.CXHome', successCallback, data, errorCallback);
    }

    getDetractorTickets(successCallback, data = {}, errorCallback = () => {}) {
        return this.callAPI(global.BASE_URL + 'a/nativehtml/cx.CXDetractorTicket', successCallback, data, errorCallback);
    }

    getCXFeedbackList(dispatch, data = {}, isLoadingTail) {
        if (!isLoadingTail) {
            return this.getFromApi(dispatch, types.CX_FEEDBACK_LIST, global.BASE_URL + 'a/nativehtml/cx.CXGetAllResponses', data);
        }
        else {
            return this.postThroughApiSilently(dispatch, types.CX_FEEDBACK_LIST, global.BASE_URL + 'a/nativehtml/cx.CXGetAllResponses', data)
        }
    }

    updateCXFeedbackStatus(dispatch, data) {
        return this.postThroughApi(dispatch, types.CX_FEEDBACK_UPDATED, global.BASE_URL + 'a/nativehtml/cx.CXAddOrUpdateTicket', data);
    }

    getProfileDetails(dispatch, data = {}) {
        return this.getFromApi(dispatch, types.COMMUNITIES_PROFILE, global.BASE_URL + 'a/nativehtml/panel.member.PanelMemberAccountStats', data);
    }


	getPanelLeaderBoard(dispatch, type = types.COMMUNITIES_LEADERBOARD_ALLTIME, data = {}) {
        return this.postThroughApi(dispatch, type, global.BASE_URL + 'a/nativehtml/panel.leaderboard.PanelLeaderBoard', data);
    }

    getRewards(dispatch, data = {}) {
        return this.getFromApi(dispatch, types.COMMUNITIES_REWARDS, global.BASE_URL + 'a/nativehtml/panel.reward.PanelQPointRewards', data);
    }

    redeemRewards(dispatch, data = {}) {
        return this.postThroughApi(dispatch, types.COMMUNITIES_REDEEM_REWARDS, global.BASE_URL + 'a/nativehtml/panel.reward.PanelRewardRedeem', data)
    }

    getPanelPollDetails(successCallback, data = {}, errorCallback = () => {
    }) {
        return this.callAPI(global.BASE_URL + 'a/nativehtml/panel.poll.PanelPollDetails', successCallback, data, errorCallback);
    }

    submitPollResult(successCallback, data = {}, errorCallback = () => {}) {
        return this.callAPI(global.BASE_URL + 'a/nativehtml/panel.poll.PanelPollResultSubmit', successCallback, data, errorCallback);
    }

    getPanelHome(dispatch, data = {}) {
        return this.postThroughApi(dispatch, types.COMMUNITIES_HOME, global.BASE_URL + 'a/nativehtml/panel.PanelAppHomeScreen', data);
    }

    getPanelSurvey(dispatch, data = {}) {
        return this.getFromApi(dispatch, types.COMMUNITIES_SURVEYS, global.BASE_URL + 'a/nativehtml/panel.member.PanelMemberSurveys', data);
    }

    getPanelMemberActivityStats(dispatch, type = types.COMMUNITIES_ACTIVITY_HISTORY_ALLTIME, data = {}) {
        return this.postThroughApi(dispatch, type, global.BASE_URL + 'a/nativehtml/panel.member.PanelMemberActivitiesStats', data);
    }

    getPanelAlert(successCallback, data = {}, errorCallback = () => {}) {
        return this.callAPI(global.BASE_URL + 'a/nativehtml/panel.mobileapplink.PanelAlertMobileAppLinks', successCallback, data, errorCallback);
    }

    sendPanelMemberInvitation(successCallback, data = {}, errorCallback = () => {}) {
        return this.callAPI(global.BASE_URL + 'a/nativehtml/panel.member.PanelMemberInvitation', successCallback, data, errorCallback);
    }

    updatePanelMemberDetails(dispatch, data = {}) {
        return this.postThroughApi(dispatch, types.COMMUNITIES_UPDATE_PROFILE, global.BASE_URL + 'a/nativehtml/panel.member.PanelMemberDetailUpdate', data);
    }

	getPanelLanguageList(dispatch, data = {}) {
        return this.getFromApi(dispatch, types.COMMUNITIES_LANGUAGE_LIST, global.BASE_URL + 'a/nativehtml/panel.language.PanelLanguages', data);
    }

    getPanelDiscussions(dispatch, data = {}) {
        if(data.page && data.page > 0){
            return this.postThroughApiSilently(dispatch, types.COMMUNITIES_PANEL_DISCUSSION_LIST, global.BASE_URL + 'a/nativehtml/panel.chat.PanelLiveDiscussion', data);
        }
        return this.getFromApi(dispatch, types.COMMUNITIES_PANEL_DISCUSSION_LIST, global.BASE_URL + 'a/nativehtml/panel.chat.PanelLiveDiscussion', data);
    }

    getPanelIdeaCategories(dispatch, data = {}) {
        if(data.page && data.page > 0){
            return this.postThroughApiSilently(dispatch, types.COMMUNITIES_APPEND_IDEA_CATEGORIES, global.BASE_URL + 'a/nativehtml/panel.idea.PanelIdeaCampaigns', data);
        }
        return this.getFromApi(dispatch,  types.COMMUNITIES_IDEA_CATEGORY_LIST, global.BASE_URL + 'a/nativehtml/panel.idea.PanelIdeaCampaigns', data);
    }

    addPanelIdea(dispatch, data) {
        return this.postThroughApi(dispatch, types.COMMUNITIES_ADD_IDEA, global.BASE_URL + 'a/nativehtml/panel.idea.AddPanelIdea', data);
    }

    editPanelIdea(dispatch, data) {
        return this.postThroughApi(dispatch, types.COMMUNITIES_EDIT_IDEA, global.BASE_URL + 'a/nativehtml/panel.idea.EditPanelIdea', data);
    }

    getPanelCampaignIdeas(dispatch, data) {
        if(data.page && data.page > 0){
            return this.postThroughApiSilently(dispatch, types.COMMUNITIES_CAMPAIGN_IDEA_LIST, global.BASE_URL + 'a/nativehtml/panel.idea.IdeasForIdeaCampaign', data);
        }
        return this.postThroughApi(dispatch, types.COMMUNITIES_CAMPAIGN_IDEA_LIST, global.BASE_URL + 'a/nativehtml/panel.idea.IdeasForIdeaCampaign', data);
    }

    addUpdateIdeaVote(dispatch, data) {
        return this.postThroughApiSilently(dispatch, types.COMMUNITIES_ADD_UPDATE_IDEA_VOTE, global.BASE_URL + 'a/nativehtml/panel.idea.AddUpdateIdeaVote', data);
    }

    addUpdateIdeaFavorite(dispatch, data) {
        return this.postThroughApiSilently(dispatch, types.COMMUNITIES_ADD_UPDATE_IDEA_FAVORITE, global.BASE_URL + 'a/nativehtml/panel.idea.MarkIdeaAsFavourite', data);
    }

    getPanelIdeaComments(dispatch, data) {
        if(data.page && data.page > 0){
            return this.postThroughApiSilently(dispatch, types.COMMUNITIES_IDEA_COMMENTS, global.BASE_URL + 'a/nativehtml/panel.idea.IdeaComments', data);
        }
        return this.postThroughApi(dispatch, types.COMMUNITIES_IDEA_COMMENTS, global.BASE_URL + 'a/nativehtml/panel.idea.IdeaComments', data);
    }

    addUpdateIdeaComment(dispatch, data) {
        return this.postThroughApi(dispatch, types.COMMUNITIES_ADD_UPDATE_IDEA_COMMENT, global.BASE_URL + 'a/nativehtml/panel.idea.AddUpdateIdeaComment', data);
    }
    addUpdateTopicComment(dispatch, data) {
        return this.postThroughApi(dispatch, types.COMMUNITIES_ADD_UPDATE_TOPIC_COMMENT, global.BASE_URL + 'a/nativehtml/panel.topic.AddUpdateDiscussionTopicComment', data);
    }

    deleteIdeaComment(dispatch, data) {
        return this.postThroughApi(dispatch, types.COMMUNITIES_DELETE_IDEA_COMMENT, global.BASE_URL + 'a/nativehtml/panel.idea.DeleteIdeaComment', data);
    }

    deleteTopicComment(dispatch, data) {
        return this.postThroughApi(dispatch, types.COMMUNITIES_DELETE_TOPIC_COMMENT, global.BASE_URL + 'a/nativehtml/panel.topic.DeleteDiscussionTopicComment', data);
    }

    deleteIdea(dispatch, data) {
        return this.postThroughApi(dispatch, types.COMMUNITIES_DELETE_IDEA, global.BASE_URL + 'a/nativehtml/panel.idea.DeletePanelIdea', data);
    }

    deleteTopic(dispatch, data) {
        return this.postThroughApi(dispatch, types.COMMUNITIES_DELETE_IDEA, global.BASE_URL + 'a/nativehtml/panel.topic.DeletePanelDiscussionTopic', data);
    }

    getPanelTopicCategories(dispatch, data = {}) {
        if(data.page && data.page > 0){
            return this.postThroughApiSilently(dispatch, types.COMMUNITIES_APPEND_TOPIC_CATEGORIES, global.BASE_URL + 'a/nativehtml/panel.topic.PanelTopicCategories', data);
        }
        return this.getFromApi(dispatch,  types.COMMUNITIES_TOPIC_CATEGORY_LIST, global.BASE_URL + 'a/nativehtml/panel.topic.PanelTopicCategories', data);
    }

    addPanelDiscussionTopic(dispatch, data) {
        return this.postThroughApi(dispatch, types.COMMUNITIES_ADD_TOPIC, global.BASE_URL + 'a/nativehtml/panel.topic.AddPanelDiscussionTopic', data);
    }

    editPanelDiscussionTopic(dispatch, data) {
        return this.postThroughApi(dispatch, types.COMMUNITIES_EDIT_TOPIC, global.BASE_URL + 'a/nativehtml/panel.topic.EditPanelDiscussionTopic', data);
    }

    addUpdateTopicFavorite(dispatch, data) {
        return this.postThroughApiSilently(dispatch, types.COMMUNITIES_ADD_UPDATE_TOPIC_FAVORITE, global.BASE_URL + 'a/nativehtml/panel.topic.MarkPanelDiscussionTopicAsFavourite', data);
    }

    getPanelDiscussionTopics(dispatch, data) {
        if(data.page && data.page > 0){
            return this.postThroughApiSilently(dispatch, types.COMMUNITIES_TOPIC_LIST, global.BASE_URL + 'a/nativehtml/panel.topic.PanelDiscussionTopics', data);
        }
        return this.postThroughApi(dispatch, types.COMMUNITIES_TOPIC_LIST, global.BASE_URL + 'a/nativehtml/panel.topic.PanelDiscussionTopics', data);
    }

    addUpdateTopicVote(dispatch, data) {
        return this.postThroughApiSilently(dispatch, types.COMMUNITIES_ADD_UPDATE_TOPIC_VOTE, global.BASE_URL + 'a/nativehtml/panel.topic.AddUpdateDiscussionTopicVote', data);
    }

    getPanelTopicComments(dispatch, data) {
        if(data.page && data.page > 0){
            return this.postThroughApiSilently(dispatch, types.COMMUNITIES_TOPIC_COMMENTS, global.BASE_URL + 'a/nativehtml/panel.topic.DiscussionTopicComments', data);
        }
        return this.postThroughApi(dispatch, types.COMMUNITIES_TOPIC_COMMENTS, global.BASE_URL + 'a/nativehtml/panel.topic.DiscussionTopicComments', data);
    }

    getPanelLocationSurveyData(dispatch, data) {
        return this.getFromApiSilently(dispatch, types.COMMUNITIES_GET_PANEL_LOCATION_SURVEY_DATA, global.BASE_URL + 'a/nativehtml/panel.locationsurvey.LocationSurveys', data);
    }

    updatePanelPreferedLanguage(dispatch, data = {}) {
        return this.postThroughApi(dispatch, types.COMMUNITIES_CHANGE_LANGUAGE, global.BASE_URL + 'a/nativehtml/panel.language.UpdatePanelLanguage', data);
    }

    callLogoutAPI(successCallback) {
        return this.callAPI(global.BASE_URL + 'a/nativehtml/panel.auth.PanelLogout', successCallback);
    }




  // registerPushToken(successCallback, appName = "", data = {}, errorCallback = () => { }, baseURL) {
  //     return this.callAPI(global.BASE_URL + 'a/nativehtml/' + this.getPushTokenRegisterRoute(appName) + '', successCallback, data, errorCallback);
  // }

  getCXDashBoard(successCallback, data = {}, errorCallback = () => { }) {
    return this.callAPI(global.BASE_URL + 'a/nativehtml/cx.CXHome', successCallback, data, errorCallback);
  }
  getDetractorTickets(successCallback, data = {}, errorCallback = () => { }) {
    return this.callAPI(global.BASE_URL + 'a/nativehtml/cx.CXDetractorTicket', successCallback, data, errorCallback);
  }

  getProfileDetails(dispatch, data = {}) {
    return this.getFromApi(dispatch, types.COMMUNITIES_PROFILE, global.BASE_URL + 'a/nativehtml/panel.member.PanelMemberAccountStats', data);
  }

  getRewards(dispatch, data = {}) {
    return this.getFromApi(dispatch, types.COMMUNITIES_REWARDS, global.BASE_URL + 'a/nativehtml/panel.reward.PanelQPointRewards', data);
  }
  redeemRewards(dispatch, data = {}) {
    return this.postThroughApi(dispatch, types.COMMUNITIES_REDEEM_REWARDS, global.BASE_URL + 'a/nativehtml/panel.reward.PanelRewardRedeem', data)
  }
  getPanelPollDetails(successCallback, data = {}, errorCallback = () => { }) {
    return this.callAPI(global.BASE_URL + 'a/nativehtml/panel.poll.PanelPollDetails', successCallback, data, errorCallback);
  }

  submitPollResult(successCallback, data = {}, errorCallback = () => { }) {
    return this.callAPI(global.BASE_URL + 'a/nativehtml/panel.poll.PanelPollResultSubmit', successCallback, data, errorCallback);
  }

  getPanelHome(dispatch, data = {}) {
    return this.getFromApi(dispatch, types.COMMUNITIES_HOME, global.BASE_URL + 'a/nativehtml/panel.PanelAppHomeScreen', data);
  }

  getPanelSurvey(dispatch, data = {}) {
    return this.getFromApi(dispatch, types.COMMUNITIES_SURVEYS, global.BASE_URL + 'a/nativehtml/panel.member.PanelMemberSurveys', data);
  }

  getPanelMemberActivityStats(dispatch, type = types.COMMUNITIES_ACTIVITY_HISTORY_ALLTIME, data = {}) {
    return this.postThroughApi(dispatch, type, global.BASE_URL + 'a/nativehtml/panel.member.PanelMemberActivitiesStats', data);
  }

  getPanelAlert(successCallback, data = {}, errorCallback = () => { }) {
    return this.callAPI(global.BASE_URL + 'a/nativehtml/panel.mobileapplink.PanelAlertMobileAppLinks', successCallback, data, errorCallback);
  }

  sendPanelMemberInvitation(successCallback, data = {}, errorCallback = () => { }) {
    return this.callAPI(global.BASE_URL + 'a/nativehtml/panel.member.PanelMemberInvitation', successCallback, data, errorCallback);
  }

  updatePanelMemberDetails(dispatch, data = {}) {
    return this.postThroughApi(dispatch, types.COMMUNITIES_UPDATE_PROFILE, global.BASE_URL + 'a/nativehtml/panel.member.PanelMemberDetailUpdate', data);
  }
  registerPushToken(successCallback, appName = "", data = {}, errorCallback = () => { }) {
    return this.callAPI(global.BASE_URL + 'a/nativehtml/' + this.getPushTokenRegisterRoute(appName) + '', successCallback, data, errorCallback);
  }

  getPanelLanguageList(dispatch, data = {}) {
    return this.getFromApi(dispatch, types.COMMUNITIES_LANGUAGE_LIST, global.BASE_URL + 'a/nativehtml/panel.language.PanelLanguages', data);
  }

  getPanelDiscussions(dispatch, data = {}) {
    return this.getFromApi(dispatch, types.COMMUNITIES_PANEL_DISCUSSION_LIST, global.BASE_URL + 'a/nativehtml/panel.chat.PanelLiveDiscussion', data);
  }
  getPanelIdeaCategories(dispatch, data = {}) {
    return this.getFromApi(dispatch, (data.page === 0) ? types.COMMUNITIES_IDEA_CATEGORY_LIST : types.COMMUNITIES_APPEND_IDEA_CATEGORIES, global.BASE_URL + 'a/nativehtml/panel.idea.PanelIdeaCampaigns', data);
  }
  addPanelIdea(dispatch, data) {
    return this.postThroughApi(dispatch, types.COMMUNITIES_ADD_IDEA, global.BASE_URL + 'a/nativehtml/panel.idea.AddPanelIdea', data);
  }
  getPanelCampaignIdeas(dispatch, data) {
    return this.postThroughApi(dispatch, types.COMMUNITIES_CAMPAIGN_IDEA_LIST, global.BASE_URL + 'a/nativehtml/panel.idea.IdeasForIdeaCampaign', data);
  }
  addUpdateIdeaVote(dispatch, data) {
    return this.postThroughApiSilently(dispatch, types.COMMUNITIES_ADD_UPDATE_IDEA_VOTE, global.BASE_URL + 'a/nativehtml/panel.idea.AddUpdateIdeaVote', data);
  }
  getPanelTopicCategories(dispatch, data = {}) {
    return this.getFromApi(dispatch, (data.page === 0) ? types.COMMUNITIES_TOPIC_CATEGORY_LIST : types.COMMUNITIES_APPEND_TOPIC_CATEGORIES, global.BASE_URL + 'a/nativehtml/panel.topic.PanelTopicCategories', data);
  }
  addPanelDiscussionTopic(dispatch, data) {
    return this.postThroughApi(dispatch, types.COMMUNITIES_ADD_TOPIC, global.BASE_URL + 'a/nativehtml/panel.topic.AddPanelDiscussionTopic', data);
  }
  getPanelDiscussionTopics(dispatch, data) {
    return this.postThroughApi(dispatch, types.COMMUNITIES_TOPIC_LIST, global.BASE_URL + 'a/nativehtml/panel.topic.PanelDiscussionTopics', data);
  }
  addUpdateDiscussionTopicVote(dispatch, data) {
    return this.postThroughApiSilently(dispatch, types.COMMUNITIES_ADD_UPDATE_TOPIC_VOTE, global.BASE_URL + 'a/nativehtml/panel.topic.AddUpdateDiscussionTopicVote', data);
  }
  updatePanelPreferedLanguage(dispatch, data = {}) {
    return this.postThroughApi(dispatch, types.COMMUNITIES_CHANGE_LANGUAGE, global.BASE_URL + 'a/nativehtml/panel.language.UpdatePanelLanguage', data);
  }

  // Get list of categories for review
  getFlashLetReviewCompetencies(dispatch, data = {}) {
    return this.getFromApi(dispatch, types.REVIEW_CATEGORIES, global.BASE_URL + urlConstants.FLASHLET_GET_REVIEW_COMPETENCY,
      data);
  }

  // Get list of review data list
  getFlashLetReviewCompetencyItems(successCallBack,data = {},errorCallBack = () => {}) {
      return this.callAPI(global.BASE_URL + urlConstants.FLASHLET_GET_REVIEW_ATTRIBUTES,successCallBack,
          data,errorCallBack);
    }

    getFlashLetReviewInfo(dispatch, data = {}) {
        return this.getFromApi(dispatch, types.REVIEW_INFO, global.BASE_URL + urlConstants.FLASHLET_REVIEW_INFO,
      data);
  }

  // Get list of employees for review
  getFlashLetReviewEmployeeList(dispatch, data = {}) {
    return this.getFromApi(dispatch, types.REVIEW_EMPLOYEE, global.BASE_URL + urlConstants.FLASHLET_GET_EMPLOYEE,
      data);
  }

  getFlashLetReviewEmployeeListMyNetwork(dispatch, data = {}) {
    return this.getFromApi(dispatch, types.REVIEW_EMPLOYEE_NETWORK, global.BASE_URL + urlConstants.FLASHLET_GET_EMPLOYEE,
      data);
  }

  //Get list if questions asked
    getAskedQuestionList(dispatch, data = {}) {
        return this.postThroughApi(dispatch, types.ASKED_QUESTIONS,global.BASE_URL + 'a/nativehtml/flashlet.pulse.queue.ShowPulseQueue', data);
    }

  //Add a new question
    submitQuestion(dispatch, data) {
        return this.postThroughApi(dispatch, types.SUBMIT_QUESTION,global.BASE_URL + 'a/nativehtml/flashlet.pulse.queue.AddQuestion', data);
    }

    //Delete question from list
    deleteQuestion(dispatch, data = {}) {
        return this.postThroughApi(dispatch, types.DELETE_QUESTION,global.BASE_URL + 'a/nativehtml/flashlet.pulse.queue.DeleteQuestion', data);
    }

    //get pending questions
    getPendingQuestionsList(dispatch, data = {}) {
        return this.postThroughApi(dispatch, types.PENDING_QUESTIONS, global.BASE_URL + 'a/nativehtml/flashlet.pulse.queue.ShowPendingQueue', data);
    }

    //add response
    addQuestionResponse(dispatch, data = {}) {
        return this.postThroughApi(dispatch, types.ADD_QUESTION_RESPONSE, global.BASE_URL + 'a/nativehtml/flashlet.pulse.queue.AddResponse', data);
    }
    //get history list
    getPulseQueueHistoryList(dispatch, data = {}){
        return this.postThroughApi(dispatch, types.HISTORY_LIST, global.BASE_URL + 'a/nativehtml/flashlet.pulse.queue.ShowHistory', data);
    }

    getPulseQueueHistoryReport(dispatch, data){
        return this.postThroughApi(dispatch, types.HISTORY_REPORT, global.BASE_URL + 'a/nativehtml/flashlet.pulse.queue.ShowReport', data);
    }



    getFlashLetPathFinder(dispatch, data = {}) {
        return this.getFromApi(dispatch, types.PATH_FINDER, global.BASE_URL + 'a/nativehtml/flashlet.pathfinder.FlashLetGetPathFinder', data);
    }
    getFlashLetPathFinderResults(dispatch, data = {}) {
        return this.getFromApi(dispatch, types.PATH_FINDER_RESULTS, global.BASE_URL + 'a/nativehtml/flashlet.pathfinder.FlashLetGetPathFinderResultsForEmployee', data);
    }
    submitPathFinderResponse(dispatch, response) {
        return this.postThroughApi(dispatch, types.PATH_FINDER_RESPONSE,global.BASE_URL + 'a/nativehtml/flashlet.pathfinder.FlashLetCollectPathfinderResponse', response);
    }


    getFlashLetMyReviewList(dispatch, data = {}) {
        return this.getFromApi(dispatch, types.REVIEW_MYREVIEWS, global.BASE_URL + urlConstants.FLASHLET_GET_MY_REVIEWS,
            data);
    }

    getFlashLetMyReviewRequestsList(dispatch, data = {}) {
        return this.getFromApi(dispatch, types.REVIEW_MYREQUESTS, global.BASE_URL + urlConstants.FLASHLET_GET_MY_REQUESTS,
            data);
    }

    getFlashLetReceivedReviewRequestsList(dispatch, data = {}) {
        return this.getFromApi(dispatch, types.REVIEW_RECEIVED_REQUESTS, global.BASE_URL + urlConstants.FLASHLET_GET_RECEIVED_REQUESTS,
            data);
    }

    getFlashLetMyReviewReceived(dispatch, data = {}) {
        return this.getFromApi(dispatch, types.REVIEW_MYREVIEWS_RECEIVED, global.BASE_URL + urlConstants.FLASHLET_GET_MY_REVIEWS_RECEIVED,
            data);
    }

    addFlashLetReviewResponse(dispatch, data = {}) {
        return this.postThroughApi(dispatch, types.REVIEW_COLLECT_RESPONSE, global.BASE_URL + urlConstants.FLASHLET_REVIEW_COLLECT_RESPONSE, data);
    }

    addFlashLetReviewRequest(dispatch, data = {}) {
        return this.postThroughApi(dispatch, types.REVIEW_COLLECT_REQUEST, global.BASE_URL + urlConstants.FLASHLET_REVIEW_COLLECT_REQUEST, data);
    }

  getPushTokenRegisterRoute(appName) {
      switch (appName) {
          case "HealthTrust":
          case "Communities":
          case "Energizer Idea Lab":
              return "panel.notification.PanelRegisterPushToken";
          case "Workforce":
          case "Pulse":
              return "flashlet.general.FlashLetRegisterPushToken";
          default:
              return "panel.notification.PanelRegisterPushToken";
    }

  }



}

export let apiHandler = new APIHandler();
