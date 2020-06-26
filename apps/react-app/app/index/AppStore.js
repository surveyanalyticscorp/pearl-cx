/**
 * Created by sachinsable on 12/07/17.
 */
var AppDispatcher = require('./AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

export const PUSH_NOTIFICATION_OPENED = 'push_notification_opened';
export const SCENE_TRANSITION = 'scene_transition';
export const BACK_NAVIGATION = 'back_navigation';
export const DONE_CLICKED = 'done_clicked';
export const OBJ_CLICKED = 'obj_clicked';
export const GOALS_FILTER_CLICKED = 'goal_filter_clicked';
export const OBJ_EDIT = 'obj_edit';
export const OBJ_EDIT_CLICKED = 'obj_edit_clicked';
export const ON_LOGOUT = 'on_logout';
export const SHOW_LANGUAGE_PICKER = 'show_language_picker';
export const NotificationStore = assign({}, EventEmitter.prototype, {
    addNotificationLisener: function (callback) {
        this.on(PUSH_NOTIFICATION_OPENED, callback);
    },
    removeNotificationListener: function (callback) {
        this.removeListener(PUSH_NOTIFICATION_OPENED, callback);
    },
    emitNotificationOpened: function (notification) {
        this.emit(PUSH_NOTIFICATION_OPENED, notification);
    }
});

var SceneTransitionStore = assign({}, EventEmitter.prototype, {
    addSceneTransitionListener: function (callback) {
        this.on(SCENE_TRANSITION, callback);
    },
    removeSceneTransitionListener: function (callback) {
        this.removeListener(SCENE_TRANSITION, callback);
    },
    emitSceneTransition: function (data) {
        this.emit(SCENE_TRANSITION, data);
    }
});

var NavigationStore = assign({}, EventEmitter.prototype, {
    addBackNavigationListener: function (callback) {
        this.on(BACK_NAVIGATION, callback);
    },
    removeBackNavigationListener: function (callback) {
        this.removeListener(BACK_NAVIGATION, callback);
    },
    onBackNavigation: function (data) {
        this.emit(BACK_NAVIGATION, data);
    }
});

var DoneButtonStore = assign({}, EventEmitter.prototype, {
    addDoneButtonListener: function (callback) {
        this.on(DONE_CLICKED, callback);
    },
    removeDoneButtonListener: function (callback) {
        // this.removeListener(DONE_CLICKED, callback);
        if (this._events && this._events[DONE_CLICKED]) {
            delete this._events[DONE_CLICKED];
        }
    },

    doneClicked: function (data) {
        this.emit(DONE_CLICKED, data);
    }
});

var ObjButtonStore = assign({}, EventEmitter.prototype, {
    addObjButtonListener: function (callback) {
        this.on(OBJ_CLICKED, callback);
    },
    removeObjButtonListener: function (callback) {
        // this.removeListener(OBJ_CLICKED, callback);
        if (this._events && this._events[OBJ_CLICKED]) {
            delete this._events[OBJ_CLICKED];
        }
    },

    objClicked: function (data) {
        this.emit(OBJ_CLICKED, data);
    }
});

var GoalFilterStore = assign({}, EventEmitter.prototype, {
    addGoalFilterListener: function (callback) {
        this.on(GOALS_FILTER_CLICKED, callback);
    },
    removeGoalFilterListener: function (callback) {
        // this.removeListener(GOALS_FILTER_CLICKED, callback);
        if (this._events && this._events[GOALS_FILTER_CLICKED]) {
            delete this._events[GOALS_FILTER_CLICKED];
        }
    },

    goalFilterClicked: function (data) {
        this.emit(GOALS_FILTER_CLICKED, data);
    }
});

var ObjEditStore = assign({}, EventEmitter.prototype, {
    addObjEditListener: function (callback) {
        this.on(OBJ_EDIT, callback);
    },
    removeObjEditListener: function (callback) {
        // this.removeListener(OBJ_EDIT, callback);
        if (this._events && this._events[OBJ_EDIT]) {
            delete this._events[OBJ_EDIT];
        }
    },
    objEditClicked: function (data) {
        this.emit(OBJ_EDIT, data);
    }
});

var ObjEditActionStore = assign({}, EventEmitter.prototype, {
    addObjEditActionListener: function (callback) {
        this.on(OBJ_EDIT_CLICKED, callback);
    },
    removeObjEditActionListener: function (callback) {
        // this.removeListener(OBJ_EDIT_CLICKED, callback);
        if (this._events && this._events[OBJ_EDIT_CLICKED]) {
            delete this._events[OBJ_EDIT_CLICKED];
        }
    },

    objEditActionClicked: function (data) {
        this.emit(OBJ_EDIT_CLICKED, data);
    }
});

var LogoutStore = assign({}, EventEmitter.prototype, {
    addLogoutListener: function (callback) {
        this.on(ON_LOGOUT, callback);
    },
    removeLogoutListener: function (callback) {
        this.removeListener(ON_LOGOUT, callback);
    },

    onLogout: function (data) {
        this.emit(ON_LOGOUT, data);
    }
});

var ShowLanguagePickerStore = assign({}, EventEmitter.prototype, {
    addShowLanguagePickerListener: function (callback) {
        this.on(SHOW_LANGUAGE_PICKER, callback);
    },
    removeShowLanguagePickerListener: function (callback) {
        this.removeListener(SHOW_LANGUAGE_PICKER, callback);
    },

    onShowLanguagePickerListener: function (data) {
        this.emit(SHOW_LANGUAGE_PICKER, data);
    }
});

function hanldeNotificationOpened(action) {
    if (action.type === PUSH_NOTIFICATION_OPENED) {
        NotificationStore.emitNotificationOpened(action.data);
    }
}

function handleSceneTransition(action) {
    if (action.type === SCENE_TRANSITION) {
        SceneTransitionStore.emitSceneTransition(action.data);
    }
}

function handleBackNavigation(action) {
    if (action.type === BACK_NAVIGATION) {
        NavigationStore.onBackNavigation(action.data);
    }
}

function handleDoneAction(action) {
    if (action.type === DONE_CLICKED) {
        DoneButtonStore.doneClicked(action.data);
    }
}

function handleObjAction(action) {
    if (action.type === OBJ_CLICKED) {
        ObjButtonStore.objClicked(action.data);
    }
}

function handleObjEditAction(action) {
    if (action.type === OBJ_EDIT) {
        ObjEditStore.objEditClicked(action.data);
    }
}

function handleObjEditClickedAction(action) {
    if (action.type === OBJ_EDIT_CLICKED) {
        ObjEditActionStore.objEditActionClicked(action.data);
    }
}

function handleGoalFilterAction(action) {
    if (action.type === GOALS_FILTER_CLICKED) {
        GoalFilterStore.goalFilterClicked(action.data);
    }
}

function handleLogout(action) {
    if (action.type === ON_LOGOUT) {
        LogoutStore.onLogout(action.data);
    }
}

function handleLangugaePicker(action) {
    if (action.type === SHOW_LANGUAGE_PICKER) {
        ShowLanguagePickerStore.onShowLanguagePickerListener(action.data)
    }
}



NotificationStore.dispatchToken = AppDispatcher.register(hanldeNotificationOpened);
SceneTransitionStore.dispatchToken = AppDispatcher.register(handleSceneTransition);
NavigationStore.dispatchToken = AppDispatcher.register(handleBackNavigation);
DoneButtonStore.dispatchToken = AppDispatcher.register(handleDoneAction);
ObjButtonStore.dispatchToken = AppDispatcher.register(handleObjAction);
ObjEditStore.dispatchToken = AppDispatcher.register(handleObjEditAction);
ObjEditActionStore.dispatchToken = AppDispatcher.register(handleObjEditClickedAction);
GoalFilterStore.dispatchToken = AppDispatcher.register(handleGoalFilterAction);
LogoutStore.dispatchToken = AppDispatcher.register(handleLogout);
ShowLanguagePickerStore.dispatchToken = AppDispatcher.register(handleLangugaePicker);
module.exports = {
    NotificationStore,
    SceneTransitionStore,
    NavigationStore,
    DoneButtonStore,
    ObjButtonStore,
    ObjEditStore,
    ObjEditActionStore,
    GoalFilterStore,
    LogoutStore,
    ShowLanguagePickerStore
};
