import React, {useMemo} from 'react';
import {useWindowDimensions} from 'react-native';
import RenderHTML, {defaultSystemFonts} from 'react-native-render-html';
import {FontFamily} from '../../styles/font.constants';
import StringUtils from '../../Utils/StringUtils';
import {Colors} from '../../styles/color.constants';
import {baseTextStyles} from '../../styles/text.styles';
import {wordsToBold} from '../../Utils/TicketUtils';
import {PaddingConstants} from '../../styles/padding.constants';

const ActivityText = React.memo(({text}) => {
  // Memoize system fonts to prevent recreation on every render
  const systemFonts = useMemo(
    () => [...defaultSystemFonts, FontFamily.regular, FontFamily.medium],
    [],
  );

  const {width} = useWindowDimensions();

  // Memoize content width calculation
  const contentWidth = useMemo(() => width / 0.5, [width]);

  // Memoize HTML content processing to prevent expensive regex operations
  const htmlContent = useMemo(() => {
    return StringUtils.formatActivityToHTML(text, wordsToBold);
  }, [text]);

  // Memoize source object to prevent unnecessary prop changes
  const sourceObject = useMemo(
    () => ({
      html: `<span>${htmlContent}</span>`,
    }),
    [htmlContent],
  );

  // Memoize tag styles to prevent object recreation
  const tagStyles = useMemo(
    () => ({
      span: {
        paddingBottom: PaddingConstants.halfTab,
        color: Colors.filterIconColor,
        ...baseTextStyles.semiSecondaryRegular2Text,
      },
    }),
    [],
  );

  return (
    <RenderHTML
      source={sourceObject}
      contentWidth={contentWidth}
      systemFonts={systemFonts}
      tagsStyles={tagStyles}
    />
  );
});

export default ActivityText;
