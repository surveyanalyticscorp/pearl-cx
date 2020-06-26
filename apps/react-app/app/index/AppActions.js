/**
 * Created by sachinsable on 12/07/17.
 */
var AppDispatcher = require('./AppDispatcher');

var AppActionCreators =  {
    notificationReceived: function (notification) {
        let action = {
            type : 'push_notification_received',
            data : notification
        };
        AppDispatcher.dispatch(action);
    },
    notificationOpened : function(notification){
        let action = {
            type : 'push_notification_opened' ,
            data : notification
        };
        AppDispatcher.dispatch(action);
    },
    sceneTransition: function (data) {
        let action = {
            type : 'scene_transition',
            data : data
        };
        AppDispatcher.dispatch(action);
    },
    backNavigation : function (data) {
        let action = {
            type : 'back_navigation',
            data : data
        };
        AppDispatcher.dispatch(action);
    },
    onDoneClicked: function (data) {
        let action = {
            type: 'done_clicked',
            data: data
        };
        AppDispatcher.dispatch(action);
    },
    onObjAndGoalsStatClicked: function (data) {
        let action = {
            type: 'obj_clicked',
            data: data
        };
        AppDispatcher.dispatch(action);
    },
    onObjAndGoalsEditClicked: function (data) {
        let action = {
            type: 'obj_edit',
            data: data
        };
        AppDispatcher.dispatch(action);
    },
    onObjAndGoalsEditActionClicked: function (data) {
        let action = {
            type: 'obj_edit_clicked',
            data: data
        };
        AppDispatcher.dispatch(action);
    },
    onGoalsFilterClicked: function (data) {
        let action = {
            type: 'goal_filter_clicked',
            data: data
        };
        AppDispatcher.dispatch(action);
    },
    onLogout: function(data){
        let action = {
            type : 'on_logout',
            data : data
        };
        AppDispatcher.dispatch(action);
    },
    showLanguagePicker: function(data){
        let action = {
            type : 'show_language_picker',
            data : data
        };
        AppDispatcher.dispatch(action);
    },

};

module.exports = AppActionCreators;