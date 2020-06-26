import Feedback from './FeedbackList';
import {connect} from 'react-redux';
import {fetchFeedbacks, setSelectedFeedback} from '../../../actions/FeedbackActions';
import FeedbackListTabs from "./FeedbackListTabs";

const mapStateToProps = state => ({
    feedbacks: state.feedbackList,
    ticketStatuses : state.ticketStatuses,
    isLoading: state.isLoading,
    isConnected : state.network.isConnected
});

const mapDispatchToProps = dispatch => ({
    fetchFeedbacks: (data, isLoadingTail) => dispatch(fetchFeedbacks(data,isLoadingTail)),
    setSelectedFeedback: (feedback) => dispatch(setSelectedFeedback(feedback))
});

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackListTabs);
