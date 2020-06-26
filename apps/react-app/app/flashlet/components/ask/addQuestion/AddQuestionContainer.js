import { connect } from 'react-redux';


import AddQuestion from "./AddQuestion";
import {submitQuestion} from "../../../actions/AddQuestionActions";

const mapStateToProps = state => ({
  questions: state.questions,
  isLoading: state.isLoading,
  error: state.error.message,
  isConnected: state.isConnected,
});

const mapDispatchToProps = dispatch => ({
  submitQuestion : (data) => dispatch(submitQuestion(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddQuestion);
