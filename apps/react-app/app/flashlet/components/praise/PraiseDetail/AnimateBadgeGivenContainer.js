import { connect } from 'react-redux';

import AnimateBadgeGiven from './AnimateBadgeGiven';
import { hideBadgeModal } from '../../../actions/PraiseActions';

const mapStateToProps = state => ({
  praiseNewBadge: state.praiseNewBadge
});

const mapDispatchToProps = dispatch => ({
  hideModal: (selectedBadge) => dispatch(hideBadgeModal(selectedBadge))
});
export default connect(mapStateToProps, mapDispatchToProps)(AnimateBadgeGiven);
