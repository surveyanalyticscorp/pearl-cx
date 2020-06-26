import { apiHandler } from '../../global/api/APIHandler';
import * as types from '../../global/api/types';
import * as _ from 'lodash';

// Get list of review data list
export function fetchReviewItems(successCallBack,requestData,errorCallBack) {
    return apiHandler.getFlashLetReviewCompetencyItems(successCallBack,requestData,errorCallBack);
}

// Get list of categories for review
export function fetchReviewCategories(requestData) {
  return dispatch => {
    return apiHandler.getFlashLetReviewCompetencies(dispatch, requestData);
  };
}

export function submitReviewResponse(requestData) {
    return dispatch => {
        return apiHandler.addFlashLetReviewResponse(dispatch, requestData);
    };
}

export function submitReviewRequest(requestData) {
    return dispatch => {
        return apiHandler.addFlashLetReviewRequest(dispatch, requestData);
    };
}

export function getReviewEmployeeListMyNetwork(requestData) {
  return (dispatch, getState) => {
    return apiHandler.getFlashLetReviewEmployeeListMyNetwork(dispatch, requestData);
  };
}

export function getReviewEmployeeList(requestData) {
  return (dispatch, getState) => {
    return apiHandler.getFlashLetReviewEmployeeList(dispatch, requestData);
  };
}

export function getNextReview(reviewCategory, reviewFilterCategories) {
  //const filterLength = reviewFilterCategories.length;
  let nextCategory = null;
  //let j;
  let lastCategoryReview = false;
  const matchedReviewIndex = reviewFilterCategories.findIndex(
    category => category.id === reviewCategory.id
  );

  if (matchedReviewIndex !== -1) {
    nextCategory = reviewFilterCategories[matchedReviewIndex + 1];
    if (reviewFilterCategories.length === matchedReviewIndex + 1) {
      lastCategoryReview = true;
    }
  }

  return { nextCategory, lastCategoryReview };
}

export function setReviewCategoryItems(
  reviewCategory,
  reviewCategoryItems,
  reviewItems
) {
  return (dispatch, getState) => {
    let isNewReview = true;

    if (reviewCategoryItems.length > 0) {
      const matchedReviewIndex = reviewCategoryItems.findIndex(
        item => item.id === reviewCategory.id
      );

      if (matchedReviewIndex !== -1) {
        const reviewItem = reviewCategoryItems[matchedReviewIndex];
        reviewCategoryItems[matchedReviewIndex] = Object.assign(
          {},
          reviewItem,
          { items: reviewItems }
        );
        isNewReview = false;
      }
    }

    if (isNewReview) {
      if (!reviewCategoryItems.length) {
        const reviewCategoryItems = [];
      }
      reviewCategory.items = reviewItems;
      reviewCategoryItems.push(reviewCategory);
    }

    dispatch({ type: 'REVIEW_CATEGORY_ITEMS', payload: reviewCategoryItems });
  };
}

export function getReviewNextAction(actionId) {
  let sceneView;
  switch (actionId) {
    case 1:
      sceneView = 'reviewInfiniteScrollOval'; // take scene reference from Flashlet.js router
      break;
    case 2:
      sceneView = 'reviewSwiper';
      break;
    case 3:
      sceneView = 'reviewDragNDrop';
      break;
    default:
      sceneView = 'reviewSwiper';
  }

  return sceneView;
}

export function setEmployeeInfo(employeeData) {
  return dispatch => {
    dispatch({ type: types.EMPLOYEE_INFO, data: employeeData });
  };
}

export function getReviewInfo() {
  return dispatch => {
    return apiHandler.getFlashLetReviewInfo(dispatch);
  };
}

export function fetchMyReviews() {
  return dispatch => {
    return apiHandler.getFlashLetMyReviewList(dispatch);
  };
}


export function fetchMyReviewRequests() {
  return dispatch => {
    return apiHandler.getFlashLetMyReviewRequestsList(dispatch);
  };
}

export function fetchReceivedRequests() {
  return dispatch => {
    return apiHandler.getFlashLetReceivedReviewRequestsList(dispatch);
  };
}

export function fetchMyReviewsReceived() {
  return dispatch => {
    return apiHandler.getFlashLetMyReviewReceived(dispatch);
  };
}

export function setReviews(reviewData) {
    return dispatch => {
        dispatch({ type: 'REVIEW_MYREVIEWS', payload: reviewData });
    }
}

export function resetCategoryItems(data) {
    return dispatch => {
        dispatch({ type: 'REVIEW_CATEGORY_ITEMS', payload: data });
    }
}

export function resetFilterCategories(data) {
    return dispatch => {
        dispatch({ type: 'REVIEW_FILTER_CATEGORIES', payload: data });
    }
}
