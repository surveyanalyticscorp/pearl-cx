import {AsyncStorage, Platform, NetInfo} from 'react-native';
import {createStore, applyMiddleware, compose} from 'redux';
import {persistStore, autoRehydrate,purgeStoredState} from 'redux-persist';
import { offlineActionTypes} from 'react-native-offline';

import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension';


//const networkMiddleware = createNetworkMiddleware();
import { createLogger } from "redux-logger";
// on iOS, the listener is fired immediately after registration
// on Android, we need to use `isConnected.fetch`, that returns a promise which resolves with a boolean
function isNetworkConnected(): Promise<boolean> {
    if (Platform.OS === 'ios') {
        return new Promise(resolve => {
            const handleFirstConnectivityChangeIOS = isConnected => {
                NetInfo.isConnected.removeEventListener( // Cleaning up after initial detection
                    'connectionChange',
                    handleFirstConnectivityChangeIOS,
                );
                resolve(isConnected);
            };
            NetInfo.isConnected.addEventListener(
                'connectionChange',
                handleFirstConnectivityChangeIOS,
            );
        });
    }

    return NetInfo.isConnected.fetch();
}

export default function configureStore(appVersion, initialState, rootReducer, callback) {


    const loggerMiddleware = createLogger({predicate: (getState, action) => __DEV__});
    const store = createStore(
        rootReducer,
        initialState,
        composeWithDevTools(
            applyMiddleware(thunkMiddleware),
            autoRehydrate(),
        ),
    );

    AsyncStorage.getItem("APP_VERSION", (error, result) => {
        console.log("App version- " + result);
        if (result !== appVersion) {
            purgeStoredState({ storage: AsyncStorage }).then(() => {
                createPersistorAndCallBack(store, callback);
            });
            AsyncStorage.setItem("APP_VERSION", appVersion);
        }
        createPersistorAndCallBack(store, callback);

    });
    // https://github.com/rt2zz/redux-persist#persiststorestore-config-callback


    return store;
}

function createPersistorAndCallBack(store, callback) {
    const persistor = persistStore(
        store,
        {
            storage: AsyncStorage,
            blacklist: ['routing', 'isLoading', 'network', 'error', 'language'],
            debounce: 500,
        },
        () => {
            // After rehydration completes, we detect initial connection
            isNetworkConnected().then(isConnected => {
                console.log("Rehydration Complete.");
                // store.dispatch({
                //     type: offlineActionTypes.CONNECTION_CHANGE,
                //     payload: isConnected,
                // });
                callback(persistor); // Notify our root component we are good to go, so that we can render our app
            });
        },
    );
}