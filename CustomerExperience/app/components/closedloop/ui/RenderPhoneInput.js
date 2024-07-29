import React, {useState} from 'react';
import PhoneInput from 'react-native-phone-number-input';
import {View, StyleSheet} from 'react-native';
import IconAndTitleText from './IconAndTitleText';
import {Colors} from '../../../styles/color.constants';
import {translate} from '../../../Utils/MultilinguaUtils';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {MarginConstants} from '../../../styles/margin.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {FontFamily} from '../../../styles/font.constants';

const RenderPhoneInput = ({defaultValue, setTicketState}) => {
  const [text, setText] = useState('');
  const phoneInput = React.useRef();
  const setPhoneNumber = () => {
    console.log('TEXT_INPUT', text);
    setTicketState(state => ({
      ...state,
      mobileNumber: text,
    }));
  };
  return (
    <View>
      <IconAndTitleText
        icon={
          <MaterialIcon name={'call'} size={14} color={Colors.lightBlack} />
        }
        title={translate('create_new_ticket.phone_number')}
      />

      <PhoneInput
        placeholder=" "
        containerStyle={styles.phoneInputContainer}
        codeTextStyle={styles.phoneInputCodeText}
        textContainerStyle={styles.phoneInputTextContainer}
        textInputStyle={styles.phoneInputTextInputStyle}
        // flagButtonStyle={{borderColor: Colors.accent, borderWidth: 1}}
        countryPickerButtonStyle={styles.phoneInputCountryPickerButtonStyle}
        textInputProps={{
          placeholderTextColor: Colors.borderColor,
          onEndEditing: function (value) {
            setPhoneNumber();
          },
        }}
        ref={phoneInput}
        // defaultValue={value}
        defaultCode="US"
        layout="second"
        // onChangeText={text => {
        // setValue(text);
        // console.log('PHONE:', text);
        // }}
        onChangeFormattedText={text => {
          // setFormattedValue(text);
          setText(text);
          console.log('FORMATTED PHONE:', text);
          // setTicketState(state => ({...state, mobileNumber: text}));
          // userInfo.mobileNumber = text;
        }}
      />
    </View>
  );
};

export default RenderPhoneInput;

const styles = StyleSheet.create({
  phoneInputContainer: {
    height: MarginConstants.tab1_6x,
    width: '100%',
  },
  phoneInputCodeText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
    height: MarginConstants.tab4,
    padding: PaddingConstants.tab1,
  },
  phoneInputTextContainer: {
    backgroundColor: Colors.settingsBackground,
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
    marginStart: MarginConstants.tab1,
  },
  phoneInputTextInputStyle: {
    height: MarginConstants.tab4,
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    paddingVertical: PaddingConstants.tab1,
    paddingStart: 0,
    paddingEnd: PaddingConstants.tab1,
    color: Colors.filterIconColor,
  },
  phoneInputCountryPickerButtonStyle: {
    borderColor: Colors.darkGrey,
    borderWidth: 1,
    padding: 0,
    marginStart: MarginConstants.tab1,
  },
});
