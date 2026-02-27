import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {useSelector} from 'react-redux';
import TextLabel from '../../../widgets/TextLabel/TextLabel';
import {baseTextStyles} from '../../../styles/text.styles';
import {FontWeight} from '../../../styles/font.constants';
import {LegendContainer} from '../../../widgets/dashboardWidget/LegendScoreView';
import {PaddingConstants} from '../../../styles/padding.constants';

const ResponseCountView = () => {
  const responses =
    useSelector(
      state => state.dashboard.currentNPSData?.NPSScore?.totalResponses,
    ) ?? 0;

  return (
    <View style={styles.legendView}>
      <LegendContainer>
        <TextLabel
          testID="legend-score-percentage"
          text={'Responses'}
          style={styles.title}
        />
      </LegendContainer>
      <LegendContainer justifyContent="flex-end">
        <TextLabel
          testID="legend-score-count"
          text={responses}
          style={styles.count}
        />
      </LegendContainer>
    </View>
  );
};
export default ResponseCountView;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  legendView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.tab1_2x,
    paddingVertical: Platform.OS === 'ios' ? PaddingConstants.halfTab : 0,
  },
  title: {
    ...baseTextStyles.secondaryRegularText,
    fontWeight: FontWeight.bold,
    marginHorizontal: 0,
  },
  count: {
    ...baseTextStyles.secondaryMediumText,
    fontWeight: FontWeight.bold,
  },
});
