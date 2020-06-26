import UpdateFeedback from './UpdateFeedback';
import {connect} from 'react-redux';
import {setSelectedFeedback, updateFeedbacks} from '../../../actions/FeedbackActions';

const mapStateToProps = (state) => ({
    feedbackList: state.feedbackList,
    feedbackDetail: state.selectedFeedback,
    ticketStatuses: state.ticketStatuses,
    isLoading: state.isLoading,
    isConnected : state.network.isConnected
});

const mapDispatchToProps = (dispatch) => ({
    setSelectedFeedback: (data) => dispatch(setSelectedFeedback(data)),
    updateFeedback: (data) => dispatch(updateFeedbacks(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateFeedback);
