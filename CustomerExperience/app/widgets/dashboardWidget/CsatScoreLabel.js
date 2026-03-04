import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {dashboardStyles} from '../../components/dashboard/dashboard.style';
import StringUtils from '../../Utils/StringUtils';
import {MarginConstants} from '../../styles/margin.constants';
import {baseTextStyles} from '../../styles/text.styles';
import {Colors} from '../../styles/color.constants';

const CsatScore = () => {
  const {csatScore, csatMeanAverage} = useSelector(
    state => state.dashboard.currentNPSData.NPSScore,
  );
  const {isCsatViewTopBox} = useSelector(state => state.dashboard);

  return (
    <Text testID="csat-score-label" style={styles.csatScore}>
      {isCsatViewTopBox
        ? `${StringUtils.floatTo2DecimalPointString(csatMeanAverage)}`
        : `${StringUtils.floatTo2DecimalPointString(csatScore)}%`}
    </Text>
  );
};

const Label = () => {
  const {isCsatViewTopBox} = useSelector(state => state.dashboard);

  return (
    <Text testID="csat-score-label" style={[styles.csatScoreLabel]}>
      {isCsatViewTopBox ? 'Mean CSAT' : 'Top Box'}
    </Text>
  );
};

const CsatScoreLabel = () => {
  return (
    <View style={styles.catScoreContainer}>
      <CsatScore />
      <Label />
    </View>
  );
};

export default CsatScoreLabel;

const styles = StyleSheet.create({
  csatScore: {
    ...baseTextStyles.largeMediumText,
    color: Colors.filterIconColor,
  },
  csatScoreLabel: {
    ...baseTextStyles.secondaryRegularText,
    color: Colors.filterIconColor,
  },
  catScoreContainer: {
    position: 'absolute',
    top: MarginConstants.tab1_4x + MarginConstants.tab1_24x,
    alignItems: 'center',
    alignSelf: 'center',
  },
});
