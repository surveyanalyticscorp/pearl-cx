import React from 'react';
import {StyleSheet, View} from 'react-native';
import {MarginConstants} from '../../../styles/margin.constants';
import TextLabel from '../../../widgets/TextLabel/TextLabel';
import {baseTextStyles} from '../../../styles/text.styles';
import {Colors} from '../../../styles/color.constants';
import {PaddingConstants} from '../../../styles/padding.constants';

export const Title = ({text}) => {
  return <TextLabel text={text} style={styles.titleText} />;
};
export const SubText = ({text, isSubtextHighlighted}) => {
  const color = isSubtextHighlighted
    ? Colors.accentLight
    : Colors.filterIconColor;
  return <TextLabel color={color} text={text} style={styles.subText} />;
};

export const ShowTitleAndText = ({title, subText, isSubtextHighlighted}) => {
  return (
    <View testID="show-title-and-text" style={styles.titleTextContainer}>
      <Title text={title} />
      <SubText text={subText} isSubtextHighlighted={isSubtextHighlighted} />
    </View>
  );
};

const styles = StyleSheet.create({
  titleTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: MarginConstants.halfTab,
  },
  titleText: {
    ...baseTextStyles.secondaryRegularText,
    color: Colors.filterIconColor,

    alignItems: 'flex-start',
    paddingBottom: PaddingConstants.halfTab,
    flex: 2,
  },

  subText: {
    ...baseTextStyles.secondaryLightText,
    flex: 3,
  },
});
export default ShowTitleAndText;
