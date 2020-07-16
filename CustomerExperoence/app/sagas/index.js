// Imports: Dependencies
import {all, fork} from 'redux-saga/effects';
// Imports: Redux Sagas

import {watchGetFeedback} from './feedbackSaga';
// Redux Saga: Root Saga
export function* rootSaga() {
  yield all([fork(watchGetFeedback)]);
}
