import {connect} from 'react-redux';
import {fetchReviewItems, setReviewCategoryItems} from '../../../actions/ReviewActions';

import ReviewInfiniteScrollOval from './ReviewInfiniteScrollOval';

const mapStateToProps = (state) => ({
    selectedEmployeeInfo: state.employeeInfo,
    maxCompetencyCount: state.reviewInfo.maxCompetencyCount,
    reviewItems: state.reviewData,
    reviewCategoryItems: state.reviewCategoryItems,
    reviewFilterCategories: state.reviewFilterCategories,
    isLoading: state.isLoading

});

const mapDispatchToProps = dispatch => ({
    setReviewCategoryItems: (reviewCategory, reviewCategoryItems, allBoxItems) =>
        dispatch(
            setReviewCategoryItems(reviewCategory, reviewCategoryItems, allBoxItems)
        )
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewInfiniteScrollOval);
