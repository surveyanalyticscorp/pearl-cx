import React from 'react';
import {useSelector} from 'react-redux';
import {View} from 'react-native';
import {dashboardStyles} from '../dashboard.style';
import {getNPSColorByNPS} from '../../../styles/color.constants';
import DottedLine from '../../../widgets/dashboardWidget/DottedLine';
import TextLabel from '../../../widgets/TextLabel/TextLabel';
import GoalIcon from '../../../../assets/images/goal_icon.svg';

const BenchmarkIcon = ({benchmark}) => {
  return (
    <View>
      <View
        style={[
          dashboardStyles.roundSquareShape,
          {backgroundColor: getNPSColorByNPS(benchmark)},
        ]}
      />
      <DottedLine />
    </View>
  );
};

const GoalView = () => {
  const {benchmarkScore} = useSelector(
    state => state.dashboard.currentNPSData.NPSScore,
  );
  return (
    <View testID="benchmark-view" style={dashboardStyles.squareView}>
      {/* <BenchmarkIcon benchmark={benchmarkScore} /> */}
      <GoalIcon />
      <TextLabel text={`Goal: ${benchmarkScore}`} />
    </View>
  );
};

export default GoalView;
