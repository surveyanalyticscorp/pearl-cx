import { connect } from 'react-redux';

import ReviewCategories from './ReviewCategories';
import { fetchReviewCategories } from '../../../actions/ReviewActions';

const mapStateToProps = (state) => ({
  isLoading: state.isLoading,
  error: state.error.message,
  isConnected: state.isConnected,
  reviewCategories: state.reviewCategories,
  selectedEmployeeInfo: state.employeeInfo,
  maxCompetencyCount:state.reviewInfo.maxCompetencyCount
});

const mapDispatchToProps = (dispatch) => ({
  fetchReviewCategories: () => dispatch(fetchReviewCategories())
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewCategories);
