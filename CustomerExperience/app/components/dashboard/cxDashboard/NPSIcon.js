import React from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {dashboardStyles} from '../dashboard.style';
import {getNPSColorByNPS} from '../../../styles/color.constants';
import DottedLine from '../../../widgets/dashboardWidget/DottedLine';

const NPSIcon = () => {
  const {npsPercentage} = useSelector(
    state => state.dashboard?.currentNPSData?.NPSScore,
  );
  return (
    <View testID="nps-icon" style={dashboardStyles.npsIcon}>
      <View
        style={[
          dashboardStyles.roundSquareShape,
          {backgroundColor: getNPSColorByNPS(npsPercentage)},
        ]}
      />
      <DottedLine borderStyle="solid" />
    </View>
  );
};

export default NPSIcon;
