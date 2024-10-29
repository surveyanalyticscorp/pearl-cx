import * as React from 'react';

import {StyleSheet, View, Text, Pressable} from 'react-native';
import {baseTextStyles} from '../styles/text.styles';
import {Colors} from '../styles/color.constants';
import {PaddingConstants} from '../styles/padding.constants';
import {MarginConstants} from '../styles/margin.constants';
import TextLabel from '../widgets/TextLabel/TextLabel';
import {IonIcon} from '../Utils/IconUtils';

const TrailingIcon = ({onPress, testID, color}) => {
  return (
    <Pressable onPress={onPress}>
      <IonIcon
        testID={testID}
        name="close-outline"
        size={MarginConstants.tab1_4x}
        color={color}
      />
    </Pressable>
  );
};

const LeadingIcon = ({name, testID, color}) => {
  return (
    <IonIcon
      testID={testID}
      name={name}
      size={MarginConstants.tab1_4x}
      color={color}
    />
  );
};
const CustomErrorToast = ({text1, props}) => {
  return (
    <View style={toastStyles.errorContainer} testID="error-toast-container">
      <LeadingIcon {...props.leadingIcon} />
      <View style={{flex: 1}}>
        <TextLabel
          numberOfLines={1}
          text={text1 ?? props.bodyText ?? ''}
          color={Colors.deleteButtonText}
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

const CustomSuccessToast = ({text1, props}) => {
  return (
    <View style={toastStyles.successContainer} testID="success-toast-container">
      <LeadingIcon {...props.leadingIcon} />
      <View style={{flex: 1}}>
        <TextLabel
          numberOfLines={1}
          text={text1 ?? props.bodyText ?? ''}
          color={Colors.toastSuccessTextColor}
          style={baseTextStyles.semiSecondaryRegular2Text}
          testID="success-toast-msg"
        />
      </View>
      <TrailingIcon {...props.trailingIcon} />
    </View>
  );
};

export default {
  custom_error: props => CustomErrorToast(props),
  custom_success: props => CustomSuccessToast(props),
};

const toastStyles = StyleSheet.create({
  errorContainer: {
    height: 60,
    width: '90%',
    backgroundColor: Colors.overdueBackgroundColor,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.tab1,
    paddingVertical: PaddingConstants.tab1,
    marginVertical: MarginConstants.tab1,
    marginHorizontal: MarginConstants.tab1_2x,
  },
  successContainer: {
    height: 60,
    width: '90%',
    backgroundColor: Colors.toastSuccessBackgroundColor,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.tab1,
    paddingVertical: PaddingConstants.tab1,
    marginVertical: MarginConstants.tab1,
    marginHorizontal: MarginConstants.tab1_2x,
  },
  error: {
    backgroundColor: Colors.overdueBackgroundColor,

    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    padding: PaddingConstants.tab1,
    margin: MarginConstants.tab1,
  },
  success: {
    backgroundColor: Colors.success,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    padding: PaddingConstants.tab1,
    margin: MarginConstants.tab1,
  },
  errorText1Style: {
    ...baseTextStyles,
    color: Colors.deleteButtonText,
  },
  successrText1Style: {
    ...baseTextStyles,
    color: Colors.promoter,
  },
});
