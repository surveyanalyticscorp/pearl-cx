import React from 'react';
import {View} from 'react-native';
import {baseTextStyles} from '../../../styles/text.styles';
import TextLabel from '../../../widgets/TextLabel/TextLabel';
import {PaddingConstants} from '../../../styles/padding.constants';
import {Colors} from '../../../styles/color.constants';
import {toastStyles} from './toast.styles';
import InfoIcon from './InfoIcon';
import TrailingIcon from './TrailingIcon';
import {MarginConstants} from '../../../styles/margin.constants';
const InfoToast = ({text1, props}) => {
  return (
    <View style={toastStyles.infoContainer} testID="info-toast-container">
      <InfoIcon />
      <View style={{flex: 1}}>
        <TextLabel
          numberOfLines={1}
          text={'Main Segment' ?? props.bodyText ?? ''}
          color={Colors.accent}
          style={{
            padding: PaddingConstants.halfTab,
            marginLeft: MarginConstants.tab1,
            ...baseTextStyles.semiSecondaryRegular2Text,
          }}
          testID="success-toast-msg"
        />
      </View>
      <TrailingIcon {...props.trailingIcon} />
    </View>
  );
};

export default InfoToast;
