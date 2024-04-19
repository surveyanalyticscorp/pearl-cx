import React from 'react';
import {useWindowDimensions} from 'react-native';
import RenderHTML, {defaultSystemFonts} from 'react-native-render-html';
import {FontFamily} from '../../styles/font.constants';
import StringUtils from '../../Utils/StringUtils';
import {Colors} from '../../styles/color.constants';
import {baseTextStyles} from '../../styles/text.styles';
import {wordsToBold} from '../../Utils/TicketUtils';
import {PaddingConstants} from '../../styles/padding.constants';

const ActivityText = ({text}) => {
  const systemFonts = [
    ...defaultSystemFonts,
    FontFamily.regular,
    FontFamily.medium,
  ];

  const {width} = useWindowDimensions();
  // console.log('HTML activity', text);
  // console.log(
  //   'HTML text activity',
  //   JSON.stringify(StringUtils.formatActivityToHTML(text)),
  // );

  return (
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
          paddingBottom: PaddingConstants.halfTab,
          color: Colors.filterIconColor,
          ...baseTextStyles.semiSecondaryRegularText,
        },
      }}
    />
  );
};

export default ActivityText;
