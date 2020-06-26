import { connect } from 'react-redux';

import Rate from './Rate';
import { getFlashLetPathFinder,getFlashLetPathFinderResults, submitPathFinderResponse} from '../../actions/PathFinderActions';
import Result from "./Result";


const mapStateToProps = (state) => ({
    pathFinderQuestionData : state.pathFinderQuestionData,
    pathFinderResultsData : state.pathFinderResultsData,
    isLoading: state.isLoading,
    error: state.error.message,
    isConnected: state.isConnected,

});

const mapDispatchToProps = (dispatch) => ({
    getFlashLetPathFinder: () => dispatch(getFlashLetPathFinder()),
    getFlashLetPathFinderResults:  () => dispatch(getFlashLetPathFinderResults()),
    submitPathFinderResponse : (response) => dispatch(submitPathFinderResponse(response))
});

export default connect(mapStateToProps, mapDispatchToProps)(Rate);
