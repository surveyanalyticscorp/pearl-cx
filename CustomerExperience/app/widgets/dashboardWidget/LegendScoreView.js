import React from 'react';
import {StyleSheet, View} from 'react-native';
import {dashboardStyles} from '../../components/dashboard/dashboard.style';
import {FontWeight} from '../../styles/font.constants';
import {baseTextStyles} from '../../styles/text.styles';
import StringUtils from '../../Utils/StringUtils';
import TextLabel from '../TextLabel/TextLabel';

const LegendContainer = ({justifyContent = 'flex-start', children}) => {
  return (
    <View style={{justifyContent: justifyContent, ...styles.legendContainer}}>
      {children}
    </View>
  );
};

const LegendScoreView = ({title, count, percentage, backgroundColor}) => {
  return (
    <View style={dashboardStyles.legendItemView}>
      <LegendContainer>
        <View
          style={{
            ...dashboardStyles.legendIcon,
            backgroundColor: backgroundColor,
          }}
        />
        <TextLabel
          text={title ?? ''}
          baseTextStyle={baseTextStyles.secondaryRegularText}
          fontWeight={FontWeight.bold}
        />
      </LegendContainer>
      <LegendContainer justifyContent="flex-end">
        <TextLabel
          text={count ?? ''}
          baseTextStyle={baseTextStyles.secondaryRegularText}
          fontWeight={FontWeight.bold}
        />
        <TextLabel
          text={`(${StringUtils.floatTo2DecimalPointString(percentage)}%)`}
          baseTextStyle={baseTextStyles.secondaryRegularText}
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
});
export default LegendScoreView;
