import React from 'react';
import {View, Image, Text} from 'react-native';
import {dashboardStyles} from '../../components/dashboard/dashboard.style';
import {Colors} from '../../styles/color.constants';
const RenderInfo = ({icon, title, count}) => {
  const size = 16;
  return (
    <View style={dashboardStyles.responseView}>
      <View style={dashboardStyles.ticketTypeContainer}>
        <Image
          source={icon}
          style={{tintColor: Colors.evenDarkerGrey, width: size, height: size}}
        />
        <Text style={dashboardStyles.response}>{title}</Text>
      </View>
      <Text style={dashboardStyles.responseText}>{count}</Text>
    </View>
  );
};

export default RenderInfo;
