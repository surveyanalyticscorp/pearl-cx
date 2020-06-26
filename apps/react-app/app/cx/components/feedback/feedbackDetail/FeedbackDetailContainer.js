import FeedbackDetail from './FeedbackDetail';
import { connect } from 'react-redux';
import { fetchFeedbackDetail, updatedFeedback } from '../../../actions/FeedbackActions';

const mapStateToProps = state => ({
  feedbackDetail: state.selectedFeedback,
    ticketStatuses: state.ticketStatuses,
});

const mapDispatchToProps = dispatch => ({
  updatedFeedback: (status) => dispatch(updatedFeedback(status))
});

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackDetail);
