import { connect } from 'react-redux';
import { setReviews, resetCategoryItems, resetFilterCategories } from '../../../actions/ReviewActions';

import ReviewSummary from './ReviewSummary';

import {
    submitReviewResponse
} from "../../../actions/ReviewActions";

const mapStateToProps = (store) => ({
  reviewEmployee: store.employeeInfo,
  reviewMyReviews: store.reviewMyReviews,
  reviewCategoryItems: store.reviewCategoryItems,
  reviewFilterCategories: store.reviewFilterCategories
});

const mapDispatchToProps = (dispatch) => ({
    setReviews: reviewData => dispatch(setReviews(reviewData)),
    resetCategoryItems: data => dispatch(resetCategoryItems(data)),
    resetFilterCategories: (data) => dispatch(resetFilterCategories(data)),
    submitReviewResponse: reqData => dispatch(submitReviewResponse(reqData))
});

export default connect(mapStateToProps,mapDispatchToProps)(ReviewSummary);
