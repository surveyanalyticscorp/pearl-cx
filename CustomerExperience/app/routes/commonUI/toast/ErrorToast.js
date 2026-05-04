import React from 'react';
import {View} from 'react-native';
import {baseTextStyles} from '../../../styles/text.styles';
import TextLabel from '../../../widgets/TextLabel/TextLabel';
import {PaddingConstants} from '../../../styles/padding.constants';
import {Colors} from '../../../styles/color.constants';
import {toastStyles} from './toast.styles';
import LeadingIcon from './LeadingIcon';
import TrailingIcon from './TrailingIcon';
const ErrorToast = ({text1, props}) => {
  return (
    <View style={toastStyles.errorContainer} testID="error-toast-container">
      <LeadingIcon {...props.leadingIcon} />
      <View style={{flex: 1}}>
        <TextLabel
          numberOfLines={1}
          text={text1 ?? props.bodyText ?? ''}
          color={Colors.deleteBackground}
          style={{
            padding: PaddingConstants.halfTab,
            ...baseTextStyles.semiSecondaryRegular2Text,
          }}
          testID="error-toast-msg"
        />
      </View>
      <TrailingIcon {...props.trailingIcon} />
    </View>
  );
};

export default ErrorToast;
