import React from 'react';
import {StyleSheet, View} from 'react-native';
import {dashboardStyles} from '../../components/dashboard/dashboard.style';
import {FontWeight} from '../../styles/font.constants';
import {baseTextStyles} from '../../styles/text.styles';
import StringUtils from '../../Utils/StringUtils';
import TextLabel from '../TextLabel/TextLabel';
import {MarginConstants} from '../../styles/margin.constants';

const LegendContainer = ({justifyContent = 'flex-start', children}) => {
  return (
    <View
      testID="legend-container"
      style={{justifyContent: justifyContent, ...styles.legendContainer}}>
      {children}
    </View>
  );
};

const LegendScoreView = ({title, count, percentage, backgroundColor}) => {
  return (
    <View testID="legend-score-view" style={dashboardStyles.legendItemView}>
      <LegendContainer>
        <View
          style={{
            ...dashboardStyles.legendIcon,
            backgroundColor: backgroundColor,
          }}
        />
        <TextLabel
          testID="legend-score-title"
          text={title ?? ''}
          baseTextStyle={baseTextStyles.secondaryRegularText}
          fontWeight={FontWeight.bold}
        />
      </LegendContainer>
      <LegendContainer justifyContent="flex-end">
        <TextLabel
          testID="legend-score-count"
          text={count ?? ''}
          baseTextStyle={baseTextStyles.secondaryRegularText}
          fontWeight={FontWeight.bold}
          style={styles.countText}
        />
        <TextLabel
          testID="legend-score-percentage"
          text={`(${StringUtils.floatToDecimal(percentage)}%)`}
          baseTextStyle={baseTextStyles.secondaryRegularText}
          style={styles.parcentageText}
        />
      </LegendContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  legendContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  parcentageText: {
    textAlign: 'right',
    width: '28%',
  },
  countText: {
    textAlign: 'right',
    width: 'auto',
  },
});
export default LegendScoreView;
