// Imports: Dependencies
import {delay, takeEvery, takeLatest, put, take} from 'redux-saga/effects';
import WebServiceHandler from '../api/WebServiceHandler';
import {BASE_URL} from '../api/types';
import {GET_FEEDBACK, FEEDBACK_RECEIVED} from '../actions';

// Worker: Increase Counter Async (Delayed By 4 Seconds)
function* fetchFeedbackAsync() {
  try {
    let token =
      'eyJpc3MiOiJodHRwczovL3FhLnF1ZXN0aW9ucHJvLmNvbS8iLCJ1aWQiOjE3MzI5LCJwaWQiOjEwMjY2LCJleHAiOjE1OTU0MjEzNzcsImlhdCI6MTU5NDgxNjU3NywiYWxnIjoiSFMyNTYifQ.eyJpc3MiOiJodHRwczovL3FhLnF1ZXN0aW9ucHJvLmNvbS8ifQ.0QliYAgAIfKzpwfK4saiU38VLWt5DkGvXmUU_MdMMEk';
    let data = {pageOffset: 0, sentiment: 'All', month: '7', year: '2018'};

    const json = yield WebServiceHandler.post(
      BASE_URL + 'a/nativehtml/cx.CXGetAllResponses',
      {'Auth-Token': token},
      data,
    );

    /*const json = yield fetch(
      'https://newsapi.org/v1/articles?source= cnn&apiKey=c39a26d9c12f48dba2a5c00e35684ecc',
    ).then(response => response.json());*/

    // Dispatch Action To Redux Store
    yield put({
      type: FEEDBACK_RECEIVED,
      value: 1,
      response: json,
    });
  } catch (error) {
    console.log(error);
  }
}

// Watcher: Increase Counter Async
export function* watchGetFeedback() {
  yield takeLatest(GET_FEEDBACK, fetchFeedbackAsync);
}
