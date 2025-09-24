import React from 'react';
import QPTextField from '../../../widgets/TextField';
import {useDispatch} from 'react-redux';
import {setLoginEmail} from '../../../redux/actions/login.action';
import {translate} from '../../../Utils/MultilinguaUtils';
import {loginStyles} from '../login.styles';
import {Colors} from '../../../styles/color.constants';
const EmailTextInput = ({defaultValue, value, setEmail}) => {
  // const email = useSelector(state => state.login.email);
  const dispatch = useDispatch();

  const handleEmail = text => {
    setEmail ? setEmail(text) : dispatch(setLoginEmail(text));
  };

  return (
    <QPTextField
      secureText={false}
      testID="emailTextField"
      autofocus={false}
      value={value}
      label={translate('onBoarding.email')}
      defaultValue={defaultValue ?? ''}
      style={loginStyles.emailInput}
      keyboardType="email-address"
      // onEndEdit={handleEmail}
      onChange={handleEmail}
    />
  );
};

export default EmailTextInput;
