import { connect } from 'react-redux';

import CompetencySelection from './CompetencySelection';

const mapStateToProps = (state) => ({
  selectedEmployeeInfo: state.employeeInfo,
  maxCompetencyCount: state.reviewInfo.maxCompetencyCount
});

export default connect(mapStateToProps)(CompetencySelection);
