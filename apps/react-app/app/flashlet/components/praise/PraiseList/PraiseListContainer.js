import { connect } from 'react-redux';

import PraiseList from './PraiseList';
import { addNewBadge } from '../../../actions/PraiseActions';
import { fetchPraises } from '../../../actions/PraiseActions';

const mapStateToProps = state => ({
  praises: state.praises,
  isLoading: state.isLoading,
  error: state.error.message,
  isConnected: state.isConnected
});

const mapDispatchToProps = dispatch => ({
  addNewBadge: selectedBadge => dispatch(addNewBadge(selectedBadge)),
  fetchPraises: () => dispatch(fetchPraises()),
  clearUserBadges: () => {
    dispatch({ type: 'USER_BADGES', data: [] });
  },
  clearNewBadge: () => {
    dispatch({
      type: 'PRAISE_NEW_BADGE',
      data: { add: false, selectedBadge: null }
    });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PraiseList);
