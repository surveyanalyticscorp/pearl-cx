import { connect } from 'react-redux';

import {getAskedQuestionList,} from "../../../actions/AskHomePageActions";
import AskedQuestionsList from "./AskedQuestionsList";
import {deleteQuestion} from "../../../actions/DeleteQuestionActions";

const mapStateToProps = state => ({
  questions: state.questions,
  isLoading: state.isLoading,
  error: state.error.message,
});

const mapDispatchToProps = dispatch => ({
  getAskedQuestionList: () => dispatch(getAskedQuestionList()),
  deleteQuestion : (data) => dispatch(deleteQuestion(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AskedQuestionsList);
