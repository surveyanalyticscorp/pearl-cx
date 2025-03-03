import React from 'react';
import {StyleSheet, View} from 'react-native';

import {baseTextStyles} from '../../styles/text.styles';
import TextLabel from '../../widgets/TextLabel/TextLabel';
import {FontWeight} from '../../styles/font.constants';
import IconButton from '../../routes/commonUI/IconButton';
import ResetFilterIcon from '../../routes/commonUI/ResetFilterIcon';
import {PaddingConstants} from '../../styles/padding.constants';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {VerticalSpaceBox} from '../../widgets/SpaceBox';

export const NoTicketFound = ({onPressReset}) => {
  return (
    <View
      style={styles.container}
      testID={'no-ticket-found'}
      accessible={true}
      accessibilityLabel={'No tickets found'}
      accessibilityHint={'Try using a different filter criteria'}>
      <TextLabel
        baseTextStyle={baseTextStyles.largeMediumText}
        fontWeight={FontWeight.bold}
        text={'Oops! No tickets found'}
      />
      <VerticalSpaceBox />
      <TextLabel text={'Try using a different filter criteria'} />
      <VerticalSpaceBox />
      <IconButton
        onPress={onPressReset}
        buttonStyle={styles.buttonStyle}
        textStyle={styles.buttonTextStyle}
        leftIcon={<ResetFilterIcon size={MarginConstants.halfTab * 5} />}
        buttonText={'Reset filters'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    margin: MarginConstants.tab1,
    marginVertical: MarginConstants.tab1_2x,

    borderRadius: 4,
  },
  buttonStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    padding: PaddingConstants.tab1,
  },
  buttonTextStyle: {
    color: Colors.accentLight,
    ...baseTextStyles.secondaryRegularText,
    paddingHorizontal: PaddingConstants.tab1_2x,
  },
});

export default NoTicketFound;
