import { connect } from 'react-redux';

import PraiseNew from './PraiseNew';

const mapStateToProps = state => ({
  isLoading: state.isLoading,
  error: state.error.message,
  isConnected: state.isConnected
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(PraiseNew);
