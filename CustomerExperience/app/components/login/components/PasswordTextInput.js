import React from 'react';
import QPTextField from '../../../widgets/TextField';
import {useDispatch} from 'react-redux';
import {setLoginPassword} from '../../../redux/actions/login.action';
import {translate} from '../../../Utils/MultilinguaUtils';
import {loginStyles} from '../login.styles';
const PasswordTextInput = ({setPassword}) => {
  // const password = useSelector(state => state.login.password);
  const dispatch = useDispatch();

  const handlePassword = text => {
    setPassword ? setPassword(text) : dispatch(setLoginPassword(text));
  };

  return (
    <QPTextField
      testID="passwordTextField"
      secureText={true}
      label={translate('onBoarding.password')}
      defaultValue={''}
      style={loginStyles.emailInput}
      // onEndEdit={handlePassword}
      onChange={handlePassword}
    />
  );
};

export default PasswordTextInput;
