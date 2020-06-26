import { connect } from 'react-redux';
import { updateGoalsNObjevtives } from '../../../actions/GoalActions';

import ObjectiveNew from './ObjectiveNew';

const mapStateToProps = state => ({
  goalsnobjectives: state.goalsnobjectives,
  isLoading: state.isLoading,
  error: state.error.message,
  isConnected: state.isConnected
});

const mapDispatchToProps = dispatch => ({
  updateGoalsNObjevtives: data => dispatch(updateGoalsNObjevtives(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(ObjectiveNew);
