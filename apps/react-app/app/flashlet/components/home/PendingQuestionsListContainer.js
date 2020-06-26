import { connect } from 'react-redux';
import Ask from "./Ask";
import {getPendingQuestionList} from "../../actions/PendingQuestionsActions";
import {addQuestionResponse} from "../../actions/AddQuestionResponseActions";


const mapStateToProps = state => ({
  pendingQuestions: state.pendingQuestions,
  isLoading: state.isLoading,
  error: state.error.message,
});

const mapDispatchToProps = dispatch => ({
  getPendingQuestionList: () => dispatch(getPendingQuestionList()),
  addQuestionResponse: (reqData) => dispatch(addQuestionResponse(reqData))
});

export default connect(mapStateToProps, mapDispatchToProps)(Ask);
