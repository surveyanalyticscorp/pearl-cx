import React, {useMemo} from 'react';
import {ScrollView} from 'react-native';
import {useWindowDimensions} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {baseTextStyles} from '../../../styles/text.styles';
import RenderHTML, {defaultSystemFonts} from 'react-native-render-html';

export const EmailBodyTextView = ({text}) => {
  const {width} = useWindowDimensions();

  const systemFonts = useMemo(
    () => [...defaultSystemFonts, FontFamily.regular],
    [],
  );

  const htmlSource = useMemo(
    () => ({
      html: `<span style="font-size: 100%;">${text}</span>`,
    }),
    [text],
  );

  const tagsStyles = useMemo(
    () => ({
      span: {
        color: Colors.filterIconColor,
        ...baseTextStyles.secondaryRegularText,
      },
    }),
    [],
  );

  return (
    <ScrollView
      style={{flexShrink: 1, backgroundColor: Colors.white}}
      scrollEnabled={true}
      testID="email-body-text-container">
      <RenderHTML
        contentWidth={width}
        ignoredDomTags={['html', 'head', 'body']}
        source={htmlSource}
        systemFonts={systemFonts}
        tagsStyles={tagsStyles}
      />
    </ScrollView>
  );
};
