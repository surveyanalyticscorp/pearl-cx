import { connect } from 'react-redux';

import ObjectiveDetail from './ObjectiveDetail';
import { updateGoalsNObjevtives } from '../../../actions/GoalActions';

const mapStateToProps = state => ({
  goalsnobjectives: state.goalsnobjectives,
  isLoading: state.isLoading,
  error: state.error.message,
  isConnected: state.isConnected
});

const mapDispatchToProps = dispatch => ({
  updateGoalsNObjevtives: data => dispatch(updateGoalsNObjevtives(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(ObjectiveDetail);
