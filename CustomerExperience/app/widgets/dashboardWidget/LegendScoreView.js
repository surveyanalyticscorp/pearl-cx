import React from 'react';
import {Text, View} from 'react-native';
import {dashboardStyles} from '../../components/dashboard/dashboard.style';
import {FontWeight} from '../../styles/font.constants';
import {baseTextStyles} from '../../styles/text.styles';
import StringUtils from '../../Utils/StringUtils';
const LegendScoreView = ({title, count, percentage, backgroundColor}) => {
  return (
    <View style={dashboardStyles.legendItemView}>
      <View
        style={{
          flex: 2,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        <View
          style={{
            ...dashboardStyles.legendIcon,
            backgroundColor: backgroundColor,
          }}
        />
        <Text
          style={{
            ...baseTextStyles.secondaryRegularText,
            fontWeight: FontWeight.bold,
          }}>
          {title ?? ''}
        </Text>
      </View>
      <View
        style={{
          flex: 2,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>
        <Text
          style={{
            ...baseTextStyles.secondaryRegularText,
            fontWeight: FontWeight.bold,
          }}>
          {count}
        </Text>

        <Text style={baseTextStyles.secondaryRegularText}>
          {`(${StringUtils.floatTo2DecimalPointString(percentage)}%)`}
        </Text>
      </View>
    </View>
  );
};

export default LegendScoreView;
