import React from 'react';
import {useSelector} from 'react-redux';
import {View} from 'react-native';
import {dashboardStyles} from '../dashboard.style';
import {getNPSColorByNPS} from '../../../styles/color.constants';
import DottedLine from '../../../widgets/dashboardWidget/DottedLine';
import TextLabel from '../../../widgets/TextLabel/TextLabel';

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
const BenchmarkView = () => {
  const {benchmarkScore} = useSelector(
    state => state.dashboard.currentNPSData.NPSScore,
  );
  return benchmarkScore !== 0 ? (
    <View testID="benchmark-view" style={dashboardStyles.squareView}>
      <BenchmarkIcon benchmark={benchmarkScore} />
      <TextLabel text={`Benchmark: ${benchmarkScore}`} />
    </View>
  ) : (
    <View style={dashboardStyles.emptyBenchmarkView} />
  );
};

export default BenchmarkView;
