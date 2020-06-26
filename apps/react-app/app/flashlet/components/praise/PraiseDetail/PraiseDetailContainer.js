import { connect } from 'react-redux';

import PraiseDetail from './PraiseDetail';
import { addNewBadge } from '../../../actions/PraiseActions';
import { getReviewEmployeeList } from '../../../actions/ReviewActions';

const mapStateToProps = state => ({
  isLoading: state.isLoading,
  error: state.error.message,
  isConnected: state.isConnected,
  users: state.reviewEmployeeList,
  praiseNewBadge: state.praiseNewBadge,
  praises: state.praises,
  userBadges: state.userBadges
});

const mapDispatchToProps = dispatch => ({
  fetchEmployeeList: () => dispatch(getReviewEmployeeList()),
  addNewBadge: selectedBadge => dispatch(addNewBadge(selectedBadge))
});
export default connect(mapStateToProps, mapDispatchToProps)(PraiseDetail);
