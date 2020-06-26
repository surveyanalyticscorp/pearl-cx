import { connect } from "react-redux";

import ReviewDragNDrop from "./ReviewDragNDrop";

import { fetchReviewItems, setReviewCategoryItems } from "../../../actions/ReviewActions";

const mapDispatchToProps = dispatch => ({
  setReviewCategoryItems: (reviewCategory, reviewCategoryItems, allBoxItems) =>
    dispatch(
      setReviewCategoryItems(reviewCategory, reviewCategoryItems, allBoxItems)
    )
});

const mapStateToProps = store => ({
  isLoading: store.isLoading,
  error: store.error.message,
  reviewItems: store.reviewData,
  isConnected: store.isConnected,
  selectedEmployeeInfo: store.employeeInfo,
  reviewCategoryItems: store.reviewCategoryItems,
  reviewFilterCategories: store.reviewFilterCategories,
  maxCompetencyCount: store.reviewInfo.maxCompetencyCount


});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewDragNDrop);
