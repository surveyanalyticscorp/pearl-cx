import React from 'react';
import {StyleSheet, View} from 'react-native';
import {MarginConstants} from '../../../styles/margin.constants';
import TextLabel from '../../../widgets/TextLabel/TextLabel';
import {baseTextStyles} from '../../../styles/text.styles';
import {Colors} from '../../../styles/color.constants';

const ShowTitleAndText = ({title, subText, isSubtextHighlighted}) => {
  return (
    <View style={styles.titleTextContainer}>
      <TextLabel text={title} style={{flex: 2}} />
      {/* <Title value={title} /> */}
      <TextLabel
        text={subText}
        baseTextStyle={baseTextStyles.secondaryLightText}
        color={
          isSubtextHighlighted ? Colors.accentLight : Colors.filterIconColor
        }
        style={{flex: 3}}
      />
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
});
export default ShowTitleAndText;
