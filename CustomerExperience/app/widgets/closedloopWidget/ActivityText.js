import React from 'react';
import {View, useWindowDimensions} from 'react-native';
import RenderHTML, {defaultSystemFonts} from 'react-native-render-html';
import {FontFamily} from '../../styles/font.constants';
import StringUtils from '../../Utils/StringUtils';
import {Colors} from '../../styles/color.constants';
import {baseTextStyles} from '../../styles/text.styles';
import {wordsToBold} from '../../Utils/TicketUtils';

const ActivityText = ({text}) => {
  const systemFonts = [...defaultSystemFonts, FontFamily.regular];

  const {width} = useWindowDimensions();
  console.log('HTML activity', text);
  // console.log(
  //   'HTML text activity',
  //   JSON.stringify(StringUtils.formatActivityToHTML(text)),
  // );

  return (
    <View>
      <RenderHTML
        source={{
          html: `
              <span>${StringUtils.formatActivityToHTML(
                text,
                wordsToBold,
              )}</span>`,
        }}
        contentWidth={width / 0.5}
        systemFonts={systemFonts}
        tagsStyles={{
          span: {
            color: Colors.filterIconColor,
            ...baseTextStyles.secondaryRegularText,
          },
        }}
      />
    </View>
  );
};

export default ActivityText;
