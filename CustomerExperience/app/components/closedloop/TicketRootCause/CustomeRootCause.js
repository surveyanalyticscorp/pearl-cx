import React from 'react';
import {View, StyleSheet} from 'react-native';
import {baseTextStyles} from '../../../styles/text.styles';
import {MarginConstants} from '../../../styles/margin.constants';
import TextLabel from '../../../widgets/TextLabel/TextLabel';
import {VerticalSpaceBox} from '../../../widgets/SpaceBox';
import IconButton from '../../../routes/commonUI/IconButton';
import {MaterialIcons} from '../../../Utils/IconUtils';
import {Colors} from '../../../styles/color.constants';
import {TextSizes} from '../../../styles/textsize.constants';

export const CustomRootCause = () => {
  return (
    <View style={styles.rootview}>
      <TextLabel
        baseTextStyle={baseTextStyles.primaryMediumText}
        text={'Custom root causes'}
      />
      <VerticalSpaceBox />
      <TextLabel
        baseTextStyle={baseTextStyles.secondaryLightText}
        text={'Currently, this ticket does not have any custom root causes.'}
      />
      <VerticalSpaceBox />

      <IconButton
        buttonStyle={styles.buttonStyle}
        textStyle={styles.buttonStyleText}
        leftIcon={
          <MaterialIcons name="add" size={20} color={Colors.accentLight} />
        }
        buttonText={'Add'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  rootview: {
    marginVertical: MarginConstants.tab1_2x,
    marginHorizontal: MarginConstants.tab1_2x,
  },

  flatList: {
    marginVertical: MarginConstants.tab1_2x,
  },
  buttonStyle: {
    width: MarginConstants.tab1_16x,
    height: MarginConstants.tab1_6x,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyleText: {
    color: Colors.accentLight,
    fontSize: TextSizes.secondary,
  },
});
