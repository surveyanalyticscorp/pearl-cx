import { connect } from 'react-redux';
import { fetchReviewItems } from '../../../actions/ReviewActions';

import ReviewSwiper from './ReviewSwiper';

const mapStateToProps = (state) => ({
  reviewItems: state.reviewData,
  reviewCategoryItems: state.reviewCategoryItems,
  reviewFilterCategories: state.reviewFilterCategories,
  selectedEmployeeInfo: state.employeeInfo,
  isLoading:state.isLoading,
  maxCompetencyCount: state.reviewInfo.maxCompetencyCount
});

const mapDisPatchToProps = (dispatch) => ({
  setReviewCategoryItems: (reviewCategoryItems) => dispatch({ type: 'REVIEW_CATEGORY_ITEMS', payload: reviewCategoryItems })
});

export default connect(mapStateToProps, mapDisPatchToProps)(ReviewSwiper);

