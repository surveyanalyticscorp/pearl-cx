import React, {useState} from 'react';
import PhoneInput from 'react-native-phone-number-input';
import {View, StyleSheet} from 'react-native';
import IconAndTitleText from './IconAndTitleText';
import {Colors} from '../../../styles/color.constants';
import {translate} from '../../../Utils/MultilinguaUtils';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {FontFamily} from '../../../styles/font.constants';
import CountryPhoneNumberLength from '../../../Utils/CountryPhoneNumberLength';

const RenderPhoneInput = ({setTicketState}) => {
  const [text, setText] = useState(' ');
  const phoneInput = React.useRef();
  // const [isValid, setIsValid] = useState(false);
  const [maxLength, setMaxLength] = useState(CountryPhoneNumberLength['US']);
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
        placeholder={text}
        containerStyle={styles.phoneInputContainer}
        codeTextStyle={styles.phoneInputCodeText}
        textContainerStyle={styles.phoneInputTextContainer}
        textInputStyle={styles.phoneInputTextInputStyle}
        countryPickerButtonStyle={styles.phoneInputCountryPickerButtonStyle}
        textInputProps={{
          maxLength: maxLength,
          placeholderTextColor: Colors.borderColor,
          onEndEditing: function (value) {
            setPhoneNumber();
          },
        }}
        ref={phoneInput}
        defaultCode="US"
        layout="first"
        onChangeCountry={country => {
          console.log('COUNTRY:', country);
          setMaxLength(CountryPhoneNumberLength[country?.cca2]);
        }}
        onChangeFormattedText={text => {
          setText(text);
        }}
      />
    </View>
  );
};

export default RenderPhoneInput;

const styles = StyleSheet.create({
  phoneInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: MarginConstants.tab1_5x,
    width: '100%',
  },
  phoneInputCodeText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
    paddingVertical: 0,
    marginVertical: 0,
  },
  phoneInputTextContainer: {
    textAlignVertical: 'center',
    backgroundColor: Colors.settingsBackground,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
    paddingVertical: 0,
    marginVertical: 0,
  },
  phoneInputTextInputStyle: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
    height: MarginConstants.tab1_5x,
    paddingVertical: 0,
    marginVertical: 0,
  },

  phoneInputTextInputStyleError: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.detractor2,
    height: MarginConstants.tab1_5x,
    paddingVertical: 0,
    marginVertical: 0,
  },
  phoneInputCountryPickerButtonStyle: {
    backgroundColor: Colors.settingsBackground,
    paddingVertical: 0,
    marginVertical: 0,
  },
});
