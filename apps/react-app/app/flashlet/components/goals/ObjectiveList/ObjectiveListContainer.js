import { connect } from 'react-redux';

import { fetchGoals, updateGoalsNObjevtives, newGoal } from '../../../actions/GoalActions';
import ObjectiveList from './ObjectiveList';

const mapStateToProps = state => ({
  goalsnobjectives: state.goalsnobjectives,
  isLoading: state.isLoading,
  error: state.error.message,
  isConnected: state.isConnected,
  newGoal: state.newGoal
});

const mapDispatchToProps = dispatch => ({
  fetchGoals: () => dispatch(fetchGoals()),
  updateGoalsNObjevtives: data => dispatch(updateGoalsNObjevtives(data)),
  addNewGoal: status => dispatch(newGoal(status))
});

export default connect(mapStateToProps, mapDispatchToProps)(ObjectiveList);
