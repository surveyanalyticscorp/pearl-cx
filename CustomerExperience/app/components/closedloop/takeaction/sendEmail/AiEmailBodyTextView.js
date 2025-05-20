import React, {useMemo} from 'react';
import {View} from 'react-native';
import {useWindowDimensions} from 'react-native';
import {Colors} from '../../../../styles/color.constants';
import {FontFamily} from '../../../../styles/font.constants';
import {baseTextStyles} from '../../../../styles/text.styles';
import RenderHTML, {defaultSystemFonts} from 'react-native-render-html';
import StringUtils from '../../../../Utils/StringUtils';

export const EmailBodyTextView = ({text}) => {
  const {width} = useWindowDimensions();

  const memoizedSystemFonts = useMemo(
    () => [...defaultSystemFonts, FontFamily.regular],
    [],
  );

  const memoizedHtmlSource = useMemo(
    () => ({
      html: `
    <span style="font-size: 100%;">${text}</span>`,
    }),
    [text],
  );

  const memoizedTagsStyles = useMemo(
    () => ({
      span: {
        color: Colors.filterIconColor,
        ...baseTextStyles.secondaryRegularText,
      },
    }),
    [],
  );

  const memoizedRenderContent = useMemo(
    () => (
      <View testID="email-body-text-container">
        <RenderHTML
          ignoredDomTags={['html', 'head', 'body']}
          source={memoizedHtmlSource}
          contentWidth={width / 0.5}
          systemFonts={memoizedSystemFonts}
          tagsStyles={memoizedTagsStyles}
        />
      </View>
    ),
    [memoizedHtmlSource, memoizedTagsStyles, memoizedSystemFonts, width],
  );

  console.log('HTML comment', text);
  console.log(
    'HTML text',
    JSON.stringify(StringUtils.formatCommentToHTML(text)),
  );

  if (StringUtils.isEmpty(text)) {
    return <View />;
  }

  return memoizedRenderContent;
};
