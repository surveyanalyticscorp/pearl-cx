import React from 'react';
import {View, Image, Text} from 'react-native';
import {dashboardStyles} from '../../components/dashboard/dashboard.style';
import {Colors} from '../../styles/color.constants';
import ChatBubble from '../../../assets/images/chat_bubble.svg';
import ResponsesIcon from '../IconWidget/ResponsesIcon';

const RenderInfo = ({icon, title, count}) => {
  const size = 16;
  return (
    <View testID="render-info" style={dashboardStyles.responseView}>
      <Text style={dashboardStyles.responseText}>{count}</Text>
      <View
        testID="render-info-icon"
        style={dashboardStyles.ticketTypeContainer}>
        {/* <Image
          testID="render-info-icon-image"
          source={icon}
          style={{tintColor: Colors.filterIconColor, width: size, height: size}}
        /> */}
        <ResponsesIcon />
        <Text testID="render-info-title" style={dashboardStyles.response}>
          {title}
        </Text>
      </View>
    </View>
  );
};

export default RenderInfo;
