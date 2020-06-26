import { connect } from 'react-redux';
import {resetCategoryItems, resetFilterCategories} from '../../../actions/ReviewActions';

import AttributeSelection from './AttributeSelection';

const mapStateToProps = (state) => ({
  selectedEmployeeInfo: state.employeeInfo,
  maxCompetencyCount: state.reviewInfo.maxCompetencyCount,
  filterCategories: state.reviewFilterCategories,
  reviewCategoryItems: state.reviewCategoryItems
});

const mapDispatchToProps = dispatch => ({
  resetCategoryItems: data => dispatch(resetCategoryItems(data)),
  resetFilterCategories: data => dispatch(resetFilterCategories(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(AttributeSelection);
