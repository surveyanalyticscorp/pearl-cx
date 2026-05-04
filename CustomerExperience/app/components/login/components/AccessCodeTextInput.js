import React from 'react';
import QPTextField from '../../../widgets/TextField';
import {useDispatch} from 'react-redux';
import {setLoginAccessCode} from '../../../redux/actions/login.action';
import {translate} from '../../../Utils/MultilinguaUtils';
import {loginStyles} from '../login.styles';
const AccessCodeTextInput = ({defaultValue, value, setAccessCode}) => {
  // const accessCode = useSelector(state => state.login.accessCode);
  const dispatch = useDispatch();

  const handleAccessCode = text => {
    setAccessCode ? setAccessCode(text) : dispatch(setLoginAccessCode(text));
  };

  return (
    <QPTextField
      testID="companyCodeTextField"
      defaultValue={defaultValue ?? ''}
      label={'Access code'}
      style={loginStyles.emailInput}
      value={value}
      onChange={handleAccessCode}
      returnKey={'done'}
    />
  );
};

export default AccessCodeTextInput;
